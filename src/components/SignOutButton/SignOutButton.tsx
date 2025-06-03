"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import Button from "../Shared/Button";
import { LogOut } from "lucide-react";
import styles from "./SignOutButton.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";

export function SignOutButton({
  handleSignOut,
}: {
  handleSignOut?: () => void;
}) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const { messages } = useLanguage();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="text"
      fullWidth
      color="error"
      childrenCLassName={styles.signOutButton}
      onClick={async () => {
        await signOut();
        router.push("/");
        handleSignOut?.();
      }}
      startIcon={<LogOut size={20} />}
    >
      {messages.nav.logout}
    </Button>
  );
}
