"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ImageAnnotatorClient } from "@google-cloud/vision";

// Initialize the Vision API client with credentials
let vision: ImageAnnotatorClient | null = null;

try {
  const credentialsBase64 = process.env.GOOGLE_CLOUD_KEY_BASE64;
  if (!credentialsBase64) {
    console.error("GOOGLE_CLOUD_KEY_BASE64 environment variable is not set");
  } else {
    const credentials = JSON.parse(
      Buffer.from(credentialsBase64, "base64").toString()
    );
    vision = new ImageAnnotatorClient({ credentials });
  }
} catch (error) {
  console.error("Failed to initialize Vision API client:", error);
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

    if (!vision) {
      throw new ConvexError(
        "Vision API client not initialized. Please check your credentials."
      );
    }

    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new ConvexError("File not found");
    }

    try {
      // Perform OCR on the document
      const [result] = await vision.documentTextDetection(fileUrl);
      const fullTextAnnotation = result.fullTextAnnotation;

      if (!fullTextAnnotation) {
        throw new ConvexError("No text detected in the document");
      }

      return {
        text: fullTextAnnotation.text,
        confidence: fullTextAnnotation.pages?.[0]?.confidence || 0,
      };
    } catch (error) {
      console.error("OCR processing error:", error);
      throw new ConvexError("Failed to process document OCR");
    }
  },
});
