import React, { useState, FormEvent, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import styles from "./FileUpload.module.scss";

export function FileUpload() {
  const generateUploadUrl = useMutation(api.labResults.generateUploadUrl);
  const saveLabResult = useMutation(api.labResults.saveLabResult);
  const labResults = useQuery(api.labResults.getLabResults);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Basic validation for text or PDF
      if (
        file.type === "application/pdf" ||
        file.type === "text/plain" ||
        file.type === "image/png" ||
        file.type === "image/webp"
      ) {
        setSelectedFile(file);
      } else {
        toast("Invalid file type. Please upload a PDF or Text file.");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      toast("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      const { storageId } = await response.json();
      if (!response.ok || !storageId) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      await saveLabResult({
        storageId: storageId as Id<"_storage">,
        fileName: selectedFile.name,
      });

      toast("File uploaded successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast(
        `Failed to upload file. ${error instanceof Error ? error.message : ""}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Lab Results</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="file-upload" className={styles.fileLabel}>
            Lab Test File (PDF or Text)
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            accept=".pdf,.txt,text/plain,application/pdf,.png,.webp"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>
        {selectedFile && (
          <p className={styles.selectedFile}>Selected: {selectedFile.name}</p>
        )}
        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className={styles.submitButton}
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {labResults === undefined && <div className={styles.loadingSpinner} />}
      {labResults && labResults.length === 0 && (
        <p className={styles.noResults}>No lab results uploaded yet.</p>
      )}
    </div>
  );
}
