"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Shared/Button/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/Card";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Eye, EyeOff } from "lucide-react";
import styles from "./SignUp.module.scss";
import TextField from "@/components/Shared/TextField";
import Checkbox from "@/components/Shared/CheckBox/CheckBox";
import { Text } from "@/components/Shared/Text/Text";
import { RadioGroup } from "@/components/Shared/RadioGroup";
import { Controller } from "react-hook-form";
import { SignUpFormData } from "./type";
import { useSignupForm } from "./useSignupForm";
import Select from "@/components/Shared/Select/Select";
import Grid from "@/components/Shared/Grid/Grid";

export default function SignUpClient() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useSignupForm();

  const [showPassword, setShowPassword] = useState(false);
  const role = watch("role");

  // Effect to handle profile update after successful authentication
  useEffect(() => {
    const updateProfile = async (data: SignUpFormData) => {
      if (isAuthenticated && data.name) {
        try {
          const profileData = {
            role: data.role,
            name: data.name,
            age: data.age,
            sex: data.sex,
            ...(data.role === "doctor" && {
              specialization: data.specialization,
            }),
            ...(data.role === "patient" && {
              symptoms: data.symptoms
                ? data.symptoms.split(",").map((s) => s.trim())
                : undefined,
              generalHealthStatus: data.generalHealthStatus,
            }),
          };

          await updateUserProfile(profileData);
          toast("Account created successfully!");
          router.push("/health-analysis");
        } catch (profileError: any) {
          console.error("Profile update error:", profileError);
          toast(
            "Account created but profile update failed. Please try updating your profile later."
          );
          router.push("/health-analysis");
        }
      }
    };

    if (isAuthenticated) {
      const formData = watch();
      updateProfile(formData);
    }
  }, [isAuthenticated, watch, updateUserProfile, router]);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // First check if email exists
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", "dummy-password-for-check");
      formData.set("flow", "signIn");

      try {
        await signIn("password", formData);
        toast.warning(
          "An account with this email already exists. Please sign in instead."
        );
        router.push("/sign-in");
        return;
      } catch (error: any) {
        const errorMessage = error?.message || "";
        if (!errorMessage.includes("InvalidAccountId")) {
          throw error;
        }
      }

      // If email doesn't exist, proceed with sign up
      const signUpFormData = new FormData();
      signUpFormData.set("email", data.email);
      signUpFormData.set("password", data.password);
      signUpFormData.set("flow", "signUp");

      await signIn("password", signUpFormData);
      // The profile update will be handled by the useEffect hook
    } catch (error: any) {
      console.error("Sign-up error:", error);
      const errorMessage = error?.message || "";

      if (errorMessage.includes("InvalidAccountId")) {
        toast("Invalid email address. Please try again.");
      } else if (
        errorMessage.includes("InvalidSecret") ||
        errorMessage.includes("Invalid password")
      ) {
        toast.warning(
          "Password must be at least 8 characters long and include a number and special character."
        );
      } else {
        toast.error("An error occurred during sign up. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title="Create an account"
          subheader="Enter your information to create your HealthAI account"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Full Name"
                      id="name"
                      placeholder="Maria Johnson"
                      {...field}
                      error={Boolean(errors.name?.message)}
                      helperText={errors.name?.message}
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
              )}

              {role === "patient" && (
                <>
                  <Grid item xs={12}>
                    <Controller
                      name="symptoms"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Symptoms (comma-separated)"
                          id="symptoms"
                          placeholder="Headache, Fever, Fatigue"
                          {...field}
                          error={Boolean(errors.symptoms?.message)}
                          helperText={errors.symptoms?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="generalHealthStatus"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="General Health Status"
                          id="generalHealthStatus"
                          placeholder="Good/Fair/Poor"
                          {...field}
                          error={Boolean(errors.generalHealthStatus?.message)}
                          helperText={errors.generalHealthStatus?.message}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Email"
                      id="email"
                      type="email"
                      placeholder="m.johnson@example.com"
                      {...field}
                      error={Boolean(errors.email?.message)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      error={Boolean(errors.password?.message)}
                      helperText={errors.password?.message}
                      endAdornment={
                        <Button onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <div className={styles.termsContainer}>
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <div className={styles.termsLabelContainer}>
                    <Text
                      noWrap
                      className={styles.termsLabel}
                      value="I agree to the"
                    />
                    <Link href="/terms" className={styles.termsLink}>
                      <Text value="Terms of Service" color="info" noWrap />
                    </Link>{" "}
                    <Text value="and" noWrap />
                    <Link href="/privacy" className={styles.termsLink}>
                      <Text value="Privacy Policy" color="info" noWrap />
                    </Link>
                  </div>
                </div>
                {errors.terms && (
                  <Text
                    value={errors.terms.message}
                    color="error"
                    fontSize="sm"
                    className={styles.errorText}
                  />
                )}
              </Grid>
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
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
            <div className={styles.signInText}>
              Already have an account?{" "}
              <Link href="/sign-in" className={styles.signInLink}>
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
