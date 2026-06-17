"use client";

import { useEffect, useRef, useState } from "react";
import type { PasswordGeneratorLabels } from "@/content/utils";

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const;

type SetKey = keyof typeof SETS;
const SET_KEYS = Object.keys(SETS) as SetKey[];

// Unbiased index in [0, max) using rejection sampling over Web Crypto.
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
  // Guarantee at least one char from each selected set (when there is room).
  for (const set of sets) {
    if (chars.length < length) chars.push(set[randomIndex(set.length)]);
  }
  while (chars.length < length) chars.push(all[randomIndex(all.length)]);
  // Fisher–Yates shuffle so the guaranteed chars aren't front-loaded.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function PasswordGenerator({ labels }: { labels: PasswordGeneratorLabels }) {
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<Record<SetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSet = SET_KEYS.some((k) => enabled[k]);

  // Clear the "copied" timer on unmount.
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const update = (next: string) => {
    setPassword(next);
    setCopied(false);
  };

  const changeLength = (value: number) => {
    setLength(value);
    update(makePassword(value, enabled));
  };

  const toggle = (key: SetKey) => {
    const next = { ...enabled, [key]: !enabled[key] };
    setEnabled(next);
    update(makePassword(length, next));
  };

  const generate = () => update(makePassword(length, enabled));

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-8">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <p className="min-h-6 flex-1 break-all font-mono text-base text-zinc-100">
          {password || labels.empty}
        </p>
        <button
          type="button"
          onClick={copy}
          disabled={!password}
          className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-zinc-400 underline-offset-4 hover:text-zinc-100 hover:underline disabled:opacity-40"
        >
          {copied ? labels.copied : labels.copy}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-400">
          <span>{labels.length}</span>
          <span className="tabular-nums text-zinc-200">{length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={48}
          value={length}
          onChange={(e) => changeLength(Number(e.target.value))}
          aria-label={labels.length}
          className="w-full accent-zinc-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SET_KEYS.map((k) => (
          <label
            key={k}
            className="flex cursor-pointer items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400"
          >
            <input
              type="checkbox"
              checked={enabled[k]}
              onChange={() => toggle(k)}
              className="size-3.5 accent-zinc-400"
            />
            {labels[k]}
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={generate}
          disabled={!hasSet}
          className="text-[11px] uppercase tracking-[0.25em] text-zinc-200 underline underline-offset-4 hover:text-zinc-100 disabled:no-underline disabled:opacity-40"
        >
          {labels.generate}
        </button>
        {!hasSet && (
          <span className="text-right text-[10px] tracking-wide text-zinc-500">
            {labels.atLeastOne}
          </span>
        )}
      </div>
    </div>
  );
}
