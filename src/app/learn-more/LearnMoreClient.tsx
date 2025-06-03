"use client";

import { Button } from "@/components/Shared/Button/Button";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Link from "next/link";
import styles from "./LearnMore.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LearnMoreClient() {
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title={messages.learnMore.title}
          subheader={messages.learnMore.subheader}
        />
        <CardContent className={styles.section}>
          <section>
            <h2 className={styles.sectionTitle}>
              {messages.learnMore.howItWorks.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.learnMore.howItWorks.description}
            </p>
            <ol className={styles.orderedList}>
              {messages.learnMore.howItWorks.steps.map(
                (step: string, index: number) => (
                  <li key={index}>{step}</li>
                )
              )}
            </ol>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.learnMore.technology.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.learnMore.technology.description}
            </p>
            <ul className={styles.unorderedList}>
              {messages.learnMore.technology.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.learnMore.privacy.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.learnMore.privacy.description}
            </p>
            <ul className={styles.unorderedList}>
              {messages.learnMore.privacy.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>
              {messages.learnMore.disclaimer.title}
            </h2>
            <p className={styles.sectionText}>
              {messages.learnMore.disclaimer.description}
            </p>
            <ul className={styles.unorderedList}>
              {messages.learnMore.disclaimer.points.map(
                (point: string, index: number) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </section>

          <div className={styles.buttonContainer}>
            <Link href="/health-analysis">
              <Button>{messages.learnMore.buttons.tryHealthAnalysis}</Button>
            </Link>
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
