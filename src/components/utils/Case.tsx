"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { OutputRow, fieldLabel, rawInputProps, textInput } from "./ui";

const S: Record<Locale, { input: string; placeholder: string }> = {
  pl: { input: "Tekst", placeholder: "Wpisz tekst…" },
  en: { input: "Text", placeholder: "Type text…" },
  it: { input: "Testo", placeholder: "Inserisci testo…" },
};

function words(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

function slugify(w: string[]): string {
  return w
    .join("-")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9-]/g, "");
}

export function Case({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [text, setText] = useState("");
  const w = words(text);

  const rows: [string, string][] = text.trim()
    ? [
        ["lowercase", text.toLowerCase()],
        ["UPPERCASE", text.toUpperCase()],
        ["Title Case", w.map(cap).join(" ")],
        ["camelCase", w.map((x, i) => (i ? cap(x) : x.toLowerCase())).join("")],
        ["PascalCase", w.map(cap).join("")],
        ["snake_case", w.map((x) => x.toLowerCase()).join("_")],
        ["kebab-case", w.map((x) => x.toLowerCase()).join("-")],
        ["CONSTANT_CASE", w.map((x) => x.toUpperCase()).join("_")],
        ["slug", slugify(w)],
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.input}</span>
        <textarea {...rawInputProps} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} rows={2} className={`${textInput} resize-y`} />
      </div>

      {rows.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-zinc-800 pt-4">
          {rows.map(([label, value]) => (
            <OutputRow key={label} label={label} value={value} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
