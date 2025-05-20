"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          signIn("password", formData).catch((error) => {
            console.log(error);
            const toastTitle =
              flow === "signIn"
                ? "Could not sign in, did you mean to sign up?"
                : "Could not sign up, did you mean to sign in?";
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <input
          className="w-full px-3 py-2 rounded-md bg-transparent border-2 border-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full px-3 py-2 rounded-md bg-transparent border-2 border-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button
          className="w-full py-2 rounded-md text-white font-medium button hover:opacity-90 transition-opacity"
          type="submit"
          disabled={submitting}
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-slate-600">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-blue-500 cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow" />
        <span className="mx-4 text-slate-400 ">or</span>
        <hr className="my-4 grow" />
      </div>
      <button
        className="w-full py-2 rounded-md text-white font-medium button hover:opacity-90 transition-opacity"
        onClick={() => void signIn("anonymous")}
      >
        Sign in anonymously
      </button>
    </div>
  );
}
