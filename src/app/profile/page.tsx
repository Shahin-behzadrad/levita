"use client";

import ProfileScreen from "@/components/ProfileScreen/ProfileScreen";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const userData = useQuery(api.userProfiles.getUserProfile);
  const router = useRouter();

  useEffect(() => {
    if (!userData?.role) {
      router.push("/");
    }
  }, [userData?.role, router]);

  if (!userData) return null;

  return <ProfileScreen userData={userData} />;
}
