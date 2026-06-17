"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

export const fieldLabel = "text-[10px] uppercase tracking-[0.25em] text-zinc-400";
export const textInput =
  "w-full border-b border-zinc-800 bg-transparent py-2 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-zinc-600";
export const textButton =
  "text-[11px] uppercase tracking-[0.25em] text-zinc-200 underline underline-offset-4 hover:text-zinc-100 disabled:no-underline disabled:opacity-40";
export const selectInput =
  "border-b border-zinc-800 bg-black py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600";
export const monoOut = "break-all font-mono text-sm text-zinc-100";

const COPY: Record<Locale, { copy: string; copied: string }> = {
  pl: { copy: "Kopiuj", copied: "Skopiowano" },
  en: { copy: "Copy", copied: "Copied" },
  it: { copy: "Copia", copied: "Copiato" },
};

export function CopyButton({ value, locale }: { value: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={!value}
      className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-zinc-400 underline-offset-4 hover:text-zinc-100 hover:underline disabled:opacity-40"
    >
      {copied ? COPY[locale].copied : COPY[locale].copy}
    </button>
  );
}

export function OutputRow({ label, value, locale }: { label: string; value: string; locale: Locale }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-zinc-500">{label}</span>
        <span className="min-w-0 break-all font-mono text-sm text-zinc-100">{value}</span>
      </div>
      <CopyButton value={value} locale={locale} />
    </div>
  );
}

// Common input attributes — no browser autofill/spellcheck helpers (project preference).
export const rawInputProps = {
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
} as const;
