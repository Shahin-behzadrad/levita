"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="w-full px-4 py-2 rounded-lg transition-colors bg-blue-500 text-white"
      onClick={async () => {
        await signOut();
        router.push("/");
      }}
    >
      Sign out
    </button>
  );
}
