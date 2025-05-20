import React, { useState, FormEvent, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

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
        toast.error("Invalid file type. Please upload a PDF or Text file.");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
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

      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error(
        `Failed to upload file. ${error instanceof Error ? error.message : ""}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-8 shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Upload Lab Results
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700"
          >
            Lab Test File (PDF or Text)
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            accept=".pdf,.txt,text/plain,application/pdf,.png,.webp"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700
                       hover:file:bg-indigo-100"
          />
        </div>
        {selectedFile && (
          <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>
        )}
        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {labResults === undefined && (
        <div className="flex justify-center items-center pt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        </div>
      )}
      {labResults && labResults.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">
          No lab results uploaded yet.
        </p>
      )}
    </div>
  );
}
