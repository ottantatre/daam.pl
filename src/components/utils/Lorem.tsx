"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, fieldLabel, textButton } from "./ui";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

type Unit = "paragraphs" | "sentences" | "words";

const S: Record<Locale, { amount: string; generate: string; paragraphs: string; sentences: string; words: string }> = {
  pl: { amount: "Ilość", generate: "Generuj", paragraphs: "Akapity", sentences: "Zdania", words: "Słowa" },
  en: { amount: "Amount", generate: "Generate", paragraphs: "Paragraphs", sentences: "Sentences", words: "Words" },
  it: { amount: "Quantità", generate: "Genera", paragraphs: "Paragrafi", sentences: "Frasi", words: "Parole" },
};

const rand = (n: number) => Math.floor(Math.random() * n);
const pickWords = (n: number) => Array.from({ length: n }, () => WORDS[rand(WORDS.length)]);
const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function sentence(): string {
  const ws = pickWords(6 + rand(9));
  return upperFirst(ws.join(" ")) + ".";
}

function paragraph(): string {
  return Array.from({ length: 3 + rand(4) }, sentence).join(" ");
}

export function Lorem({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [amount, setAmount] = useState(3);
  const [output, setOutput] = useState("");

  const generate = () => {
    if (unit === "paragraphs") setOutput(Array.from({ length: amount }, paragraph).join("\n\n"));
    else if (unit === "sentences") setOutput(Array.from({ length: amount }, sentence).join(" "));
    else setOutput(upperFirst(pickWords(amount).join(" ")) + ".");
  };

  const units: [Unit, string][] = [
    ["paragraphs", t.paragraphs],
    ["sentences", t.sentences],
    ["words", t.words],
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2">
          <span className={fieldLabel}>{t.amount}</span>
          <input
            type="number"
            min={1}
            max={50}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-20 border-b border-zinc-800 bg-transparent py-2 font-mono text-sm text-zinc-100 outline-none focus:border-zinc-600"
          />
        </div>
        <div className="flex gap-4">
          {units.map(([u, label]) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={
                u === unit
                  ? "text-[11px] uppercase tracking-[0.2em] text-zinc-100 underline underline-offset-4"
                  : "text-[11px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={generate} className={`${textButton} self-start`}>
        {t.generate}
      </button>

      {output && (
        <div className="flex items-start gap-4 border-t border-zinc-800 pt-4">
          <p className="min-h-6 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{output}</p>
          <CopyButton value={output} locale={locale} />
        </div>
      )}
    </div>
  );
}
