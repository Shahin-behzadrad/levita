"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useConvexAuth } from "convex/react";

const HeroActions = () => {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="space-x-4">
      <Link href={isAuthenticated ? "/health-analysis" : "/sign-in"}>
        <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
          Get Started
        </Button>
      </Link>
      <Link href="/learn-more">
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
