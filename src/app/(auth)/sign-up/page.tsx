import type { Metadata } from "next";
import SignUpClient from "./SignUpClient";

export const metadata: Metadata = {
  title: "Levita - Sign Up",
  description: "Create an account to access AI-powered health analysis",
  keywords: ["sign up", "create account", "health analysis", "AI health"],
};

export default function SignUpPage() {
  return <SignUpClient />;
}
