"use client";

import { UserType } from "@/types/userType";
import { TextField } from "../Shared/TextField/TextField";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import Grid from "../Shared/Grid/Grid";
import { Save } from "lucide-react";
import { Button } from "../Shared/Button/Button";
import styles from "./ProfileScreen.module.scss";
import { useState } from "react";
import Select from "../Shared/Select/Select";
import { useLanguage } from "@/i18n/LanguageContext";

interface BaseProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  sex: string;
  languages: string;
  bio?: string;
  age?: number | null;
}

interface DoctorProfileFormData extends BaseProfileFormData {
  specialization: string;
  licenseNumber: string;
}

type ProfileFormData = DoctorProfileFormData | BaseProfileFormData;

const createDoctorSchema = (messages: any) =>
  yup.object().shape({
    firstName: yup.string().required(messages.profile.requiredField),
    lastName: yup.string().required(messages.profile.requiredField),
    phoneNumber: yup.string().required(messages.profile.requiredField),
    sex: yup.string().required(messages.profile.requiredField),
    languages: yup.string().required(messages.profile.requiredField),
    specialization: yup.string().required(messages.profile.requiredField),
    licenseNumber: yup.string().required(messages.profile.requiredField),
    bio: yup.string(),
    age: yup
      .number()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
      .min(0, messages.profile.ageRange)
      .max(120, messages.profile.ageRange)
      .typeError(messages.profile.invalidAge),
  });

const createPatientSchema = (messages: any) =>
  yup.object().shape({
    firstName: yup.string().required(messages.profile.requiredField),
    lastName: yup.string().required(messages.profile.requiredField),
    phoneNumber: yup.string().required(messages.profile.requiredField),
    sex: yup.string().required(messages.profile.requiredField),
    languages: yup.string().required(messages.profile.requiredField),
    bio: yup.string(),
    age: yup
      .number()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
      .min(0, messages.profile.ageRange)
      .max(120, messages.profile.ageRange)
      .typeError(messages.profile.invalidAge),
  });

interface ProfileFormProps {
  userData: UserType;
  onSuccess?: () => void;
}

export const ProfileFormPage = ({ userData, onSuccess }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const { messages } = useLanguage();

  const sexOptions = [
    { value: "male", label: messages.profile.male },
    { value: "female", label: messages.profile.female },
    { value: "other", label: messages.profile.other },
  ];

  const schema =
    userData.role === "doctor"
      ? createDoctorSchema(messages)
      : createPatientSchema(messages);
  const isDoctor = userData.role === "doctor";

  const [firstName, ...lastNameArr] = (userData.fullName || "").split(" ");
  const lastName = lastNameArr.join(" ");

  const defaultValues = {
    firstName,
    lastName,
    phoneNumber: userData.phoneNumber || "",
    sex: userData.sex || "",
    languages: userData.languages?.join(", ") || "",
    age: userData.age || undefined,
    ...(isDoctor && {
      specialization: userData.specialization || "",
      licenseNumber: userData.licenseNumber || "",
    }),
    bio: userData.bio || "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      const profileData = {
        role: userData.role as "doctor" | "patient",
        fullName: `${data.firstName} ${data.lastName}`,
        phoneNumber: data.phoneNumber,
        age: data.age || 0,
        sex: data.sex,
        languages: data.languages.split(",").map((l) => l.trim()),
        ...(isDoctor && {
          specialization: (data as DoctorProfileFormData).specialization,
          licenseNumber: (data as DoctorProfileFormData).licenseNumber,
          bio: data.bio,
        }),
      };
      await updateUserProfile(profileData);
      toast.success(messages.profile.updateSuccess);
      reset(data);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(messages.profile.updateError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const doctorErrors = errors as Partial<
    Record<keyof DoctorProfileFormData, { message?: string }>
  >;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={8} className={styles.fieldsContainer}>
        <Grid item xs={12} md={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                label={messages.profile.firstName}
                {...field}
                error={!!errors.firstName}
                errors={errors.firstName?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                label={messages.profile.lastName}
                {...field}
                error={!!errors.lastName}
                errors={errors.lastName?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                label={messages.profile.phone}
                {...field}
                error={!!errors.phoneNumber}
                errors={errors.phoneNumber?.message}
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
                label={messages.profile.age}
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(null);
                  } else {
                    field.onChange(parseInt(value, 10));
                  }
                }}
                error={!!errors.age}
                errors={errors.age?.message}
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
                label={messages.profile.sex}
                options={sexOptions}
                {...field}
                error={!!errors.sex}
                helperText={errors.sex?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="languages"
            control={control}
            render={({ field }) => (
              <TextField
                label={messages.profile.languages}
                {...field}
                error={!!errors.languages}
                errors={errors.languages?.message}
              />
            )}
          />
        </Grid>
        {isDoctor && (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={messages.profile.specialization}
                    {...field}
                    error={!!doctorErrors.specialization}
                    errors={doctorErrors.specialization?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="licenseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={messages.profile.licenseNumber}
                    {...field}
                    error={!!doctorErrors.licenseNumber}
                    errors={doctorErrors.licenseNumber?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}
        {isDoctor && (
          <Grid item xs={12}>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  label={messages.profile.bio}
                  {...field}
                  multiline
                  error={!!errors.bio}
                  errors={errors.bio?.message}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
      {isDirty && (
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isSubmitting}
          startIcon={<Save size={20} />}
        >
          {messages.profile.updateProfile}
        </Button>
      )}
    </form>
  );
};
