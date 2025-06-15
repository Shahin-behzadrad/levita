"use client";

import type React from "react";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useApp } from "@/lib/AppContext";
import AuthForm from "@/components/Shared/AuthForm/AuthForm";
import { ConnectGoogleButton } from "@/components/Shared/GoogleButton/GoogleButton";

export default function SignInClient() {
  const { signIn } = useAuthActions();
  const { setView } = useApp();
  const { messages } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        setView("sign-up");
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
    <AuthForm
      type="sign-in"
      title={messages.auth.signIn}
      email={email}
      password={password}
      showPassword={showPassword}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      messages={{
        email: messages.auth.email,
        password: messages.auth.password,
        submit: messages.auth.signIn,
        loading: messages.auth.signingIn,
        switchText: messages.auth.dontHaveAccount,
        switchLink: messages.auth.signUp,
        switchUrl: "/sign-up",
      }}
    />
  );
}
