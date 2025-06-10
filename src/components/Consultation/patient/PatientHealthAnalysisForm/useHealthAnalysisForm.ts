import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLanguage } from "@/i18n/LanguageContext";

export interface HealthAnalysisFormData {
  symptoms: string;
  currentConditions: string;
  age: number;
  sex: string;
  healthStatus: string;
  additionalInfo?: string;
  documents: (File | undefined)[];
  ocr?: string[];
}

export const useHealthAnalysisForm = () => {
  const { messages } = useLanguage();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<HealthAnalysisFormData>({
    resolver: yupResolver<HealthAnalysisFormData>(
      yup.object().shape({
        symptoms: yup
          .string()
          .required(
            messages.healthAnalysis?.symptomsRequired ||
              "Please describe your symptoms"
          ),
        currentConditions: yup
          .string()
          .required(
            messages.healthAnalysis?.currentConditionsRequired ||
              "Please list any current conditions"
          ),
        age: yup
          .number()
          .typeError(
            messages.healthAnalysis?.ageTypeError || "Age must be a number"
          )
          .transform((value, originalValue) => {
            // Convert empty string to undefined so required() triggers
            return originalValue === "" ? undefined : value;
          })
          .required(messages.healthAnalysis?.ageRequired || "Age is required")
          .min(1, messages.healthAnalysis?.ageMin || "Age must be at least 1")
          .max(
            120,
            messages.healthAnalysis?.ageMax ||
              "Age must be less than or equal to 120"
          ),
        sex: yup
          .string()
          .required(
            messages.healthAnalysis?.genderRequired || "Gender is required"
          ),
        healthStatus: yup
          .string()
          .required(
            messages.healthAnalysis?.healthStatusRequired ||
              "Health status is required"
          ),
        additionalInfo: yup.string().optional(),
        documents: yup
          .array()
          .of(
            yup
              .mixed<File>()
              .test(
                "is-file",
                messages.healthAnalysis?.invalidFile || "Invalid file",
                (value) => value instanceof File
              )
          )
          .default([])
          .required(
            messages.healthAnalysis?.documentsRequired ||
              "Please upload your medical documents"
          ),
        ocr: yup.array().of(yup.string().required()).optional(),
      })
    ),
    defaultValues: {
      symptoms: "",
      currentConditions: "",
      age: undefined,
      sex: "",
      healthStatus: "",
      additionalInfo: "",
      documents: [],
      ocr: [],
    },
  });

  return {
    control,
    handleSubmit,
    errors,
    setValue,
  };
};

export const healthStatusOptions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
