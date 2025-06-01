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

const doctorSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  sex: yup.string().required("Sex is required"),
  languages: yup.string().required("Languages are required"),
  specialization: yup.string().required("Specialization is required"),
  licenseNumber: yup.string().required("License number is required"),
  bio: yup.string(),
  age: yup
    .number()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(0, "Age must be positive")
    .max(120, "Age must be less than 120")
    .typeError("Please enter a valid age"),
});

const patientSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  sex: yup.string().required("Sex is required"),
  languages: yup.string().required("Languages are required"),
  bio: yup.string(),
  age: yup
    .number()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(0, "Age must be positive")
    .max(120, "Age must be less than 120")
    .typeError("Please enter a valid age"),
});

interface ProfileFormProps {
  userData: UserType;
  onSuccess?: () => void;
}

const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const ProfileFormPage = ({ userData, onSuccess }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const schema = userData.role === "doctor" ? doctorSchema : patientSchema;
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
      toast.success("Profile updated successfully");
      reset(data);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
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
                label="First Name"
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
                label="Last Name"
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
                label="Phone"
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
                label="Age"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(null);
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      field.onChange(numValue);
                    }
                  }
                }}
                error={!!errors.age}
                errors={errors.age?.message}
                inputMode="numeric"
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
                label="Sex"
                options={sexOptions}
                value={field.value}
                onChange={field.onChange}
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
                label="Languages"
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
                    label="Specialization"
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
                    label="License Number"
                    {...field}
                    error={!!doctorErrors.licenseNumber}
                    errors={doctorErrors.licenseNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Bio"
                    {...field}
                    error={!!errors.bio}
                    errors={errors.bio?.message}
                    multiline
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
      {isDirty && (
        <div className={styles.saveButton}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            <Save size={20} style={{ marginRight: 8 }} />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
};
