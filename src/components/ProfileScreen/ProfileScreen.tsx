import { UserType } from "@/types/userType";
import { Card, CardContent } from "../Shared/Card";
import { Text } from "../Shared/Text/Text";
import { ProfileImageUpload } from "../ProfileImageUpload/ProfileImageUpload";
import styles from "./ProfileScreen.module.scss";
import { useEffect, useState } from "react";
import Grid from "../Shared/Grid/Grid";
import { User, Save } from "lucide-react";
import { TextField } from "../Shared/TextField/TextField";
import { useForm } from "react-hook-form";
import { Button } from "../Shared/Button/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface ProfileScreenProps {
  userData?: UserType | null;
}

interface BaseProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  sex: string;
  languages: string;
  bio?: string;
  age?: number;
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
    .min(0, "Age must be positive")
    .max(120, "Age must be less than 120"),
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
    .min(0, "Age must be positive")
    .max(120, "Age must be less than 120"),
});

const ProfileScreen = ({ userData }: ProfileScreenProps) => {
  if (!userData) return null;

  const [firstName, ...lastNameArr] = (userData.fullName || "").split(" ");
  const lastName = lastNameArr.join(" ");
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const schema = userData.role === "doctor" ? doctorSchema : patientSchema;
  const isDoctor = userData.role === "doctor";

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
    formState: { errors, isDirty: formIsDirty, dirtyFields },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formIsDirty]);

  const handleFieldChange = (
    field: keyof (BaseProfileFormData & Partial<DoctorProfileFormData>),
    value: string | number
  ) => {
    setValue(field, value, { shouldDirty: true });
  };

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
      reset(data); // Reset form with new values after successful submission
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
    <div className={styles.container}>
      <div>
        <Text
          value={`${userData?.role ? userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) : ""} Profile`}
          variant="h4"
          fontWeight="bold"
        />
        <Text
          value="manage your profile information"
          color="gray"
          fontSize="sm"
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={8} className={styles.gridContainer}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent className={styles.sidebarContent}>
                <ProfileImageUpload currentImageUrl={userData.profilePicture} />
                <Text
                  value={userData.fullName || ""}
                  fontWeight="bold"
                  fontSize="lg"
                  noWrap
                  textAlign="center"
                />
                {userData.role === "doctor" && userData.specialization && (
                  <div className={styles.specialization}>
                    <Text value={userData.specialization} fontSize="sm" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Card>
              <CardContent>
                <Text
                  className={styles.title}
                  value="Personal Information"
                  fontWeight="bold"
                  fontSize="xl"
                  startAdornment={<User size={20} />}
                />
                <Text
                  value="Your basic personal and contact information"
                  color="gray"
                  fontSize="sm"
                />
                <Grid container spacing={8} className={styles.fieldsContainer}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First Name"
                      value={watch("firstName")}
                      onChangeText={(text) =>
                        handleFieldChange("firstName", text)
                      }
                      error={!!errors.firstName}
                      errors={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Last Name"
                      value={watch("lastName")}
                      onChangeText={(text) =>
                        handleFieldChange("lastName", text)
                      }
                      error={!!errors.lastName}
                      errors={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      value={watch("phoneNumber")}
                      onChangeText={(text) =>
                        handleFieldChange("phoneNumber", text)
                      }
                      error={!!errors.phoneNumber}
                      errors={errors.phoneNumber?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Age"
                      value={watch("age")?.toString() || ""}
                      onChangeText={(text) =>
                        handleFieldChange("age", parseInt(text) || "")
                      }
                      error={!!errors.age}
                      errors={errors.age?.message}
                      inputMode="numeric"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Sex"
                      value={watch("sex")}
                      onChangeText={(text) => handleFieldChange("sex", text)}
                      error={!!errors.sex}
                      errors={errors.sex?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Languages"
                      value={watch("languages")}
                      onChangeText={(text) =>
                        handleFieldChange("languages", text)
                      }
                      error={!!errors.languages}
                      errors={errors.languages?.message}
                    />
                  </Grid>
                  {isDoctor && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Specialization"
                          value={watch("specialization")}
                          onChangeText={(text) =>
                            handleFieldChange("specialization", text)
                          }
                          error={!!doctorErrors.specialization}
                          errors={doctorErrors.specialization?.message}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="License Number"
                          value={watch("licenseNumber")}
                          onChangeText={(text) =>
                            handleFieldChange("licenseNumber", text)
                          }
                          error={!!doctorErrors.licenseNumber}
                          errors={doctorErrors.licenseNumber?.message}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Bio"
                          value={watch("bio")}
                          onChangeText={(text) =>
                            handleFieldChange("bio", text)
                          }
                          error={!!errors.bio}
                          errors={errors.bio?.message}
                          multiline
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ProfileScreen;
