"use client";

import { Button } from "@/components/Shared/Button/Button";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Link from "next/link";
import styles from "./LearnMore.module.scss";

export default function LearnMoreClient() {
  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title="About HealthAI Analysis"
          subheader="Understanding our AI-powered health analysis service"
        />
        <CardContent className={styles.section}>
          <section>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionText}>
              Our AI-powered health analysis system uses advanced machine
              learning algorithms to analyze your symptoms and health data.
              Here's how the process works:
            </p>
            <ol className={styles.orderedList}>
              <li>You provide your symptoms and health information</li>
              <li>Optionally upload lab results or medical documents</li>
              <li>
                Our AI analyzes the data using a comprehensive medical knowledge
                base
              </li>
              <li>You receive personalized insights and recommendations</li>
            </ol>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Our Technology</h2>
            <p className={styles.sectionText}>
              HealthAI uses state-of-the-art natural language processing and
              machine learning technologies to understand and analyze health
              information. Our system is trained on:
            </p>
            <ul className={styles.unorderedList}>
              <li>Medical literature and research papers</li>
              <li>Clinical guidelines and best practices</li>
              <li>Patterns from anonymized health data</li>
              <li>Expert medical knowledge</li>
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Privacy and Security</h2>
            <p className={styles.sectionText}>
              We take your privacy and data security seriously. All information
              is:
            </p>
            <ul className={styles.unorderedList}>
              <li>Encrypted during transmission and storage</li>
              <li>Processed in compliance with healthcare regulations</li>
              <li>Never shared with third parties without your consent</li>
              <li>Protected by strict access controls</li>
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Important Disclaimer</h2>
            <p className={styles.sectionText}>
              While our AI analysis can provide valuable insights, it is not a
              substitute for professional medical advice. Always consult with
              healthcare professionals for:
            </p>
            <ul className={styles.unorderedList}>
              <li>Medical diagnosis and treatment</li>
              <li>Emergency situations</li>
              <li>Serious health concerns</li>
              <li>Prescription medications</li>
            </ul>
          </section>

          <div className={styles.buttonContainer}>
            <Link href="/health-analysis">
              <Button>Try Health Analysis</Button>
            </Link>
            <Link href="/">
              <Button variant="outlined">Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
