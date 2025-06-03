export const defaultLocale = "en";
export const locales = ["en", "sq"] as const;
export type ValidLocale = (typeof locales)[number];

export const localeNames: Record<ValidLocale, string> = {
  en: "EN",
  sq: "SQ",
};

// Use type assertion since we know these values exist
export function getMessages(locale: ValidLocale) {
  return require(`../messages/${locale}.json`);
}
