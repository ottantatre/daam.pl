"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, fieldLabel, rawInputProps, textInput } from "./ui";

type Mode = "encode" | "decode";

const S: Record<Locale, { encode: string; decode: string; input: string; output: string; placeholder: string; invalid: string }> = {
  pl: { encode: "Koduj", decode: "Dekoduj", input: "Wejście", output: "Wynik", placeholder: "Wpisz tekst…", invalid: "Nieprawidłowy Base64." },
  en: { encode: "Encode", decode: "Decode", input: "Input", output: "Output", placeholder: "Type text…", invalid: "Invalid Base64." },
  it: { encode: "Codifica", decode: "Decodifica", input: "Input", output: "Output", placeholder: "Inserisci testo…", invalid: "Base64 non valido." },
};

function encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function decode(b64: string): string {
  const bin = atob(b64.trim());
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export function Base64({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);

  const run = (value: string, m: Mode) => {
    if (!value) {
      setOutput("");
      setError(false);
      return;
    }
    try {
      setOutput(m === "encode" ? encode(value) : decode(value));
      setError(false);
    } catch {
      setOutput("");
      setError(true);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-6">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              run(input, m);
            }}
            className={
              m === mode
                ? "text-[11px] uppercase tracking-[0.25em] text-zinc-100 underline underline-offset-4"
                : "text-[11px] uppercase tracking-[0.25em] text-zinc-600 hover:text-zinc-300"
            }
          >
            {t[m]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.input}</span>
        <textarea
          {...rawInputProps}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            run(e.target.value, mode);
          }}
          placeholder={t.placeholder}
          rows={3}
          className={`${textInput} resize-y`}
        />
      </div>

      <div className="flex items-start gap-4 border-t border-zinc-800 pt-4">
        <p className="min-h-6 flex-1 break-all font-mono text-sm text-zinc-100">
          {error ? <span className="text-zinc-500">{t.invalid}</span> : output || "—"}
        </p>
        <CopyButton value={error ? "" : output} locale={locale} />
      </div>
    </div>
  );
}
