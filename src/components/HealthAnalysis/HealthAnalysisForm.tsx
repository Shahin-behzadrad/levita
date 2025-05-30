import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Shared/Button/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/Card";

import { CircleX, Loader2, FileText } from "lucide-react";
import { FileUploadSection } from "./FileUploadSection";
import Image from "next/image";
import LoadingModal from "@/components/LoadingModal/LoadingModal";
import styles from "./HealthAnalysisForm.module.scss";
import TextField from "../Shared/TextField";
import Select from "../Shared/Select/Select";
import Text from "../Shared/Text";
export interface userProfileData {
  age?: string | number;
  sex?: string;
  symptoms?: string[];
  generalHealthStatus?: string;
}
interface HealthAnalysisFormProps {
  onSubmit: (formData: userProfileData) => Promise<void>;
  onFileUploaded: (files: File[]) => void;
  isAnalyzing: boolean;
  userProfile?: userProfileData | null;
}

interface FilePreview {
  url: string;
  type: string;
  name: string;
}

export function HealthAnalysisForm({
  onSubmit,
  isAnalyzing,
  userProfile,
  onFileUploaded,
}: HealthAnalysisFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<userProfileData>({
    defaultValues: {
      age: "",
      sex: "",
      symptoms: [""],
      generalHealthStatus: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  useEffect(() => {
    if (userProfile) {
      setValue("age", userProfile?.age?.toString() || "");
      setValue("sex", userProfile?.sex || "");
      setValue("symptoms", userProfile?.symptoms || []);
      setValue("generalHealthStatus", userProfile?.generalHealthStatus || "");
    }
  }, [userProfile, setValue]);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    const previews: FilePreview[] = [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview: FilePreview = {
          url: reader.result as string,
          type: file.type,
          name: file.name,
        };
        previews.push(preview);
        setFilePreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });

    onFileUploaded(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setFilePreviews(newPreviews);
    onFileUploaded(newFiles);
  };

  const onSubmitForm = async (data: userProfileData) => {
    await onSubmit(data);
  };

  const renderFilePreview = (preview: FilePreview, index: number) => {
    if (preview.type === "application/pdf") {
      return (
        <div key={index} className={styles.pdfPreview}>
          <CircleX
            color="red"
            className={styles.removeButton}
            onClick={() => removeFile(index)}
          />
          <FileText className={styles.pdfIcon} />
          <p className={styles.pdfName}>{preview.name}</p>
        </div>
      );
    }

    return (
      <div key={index} className={styles.filePreview}>
        <CircleX
          color="red"
          className={styles.removeButton}
          onClick={() => removeFile(index)}
        />
        <Image
          src={preview.url}
          alt={`Preview ${index + 1}`}
          className={styles.imagePreview}
          fill
          sizes="50px"
        />
      </div>
    );
  };

  return (
    <>
      {isAnalyzing && (
        <LoadingModal content="Your health details are being analyzed, please be patient." />
      )}
      <Card className={styles.form}>
        <CardHeader
          title="Health Analysis"
          subheader="Describe your symptoms and optionally upload lab results for AI analysis"
        />
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <CardContent className={styles.formSection}>
            <div className={styles.formGroup}>
              <TextField
                multiline
                label="Describe your symptoms or health concerns"
                placeholder="E.g., I've had a headache for 3 days, slight fever, and a sore throat..."
                value={watch("symptoms")?.[0] || ""}
                onChangeText={(text) => setValue("symptoms", [text])}
              />
            </div>

            <div className={styles.gridContainer}>
              <div className={styles.formGroup}>
                <TextField
                  label="Age"
                  type="number"
                  id="age"
                  min="0"
                  max="120"
                  step="1"
                  placeholder="Enter your age"
                  value={watch("age") ?? ""}
                  onChangeText={(text) => setValue("age", text)}
                />
              </div>

              <div className={styles.formGroup}>
                <Select
                  onChange={(value) => setValue("sex", value as string)}
                  value={watch("sex") ?? ""}
                  label="Sex"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </div>

              <div className={styles.formGroup}>
                <Select
                  label="Health Status"
                  options={[
                    { label: "Excellent", value: "excellent" },
                    { label: "Good", value: "good" },
                    { label: "Fair", value: "fair" },
                    { label: "Poor", value: "poor" },
                  ]}
                  value={watch("generalHealthStatus") ?? ""}
                  onChange={(value) =>
                    setValue("generalHealthStatus", value as string)
                  }
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <Text value="Lab Results (Optional)" />
              {filePreviews.length > 0 ? (
                <div className={styles.filePreviewContainer}>
                  {filePreviews.map((preview, index) =>
                    renderFilePreview(preview, index)
                  )}
                </div>
              ) : (
                <FileUploadSection onFileChange={handleFileChange} />
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className={styles.loadingIcon} />
                  Analyzing...
                </>
              ) : (
                "Analyze Health Data"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
