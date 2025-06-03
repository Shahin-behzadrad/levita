"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { locales, localeNames } from "@/i18n/settings";
import Select from "../Select/Select";
import styles from "./LanguageSwitcher.module.scss";

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useLanguage();

  const languageOptions = locales.map((loc) => ({
    value: loc,
    label: localeNames[loc],
  }));

  return (
    <Select
      options={languageOptions}
      className={styles.languageSwitcher}
      value={locale}
      small
      onChange={(value) => setLocale(value as any)}
    />
  );
}
