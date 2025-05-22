"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useConvexAuth } from "convex/react";

const HeroActions = () => {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="space-x-4">
      <Link href={isAuthenticated ? "/health-analysis" : "/sign-in"}>
        <Button
          size="lg"
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          Get Started
        </Button>
      </Link>
      <Link href="/learn-more">
        <Button
          size="lg"
          variant="outline"
          className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          Learn More
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
