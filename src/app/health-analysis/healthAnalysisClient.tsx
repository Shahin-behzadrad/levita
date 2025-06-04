"use client";

import { Controller } from "react-hook-form";
import { TextField } from "@/components/Shared/TextField/TextField";
import { Button } from "@/components/Shared/Button/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/Card";
import Grid from "@/components/Shared/Grid/Grid";
import Select from "@/components/Shared/Select/Select";
import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import {
  useHealthAnalysisForm,
  type HealthAnalysisFormData,
  healthStatusOptions,
  genderOptions,
} from "./useHealthAnalysisForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";

import styles from "./healthAnalysisClient.module.scss";
import Image from "@/components/Shared/Image/Image";
import LoadingModal from "@/components/LoadingModal/LoadingModal";

export const HealthAnalysis = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingOCR, setProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    text: string;
    pageCount: number;
    pages: Array<{
      pageNumber: number;
      confidence: number;
      blocks: Array<{
        confidence: number;
        text: string;
      }>;
    }>;
  } | null>(null);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const { control, handleSubmit, errors } = useHealthAnalysisForm();
  const router = useRouter();
  const updateHealthAnalysis = useMutation(
    api.healthAnalysis.updateHealthAnalysis
  );
  const existingAnalysis = useQuery(api.healthAnalysis.getHealthAnalysis);
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const processDocumentOCR = useAction(api.ocr.processDocumentOCR);

  // Get all file URLs at once
  const fileUrls = useQuery(
    api.fileStorage.getFileUrls,
    existingAnalysis?.documents
      ? {
          storageIds: existingAnalysis.documents.map((doc) => doc.storageId),
        }
      : "skip"
  );

  const onSubmit = async (data: HealthAnalysisFormData) => {
    setIsSubmitting(true);
    try {
      // Upload files to Convex storage
      const uploadedFiles = await Promise.all(
        data.documents
          .filter((file): file is File => file instanceof File)
          .map(async (file) => {
            const storageId = await uploadFile(file);
            return {
              storageId,
              fileName: file.name,
              fileType: file.type,
              uploadedAt: Date.now(),
            };
          })
      );

      // Update health analysis in Convex
      await updateHealthAnalysis({
        symptoms: data.symptoms,
        currentConditions: data.currentConditions,
        healthStatus: data.healthStatus,
        additionalInfo: data.additionalInfo,
        documents: uploadedFiles,
      });

      toast.success("Health analysis submitted successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit health analysis");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to upload a file to Convex storage
  const uploadFile = async (file: File): Promise<string> => {
    // Get the upload URL
    const uploadUrl = await generateUploadUrl();

    // Upload the file
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Failed to upload file: ${result.statusText}`);
    }

    // Get the storage ID from the response
    const { storageId } = await result.json();
    return storageId;
  };

  if (existingAnalysis) {
    return (
      <>
        <div style={{ padding: "20px" }}>
          <h2>Your Health Analysis</h2>
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
              {existingAnalysis.documents?.map((doc, index) => {
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
                            onClick={async () => {
                              try {
                                setProcessingOCR(true);
                                const result = await processDocumentOCR({
                                  storageId: doc.storageId,
                                  fileType: doc.fileType,
                                });
                                console.log(result);

                                if (result.text) {
                                  setOcrResult({
                                    text: result.text,
                                    pageCount: result.pageCount,
                                    pages: (result.pages || []).map((page) => ({
                                      ...page,
                                      blocks: page.blocks.map((block) => ({
                                        ...block,
                                        text: block.text || "",
                                      })),
                                    })),
                                  });
                                  setShowOcrModal(true);
                                  toast.success("OCR processing completed");
                                } else {
                                  toast.error(
                                    "No text detected in the document"
                                  );
                                }
                              } catch (error) {
                                console.error("OCR processing error:", error);
                                toast.error("Failed to process document OCR");
                              } finally {
                                setProcessingOCR(false);
                              }
                            }}
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
        </div>
        {showOcrModal && ocrResult && (
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
            onClick={() => setShowOcrModal(false)}
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
                <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                  Total Pages: {ocrResult.pageCount}
                </p>
                {ocrResult.pages.map((page, index) => (
                  <div key={index} style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                        padding: "8px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                      }}
                    >
                      <h4 style={{ margin: 0 }}>Page {page.pageNumber}</h4>
                      <span
                        style={{
                          fontSize: "14px",
                          color:
                            page.confidence > 0.8
                              ? "#2e7d32"
                              : page.confidence > 0.6
                                ? "#ed6c02"
                                : "#d32f2f",
                        }}
                      >
                        Confidence: {(page.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
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
                      {page.blocks.map((block, blockIndex) => (
                        <div
                          key={blockIndex}
                          style={{
                            marginBottom: "8px",
                            padding: "8px",
                            backgroundColor: "#ffffff",
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "4px",
                            }}
                          >
                            Block Confidence:{" "}
                            {(block.confidence * 100).toFixed(1)}%
                          </div>
                          {block.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="contained"
                onClick={() => setShowOcrModal(false)}
                fullWidth
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Health Analysis Form"
        subheader="Please provide detailed information about your health concerns"
      />
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("errors", errors);
        })}
      >
        <CardContent>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Controller
                name="symptoms"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Symptoms and Concerns"
                    multiline
                    {...field}
                    error={Boolean(errors.symptoms?.message)}
                    helperText={errors.symptoms?.message}
                    placeholder="Please describe your symptoms and concerns in detail"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="currentConditions"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Current Conditions, Illness, and Medication"
                    multiline
                    {...field}
                    error={Boolean(errors.currentConditions?.message)}
                    helperText={errors.currentConditions?.message}
                    placeholder="List any current conditions, illnesses, or medications you're taking"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Age"
                    type="number"
                    inputMode="numeric"
                    {...field}
                    error={Boolean(errors.age?.message)}
                    helperText={errors.age?.message}
                    placeholder="Enter your age"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Gender"
                    options={genderOptions}
                    {...field}
                    error={Boolean(errors.gender?.message)}
                    helperText={errors.gender?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="healthStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    label="General Health Status"
                    options={healthStatusOptions}
                    {...field}
                    error={Boolean(errors.healthStatus?.message)}
                    helperText={errors.healthStatus?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="additionalInfo"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Additional Information"
                    multiline
                    {...field}
                    error={Boolean(errors.additionalInfo?.message)}
                    helperText={errors.additionalInfo?.message}
                    placeholder="Share any additional information that might help the doctor"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="documents"
                control={control}
                render={({ field: { value, onChange, ...field } }) => {
                  // Ensure value is always an array
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
                            // Convert FileList to Array and validate each file
                            const newFiles = Array.from(files).filter(
                              (file) => {
                                const isValidType =
                                  file.type.startsWith("image/") ||
                                  file.type === "application/pdf";
                                const isValidSize =
                                  file.size <= 10 * 1024 * 1024; // 10MB limit
                                return isValidType && isValidSize;
                              }
                            );
                            onChange([...currentFiles, ...newFiles]);
                          }
                        }}
                        {...field}
                        style={{ display: "none" }}
                        id="document-upload"
                      />
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<Upload size={20} />}
                        onClick={() =>
                          document.getElementById("document-upload")?.click()
                        }
                      >
                        Upload Medical Documents
                      </Button>
                      {currentFiles.length > 0 && (
                        <div className={styles.filePreviews}>
                          {currentFiles
                            .filter(
                              (file): file is File => file instanceof File
                            )
                            .map((file: File, index: number) => {
                              const isImage = file.type.startsWith("image/");
                              const isPDF = file.type === "application/pdf";

                              return (
                                <div key={index} className={styles.filePreview}>
                                  {isImage ? (
                                    <div className={styles.imagePreview}>
                                      <Image
                                        shape="square"
                                        width={200}
                                        height={200}
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className={styles.previewImage}
                                      />
                                    </div>
                                  ) : (
                                    <div className={styles.fileIcon}>
                                      {isPDF ? (
                                        <FileText size={40} />
                                      ) : (
                                        <FileText size={40} />
                                      )}
                                    </div>
                                  )}
                                  <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>
                                      {file.name}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="text"
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
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Health Analysis"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
