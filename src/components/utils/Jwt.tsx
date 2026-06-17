"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, fieldLabel, rawInputProps, textInput } from "./ui";

const S: Record<Locale, { input: string; placeholder: string; header: string; payload: string; signature: string; invalid: string }> = {
  pl: { input: "Token", placeholder: "Wklej token JWT…", header: "Nagłówek", payload: "Ładunek", signature: "Podpis", invalid: "Nieprawidłowy token JWT." },
  en: { input: "Token", placeholder: "Paste a JWT…", header: "Header", payload: "Payload", signature: "Signature", invalid: "Invalid JWT." },
  it: { input: "Token", placeholder: "Incolla un JWT…", header: "Header", payload: "Payload", signature: "Firma", invalid: "JWT non valido." },
};

function decodePart(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.stringify(JSON.parse(json), null, 2);
}

export function Jwt({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [token, setToken] = useState("");
  const [parts, setParts] = useState<{ header: string; payload: string; signature: string } | null>(null);
  const [error, setError] = useState(false);

  const decode = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setParts(null);
      setError(false);
      return;
    }
    const segments = trimmed.split(".");
    if (segments.length < 2) {
      setParts(null);
      setError(true);
      return;
    }
    try {
      setParts({
        header: decodePart(segments[0]),
        payload: decodePart(segments[1]),
        signature: segments[2] ?? "",
      });
      setError(false);
    } catch {
      setParts(null);
      setError(true);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.input}</span>
        <textarea
          {...rawInputProps}
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            decode(e.target.value);
          }}
          placeholder={t.placeholder}
          rows={3}
          className={`${textInput} resize-y`}
        />
      </div>

      {error && <p className="text-[11px] text-zinc-500">{t.invalid}</p>}

      {parts && (
        <div className="flex flex-col gap-6">
          <Section label={t.header} value={parts.header} locale={locale} pre />
          <Section label={t.payload} value={parts.payload} locale={locale} pre />
          <Section label={t.signature} value={parts.signature} locale={locale} />
        </div>
      )}
    </div>
  );
}

function Section({ label, value, locale, pre }: { label: string; value: string; locale: Locale; pre?: boolean }) {
  return (
    <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4">
      <div className="flex items-center justify-between">
        <span className={fieldLabel}>{label}</span>
        <CopyButton value={value} locale={locale} />
      </div>
      {pre ? (
        <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm text-zinc-100">{value}</pre>
      ) : (
        <p className="break-all font-mono text-sm text-zinc-500">{value || "—"}</p>
      )}
    </div>
  );
}
