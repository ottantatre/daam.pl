import type { Locale } from "@/lib/i18n";
import type { UtilSlug } from "@/lib/utils-tools";

export type UtilsContent = {
  title: string;
  intro: string;
  tools: Record<UtilSlug, { name: string; description: string }>;
};

export const utilsContent: Record<Locale, UtilsContent> = {
  pl: {
    title: "Utils",
    intro: "Zbiór mikronarzędzi. Wszystko działa lokalnie w przeglądarce.",
    tools: {
      "password-generator": { name: "Generator haseł", description: "Twórz silne, losowe hasła." },
      uuid: { name: "Generator UUID", description: "Losowe identyfikatory UUID v4." },
      hash: { name: "Hash", description: "SHA-1 / 256 / 384 / 512 z tekstu." },
      base64: { name: "Base64", description: "Koduj i dekoduj Base64." },
      "url-encode": { name: "URL encode", description: "Koduj i dekoduj adresy URL." },
      json: { name: "JSON", description: "Formatuj, minifikuj i waliduj JSON." },
      jwt: { name: "JWT decoder", description: "Dekoduj tokeny JWT." },
      color: { name: "Konwerter kolorów", description: "HEX ↔ RGB ↔ HSL." },
      timestamp: { name: "Timestamp", description: "Unix ↔ data." },
      case: { name: "Wielkość liter", description: "camelCase, snake_case, kebab, slug…" },
      "text-stats": { name: "Statystyki tekstu", description: "Znaki, słowa, czas czytania." },
      lorem: { name: "Lorem ipsum", description: "Generuj tekst zastępczy." },
    },
  },
  en: {
    title: "Utils",
    intro: "A collection of micro-tools. Everything runs locally in your browser.",
    tools: {
      "password-generator": { name: "Password generator", description: "Create strong, random passwords." },
      uuid: { name: "UUID generator", description: "Random UUID v4 identifiers." },
      hash: { name: "Hash", description: "SHA-1 / 256 / 384 / 512 of text." },
      base64: { name: "Base64", description: "Encode and decode Base64." },
      "url-encode": { name: "URL encode", description: "Encode and decode URLs." },
      json: { name: "JSON", description: "Format, minify and validate JSON." },
      jwt: { name: "JWT decoder", description: "Decode JWT tokens." },
      color: { name: "Color converter", description: "HEX ↔ RGB ↔ HSL." },
      timestamp: { name: "Timestamp", description: "Unix ↔ date." },
      case: { name: "Case converter", description: "camelCase, snake_case, kebab, slug…" },
      "text-stats": { name: "Text stats", description: "Characters, words, reading time." },
      lorem: { name: "Lorem ipsum", description: "Generate placeholder text." },
    },
  },
  it: {
    title: "Utils",
    intro: "Una raccolta di micro-strumenti. Tutto funziona localmente nel browser.",
    tools: {
      "password-generator": { name: "Generatore di password", description: "Crea password forti e casuali." },
      uuid: { name: "Generatore UUID", description: "Identificatori UUID v4 casuali." },
      hash: { name: "Hash", description: "SHA-1 / 256 / 384 / 512 del testo." },
      base64: { name: "Base64", description: "Codifica e decodifica Base64." },
      "url-encode": { name: "URL encode", description: "Codifica e decodifica URL." },
      json: { name: "JSON", description: "Formatta, minifica e valida JSON." },
      jwt: { name: "JWT decoder", description: "Decodifica i token JWT." },
      color: { name: "Convertitore colori", description: "HEX ↔ RGB ↔ HSL." },
      timestamp: { name: "Timestamp", description: "Unix ↔ data." },
      case: { name: "Maiuscole/minuscole", description: "camelCase, snake_case, kebab, slug…" },
      "text-stats": { name: "Statistiche testo", description: "Caratteri, parole, tempo di lettura." },
      lorem: { name: "Lorem ipsum", description: "Genera testo segnaposto." },
    },
  },
};
