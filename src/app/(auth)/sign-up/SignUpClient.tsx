"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import styles from "./SignUp.module.scss";
import TextField from "@/components/Shared/TextField";
import Checkbox from "@/components/Shared/CheckBox/CheckBox";
import { Text } from "@/components/Shared/Text/Text";

export default function SignUpClient() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  // Function to check if email exists
  const checkEmailExists = async (email: string) => {
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", "dummy-password-for-check");
      formData.set("flow", "signIn");
      await signIn("password", formData);
      return true; // If sign in succeeds, email exists
    } catch (error: any) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("InvalidAccountId")) {
        return false; // Email doesn't exist
      }
      return true; // If any other error, assume email exists to be safe
    }
  };

  // Effect to handle profile update after successful authentication
  useEffect(() => {
    const updateProfile = async () => {
      if (isAuthenticated && name) {
        try {
          await updateUserProfile({ name });
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

    updateProfile();
  }, [isAuthenticated, name, updateUserProfile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check if email exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast.warning(
          "An account with this email already exists. Please sign in instead."
        );
        router.push("/sign-in");
        return;
      }

      // If email doesn't exist, proceed with sign up
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signUp");

      await signIn("password", formData);
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
        setPasswordError(true);
        toast.warning(
          "Password must be at least 8 characters long and include a number and special character."
        );
      } else {
        toast.error("An error occurred during sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title="Create an account"
          subheader="Enter your information to create your HealthAI account"
        />
        <form onSubmit={handleSubmit}>
          <CardContent className={styles.content}>
            <div className={styles.formGroup}>
              <TextField
                label="Full Name"
                id="name"
                placeholder="Maria Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                label="Email"
                id="email"
                type="email"
                placeholder="m.johnson@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                className={passwordError ? styles.passwordError : ""}
                required
                endAdornment={
                  <Button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                }
              />
              <Text
                value="Password must be at least 8 characters long and include a number and special character."
                color={passwordError ? "error" : "gray"}
                fontSize="sm"
                className={styles.passwordHint}
              />
            </div>
            <div className={styles.termsContainer}>
              <Checkbox id="terms" name="terms" />
              <Text
                noWrap
                className={styles.termsLabel}
                value="I agree to the"
              />
              <Link href="/terms" className={styles.termsLink}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={styles.termsLink}>
                Privacy Policy
              </Link>
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button
              type="submit"
              size="lg"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
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
