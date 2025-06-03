"use client";

import { Button } from "@/components/Shared/Button/Button";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Link from "next/link";
import styles from "./PrivacyPolicy.module.scss";
import { Separator } from "@/components/Shared/Separator/Separator";
import { useLanguage } from "@/i18n/LanguageContext";

export default function PrivacyPolicyClient() {
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title={messages.privacyPolicy.title}
          subheader={messages.privacyPolicy.lastUpdated}
        />
        <CardContent className={styles.section}>
          <section>
            <h2 className={styles.sectionTitle}>
              {messages.privacyPolicy.informationWeCollect.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.privacyPolicy.informationWeCollect.description}
            </p>
            <ul className={styles.list}>
              {messages.privacyPolicy.informationWeCollect.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.privacyPolicy.howWeUse.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.privacyPolicy.howWeUse.description}
            </p>
            <ul className={styles.list}>
              {messages.privacyPolicy.howWeUse.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.privacyPolicy.dataSecurity.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.privacyPolicy.dataSecurity.description}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.privacyPolicy.yourRights.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.privacyPolicy.yourRights.description}
            </p>
            <ul className={styles.list}>
              {messages.privacyPolicy.yourRights.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

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
