import React, { useState } from "react";
import { Button } from "@/components/Shared/Button/Button";
import { X, FileText, Upload, Loader2 } from "lucide-react";
import Image from "@/components/Shared/Image/Image";
import styles from "./healthAnalysisClient.module.scss";
import Text from "@/components/Shared/Text";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type FileStatus = "pending" | "processing" | "completed" | "error";

interface FileWithStatus extends File {
  id: string;
  status: FileStatus;
  ocrText?: string;
}

const DocumentUploadField = ({
  value,
  onChange,
  error,
}: {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
}) => {
  const currentFiles = Array.isArray(value) ? value : [];
  const processDocumentOCR = useAction(api.ocr.processDocumentOCR);
  const [processingQueue, setProcessingQueue] = useState<FileWithStatus[]>([]);
  const [filesWithStatus, setFilesWithStatus] = useState<FileWithStatus[]>([]);

  const processFile = async (file: FileWithStatus) => {
    try {
      // Update file status to processing
      setFilesWithStatus((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "processing" as FileStatus } : f
        )
      );

      // Get the file data

      const fileData = {
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        buffer: await file.arrayBuffer(),
      };

      const result = await processDocumentOCR({
        file: fileData,
        fileType: file.type,
      });

      console.log("OCR Result:", result);

      // Update file status to completed with OCR text
      setFilesWithStatus((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "completed" as FileStatus, ocrText: result.text }
            : f
        )
      );
    } catch (error) {
      console.error("OCR Processing Error:", error);
      // Update file status to error
      setFilesWithStatus((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "error" as FileStatus } : f
        )
      );
    }
  };

  const processNextInQueue = async () => {
    if (processingQueue.length > 0) {
      const nextFile = processingQueue[0];
      await processFile(nextFile);
      setProcessingQueue((prev) => prev.slice(1));
    }
  };

  React.useEffect(() => {
    if (processingQueue.length > 0) {
      processNextInQueue();
    }
  }, [processingQueue]);

  return (
    <div>
      <input
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            const newFiles = Array.from(files).filter((file) => {
              const isValidType =
                file.type.startsWith("image/") ||
                file.type === "application/pdf";
              const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
              return isValidType && isValidSize;
            });

            // Create FileWithStatus objects
            const filesWithStatus = newFiles.map((file) => {
              // Create a new File object with the same properties
              const fileWithStatus = new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified,
              }) as FileWithStatus;

              // Add our custom properties
              fileWithStatus.id = Math.random().toString(36).substr(2, 9);
              fileWithStatus.status = "pending";

              return fileWithStatus;
            });

            // Update both the form value and our internal state
            onChange([...currentFiles, ...newFiles]);
            setFilesWithStatus((prev) => [...prev, ...filesWithStatus]);
            setProcessingQueue((prev) => [...prev, ...filesWithStatus]);
          }
        }}
        style={{ display: "none" }}
        id="document-upload"
      />
      <Button
        type="button"
        variant="outlined"
        startIcon={<Upload size={20} />}
        onClick={() => document.getElementById("document-upload")?.click()}
      >
        Upload Medical Documents
      </Button>
      {error && <div style={{ color: "red", marginTop: 4 }}>{error}</div>}
      {filesWithStatus.length > 0 && (
        <div className={styles.filePreviews}>
          {filesWithStatus.map((file: FileWithStatus, index: number) => {
            console.log(file);

            const isImage = file?.type?.startsWith("image/");
            const isPDF = file?.type === "application/pdf";
            return (
              <div className={styles.filePreviewContainer} key={file.id}>
                <div className={styles.filePreview}>
                  {isImage ? (
                    <div className={styles.imagePreview}>
                      <Image
                        shape="square"
                        fill
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className={styles.previewImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.fileIcon}>
                      {isPDF ? <FileText size={40} /> : <FileText size={40} />}
                    </div>
                  )}
                  <div className={styles.fileInfo}>
                    {file.status === "processing" && (
                      <div className={styles.processingIndicator}>
                        <Loader2 size={16} className={styles.spinner} />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="contained"
                      size="xs"
                      onClick={() => {
                        const newFiles = [...currentFiles];
                        newFiles.splice(index, 1);
                        onChange(newFiles);
                        setFilesWithStatus((prev) =>
                          prev.filter((f) => f.id !== file.id)
                        );
                        setProcessingQueue((prev) =>
                          prev.filter((f) => f.id !== file.id)
                        );
                      }}
                      className={styles.removeButton}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <Text
                  value={`${file.name} ${file.status === "processing" ? "(Processing...)" : file.status === "completed" ? "(OCR Complete)" : file.status === "error" ? "(Error)" : ""}`}
                  fontSize="xs"
                  className={styles.fileName}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadField;
