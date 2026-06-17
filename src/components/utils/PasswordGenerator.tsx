"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, textButton } from "./ui";

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const;

type SetKey = keyof typeof SETS;
const SET_KEYS = Object.keys(SETS) as SetKey[];

function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

function makePassword(length: number, enabled: Record<SetKey, boolean>): string {
  const sets = SET_KEYS.filter((k) => enabled[k]).map((k) => SETS[k]);
  if (sets.length === 0) return "";
  const all = sets.join("");
  const chars: string[] = [];
  for (const set of sets) {
    if (chars.length < length) chars.push(set[randomIndex(set.length)]);
  }
  while (chars.length < length) chars.push(all[randomIndex(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

const S: Record<Locale, Record<SetKey | "length" | "generate" | "empty" | "atLeastOne", string>> = {
  pl: { length: "Długość", uppercase: "Wielkie litery", lowercase: "Małe litery", digits: "Cyfry", symbols: "Symbole", generate: "Generuj", empty: "—", atLeastOne: "Zaznacz przynajmniej jeden zestaw znaków." },
  en: { length: "Length", uppercase: "Uppercase", lowercase: "Lowercase", digits: "Digits", symbols: "Symbols", generate: "Generate", empty: "—", atLeastOne: "Select at least one character set." },
  it: { length: "Lunghezza", uppercase: "Maiuscole", lowercase: "Minuscole", digits: "Numeri", symbols: "Simboli", generate: "Genera", empty: "—", atLeastOne: "Seleziona almeno un set di caratteri." },
};

export function PasswordGenerator({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<Record<SetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");

  const hasSet = SET_KEYS.some((k) => enabled[k]);

  const changeLength = (value: number) => {
    setLength(value);
    setPassword(makePassword(value, enabled));
  };

  const toggle = (key: SetKey) => {
    const next = { ...enabled, [key]: !enabled[key] };
    setEnabled(next);
    setPassword(makePassword(length, next));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <p className="min-h-6 flex-1 break-all font-mono text-base text-zinc-100">
          {password || t.empty}
        </p>
        <CopyButton value={password} locale={locale} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-400">
          <span>{t.length}</span>
          <span className="tabular-nums text-zinc-200">{length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={48}
          value={length}
          onChange={(e) => changeLength(Number(e.target.value))}
          aria-label={t.length}
          className="w-full accent-zinc-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SET_KEYS.map((k) => (
          <label
            key={k}
            className="flex cursor-pointer items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400"
          >
            <input type="checkbox" checked={enabled[k]} onChange={() => toggle(k)} className="size-3.5 accent-zinc-400" />
            {t[k]}
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={() => setPassword(makePassword(length, enabled))} disabled={!hasSet} className={textButton}>
          {t.generate}
        </button>
        {!hasSet && <span className="text-right text-[10px] tracking-wide text-zinc-500">{t.atLeastOne}</span>}
      </div>
    </div>
  );
}
