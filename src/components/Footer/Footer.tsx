"use client";

import Link from "next/link";
import styles from "./Footer.module.scss";
import { useLanguage } from "@/i18n/LanguageContext";
import { useApp } from "@/lib/AppContext";

const Footer = () => {
  const { currentView } = useApp();
  const { messages } = useLanguage();

  if (currentView === "chat") {
    return null;
  }

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
