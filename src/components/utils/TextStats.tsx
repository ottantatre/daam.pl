"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fieldLabel, rawInputProps, textInput } from "./ui";

const S: Record<Locale, { input: string; placeholder: string; characters: string; noSpaces: string; words: string; lines: string; sentences: string; reading: string; min: string }> = {
  pl: { input: "Tekst", placeholder: "Wpisz lub wklej tekst…", characters: "Znaki", noSpaces: "Znaki (bez spacji)", words: "Słowa", lines: "Linie", sentences: "Zdania", reading: "Czas czytania", min: "min" },
  en: { input: "Text", placeholder: "Type or paste text…", characters: "Characters", noSpaces: "Characters (no spaces)", words: "Words", lines: "Lines", sentences: "Sentences", reading: "Reading time", min: "min" },
  it: { input: "Testo", placeholder: "Scrivi o incolla testo…", characters: "Caratteri", noSpaces: "Caratteri (senza spazi)", words: "Parole", lines: "Righe", sentences: "Frasi", reading: "Tempo di lettura", min: "min" },
};

export function TextStats({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  const stats: [string, string][] = [
    [t.characters, String(text.length)],
    [t.noSpaces, String(text.replace(/\s/g, "").length)],
    [t.words, String(wordCount)],
    [t.lines, String(text ? text.split(/\r\n|\r|\n/).length : 0)],
    [t.sentences, String((text.match(/[^.!?…]+[.!?…]+/g) || []).length)],
    [t.reading, `${wordCount ? Math.max(1, Math.ceil(wordCount / 200)) : 0} ${t.min}`],
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.input}</span>
        <textarea {...rawInputProps} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} rows={5} className={`${textInput} resize-y`} />
      </div>

      <dl className="flex flex-col gap-3 border-t border-zinc-800 pt-4">
        {stats.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4">
            <dt className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">{k}</dt>
            <dd className="font-mono text-sm tabular-nums text-zinc-100">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
