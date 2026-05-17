export type SessionPhase = "pre_market" | "buy_window" | "session" | "post_session" | "weekend";

const BUY_WINDOW_START = { h: 10, m: 0 };
const BUY_WINDOW_END = { h: 11, m: 0 };
const SESSION_END = { h: 16, m: 50 };

function warsawNow(now: Date = new Date()): { wd: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wdMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
  return {
    wd: wdMap[get("weekday")] ?? 0,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

export function sessionPhase(now: Date = new Date()): SessionPhase {
  const { wd, hour, minute } = warsawNow(now);
  if (wd === 0 || wd === 6) return "weekend";
  const mins = hour * 60 + minute;
  const buyStart = BUY_WINDOW_START.h * 60 + BUY_WINDOW_START.m;
  const buyEnd = BUY_WINDOW_END.h * 60 + BUY_WINDOW_END.m;
  const sessionEnd = SESSION_END.h * 60 + SESSION_END.m;
  if (mins < buyStart) return "pre_market";
  if (mins < buyEnd) return "buy_window";
  if (mins < sessionEnd) return "session";
  return "post_session";
}

export function phaseLabel(p: SessionPhase): string {
  switch (p) {
    case "pre_market":
      return "pre-market";
    case "buy_window":
      return "okno zakupowe";
    case "session":
      return "sesja";
    case "post_session":
      return "po sesji";
    case "weekend":
      return "weekend";
  }
}

export function formatPrice(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export function formatPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pl-PL", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseXtbSymbol(raw: string): { ticker: string; exchange: string } | null {
  const m = raw.trim().toUpperCase().match(/^([A-Z0-9]+)\.([A-Z]+)(_\d+)?$/);
  if (!m) return null;
  return { ticker: m[1], exchange: m[2] };
}
