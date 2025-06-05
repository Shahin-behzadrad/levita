import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/Shared/Button/Button";
import {
  X,
  FileText,
  Upload,
  Loader2,
  Eye,
  Check,
  AlertCircle,
} from "lucide-react";
import Image from "@/components/Shared/Image/Image";
import styles from "./healthAnalysisClient.module.scss";
import Text from "@/components/Shared/Text";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Modal from "@/components/Shared/Modal/Modal";
import { toast } from "sonner";

type FileStatus = "pending" | "processing" | "completed" | "error";

interface FileWithStatus extends File {
  id: string;
  status: FileStatus;
  ocrText?: string;
}

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
  onOCRComplete: (ocrResult: string[]) => void;
};

const DocumentUploadField = ({
  value,
  onChange,
  error,
  onOCRComplete,
}: Props) => {
  const currentFiles = Array.isArray(value) ? value : [];
  const processDocumentOCR = useAction(api.ocr.processDocumentOCR);
  const [processingQueue, setProcessingQueue] = useState<FileWithStatus[]>([]);
  const [filesWithStatus, setFilesWithStatus] = useState<FileWithStatus[]>([]);
  const [previewFile, setPreviewFile] = useState<FileWithStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: FileWithStatus) => {
    try {
      // Update file status to processing
      setFilesWithStatus((prev) =>
        prev.map((f) => {
          if (f.id === file.id) f.status = "processing";
          return f;
        })
      );

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

      // Update file status to completed with OCR text
      setFilesWithStatus((prev) =>
        prev.map((f) => {
          if (f.id === file.id) {
            f.status = "completed";
            f.ocrText = result;
          }
          return f;
        })
      );
    } catch (error) {
      setFilesWithStatus((prev) =>
        prev.map((f) => {
          if (f.id === file.id) f.status = "error";
          return f;
        })
      );
      toast.error(`Failed to process ${file.name}`);
    }
  };

  const processNextInQueue = async () => {
    if (processingQueue.length > 0) {
      const nextFile = processingQueue[0];
      await processFile(nextFile);
      setProcessingQueue((prev) => prev.slice(1));
    }
  };

  useEffect(() => {
    if (processingQueue.length > 0) {
      processNextInQueue();
    }
  }, [processingQueue]);

  // Trigger onOCRComplete with array of ocrText when all files are done
  useEffect(() => {
    if (
      filesWithStatus.length > 0 &&
      filesWithStatus.every(
        (f) => f.status === "completed" || f.status === "error"
      )
    ) {
      const ocrTexts = filesWithStatus.map((f) => f.ocrText || "");
      onOCRComplete(ocrTexts);
    }
  }, [filesWithStatus, onOCRComplete]);

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
        ref={fileInputRef}
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
            const isImage = file?.type?.startsWith("image/");
            const isPDF = file?.type === "application/pdf";
            // Reduce opacity for files that are 'pending' (in queue, not yet processing)
            const containerStyle =
              file.status === "pending" ? { opacity: 0.5 } : {};
            return (
              <div
                className={styles.filePreviewContainer}
                key={file.id}
                style={containerStyle}
              >
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
                  {file.status === "completed" && (
                    <div
                      className={`${styles.statusIndicator} ${styles.completed}`}
                    >
                      <Check size={24} />
                    </div>
                  )}
                  {file.status === "error" && (
                    <div
                      className={`${styles.statusIndicator} ${styles.error}`}
                    >
                      <AlertCircle size={12} />
                    </div>
                  )}
                  {file.status === "processing" && (
                    <div className={styles.processingIndicator}>
                      <Loader2 size={16} className={styles.spinner} />
                    </div>
                  )}
                  <div className={styles.fileInfo}>
                    <Button
                      type="button"
                      color="success"
                      variant="contained"
                      size="xs"
                      onClick={() => setPreviewFile(file)}
                      className={styles.previewButton}
                    >
                      <Eye size={16} />
                    </Button>
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
                        // Reset file input so the same file can be added again
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className={styles.removeButton}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <Text
                  value={file.name}
                  fontSize="xs"
                  className={styles.fileName}
                />
              </div>
            );
          })}
        </div>
      )}
      <Modal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        title={previewFile?.name}
        maxWidth={600}
      >
        {previewFile && previewFile.type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(previewFile)}
            alt={previewFile.name}
            style={{ width: "100%", maxHeight: 500, objectFit: "contain" }}
          />
        ) : previewFile && previewFile.type === "application/pdf" ? (
          <iframe
            src={URL.createObjectURL(previewFile)}
            title={previewFile.name}
            style={{ width: "100%", height: 500, border: "none" }}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default DocumentUploadField;
