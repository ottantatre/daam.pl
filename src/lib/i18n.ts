export const locales = ["pl", "en", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

export const localeNames: Record<Locale, string> = {
  pl: "PL",
  en: "EN",
  it: "IT",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
