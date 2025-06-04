import { Button } from "@/components/Shared/Button/Button";
import React from "react";

const OcrResultModal = ({
  open,
  text,
  onClose,
}: {
  open: boolean;
  text: string;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Extracted Text</h3>
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "16px",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {text}
          </div>
        </div>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </div>
    </div>
  );
};

export default OcrResultModal;
