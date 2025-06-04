import type { Metadata } from "next";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Levita - Sign In",
  description:
    "Sign in to your Levita account to access AI-powered health analysis",
  keywords: ["sign in", "login", "health analysis", "AI health"],
};

export default function SignInPage() {
  return <SignInClient />;
}
