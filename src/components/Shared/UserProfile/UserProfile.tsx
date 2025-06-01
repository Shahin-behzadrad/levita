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
interface UserProfileProps {
  userData: Pick<UserType, "fullName" | "role">;
  handleSignOut?: () => void;
}

export const UserProfile = ({ userData, handleSignOut }: UserProfileProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const ProfileContent = () => (
    <div className={clsx(styles.profileInfo, isMobile && styles.mobile)}>
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
      <Separator />
      <Button
        fullWidth
        childrenCLassName={styles.profileButton}
        variant="text"
        startIcon={<User size={20} />}
        onClick={() => {
          router.push("/profile");
        }}
      >
        View Profile
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
            <SignOutButton handleSignOut={handleSignOut} />
          </div>
        }
      >
        <div
          className={styles.profileTrigger}
          onClick={() => setIsTooltipOpen(!isTooltipOpen)}
        >
          <Text fontWeight="bold" value={userData.fullName} />
          <div className={styles.avatar}>
            {userData?.fullName ? (
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
