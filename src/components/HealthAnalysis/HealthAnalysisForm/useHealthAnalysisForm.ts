import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

export const schema = yup.object().shape({
  symptoms: yup.string().required("Please describe your symptoms"),
  currentConditions: yup
    .string()
    .required("Please list any current conditions"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .transform((value, originalValue) => {
      // Convert empty string to undefined so required() triggers
      return originalValue === "" ? undefined : value;
    })
    .required("Age is required")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than or equal to 120"),
  sex: yup.string().required("Gender is required"),
  healthStatus: yup.string().required("Health status is required"),
  additionalInfo: yup.string().optional(),
  documents: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test("is-file", "Invalid file", (value) => value instanceof File)
    )
    .default([])
    .required("Please upload your medical documents"),
  ocr: yup.array().of(yup.string().required()).optional(),
});

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

export const useHealthAnalysisForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<HealthAnalysisFormData>({
    resolver: yupResolver<HealthAnalysisFormData>(schema),
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
