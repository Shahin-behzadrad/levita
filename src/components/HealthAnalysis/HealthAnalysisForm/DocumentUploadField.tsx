import React from "react";
import { Button } from "@/components/Shared/Button/Button";
import { X, FileText, Upload } from "lucide-react";
import Image from "@/components/Shared/Image/Image";
import styles from "./healthAnalysisClient.module.scss";
import Text from "@/components/Shared/Text";

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
            onChange([...currentFiles, ...newFiles]);
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
      {currentFiles.length > 0 && (
        <div className={styles.filePreviews}>
          {currentFiles.map((file: File, index: number) => {
            const isImage = file.type.startsWith("image/");
            const isPDF = file.type === "application/pdf";
            return (
              <div className={styles.filePreviewContainer} key={index}>
                <div key={index} className={styles.filePreview}>
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
                    <Button
                      type="button"
                      variant="contained"
                      size="xs"
                      onClick={() => {
                        const newFiles = [...currentFiles];
                        newFiles.splice(index, 1);
                        onChange(newFiles);
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
    </div>
  );
};

export default DocumentUploadField;
