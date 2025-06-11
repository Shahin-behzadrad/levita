"use client";

import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import AuthForm from "@/components/Shared/AuthForm/AuthForm";
import { useApp } from "@/lib/AppContext";

export default function SignUpClient() {
  const { signIn, signOut } = useAuthActions();
  const { setView } = useApp();
  const { messages } = useLanguage();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First check if email exists
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signIn");

      try {
        await signIn("password", formData);
        toast.warning(messages.auth.emailExists);
        signOut();
        setView("sign-in");
        return;
      } catch (error: any) {
        const errorMessage = error?.message || "";
        if (!errorMessage.includes("InvalidAccountId")) {
          throw error;
        }
      }

      // If email doesn't exist, proceed with sign up
      const signUpFormData = new FormData();
      signUpFormData.set("email", email);
      signUpFormData.set("password", password);
      signUpFormData.set("flow", "signUp");

      await signIn("password", signUpFormData).then((res) => {});
    } catch (error: any) {
      console.error("Sign-up error:", error);
      const errorMessage = error?.message || "";

      if (errorMessage.includes("InvalidAccountId")) {
        toast(messages.auth.invalidEmail);
      } else if (
        errorMessage.includes("InvalidSecret") ||
        errorMessage.includes("Invalid password")
      ) {
        setPasswordError(messages.auth.invalidPassword);
        toast.warning(messages.auth.invalidPassword);
      } else {
        toast.error(messages.auth.unexpectedError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      type="sign-up"
      title={messages.auth.createAccount}
      email={email}
      password={password}
      showPassword={showPassword}
      isLoading={isSubmitting}
      passwordError={passwordError}
      onSubmit={handleSignUp}
      onEmailChange={setEmail}
      onPasswordChange={(value) => {
        setPassword(value);
        setPasswordError(""); // Clear error when user types
      }}
      onTogglePassword={() => setShowPassword(!showPassword)}
      messages={{
        email: messages.auth.email,
        password: messages.auth.password,
        submit: messages.common.continue,
        loading: messages.auth.creatingAccount,
        switchText: messages.auth.alreadyHaveAccount,
        switchLink: messages.auth.signIn,
        switchUrl: "/sign-in",
      }}
    />
  );
}
