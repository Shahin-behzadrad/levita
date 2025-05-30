"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import styles from "./HeroActions.module.scss";
import Button from "../Shared/Button";

const HeroActions = () => {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className={styles.container}>
      <Link href={isAuthenticated ? "/health-analysis" : "/sign-in"}>
        <Button variant="contained" size="lg">
          Get Started
        </Button>
      </Link>
      <Link href="/learn-more">
        <Button size="lg" variant="outlined">
          Learn More
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
