import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SignUpFormData } from "./type";
import { toast } from "sonner";
import { useApp } from "@/lib/AppContext";

const schema = yup.object().shape({
  role: yup.string().oneOf(["doctor", "patient"]).required("Role is required"),
  fullName: yup.string().required("Full name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  age: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .required("Age is required")
    .min(1, "Age must be positive")
    .max(120, "Invalid age"),
  sex: yup.string().required("Sex is required"),
  // Doctor-specific validations
  specialization: yup.string().when("role", {
    is: "doctor",
    then: (schema) => schema.required("Specialization is required for doctors"),
  }),
  licenseNumber: yup.string().when("role", {
    is: "doctor",
    then: (schema) => schema.required("License number is required for doctors"),
  }),
  languages: yup.string().when("role", {
    is: "doctor",
    then: (schema) => schema.required("Languages are required for doctors"),
  }),
  bio: yup.string().when("role", {
    is: "doctor",
    then: (schema) => schema.required("Bio is required for doctors"),
  }),
});

export const useProfileForm = () => {
  const { setView } = useApp();
  const updateUserProfile = useMutation(
    api.api.profiles.userProfiles.updateUserProfile
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: yupResolver<SignUpFormData>(schema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      specialization: "",
      licenseNumber: "",
      languages: "",
      bio: "",
      role: "patient",
      age: 0,
      sex: "",
    },
  });

  const role = watch("role");

  const handleProfileSubmit = async (data: SignUpFormData) => {
    try {
      const profileData = {
        role: data.role,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        age: data.age,
        sex: data.sex,
        ...(data.role === "doctor" && {
          specialization: data.specialization,
          licenseNumber: data.licenseNumber,
          languages: data.languages
            ? data.languages.split(",").map((l) => l.trim())
            : undefined,
          bio: data.bio,
        }),
      };

      await updateUserProfile(profileData);
      toast("Profile completed successfully!");
      setView("home");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return {
    control,
    handleSubmit,
    role,
    errors,
    isSubmitting,
    handleProfileSubmit,
  };
};
