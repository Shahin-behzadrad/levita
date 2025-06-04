import { FileText } from "lucide-react";
import { Button } from "@/components/Shared/Button/Button";
import React from "react";

export const HealthAnalysisDocuments = ({
  documents,
  fileUrls,
  processingOCR,
  onExtractText,
}: {
  documents: any[];
  fileUrls: string[];
  processingOCR: boolean;
  onExtractText: (doc: any, index: number) => void;
}) => (
  <div style={{ marginTop: "20px" }}>
    <h3>Documents</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "10px",
      }}
    >
      {documents?.map((doc, index) => {
        const isImage = doc.fileType.startsWith("image/");
        const isPDF = doc.fileType === "application/pdf";
        const fileUrl = fileUrls?.[index];
        return (
          <div
            key={doc.storageId}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {isImage ? (
              <img
                src={fileUrl || undefined}
                alt={doc.fileName}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <div
                style={{
                  height: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <FileText size={40} />
              </div>
            )}
            <div style={{ marginTop: "8px" }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.fileName}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
              {fileUrl && (
                <div style={{ marginTop: "8px" }}>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginRight: "8px",
                      fontSize: "14px",
                      color: "#0066cc",
                      textDecoration: "none",
                    }}
                  >
                    View File
                  </a>
                  <Button
                    variant="contained"
                    onClick={() => onExtractText(doc, index)}
                    disabled={processingOCR}
                  >
                    {processingOCR ? "Processing..." : "Extract Text"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default HealthAnalysisDocuments;
