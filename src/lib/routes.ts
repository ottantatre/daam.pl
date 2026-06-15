import type { Locale } from "./i18n";

export type PageKey = "about" | "offer" | "privacy";

// Localized URL slug for each page, per locale.
export const slugs: Record<PageKey, Record<Locale, string>> = {
  about: { pl: "o-mnie", en: "about", it: "chi-sono" },
  offer: { pl: "oferta", en: "offer", it: "offerta" },
  privacy: {
    pl: "polityka-prywatnosci",
    en: "privacy-policy",
    it: "informativa-privacy",
  },
};

export const pageKeys = Object.keys(slugs) as PageKey[];

/** Localized href for a page, e.g. pageHref("it", "about") -> "/it/chi-sono". */
export function pageHref(lang: Locale, key: PageKey): string {
  return `/${lang}/${slugs[key][lang]}`;
}

/** Reverse lookup: which page does this slug map to in the given locale? */
export function pageKeyForSlug(lang: Locale, slug: string): PageKey | null {
  return pageKeys.find((key) => slugs[key][lang] === slug) ?? null;
}
