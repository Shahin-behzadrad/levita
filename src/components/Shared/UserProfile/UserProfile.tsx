"use client";

import { User } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import styles from "./UserProfile.module.scss";
import Tooltip from "../Tooltip/Tooltip";
import { SignOutButton } from "../../SignOutButton/SignOutButton";
import Text from "../Text";
import { Separator } from "../Separator/Separator";
import Button from "../Button";
import { UserType } from "@/types/userType";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";

interface UserProfileProps {
  userData: Pick<UserType, "fullName" | "role" | "profileImage">;
  onCloseSidebar?: () => void;
}

export const UserProfile = ({ userData, onCloseSidebar }: UserProfileProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { messages } = useLanguage();
  const imageUrl = useQuery(
    api.profileImage.getProfileImageUrl,
    userData.profileImage ? { storageId: userData.profileImage } : "skip"
  );

  const ProfileContent = () => (
    <div className={clsx(styles.profileInfo, isMobile && styles.mobile)}>
      <div className={styles.avatarContainer}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={userData.fullName || messages.profile.title}
            width={50}
            height={50}
            className={styles.avatarImage}
            loading="lazy"
          />
        ) : (
          <User size={20} />
        )}
        <div>
          <Text
            noWrap
            value={userData.fullName}
            fontWeight="bold"
            className={styles.profileName}
          />
          <Text
            noWrap
            value={
              userData?.role
                ? userData?.role?.charAt(0).toUpperCase() +
                  userData?.role?.slice(1)
                : ""
            }
            color="gray"
            className={styles.profileRole}
          />
        </div>
      </div>
      <Separator />
      <Button
        fullWidth
        childrenCLassName={styles.profileButton}
        variant="text"
        startIcon={<User size={20} />}
        onClick={() => {
          router.push("/profile");
          onCloseSidebar?.();
          setIsTooltipOpen(false);
        }}
      >
        {messages.nav.profile}
      </Button>
      <Separator />
    </div>
  );

  if (!isMobile) {
    return (
      <Tooltip
        open={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        tooltipContent={
          <div className={styles.popoverContent}>
            <ProfileContent />
            <SignOutButton handleSignOut={() => onCloseSidebar?.()} />
          </div>
        }
      >
        <div
          className={styles.profileTrigger}
          onClick={() => setIsTooltipOpen(!isTooltipOpen)}
        >
          <Text fontWeight="bold" value={userData.fullName} />
          <div className={styles.avatar}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={userData.fullName || messages.profile.title}
                width={40}
                height={40}
                className={styles.avatarImage}
                unoptimized
              />
            ) : userData?.fullName ? (
              userData.fullName.slice(0, 2).toUpperCase()
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </Tooltip>
    );
  }

  return <ProfileContent />;
};
