"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProfileForm } from "@/app/(auth)/sign-up/ProfileForm";
import { Card } from "@/components/Shared/Card";
import styles from "./ProfileSetup.module.scss";
import Modal from "../Shared/Modal/Modal";

export function ProfileSetup() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const userProfile = useQuery(api.userProfiles.getUserProfile);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || userProfile) {
    return null;
  }

  return (
    <Modal isOpen={true}>
      <ProfileForm isSetup={true} />
    </Modal>
  );
}
