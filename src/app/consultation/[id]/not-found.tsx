"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import Text from "@/components/Shared/Text";
import styles from "./not-found.module.scss";

export default function NotFound() {
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      <Text value={messages.healthAnalysis.result} variant="h1" />
      <Text
        value={messages.errors.somethingWentWrong}
        variant="p"
        fontSize="lg"
      />
    </div>
  );
}
