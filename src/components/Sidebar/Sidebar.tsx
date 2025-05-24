"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignOutButton } from "../SignOutButton/SignOutButton";
import {
  Root as AvatarRoot,
  Fallback as AvatarFallback,
} from "@radix-ui/react-avatar";

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
              <div className="flex items-center gap-4 p-4 border-b">
                <AvatarRoot>
                  <AvatarFallback className="w-12 h-12 rounded-full bg-muted text-muted-foreground font-medium flex items-center justify-center">
                    {userData?.name?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </AvatarRoot>
                <div className="text-lg font-semibold">{userData.name}</div>
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
