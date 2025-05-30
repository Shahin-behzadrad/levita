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
import SalSVG from "@/components/svgs/Sal";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useConvexAuth } from "convex/react";
import styles from "./SignIn.module.scss";
import TextField from "@/components/Shared/TextField";

export default function SignInClient() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/health-analysis");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("flow", "signIn");

    try {
      await signIn("password", formData).then(() => {
        toast.success("Signed in successfully!");
      });
    } catch (error: any) {
      console.error("Sign-in error:", error);
      const errorMessage = error?.message || "";

      if (errorMessage.includes("InvalidAccountId")) {
        toast.error("No account found with this email. Please sign up first.");
        router.push("/sign-up");
      } else if (errorMessage.includes("InvalidSecret")) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader title="Sign In" className={styles.header} />
        <form onSubmit={handleSubmit}>
          <CardContent className={styles.content}>
            <div className={styles.formGroup}>
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder="m.johnson@example.com"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.passwordInput}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className={styles.signUpText}>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className={styles.signUpLink}>
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
