"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Shared/Button/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/Card";
import {
  useHealthAnalysisForm,
  type HealthAnalysisFormData,
} from "./useHealthAnalysisForm";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import { HealthAnalysisForm } from "./HealthAnalysisForm";

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

type Props = {
  onCancel?: () => void;
};

export const HealthAnalysis = ({ onCancel }: Props) => {
  const router = useRouter();
  const { locale, messages } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOCRFulfilled, setIsOCRFulfilled] = useState(false);

  const { control, handleSubmit, errors, setValue } = useHealthAnalysisForm();

  const updateHealthAnalysis = useMutation(
    api.api.health.healthAnalysis.updateHealthAnalysisInfo
  );
  const patientProfile = useQuery(
    api.api.profiles.patientProfiles.getPatientProfile
  );

  const openAIAnalyzeHealth = useAction(
    api.api.health.healthAnalysis.openAIAnalyzeHealth
  );
  const getHealthAnalysisInfo = useQuery(
    api.api.health.healthAnalysis.getHealthAnalysisInfo
  );
  const generateUploadUrl = useMutation(
    api.api.storage.fileStorage.generateUploadUrl
  );

  useEffect(() => {
    if (patientProfile && patientProfile.sex && patientProfile.age) {
      setValue("age", patientProfile.age);
      setValue("sex", patientProfile.sex);
    }
  }, [patientProfile]);

  const onSubmit = async (data: HealthAnalysisFormData) => {
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

      await openAIAnalyzeHealth({ language: locale });

      toast.success("Health analysis submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit health analysis");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (getHealthAnalysisInfo === undefined) {
    return <LoadingModal />;
  }

  return (
    <Card>
      <CardHeader
        title={messages.healthAnalysis?.formTitle || "Health Analysis Form"}
        subheader={
          messages.healthAnalysis?.formSubheader ||
          "Please provide detailed information about your health concerns"
        }
      />
      <CardContent>
        <HealthAnalysisForm
          control={control}
          errors={errors}
          setValue={setValue}
          setIsOCRFulfilled={setIsOCRFulfilled}
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("errors", errors);
          })}
        />
      </CardContent>
      <CardFooter>
        <Button fullWidth variant="outlined" onClick={onCancel}>
          {messages.healthAnalysis?.cancel || "Cancel"}
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting || !isOCRFulfilled}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? messages.healthAnalysis?.submitting || "Submitting..."
            : messages.healthAnalysis?.submitButton || "Submit Health Analysis"}
        </Button>
      </CardFooter>
    </Card>
  );
};
