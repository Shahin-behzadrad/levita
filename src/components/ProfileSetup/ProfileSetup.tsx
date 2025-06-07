"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProfileForm } from "@/app/(auth)/sign-up/ProfileForm";
import Modal from "../Shared/Modal/Modal";

export function ProfileSetup() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const userProfile = useQuery(api.api.profiles.userProfiles.getUserProfile);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || userProfile !== null) {
    return null;
  }

  return (
    <Modal isOpen={true}>
      <ProfileForm isSetup={true} />
    </Modal>
  );
}
