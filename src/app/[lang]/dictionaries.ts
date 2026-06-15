import type { Locale } from "@/lib/i18n";

const dictionaries = {
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
