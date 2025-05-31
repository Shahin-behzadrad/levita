import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SignUpFormData } from "./type";

const schema = yup.object().shape({
  role: yup.string().oneOf(["doctor", "patient"]).required("Role is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  age: yup
    .number()
    .min(0, "Age must be positive")
    .max(120, "Invalid age")
    .required("Age is required"),
  sex: yup.string().required("Sex is required"),
  // Doctor-specific validations
  specialization: yup.string().when("role", {
    is: "doctor",
    then: (schema) => schema.required("Specialization is required for doctors"),
  }),

  // Patient-specific validations
  symptoms: yup.string().when("role", {
    is: "patient",
    then: (schema) => schema.required("Symptoms are required for patients"),
  }),
  generalHealthStatus: yup.string().when("role", {
    is: "patient",
    then: (schema) => schema.required("Health status is required for patients"),
  }),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

export const useSignupForm = () => {
  return useForm<SignUpFormData>({
    resolver: yupResolver<SignUpFormData>(schema),
    defaultValues: {
      role: "patient",
      terms: false,
      age: 0,
      sex: "",
    },
  });
};
