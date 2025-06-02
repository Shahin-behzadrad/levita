"use client";

import ProfileScreen from "@/components/ProfileScreen/ProfileScreen";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingModal from "@/components/LoadingModal/LoadingModal";

export default function ProfilePage() {
  const userData = useQuery(api.userProfiles.getUserProfile);
  const router = useRouter();

  useEffect(() => {
    if (userData === null) {
      router.push("/");
    }
  }, [userData?.role, router]);

  if (!userData) return <LoadingModal />;

  return <ProfileScreen userData={userData} />;
}
