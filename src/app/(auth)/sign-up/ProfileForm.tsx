"use client";

import { Button } from "@/components/Shared/Button/Button";
import { CardContent, CardFooter, CardHeader } from "@/components/Shared/Card";
import styles from "./SignUp.module.scss";
import TextField from "@/components/Shared/TextField";
import Checkbox from "@/components/Shared/CheckBox/CheckBox";
import { Text } from "@/components/Shared/Text/Text";
import { RadioGroup } from "@/components/Shared/RadioGroup";
import { Controller } from "react-hook-form";
import Select from "@/components/Shared/Select/Select";
import Grid from "@/components/Shared/Grid/Grid";
import Link from "next/link";
import { useProfileForm } from "./useProfileForm";
import { toast } from "sonner";

interface ProfileFormProps {
  isSetup?: boolean;
}

export function ProfileForm({ isSetup = false }: ProfileFormProps) {
  const {
    control,
    handleSubmit,
    role,
    errors,
    isSubmitting,
    handleProfileSubmit,
  } = useProfileForm();

  return (
    <>
      <CardHeader
        title={isSetup ? "Complete Your Profile" : "Create Your Profile"}
        subheader={
          isSetup
            ? "Please provide your information to complete your account setup"
            : "Please provide your information to create your account"
        }
      />
      <form onSubmit={handleSubmit(handleProfileSubmit)}>
        <CardContent>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Text value="Sign up as:" fontSize="sm" />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name="role"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "patient", label: "Patient" },
                      { value: "doctor", label: "Doctor" },
                    ]}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Full Name"
                    id="fullName"
                    placeholder="Maria Johnson"
                    {...field}
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
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
                    label="Phone Number"
                    id="phoneNumber"
                    placeholder="+1234567890"
                    {...field}
                    error={Boolean(errors.phoneNumber?.message)}
                    helperText={errors.phoneNumber?.message}
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
                    id="age"
                    min="0"
                    max="120"
                    step="1"
                    placeholder="Enter your age"
                    {...field}
                    error={Boolean(errors.age?.message)}
                    helperText={errors.age?.message}
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
                    {...field}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    error={Boolean(errors.sex?.message)}
                    helperText={errors.sex?.message}
                  />
                )}
              />
            </Grid>

            {role === "doctor" && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="specialization"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Specialization"
                        id="specialization"
                        placeholder="Cardiology"
                        {...field}
                        error={Boolean(errors.specialization?.message)}
                        helperText={errors.specialization?.message}
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
                        id="licenseNumber"
                        placeholder="Enter your medical license number"
                        {...field}
                        error={Boolean(errors.licenseNumber?.message)}
                        helperText={errors.licenseNumber?.message}
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
                        id="languages"
                        placeholder="English, Spanish, French"
                        {...field}
                        error={Boolean(errors.languages?.message)}
                        helperText={errors.languages?.message}
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
                        id="bio"
                        placeholder="Share anything you're particularly passionate about, in regards to healthcare and not"
                        multiline
                        {...field}
                        error={Boolean(errors.bio?.message)}
                        helperText={errors.bio?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
        <CardFooter className={styles.footer}>
          <Button
            type="submit"
            size="lg"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isSetup
                ? "Complete Profile"
                : "Create Profile"}
          </Button>
        </CardFooter>
      </form>
    </>
  );
}
