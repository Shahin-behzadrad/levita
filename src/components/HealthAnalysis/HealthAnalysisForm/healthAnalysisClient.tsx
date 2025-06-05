"use client";

import { useState } from "react";
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

import {
  useHealthAnalysisForm,
  type HealthAnalysisFormData,
  healthStatusOptions,
  genderOptions,
} from "./useHealthAnalysisForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

import styles from "./healthAnalysisClient.module.scss";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import DocumentUploadField from "./DocumentUploadField";

// Helper function to upload a file to Convex storage
const uploadFile = async (
  file: File,
  generateUploadUrl: any
): Promise<string> => {
  const uploadUrl = await generateUploadUrl();
  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!result.ok) {
    throw new Error(`Failed to upload file: ${result.statusText}`);
  }
  const { storageId } = await result.json();
  return storageId;
};

export const HealthAnalysis = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOCRFulfilled, setIsOCRFulfilled] = useState(false);
  const { control, handleSubmit, errors, setValue } = useHealthAnalysisForm();

  const updateHealthAnalysis = useMutation(
    api.healthAnalysis.updateHealthAnalysis
  );
  const analysisData = useQuery(api.healthAnalysis.getHealthAnalysis);
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);

  const onSubmit = async (data: HealthAnalysisFormData) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const uploadedFiles = await Promise.all(
        data.documents
          .filter((file): file is File => file instanceof File)
          .map(async (file) => {
            const storageId = await uploadFile(file, generateUploadUrl);
            return {
              storageId,
              fileName: file.name,
              fileType: file.type,
              uploadedAt: Date.now(),
            };
          })
      );
      await updateHealthAnalysis({
        symptoms: data.symptoms,
        currentConditions: data.currentConditions,
        healthStatus: data.healthStatus,
        additionalInfo: data.additionalInfo || "",
        documents: uploadedFiles,
        ocrText: data.ocr,
      });
      toast.success("Health analysis submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit health analysis");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (analysisData === undefined) {
    return <LoadingModal />;
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
            <Grid item xs={12} md={6}>
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

            <Grid item xs={12} md={6}>
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
                name="sex"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Gender"
                    options={genderOptions}
                    {...field}
                    error={Boolean(errors.sex?.message)}
                    helperText={errors.sex?.message}
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
                render={({ field: { value, onChange } }) => (
                  <DocumentUploadField
                    value={
                      Array.isArray(value)
                        ? value.filter((f): f is File => f instanceof File)
                        : []
                    }
                    onChange={onChange}
                    error={errors.documents?.message}
                    onOCRComplete={(ocrResults) => {
                      setValue("ocr", ocrResults);
                      setIsOCRFulfilled(true);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || !isOCRFulfilled}
          >
            {isSubmitting ? "Submitting..." : "Submit Health Analysis"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
