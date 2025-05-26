"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "../SignOutButton/SignOutButton";
import {
  Root as AvatarRoot,
  Fallback as AvatarFallback,
} from "@radix-ui/react-avatar";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserProfileProps {
  userData: {
    _id: string;
    name?: string;
  };
  isReadOnly?: boolean;
}

export const UserProfile = ({
  userData,
  isReadOnly = false,
}: UserProfileProps) => {
  const isMobile = useIsMobile();
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || "");

  const handleSaveName = async () => {
    if (editedName.trim() && userData?._id) {
      await updateUserProfile({
        name: editedName,
      });
      setIsEditing(false);
    }
  };

  const ProfileContent = () => (
    <div className="flex flex-col items-center gap-2 p-2">
      <AvatarRoot>
        <AvatarFallback
          className={clsx(
            "rounded-full bg-muted text-muted-foreground text-small flex items-center justify-center text-xl",
            isMobile ? "w-16 h-16" : "w-10 h-10"
          )}
        >
          {userData?.name?.slice(0, 2).toUpperCase() || "??"}
        </AvatarFallback>
      </AvatarRoot>
      <div className="flex flex-col items-center gap-1">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-8 w-32"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveName}
              className="h-8"
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold">{userData.name}</div>
            {!isReadOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="text-lg">{userData.name}</div>
            <AvatarRoot>
              <AvatarFallback className="w-10 h-10 rounded-full bg-muted text-muted-foreground text-small flex items-center justify-center">
                {userData?.name?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </AvatarRoot>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <ProfileContent />
          <div className="border-t p-2">
            <SignOutButton />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return <ProfileContent />;
};

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData?: {
    _id: string;
    name?: string;
  } | null;
}

const Sidebar = ({ isOpen, onOpenChange, userData }: SidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          {userData?._id ? (
            <>
              <div className="p-4 border-b">
                <UserProfile userData={userData} />
              </div>
              <div className="p-4">
                <SignOutButton />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 p-4">
              <Link href="/sign-in" className="w-full">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
