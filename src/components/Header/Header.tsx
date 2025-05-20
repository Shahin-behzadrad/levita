"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
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

const Header = () => {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <header className="fixed top-0 left-0 right-0 border-b backdrop-blur bg-white/70 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <SalSVG />
          <span className="text-xl font-bold">HealthAI</span>
        </div>
        <Unauthenticated>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </Unauthenticated>
        <Authenticated>
          <Popover>
            <div className="flex items-center gap-2">
              <h1>{loggedInUser?.email} </h1>
              <PopoverTrigger asChild className="cursor-pointer">
                <AvatarRoot>
                  <AvatarFallback className="w-12 h-12 rounded-full bg-muted text-muted-foreground font-medium flex items-center justify-center">
                    {loggedInUser?.email?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </AvatarRoot>
              </PopoverTrigger>
            </div>
            <PopoverContent className="rounded-xl border bg-white shadow-md p-4 mt-1 mr-5 w-56">
              <div className="text-sm font-semibold mb-2">
                {loggedInUser?.name || loggedInUser?.email}
              </div>
              <SignOutButton />
            </PopoverContent>
          </Popover>
        </Authenticated>
      </div>
    </header>
  );
};

export default Header;
