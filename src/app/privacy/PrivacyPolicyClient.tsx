"use client";

import { Button } from "@/components/Shared/Button/Button";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Link from "next/link";
import styles from "./PrivacyPolicy.module.scss";

export default function PrivacyPolicyClient() {
  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title="Privacy Policy"
          subheader="Last updated: March 15, 2024"
        />
        <CardContent className={styles.section}>
          <section>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.sectionText}>
              We collect information that you provide directly to us, including:
            </p>
            <ul className={styles.list}>
              <li>Personal information (name, email address, age, sex)</li>
              <li>Health-related information you choose to share</li>
              <li>Lab results and medical documents you upload</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>
              2. How We Use Your Information
            </h2>
            <p className={styles.sectionText}>
              We use the information we collect to:
            </p>
            <ul className={styles.list}>
              <li>Provide and improve our AI health analysis services</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about our services</li>
              <li>Ensure the security of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>3. Data Security</h2>
            <p className={styles.sectionText}>
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>4. Your Rights</h2>
            <p className={styles.sectionText}>You have the right to:</p>
            <ul className={styles.list}>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <div className={styles.backButton}>
            <Link href="/">
              <Button variant="outlined">Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
