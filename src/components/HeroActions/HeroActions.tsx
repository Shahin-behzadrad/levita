"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import styles from "./HeroActions.module.scss";
import Button from "../Shared/Button";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroActions = () => {
  const { isAuthenticated } = useConvexAuth();
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      <Link href={isAuthenticated ? "/health-analysis" : "/sign-in"}>
        <Button variant="contained" size="lg">
          {messages.hero.getStarted}
        </Button>
      </Link>
      <Link href="/learn-more">
        <Button size="lg" variant="outlined">
          {messages.hero.learnMore}
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
