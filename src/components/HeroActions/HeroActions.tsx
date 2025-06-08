"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import styles from "./HeroActions.module.scss";
import Button from "../Shared/Button";
import { useLanguage } from "@/i18n/LanguageContext";
import { api } from "../../../convex/_generated/api";

const HeroActions = () => {
  const { isAuthenticated } = useConvexAuth();
  const userData = useQuery(api.api.profiles.userProfiles.getUserProfile);
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      {userData?.role !== "doctor" && (
        <Link href={isAuthenticated ? "/health-analysis" : "/sign-in"}>
          <Button variant="contained" size="lg">
            {messages.hero.getStarted}
          </Button>
        </Link>
      )}
      <Link href="/learn-more">
        <Button size="lg" variant="outlined">
          {messages.hero.learnMore}
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
