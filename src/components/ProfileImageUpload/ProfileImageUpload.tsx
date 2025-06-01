import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import styles from "./ProfileImageUpload.module.scss";

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate?: () => void;
}

export function ProfileImageUpload({
  currentImageUrl,
  onImageUpdate,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(currentImageUrl);

  const generateUploadUrl = useMutation(
    api.profileImage.generateProfileImageUploadUrl
  );
  const updateProfileImage = useMutation(api.profileImage.updateProfileImage);
  const deleteProfileImage = useMutation(api.profileImage.deleteProfileImage);

  // Function to get the proper image URL from storage ID
  const getImageUrl = (storageId: string) => {
    if (!storageId) return "";
    // If it's already a full URL, return it
    if (storageId.startsWith("http://") || storageId.startsWith("https://")) {
      return storageId;
    }
    // Otherwise construct the URL using the Convex storage URL
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await response.json();
      await updateProfileImage({ storageId });
      toast.success("Profile image updated successfully");
      onImageUpdate?.();
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteProfileImage();
      setPreviewUrl(null);
      toast.success("Profile image removed");
      onImageUpdate?.();
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer} onClick={handleClick}>
        {previewUrl || currentImageUrl ? (
          <>
            <Image
              src={previewUrl || getImageUrl(currentImageUrl || "")}
              alt="Profile"
              fill
              className={styles.image}
            />
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage();
              }}
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <div className={styles.placeholder}>
            <Camera size={24} />
            <span>Upload Photo</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={isUploading}
      />
    </div>
  );
}
