import Link from "next/link";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <p className={styles.copyrightText}>
            © 2025 HealthAI. All rights reserved.
          </p>
        </div>
        <div className={styles.links}>
          <Link href="/terms" className={styles.link}>
            Terms of Service
          </Link>
          <Link href="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
