import { Controller, UseFormSetValue } from "react-hook-form";
import { TextField } from "@/components/Shared/TextField/TextField";
import Grid from "@/components/Shared/Grid/Grid";
import Select from "@/components/Shared/Select/Select";
import DocumentUploadField from "./DocumentUploadField";
import { useLanguage } from "@/i18n/LanguageContext";

import {
  type HealthAnalysisFormData,
  healthStatusOptions,
  genderOptions,
} from "./useHealthAnalysisForm";

import styles from "./healthAnalysisForm.module.scss";

interface HealthAnalysisFormProps {
  control: any;
  errors: any;
  setValue: UseFormSetValue<HealthAnalysisFormData>;
  onSubmit: (e: React.FormEvent) => void;
  setIsOCRFulfilled: (isOCRFulfilled: boolean) => void;
}

export const HealthAnalysisForm = ({
  control,
  errors,
  setValue,

  onSubmit,
  setIsOCRFulfilled,
}: HealthAnalysisFormProps) => {
  const { messages } = useLanguage();

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Grid container spacing={8}>
        <Grid item xs={12} md={6}>
          <Controller
            name="symptoms"
            control={control}
            render={({ field }) => (
              <TextField
                label={
                  messages.healthAnalysis?.symptomsLabel ||
                  "Symptoms and Concerns"
                }
                multiline
                {...field}
                error={Boolean(errors.symptoms?.message)}
                helperText={errors.symptoms?.message}
                placeholder={
                  messages.healthAnalysis?.symptomsPlaceholder ||
                  "Please describe your symptoms and concerns in detail"
                }
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
                label={
                  messages.healthAnalysis?.currentConditionsLabel ||
                  "Current Conditions, Illness, and Medication"
                }
                multiline
                {...field}
                error={Boolean(errors.currentConditions?.message)}
                helperText={errors.currentConditions?.message}
                placeholder={
                  messages.healthAnalysis?.currentConditionsPlaceholder ||
                  "List any current conditions, illnesses, or medications you're taking"
                }
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
                label={messages.healthAnalysis?.ageLabel || "Age"}
                type="number"
                inputMode="numeric"
                {...field}
                error={Boolean(errors.age?.message)}
                helperText={errors.age?.message}
                placeholder={
                  messages.healthAnalysis?.agePlaceholder || "Enter your age"
                }
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
                label={messages.healthAnalysis?.genderLabel || "Gender"}
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
                label={
                  messages.healthAnalysis?.healthStatusLabel ||
                  "General Health Status"
                }
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
                label={
                  messages.healthAnalysis?.additionalInfoLabel ||
                  "Additional Information"
                }
                multiline
                {...field}
                error={Boolean(errors.additionalInfo?.message)}
                helperText={errors.additionalInfo?.message}
                placeholder={
                  messages.healthAnalysis?.additionalInfoPlaceholder ||
                  "Share any additional information that might help the doctor"
                }
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
    </form>
  );
};
