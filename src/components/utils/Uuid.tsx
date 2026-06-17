"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, textButton } from "./ui";

const S: Record<Locale, { generate: string; empty: string; count: string }> = {
  pl: { generate: "Generuj", empty: "—", count: "Ilość" },
  en: { generate: "Generate", empty: "—", count: "Count" },
  it: { generate: "Genera", empty: "—", count: "Quantità" },
};

const COUNTS = [1, 5, 10] as const;

export function Uuid({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [count, setCount] = useState<number>(1);
  const [ids, setIds] = useState<string[]>([]);

  const generate = (n: number) =>
    setIds(Array.from({ length: n }, () => crypto.randomUUID()));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-4 border-b border-zinc-800 pb-4">
        <div className="min-h-6 flex-1 break-all font-mono text-sm leading-relaxed text-zinc-100">
          {ids.length ? ids.map((id) => <div key={id}>{id}</div>) : t.empty}
        </div>
        <CopyButton value={ids.join("\n")} locale={locale} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={() => generate(count)} className={textButton}>
          {t.generate}
        </button>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400">
          <span>{t.count}</span>
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setCount(n);
                generate(n);
              }}
              className={n === count ? "tabular-nums text-zinc-200" : "tabular-nums text-zinc-600 hover:text-zinc-300"}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
