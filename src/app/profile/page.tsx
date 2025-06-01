"use client";

import ProfileScreen from "@/components/ProfileScreen/ProfileScreen";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const userData = useQuery(api.userProfiles.getUserProfile);
  const router = useRouter();

  if (!userData?.role) {
    router.push("/");
  }

  return <ProfileScreen userData={userData} />;
}
