"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import { useRouter } from "next/navigation";
import styles from "./not-found.module.scss";

export default function NotFound() {
  const { messages } = useLanguage();
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title={messages.common.noConsultationsFound}
          titleStartAdornment={<div className={styles.icon}>🔍</div>}
        />
        <CardContent className={styles.content}>
          <Text
            value={messages.common.noConsultationsDescription}
            variant="p"
            fontSize="md"
            className={styles.description}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
            className={styles.button}
          >
            {messages.common.backToHome}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
