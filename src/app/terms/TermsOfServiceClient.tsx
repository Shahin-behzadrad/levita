"use client";

import { Button } from "@/components/Shared/Button/Button";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Link from "next/link";
import styles from "./TermsOfService.module.scss";
import { Separator } from "@/components/Shared/Separator/Separator";
import { useLanguage } from "@/i18n/LanguageContext";

export default function TermsOfServiceClient() {
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title={messages.termsOfService.title}
          subheader={messages.termsOfService.lastUpdated}
        />
        <CardContent className={styles.section}>
          <section>
            <h2 className={styles.sectionTitle}>
              {messages.termsOfService.acceptance.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.termsOfService.acceptance.description}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.termsOfService.license.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.termsOfService.license.description}
            </p>
            <ul className={styles.list}>
              {messages.termsOfService.license.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.termsOfService.medicalDisclaimer.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.termsOfService.medicalDisclaimer.description}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.termsOfService.limitations.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.termsOfService.limitations.description}
            </p>
          </section>

          <Separator />

          <div className={styles.backButton}>
            <Link href="/">
              <Button variant="outlined">
                {messages.learnMore.buttons.backToHome}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
