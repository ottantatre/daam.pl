import { Candle, SymbolCandles } from "./yahoo";

export type Score = {
  symbol: string;
  ticker: string;
  exchange: string;
  digits: number;
  currentPrice: number;
  suggestedEntry: number;
  suggestedStopLoss: number;
  gapPct: number;
  volumeRatio: number;
  momentumPct: number;
  atr: number;
  composite: number;
  rationale: string;
};

const ATR_PERIOD = 14;
const MOMENTUM_DAYS = 5;
const VOLUME_BASELINE_DAYS = 30;
const ATR_MULTIPLIER_SL = 1.0;

function trueRange(prev: Candle, curr: Candle): number {
  return Math.max(curr.high - curr.low, Math.abs(curr.high - prev.close), Math.abs(curr.low - prev.close));
}

function atr(candles: Candle[]): number {
  if (candles.length < ATR_PERIOD + 1) return 0;
  const slice = candles.slice(-(ATR_PERIOD + 1));
  let sum = 0;
  for (let i = 1; i < slice.length; i++) sum += trueRange(slice[i - 1], slice[i]);
  return sum / ATR_PERIOD;
}

function avgVolume(candles: Candle[], n: number): number {
  if (candles.length === 0) return 0;
  const slice = candles.slice(-n - 1, -1); // exclude today
  if (slice.length === 0) return 0;
  return slice.reduce((s, c) => s + c.vol, 0) / slice.length;
}

export function scoreSymbol(data: SymbolCandles): Score | null {
  const { candles, symbol, digits } = data;
  if (candles.length < ATR_PERIOD + 2) return null;

  const today = candles[candles.length - 1];
  const yesterday = candles[candles.length - 2];
  const nDaysAgo = candles[Math.max(0, candles.length - 1 - MOMENTUM_DAYS)];

  const gapPct = ((today.open - yesterday.close) / yesterday.close) * 100;
  const momentumPct = ((today.close - nDaysAgo.close) / nDaysAgo.close) * 100;
  const baselineVol = avgVolume(candles, VOLUME_BASELINE_DAYS);
  const volumeRatio = baselineVol > 0 ? today.vol / baselineVol : 0;
  const a = atr(candles);

  // Composite: prefer positive gap with volume confirmation and recent momentum.
  // Penalize when ATR-to-price ratio is extreme (avoid runaways and dead stocks).
  const atrPct = today.close > 0 ? (a / today.close) * 100 : 0;
  const atrPenalty = atrPct > 5 || atrPct < 0.3 ? 0.5 : 1;
  const composite = (gapPct * 0.5 + Math.log2(Math.max(volumeRatio, 0.1)) * 10 + momentumPct * 0.3) * atrPenalty;

  const currentPrice = today.close;
  const suggestedEntry = currentPrice;
  const suggestedStopLoss = Math.max(currentPrice - a * ATR_MULTIPLIER_SL, currentPrice * 0.98);

  const [ticker, exchange] = symbol.split(".");

  return {
    symbol,
    ticker: ticker ?? symbol,
    exchange: exchange ?? "",
    digits,
    currentPrice,
    suggestedEntry,
    suggestedStopLoss,
    gapPct,
    volumeRatio,
    momentumPct,
    atr: a,
    composite,
    rationale: `gap ${gapPct >= 0 ? "+" : ""}${gapPct.toFixed(2)}%, vol ${volumeRatio.toFixed(2)}×, mom ${momentumPct >= 0 ? "+" : ""}${momentumPct.toFixed(2)}%`,
  };
}

export function rankCandidates(data: SymbolCandles[], topN = 5): Score[] {
  return data
    .map(scoreSymbol)
    .filter((s): s is Score => s !== null)
    .sort((a, b) => b.composite - a.composite)
    .slice(0, topN);
}
