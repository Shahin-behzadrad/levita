"use client";

import { Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";
import SalSVG from "../svgs/Sal";
import {
  Root as AvatarRoot,
  Fallback as AvatarFallback,
} from "@radix-ui/react-avatar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { SignOutButton } from "../SignOutButton/SignOutButton";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import clsx from "clsx";

const Header = () => {
  const userData = useQuery(api.userProfiles.getUserProfile);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoading = userData === undefined;

  return (
    <header className="fixed top-0 left-0 right-0 border-b backdrop-blur bg-white/70 z-50">
      <div
        className={clsx(
          "container flex h-16 items-center justify-between py-4",
          isMobile && "px-4"
        )}
      >
        <div
          className={clsx(
            "flex items-end gap-1 cursor-pointer",
            isMobile && "gap-0"
          )}
          onClick={() => router.push("/")}
        >
          <SalSVG width={isMobile ? 70 : 100} height={isMobile ? 28 : 40} />
          <span className={clsx("font-bold", isMobile ? "text-sm" : "text-xl")}>
            HealthAI
          </span>
        </div>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
          </div>
        ) : userData?._id ? (
          <>
            {isMobile ? (
              <>
                <Menu
                  className="w-6 h-6 text-muted-foreground dark:text-white cursor-pointer"
                  onClick={() => setIsSidebarOpen(true)}
                />
                <Sidebar
                  isOpen={isSidebarOpen}
                  onOpenChange={setIsSidebarOpen}
                  userData={userData}
                />
              </>
            ) : (
              <Popover>
                <div className="flex items-center gap-2">
                  <h1>{userData?.name} </h1>
                  <PopoverTrigger asChild className="cursor-pointer">
                    <AvatarRoot>
                      <AvatarFallback className="w-12 h-12 rounded-full bg-muted text-muted-foreground font-medium flex items-center justify-center">
                        {userData?.name?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </AvatarRoot>
                  </PopoverTrigger>
                </div>
                <PopoverContent className="rounded-xl border bg-white shadow-md p-4 mt-1 mr-5 w-56">
                  <div className="text-sm font-semibold mb-2">
                    {userData?.name ?? "Welcome"}
                  </div>
                  <SignOutButton />
                </PopoverContent>
              </Popover>
            )}
          </>
        ) : (
          <>
            {isMobile ? (
              <>
                <Menu
                  className="w-6 h-6 text-muted-foreground dark:text-white cursor-pointer"
                  onClick={() => setIsSidebarOpen(true)}
                />
                <Sidebar
                  isOpen={isSidebarOpen}
                  onOpenChange={setIsSidebarOpen}
                  userData={userData}
                />
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/sign-in">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
