"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, fieldLabel, rawInputProps, textButton, textInput } from "./ui";

const S: Record<Locale, { input: string; placeholder: string; format: string; minify: string; invalid: string }> = {
  pl: { input: "JSON", placeholder: '{ "klucz": "wartość" }', format: "Formatuj", minify: "Minifikuj", invalid: "Nieprawidłowy JSON: " },
  en: { input: "JSON", placeholder: '{ "key": "value" }', format: "Format", minify: "Minify", invalid: "Invalid JSON: " },
  it: { input: "JSON", placeholder: '{ "chiave": "valore" }', format: "Formatta", minify: "Minify", invalid: "JSON non valido: " },
};

export function Json({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const transform = (indent: number) => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent || undefined));
      setError("");
    } catch (e) {
      setOutput("");
      setError(t.invalid + (e instanceof Error ? e.message : ""));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.input}</span>
        <textarea
          {...rawInputProps}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          rows={5}
          className={`${textInput} resize-y`}
        />
      </div>

      <div className="flex gap-6">
        <button type="button" onClick={() => transform(2)} className={textButton}>
          {t.format}
        </button>
        <button type="button" onClick={() => transform(0)} className={textButton}>
          {t.minify}
        </button>
      </div>

      {error && <p className="text-[11px] leading-relaxed text-zinc-500">{error}</p>}

      {output && (
        <div className="flex items-start gap-4 border-t border-zinc-800 pt-4">
          <pre className="min-h-6 flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-zinc-100">
            {output}
          </pre>
          <CopyButton value={output} locale={locale} />
        </div>
      )}
    </div>
  );
}
