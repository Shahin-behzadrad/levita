"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { locales, localeNames } from "@/i18n/settings";
import Select from "@/components/Shared/Select/Select";
import styles from "./LanguageSwitcher.module.scss";

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useLanguage();

  const languageOptions = locales.map((loc) => ({
    value: loc,
    label: localeNames[loc],
  }));

  return (
    <div className={styles.container}>
      <Select
        options={languageOptions}
        value={locale}
        onChange={(value) => setLocale(value as any)}
      />
    </div>
  );
}
