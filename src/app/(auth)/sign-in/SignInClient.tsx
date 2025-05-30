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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/health-analysis");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
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
        <CardHeader title="Sign In" />
        <form onSubmit={handleSubmit}>
          <CardContent className={styles.content}>
            <div className={styles.formGroup}>
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder="m.johnson@example.com"
                required
                value={email}
                onChangeText={setEmail}
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.passwordInput}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChangeText={setPassword}
                  endAdornment={
                    <Button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  }
                />
              </div>
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
