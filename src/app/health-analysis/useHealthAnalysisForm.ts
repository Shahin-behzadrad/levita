import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface HealthAnalysisFormData {
  symptoms: string;
  currentConditions: string;
  age: number;
  gender: string;
  healthStatus: string;
  additionalInfo: string;
  documents: (File | undefined)[];
}

export const schema = yup.object().shape({
  symptoms: yup.string().required("Please describe your symptoms"),
  currentConditions: yup
    .string()
    .required("Please list any current conditions"),
  age: yup
    .number()
    .required("Age is required")
    .min(0, "Age must be positive")
    .max(120, "Age must be less than 120"),
  gender: yup.string().required("Gender is required"),
  healthStatus: yup.string().required("Health status is required"),
  additionalInfo: yup.string().required("Additional information is required"),
  documents: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test("is-file", "Invalid file", (value) => value instanceof File)
    )
    .default([]),
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
  } = useForm<HealthAnalysisFormData>({
    resolver: yupResolver<HealthAnalysisFormData>(schema),
    defaultValues: {
      symptoms: "",
      currentConditions: "",
      age: undefined,
      gender: "",
      healthStatus: "",
      additionalInfo: "",
      documents: [],
    },
  });

  return {
    control,
    handleSubmit,
    errors,
  };
};
