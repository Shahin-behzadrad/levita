"use client";

import { Button } from "@/components/Shared/Button/Button";
import { CardContent, CardFooter, CardHeader } from "@/components/Shared/Card";
import styles from "./SignUp.module.scss";
import TextField from "@/components/Shared/TextField";
import { Text } from "@/components/Shared/Text/Text";
import { RadioGroup } from "@/components/Shared/RadioGroup";
import { Controller } from "react-hook-form";
import Select from "@/components/Shared/Select/Select";
import Grid from "@/components/Shared/Grid/Grid";
import { useProfileForm } from "./useProfileForm";
import { useLanguage } from "@/i18n/LanguageContext";

interface ProfileFormProps {
  isSetup?: boolean;
}

export function ProfileForm({ isSetup = false }: ProfileFormProps) {
  const { messages } = useLanguage();
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
        title={
          isSetup
            ? messages.auth.signUpForm.completeProfile
            : messages.auth.signUpForm.createProfile
        }
        subheader={
          isSetup
            ? messages.auth.signUpForm.completeProfileSubheader
            : messages.auth.signUpForm.createProfileSubheader
        }
      />
      <form onSubmit={handleSubmit(handleProfileSubmit)}>
        <CardContent>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Text value={messages.auth.signUpForm.signUpAs} fontSize="sm" />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name="role"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      {
                        value: "patient",
                        label: messages.auth.signUpForm.patient,
                      },
                      {
                        value: "doctor",
                        label: messages.auth.signUpForm.doctor,
                      },
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
                    label={messages.auth.signUpForm.fullName}
                    id="fullName"
                    placeholder={messages.auth.signUpForm.fullNamePlaceholder}
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
                    label={messages.auth.signUpForm.phoneNumber}
                    id="phoneNumber"
                    placeholder={
                      messages.auth.signUpForm.phoneNumberPlaceholder
                    }
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
                    label={messages.auth.signUpForm.age}
                    type="number"
                    id="age"
                    min="0"
                    max="120"
                    step="1"
                    placeholder={messages.auth.signUpForm.agePlaceholder}
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
                    label={messages.auth.signUpForm.sex}
                    {...field}
                    options={[
                      { label: messages.auth.signUpForm.male, value: "male" },
                      {
                        label: messages.auth.signUpForm.female,
                        value: "female",
                      },
                      { label: messages.auth.signUpForm.other, value: "other" },
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
                        label={messages.auth.signUpForm.specialization}
                        id="specialization"
                        placeholder={
                          messages.auth.signUpForm.specializationPlaceholder
                        }
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
                        label={messages.auth.signUpForm.licenseNumber}
                        id="licenseNumber"
                        placeholder={
                          messages.auth.signUpForm.licenseNumberPlaceholder
                        }
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
                        label={messages.auth.signUpForm.languages}
                        id="languages"
                        placeholder={
                          messages.auth.signUpForm.languagesPlaceholder
                        }
                        {...field}
                        error={Boolean(errors.languages?.message)}
                        helperText={errors.languages?.message}
                      />
                    )}
                  />
                </Grid>
                {role === "doctor" && (
                  <Grid item xs={12}>
                    <Controller
                      name="bio"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={messages.auth.signUpForm.bio}
                          id="bio"
                          placeholder={messages.auth.signUpForm.bioPlaceholder}
                          multiline
                          {...field}
                          error={Boolean(errors.bio?.message)}
                          helperText={errors.bio?.message}
                        />
                      )}
                    />
                  </Grid>
                )}
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
              ? messages.auth.signUpForm.saving
              : isSetup
                ? messages.auth.signUpForm.completeProfile
                : messages.auth.signUpForm.createProfile}
          </Button>
        </CardFooter>
      </form>
    </>
  );
}
