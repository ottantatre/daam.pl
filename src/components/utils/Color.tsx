"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { OutputRow, fieldLabel, rawInputProps, textInput } from "./ui";

const S: Record<Locale, { input: string; invalid: string }> = {
  pl: { input: "HEX", invalid: "Nieprawidłowy kolor." },
  en: { input: "HEX", invalid: "Invalid color." },
  it: { input: "HEX", invalid: "Colore non valido." },
};

function parseHex(input: string): { r: number; g: number; b: number } | null {
  let s = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(s)) s = s.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function Color({ locale }: { locale: Locale }) {
  const t = S[locale];
  const [hex, setHex] = useState("");

  const rgb = parseHex(hex);
  const norm = rgb ? "#" + [rgb.r, rgb.g, rgb.b].map((n) => n.toString(16).padStart(2, "0")).join("") : null;
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end gap-4">
        <input
          type="color"
          value={norm ?? "#000000"}
          onChange={(e) => setHex(e.target.value)}
          aria-label={t.input}
          className="size-10 cursor-pointer border border-zinc-800 bg-transparent p-0"
        />
        <div className="flex flex-1 flex-col gap-2">
          <span className={fieldLabel}>{t.input}</span>
          <input {...rawInputProps} value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#7c3aed" className={textInput} />
        </div>
      </div>

      {hex.trim() && !rgb && <p className="text-[11px] text-zinc-500">{t.invalid}</p>}

      {rgb && norm && hsl && (
        <div className="flex flex-col gap-4 border-t border-zinc-800 pt-4">
          <OutputRow label="HEX" value={norm} locale={locale} />
          <OutputRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} locale={locale} />
          <OutputRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} locale={locale} />
        </div>
      )}
    </div>
  );
}
