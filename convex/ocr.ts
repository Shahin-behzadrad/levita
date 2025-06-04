"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { protos } from "@google-cloud/vision";
import { Storage } from "@google-cloud/storage";

// Initialize the Vision API client with credentials
let vision: ImageAnnotatorClient | null = null;
let storage: Storage | null = null;

try {
  const credentialsBase64 = process.env.GOOGLE_CLOUD_KEY_BASE64;
  if (!credentialsBase64) {
    console.error("GOOGLE_CLOUD_KEY_BASE64 environment variable is not set");
  } else {
    const credentials = JSON.parse(
      Buffer.from(credentialsBase64, "base64").toString()
    );
    vision = new ImageAnnotatorClient({ credentials });
    storage = new Storage({ credentials });
  }
} catch (error) {
  console.error("Failed to initialize Google Cloud clients:", error);
}

// Get GCS bucket name from environment
const GCS_BUCKET = process.env.GOOGLE_CLOUD_BUCKET;
if (!GCS_BUCKET) {
  console.error("GOOGLE_CLOUD_BUCKET environment variable is not set");
}

export const processDocumentOCR = action({
  args: {
    storageId: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    if (!vision || !storage) {
      throw new ConvexError(
        "Google Cloud clients not initialized. Please check your credentials."
      );
    }

    if (!GCS_BUCKET) {
      throw new ConvexError(
        "GCS bucket not configured. Please set GOOGLE_CLOUD_BUCKET environment variable."
      );
    }

    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new ConvexError("File not found");
    }

    try {
      let result;
      if (args.fileType === "application/pdf") {
        console.log("Processing PDF document:", fileUrl);
        try {
          // First, download the file from Convex storage
          const fileResponse = await fetch(fileUrl);
          const fileBuffer = await fileResponse.arrayBuffer();

          // Upload to GCS
          const gcsFileName = `uploads/${args.storageId}.pdf`;
          const bucket = storage.bucket(GCS_BUCKET);
          const file = bucket.file(gcsFileName);

          await file.save(Buffer.from(fileBuffer), {
            contentType: "application/pdf",
            metadata: {
              contentType: "application/pdf",
            },
          });

          // For PDFs, use asyncBatchAnnotateFiles
          const request: protos.google.cloud.vision.v1.IAsyncBatchAnnotateFilesRequest =
            {
              requests: [
                {
                  inputConfig: {
                    mimeType: "application/pdf",
                    gcsSource: { uri: `gs://${GCS_BUCKET}/${gcsFileName}` },
                  },
                  features: [
                    {
                      type: protos.google.cloud.vision.v1.Feature.Type
                        .DOCUMENT_TEXT_DETECTION,
                    },
                  ],
                  outputConfig: {
                    gcsDestination: {
                      uri: `gs://${GCS_BUCKET}/ocr-results/${args.storageId}/`,
                    },
                  },
                },
              ],
            };

          const [operation] = await vision.asyncBatchAnnotateFiles(request);
          const [filesResponse] = await operation.promise();

          if (
            !filesResponse?.responses?.[0]?.outputConfig?.gcsDestination?.uri
          ) {
            throw new ConvexError("No output destination for PDF processing");
          }

          // The result is stored in GCS, we need to fetch it
          const outputUri =
            filesResponse.responses[0].outputConfig.gcsDestination.uri;
          // List all files in the output folder
          const [outputFiles] = await bucket.getFiles({
            prefix: `ocr-results/${args.storageId}/`,
          });

          // Collect and sort all JSON output files
          const jsonFiles = outputFiles
            .filter((file) => file.name.endsWith(".json"))
            .sort((a, b) => a.name.localeCompare(b.name));

          if (jsonFiles.length === 0) {
            throw new ConvexError("No output JSON files found in GCS.");
          }

          let fullText = "";
          let fullPages: protos.google.cloud.vision.v1.IPage[] = [];

          for (const file of jsonFiles) {
            const [jsonBuffer] = await file.download();
            const json = JSON.parse(jsonBuffer.toString());

            for (const response of json.responses || []) {
              const annotation = response.fullTextAnnotation;
              if (annotation) {
                fullText += annotation.text + "\n";
                if (annotation.pages) {
                  fullPages.push(...annotation.pages);
                }
              }
            }
          }

          if (fullPages.length === 0) {
            throw new ConvexError("No pages found in OCR results");
          }

          result = {
            fullTextAnnotation: {
              text: fullText.trim(),
              pages: fullPages,
            },
          };

          console.log("Multi-page OCR processed", {
            pageCount: fullPages.length,
            textLength: fullText.length,
          });

          console.log("Full text annotation:", {
            text: result.fullTextAnnotation.text,
            pageCount: result.fullTextAnnotation.pages?.length,
            pages: result.fullTextAnnotation.pages?.map((page: any) => ({
              pageNumber: page.pageNumber,
              confidence: page.confidence,
              blockCount: page.blocks?.length,
            })),
          });

          // Clean up the uploaded file
          await file.delete();
        } catch (pdfError: any) {
          console.error("PDF processing error:", pdfError);
          throw new ConvexError(
            `PDF processing failed: ${pdfError.message || "Unknown error"}`
          );
        }
      } else {
        console.log("Processing image document:", fileUrl);
        try {
          // For images, use textDetection
          const [imageResult] = await vision.textDetection(fileUrl);
          result = imageResult;
        } catch (imageError: any) {
          console.error("Image processing error:", imageError);
          throw new ConvexError(
            `Image processing failed: ${imageError.message || "Unknown error"}`
          );
        }
      }

      const fullTextAnnotation = result.fullTextAnnotation;
      if (!fullTextAnnotation) {
        throw new ConvexError("No text detected in the document");
      }

      console.log("Processing full text annotation:", {
        textLength: fullTextAnnotation.text?.length,
        pageCount: fullTextAnnotation.pages?.length,
        pages: fullTextAnnotation.pages?.map((page: any) => ({
          pageNumber: page.pageNumber,
          confidence: page.confidence,
          blockCount: page.blocks?.length,
        })),
      });

      // Extract detailed page info
      const pages = fullTextAnnotation.pages?.map(
        (page: protos.google.cloud.vision.v1.IPage, index: number) => {
          // Combine all text from blocks into a single string for each page
          const pageText = page.blocks
            ?.map((block) => {
              return block.paragraphs
                ?.flatMap((p: protos.google.cloud.vision.v1.IParagraph) =>
                  p.words
                    ?.map((w: protos.google.cloud.vision.v1.IWord) =>
                      w.symbols
                        ?.map(
                          (s: protos.google.cloud.vision.v1.ISymbol) => s.text
                        )
                        .join("")
                    )
                    .join(" ")
                )
                .join(" ");
            })
            .filter(Boolean)
            .join("\n");

          return {
            p: index + 1, // page number
            c: page.confidence || 0, // confidence
            t: pageText || "", // text
          };
        }
      );

      // Calculate average confidence across all pages
      const avgConfidence =
        (pages || []).reduce((acc, page) => acc + page.c, 0) /
        (pages?.length || 1);

      return {
        t: fullTextAnnotation.text || "", // full text
        p: pages?.length || 0, // page count
        c: avgConfidence, // average confidence
        d: pages || [], // pages data
      };
    } catch (error: any) {
      console.error("OCR processing error details:", {
        error,
        fileType: args.fileType,
        fileUrl,
        errorMessage: error.message || "Unknown error",
        errorStack: error.stack,
      });
      throw new ConvexError(
        `Failed to process document OCR: ${error.message || "Unknown error"}`
      );
    }
  },
});
