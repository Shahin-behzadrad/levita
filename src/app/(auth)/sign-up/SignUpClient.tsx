"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SalSVG from "@/components/svgs/Sal";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

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
        toast(
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md mt-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4 pb-4 border-b">
            <SalSVG />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your HealthAI account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Maria Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m.johnson@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  className={
                    passwordError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p
                className={clsx(
                  "text-xs text-gray-500",
                  passwordError && "text-red-500"
                )}
              >
                Password must be at least 8 characters long and include a number
                and special character.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the{" "}
                <Link href="/terms" className="text-teal-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-teal-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-teal-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
