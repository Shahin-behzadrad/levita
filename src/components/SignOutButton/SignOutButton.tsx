"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
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

        handleSignOut?.();
      }}
      startIcon={<LogOut size={20} />}
    >
      {messages.nav.logout}
    </Button>
  );
}
