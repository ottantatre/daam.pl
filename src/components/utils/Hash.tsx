"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, fieldLabel, rawInputProps, selectInput, textInput } from "./ui";

const ALGOS = ["SHA-256", "SHA-1", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

const S: Record<Locale, { input: string; algorithm: string; placeholder: string; output: string }> = {
  pl: { input: "Tekst", algorithm: "Algorytm", placeholder: "Wpisz tekst…", output: "Wynik" },
  en: { input: "Text", algorithm: "Algorithm", placeholder: "Type text…", output: "Output" },
  it: { input: "Testo", algorithm: "Algoritmo", placeholder: "Inserisci testo…", output: "Output" },
};

async function digestHex(algo: Algo, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function Hash({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [text, setText] = useState("");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [output, setOutput] = useState("");
  const seq = useRef(0);

  const recompute = (value: string, a: Algo) => {
    if (!value) {
      seq.current++;
      setOutput("");
      return;
    }
    const id = ++seq.current;
    digestHex(a, value).then((hex) => {
      if (id === seq.current) setOutput(hex);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.input}</span>
        <textarea
          {...rawInputProps}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            recompute(e.target.value, algo);
          }}
          placeholder={t.placeholder}
          rows={3}
          className={`${textInput} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.algorithm}</span>
        <select
          value={algo}
          onChange={(e) => {
            const a = e.target.value as Algo;
            setAlgo(a);
            recompute(text, a);
          }}
          className={selectInput}
        >
          {ALGOS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start gap-4 border-t border-zinc-800 pt-4">
        <p className="min-h-6 flex-1 break-all font-mono text-sm text-zinc-100">{output || "—"}</p>
        <CopyButton value={output} locale={locale} />
      </div>
    </div>
  );
}
