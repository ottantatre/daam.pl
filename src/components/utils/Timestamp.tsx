"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { OutputRow, fieldLabel, rawInputProps, textInput } from "./ui";

const TAG: Record<Locale, string> = { pl: "pl-PL", en: "en-GB", it: "it-IT" };

const S: Record<Locale, { unix: string; now: string; datetime: string; utc: string; local: string; ms: string; invalid: string }> = {
  pl: { unix: "Unix (s)", now: "Teraz", datetime: "Data i czas", utc: "UTC", local: "Lokalnie", ms: "Milisekundy", invalid: "Nieprawidłowy timestamp." },
  en: { unix: "Unix (s)", now: "Now", datetime: "Date & time", utc: "UTC", local: "Local", ms: "Milliseconds", invalid: "Invalid timestamp." },
  it: { unix: "Unix (s)", now: "Adesso", datetime: "Data e ora", utc: "UTC", local: "Locale", ms: "Millisecondi", invalid: "Timestamp non valido." },
};

const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function Timestamp({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [unix, setUnix] = useState("");

  const num = Number(unix);
  const valid = unix.trim() !== "" && Number.isFinite(num);
  const date = valid ? new Date(num * 1000) : null;
  const ok = date !== null && !Number.isNaN(date.getTime());

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={fieldLabel}>{t.unix}</span>
          <button
            type="button"
            onClick={() => setUnix(String(Math.floor(Date.now() / 1000)))}
            className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 hover:text-zinc-100"
          >
            {t.now}
          </button>
        </div>
        <input {...rawInputProps} inputMode="numeric" value={unix} onChange={(e) => setUnix(e.target.value)} placeholder="1700000000" className={textInput} />
      </div>

      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>{t.datetime}</span>
        <input
          type="datetime-local"
          value={ok ? toLocalInput(date) : ""}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) {
              setUnix("");
              return;
            }
            const ms = new Date(v).getTime();
            if (Number.isFinite(ms)) setUnix(String(Math.floor(ms / 1000)));
          }}
          className={`${textInput} [color-scheme:dark]`}
        />
      </div>

      {valid && !ok && <p className="text-[11px] text-zinc-500">{t.invalid}</p>}

      {ok && (
        <div className="flex flex-col gap-4 border-t border-zinc-800 pt-4">
          <OutputRow label={t.utc} value={date.toISOString()} locale={locale} />
          <OutputRow label={t.local} value={new Intl.DateTimeFormat(TAG[locale], { dateStyle: "full", timeStyle: "medium" }).format(date)} locale={locale} />
          <OutputRow label={t.ms} value={String(num * 1000)} locale={locale} />
        </div>
      )}
    </div>
  );
}
