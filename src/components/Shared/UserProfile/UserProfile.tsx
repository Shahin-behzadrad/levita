"use client";

import Button from "../Button";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Check, Pencil, User, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import styles from "./UserProfile.module.scss";
import TextField from "../TextField";
import Tooltip from "../Tooltip/Tooltip";
import { SignOutButton } from "../../SignOutButton/SignOutButton";
import Text from "../Text";

interface UserProfileProps {
  userData: {
    _id: string;
    name?: string;
  };
  isReadOnly?: boolean;
  handleSignOut?: () => void;
}

export const UserProfile = ({
  userData,
  isReadOnly = false,
  handleSignOut,
}: UserProfileProps) => {
  const isMobile = useIsMobile();
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || "");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleSaveName = async () => {
    if (editedName.trim() && userData?._id) {
      await updateUserProfile({
        name: editedName,
      });
      setIsEditing(false);
    }
  };

  const ProfileContent = () => (
    <div className={styles.profileInfo}>
      <div className={styles.avatar}>
        {userData?.name ? (
          userData.name.slice(0, 2).toUpperCase()
        ) : (
          <User size={20} />
        )}
      </div>
      {isEditing ? (
        <div className={styles.editContainer}>
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            autoFocus
            fullWidth={false}
          />
          <div className={styles.buttonContainer}>
            <Button
              variant="text"
              color="error"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X size={20} />
            </Button>
            <Button
              variant="text"
              size="sm"
              color="success"
              onClick={handleSaveName}
              className={styles.saveButton}
            >
              <Check size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.nameContainer}>
          <Text noWrap value={userData.name} />
          {!isReadOnly && (
            <Button
              variant="text"
              size="sm"
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={20} />
            </Button>
          )}
        </div>
      )}
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
          <Text fontWeight="bold" value={userData.name} />
          <div className={styles.avatar}>
            {userData?.name ? (
              userData.name.slice(0, 2).toUpperCase()
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
