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
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import {
  useHealthAnalysisForm,
  type HealthAnalysisFormData,
  healthStatusOptions,
  genderOptions,
} from "./useHealthAnalysisForm";

import styles from "./healthAnalysisClient.module.scss";
import Image from "@/components/Shared/Image/Image";

export const HealthAnalysis = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, errors } = useHealthAnalysisForm();

  const onSubmit = async (data: HealthAnalysisFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement form submission logic
      console.log("Form data:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Health Analysis Form"
        subheader="Please provide detailed information about your health concerns"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
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
                render={({ field: { value, onChange, ...field } }) => (
                  <div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,text/plain,application/pdf,.png,.webp"
                      onChange={(e) => onChange(e.target.files)}
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
                    {value && value.length > 0 && (
                      <div className={styles.filePreviews}>
                        {Array.from(value).map((file, index) => {
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
                                    const newFiles = Array.from(value);
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Health Analysis"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
