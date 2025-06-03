"use client";

import Link from "next/link";
import styles from "./Footer.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { messages } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <p className={styles.copyrightText}>{messages.footer.copyright}</p>
        </div>
        <div className={styles.links}>
          <Link href="/terms" className={styles.link}>
            {messages.footer.terms}
          </Link>
          <Link href="/privacy" className={styles.link}>
            {messages.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
