import "server-only";
import { parseXtbSymbol } from "@/features/stocks/stockUtils";

export type Candle = {
  ctm: number; // ms timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
};

export type SymbolCandles = {
  symbol: string; // XTB symbol (canonical for our app)
  candles: Candle[]; // oldest → newest
  digits: number;
};

// XTB exchange code → Yahoo Finance suffix
const SUFFIX_MAP: Record<string, string> = {
  DE: ".DE", // XETRA
  FR: ".PA", // Paris
  NL: ".AS", // Amsterdam
  UK: ".L",  // London
  CH: ".SW", // Zurich
  IT: ".MI", // Milan
  ES: ".MC", // Madrid
  US: "",    // NYSE/NASDAQ
  BE: ".BR", // Brussels
  DK: ".CO", // Copenhagen
  FI: ".HE", // Helsinki
  NO: ".OL", // Oslo
  PT: ".LS", // Lisbon
  CZ: ".PR", // Prague
  SE: ".ST", // Stockholm
};

export function xtbToYahoo(xtbSymbol: string): string | null {
  const parsed = parseXtbSymbol(xtbSymbol);
  if (!parsed) return null;
  const suffix = SUFFIX_MAP[parsed.exchange];
  if (suffix === undefined) return null;
  return parsed.ticker + suffix;
}

type YahooChartResult = {
  meta?: { regularMarketPrice?: number; symbol?: string };
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      open?: (number | null)[];
      high?: (number | null)[];
      low?: (number | null)[];
      close?: (number | null)[];
      volume?: (number | null)[];
    }>;
  };
};

type YahooChartResponse = {
  chart?: {
    result?: YahooChartResult[] | null;
    error?: { description?: string; code?: string } | null;
  };
};

async function fetchOne(xtbSymbol: string, daysBack: number): Promise<SymbolCandles | null> {
  const yahoo = xtbToYahoo(xtbSymbol);
  if (!yahoo) return null;

  const end = Math.floor(Date.now() / 1000);
  const start = end - daysBack * 86400;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?period1=${start}&period2=${end}&interval=1d`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (daam.pl scanner)" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const body = (await res.json()) as YahooChartResponse;
  const result = body.chart?.result?.[0];
  if (!result || !result.timestamp || !result.indicators?.quote?.[0]) return null;

  const ts = result.timestamp;
  const q = result.indicators.quote[0];
  const candles: Candle[] = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i];
    const h = q.high?.[i];
    const l = q.low?.[i];
    const c = q.close?.[i];
    const v = q.volume?.[i];
    if (o == null || h == null || l == null || c == null) continue;
    candles.push({ ctm: ts[i] * 1000, open: o, high: h, low: l, close: c, vol: v ?? 0 });
  }
  if (candles.length === 0) return null;

  return { symbol: xtbSymbol, digits: 4, candles };
}

export async function fetchDailyCandles(xtbSymbols: string[], daysBack = 35): Promise<SymbolCandles[]> {
  const results = await Promise.all(xtbSymbols.map((s) => fetchOne(s, daysBack)));
  return results.filter((r): r is SymbolCandles => r !== null);
}
