"use client";

import { Button } from "@/components/Shared/Button/Button";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Link from "next/link";
import styles from "./TermsOfService.module.scss";

export default function TermsOfServiceClient() {
  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title="Terms of Service"
          subheader="Last updated: March 15, 2024"
        />
        <CardContent className={styles.section}>
          <section>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.sectionText}>
              By accessing and using HealthAI's services, you agree to be bound
              by these Terms of Service and all applicable laws and regulations.
              If you do not agree with any of these terms, you are prohibited
              from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>2. Use License</h2>
            <p className={styles.sectionText}>
              Permission is granted to temporarily use HealthAI's services for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className={styles.list}>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on HealthAI
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>3. Medical Disclaimer</h2>
            <p className={styles.sectionText}>
              The information provided by HealthAI is for general informational
              purposes only and is not intended to be a substitute for
              professional medical advice, diagnosis, or treatment. Always seek
              the advice of your physician or other qualified health provider
              with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>4. Limitations</h2>
            <p className={styles.sectionText}>
              In no event shall HealthAI or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on HealthAI's website.
            </p>
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
