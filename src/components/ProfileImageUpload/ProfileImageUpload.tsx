import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
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
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(
    api.profileImage.generateProfileImageUploadUrl
  );
  const updateProfileImage = useMutation(api.profileImage.updateProfileImage);
  const deleteProfileImage = useMutation(api.profileImage.deleteProfileImage);
  const imageUrl = useQuery(
    api.profileImage.getProfileImageUrl,
    currentImageUrl ? { storageId: currentImageUrl } : "skip"
  );

  // Reset error state when URL changes
  useEffect(() => {
    setImageError(false);
  }, [currentImageUrl, previewUrl]);

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
      const result = reader.result as string;

      setPreviewUrl(result);
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
      console.error("[handleFileChange] Failed to upload image:", error);
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
      console.error("[handleDeleteImage] Failed to delete image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Log the final image URL that will be used
  const finalImageUrl = previewUrl || imageUrl || "";

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer} onClick={handleClick}>
        {previewUrl || imageUrl ? (
          <>
            <Image
              src={finalImageUrl}
              alt="Profile"
              fill
              unoptimized
              className={styles.image}
              onError={(e) => {
                console.error("[ProfileImageUpload] Image load error:", e);
                setImageError(true);
                setPreviewUrl(null);
              }}
              priority
            />
            {imageError && (
              <div className={styles.placeholder}>
                <Camera size={24} />
                <span>Failed to load image</span>
              </div>
            )}
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
