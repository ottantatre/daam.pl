import type { Locale } from "@/lib/i18n";
import type { UtilSlug } from "@/lib/utils-tools";

export type PasswordGeneratorLabels = {
  length: string;
  uppercase: string;
  lowercase: string;
  digits: string;
  symbols: string;
  generate: string;
  copy: string;
  copied: string;
  empty: string;
  atLeastOne: string;
};

export type UtilsContent = {
  title: string;
  intro: string;
  tools: Record<UtilSlug, { name: string; description: string }>;
  passwordGenerator: PasswordGeneratorLabels;
};

export const utilsContent: Record<Locale, UtilsContent> = {
  pl: {
    title: "Utils",
    intro: "Zbiór mikronarzędzi.",
    tools: {
      "password-generator": {
        name: "Generator haseł",
        description: "Twórz silne, losowe hasła.",
      },
    },
    passwordGenerator: {
      length: "Długość",
      uppercase: "Wielkie litery",
      lowercase: "Małe litery",
      digits: "Cyfry",
      symbols: "Symbole",
      generate: "Generuj",
      copy: "Kopiuj",
      copied: "Skopiowano",
      empty: "—",
      atLeastOne: "Zaznacz przynajmniej jeden zestaw znaków.",
    },
  },
  en: {
    title: "Utils",
    intro: "A collection of micro-tools.",
    tools: {
      "password-generator": {
        name: "Password generator",
        description: "Create strong, random passwords.",
      },
    },
    passwordGenerator: {
      length: "Length",
      uppercase: "Uppercase",
      lowercase: "Lowercase",
      digits: "Digits",
      symbols: "Symbols",
      generate: "Generate",
      copy: "Copy",
      copied: "Copied",
      empty: "—",
      atLeastOne: "Select at least one character set.",
    },
  },
  it: {
    title: "Utils",
    intro: "Una raccolta di micro-strumenti.",
    tools: {
      "password-generator": {
        name: "Generatore di password",
        description: "Crea password forti e casuali.",
      },
    },
    passwordGenerator: {
      length: "Lunghezza",
      uppercase: "Maiuscole",
      lowercase: "Minuscole",
      digits: "Numeri",
      symbols: "Simboli",
      generate: "Genera",
      copy: "Copia",
      copied: "Copiato",
      empty: "—",
      atLeastOne: "Seleziona almeno un set di caratteri.",
    },
  },
};
