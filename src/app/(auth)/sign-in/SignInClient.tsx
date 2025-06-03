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
import { useLanguage } from "@/i18n/LanguageContext";

export default function SignInClient() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { messages } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
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
        toast.success(messages.auth.signInSuccess);
      });
    } catch (error: any) {
      console.error("Sign-in error:", error);
      const errorMessage = error?.message || "";

      if (errorMessage.includes("InvalidAccountId")) {
        toast.error(messages.auth.noAccount);
        router.push("/sign-up");
      } else if (errorMessage.includes("InvalidSecret")) {
        toast.error(messages.auth.incorrectPassword);
      } else {
        toast.error(messages.auth.unexpectedError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader title={messages.auth.signIn} />
        <form onSubmit={handleSubmit}>
          <CardContent className={styles.content}>
            <div className={styles.formGroup}>
              <TextField
                label={messages.auth.email}
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
                  label={messages.auth.password}
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
              {isLoading ? messages.auth.signingIn : messages.auth.signIn}
            </Button>
            <div className={styles.signUpText}>
              {messages.auth.dontHaveAccount}{" "}
              <Link href="/sign-up" className={styles.signUpLink}>
                {messages.auth.signUp}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
