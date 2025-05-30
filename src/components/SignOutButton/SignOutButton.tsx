"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import Button from "../Shared/Button";

export function SignOutButton({
  handleSignOut,
}: {
  handleSignOut?: () => void;
}) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={async () => {
        await signOut();
        router.push("/");
        handleSignOut?.();
      }}
    >
      Sign out
    </Button>
  );
}
