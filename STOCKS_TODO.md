# Stocks module — co dalej

Stan na koniec sesji 2026-05-17. Faza 1+2 dowiezione, nie przetestowane end-to-end na żywym koncie.

## Zrobione

- **Schemat DB** (`supabase/migrations/20260515020000_stocks_sets.sql`): scans → sets → set_items, enumy `stock_set_status`, `stock_set_item_status`. Stary schemat (positions/suggestions/watchlist) drop'owany.
- **UI**: `[Panel] [ProposedSetsView] [ActiveSetsView]` + modale `NewSet` / `BoughtSet` / `SoldSet` / `LossPosition`. Aggregate % equal-weight z realized PnL.
- **Strategia**: 1% rolling, target_pct domyślnie 1.0 (configurable per set).
- **shadcn/ui**: preset radix-lyra (`buFyzGS`), heavy override (`--radius: 0`, zinc, IBM Plex Mono zachowane). Primitive `Button` w `src/components/ui/button.tsx` jeszcze nieużywany — istniejące buttony zostają na className-style.
- **Scanner** (`src/lib/market/`): Yahoo Finance via raw fetch, hardcoded universe ~30 blue chipów EU+US, scoring gap×0.5 + log2(volRatio)×10 + momentum×0.3 z ATR-penalty, SL = entry − 1×ATR. Endpoint POST `/api/stocks/scan` woła Yahoo, ranks top 5, INSERT scan/set/items.

## Nieprzetestowane

- [ ] Migracja `20260515020000_stocks_sets.sql` zaaplikowana w Supabase
- [ ] Pełen flow w UI: skanuj → bought → loss na jednej pozycji → sold na reszcie → wynik w History panelu
- [ ] Yahoo z poziomu produkcji Vercel (lokalnie testowane curl'em — działa)

## Blockery / decyzje techniczne wymagające ruchu

- **XTB xAPI martwe dla retail** (potwierdzone 2026-05-15). Execution zostaje ręczny w xStation; app jest tylko decision-support. Yahoo jako data source w MVP. Jak Yahoo zacznie sprawiać problemy (rate limit, cookie/crumb wymagane dla quote endpointu) — pivot na Finnhub (free 60/min, signup) lub yahoo-finance2 package.

## Faza 3 — Claude rerank

Po skanerze technicznym (top 20) → Claude wybiera top 5 z lepszym uzasadnieniem opartym o newsy + dane.

- [ ] `@anthropic-ai/sdk` zainstalować
- [ ] `ANTHROPIC_API_KEY` w `.env.local` + Vercel env
- [ ] `src/lib/market/rerank.ts`: prompt z system message w cache (reguły skanera, format outputu), dynamiczny content (top 20 z metrykami + opcjonalnie newsy)
- [ ] Modyfikacja `/api/stocks/scan`: zmień `topN` skanera na 20, dorzuć rerank Claude'm, persist top 5 jako items
- [ ] Newsy: poszukać darmowego źródła per-ticker (Finnhub news? GNews? Marketaux?) lub na początek bez newsów, sam reasoning na danych

## Faza 4 — Analytics cron

Wypełnianie pól `hit_1pct_at` / `max_pct_observed` / `min_pct_observed` na items (dla bought ORAZ skipped) + `hit_target_at` na sets. Działa dla niesprzedanych propozycji → daje historię "co by się stało".

- [ ] Endpoint `/api/stocks/track` co fetcha aktualne ceny dla wszystkich open items + skipped/proposed items z ostatnich N dni
- [ ] Vercel Cron co 5-15 min w godzinach sesji (Hobby = max 1/day, Pro = 5min) — może lepiej GitHub Actions cron (free 5min granularity)?
- [ ] Logika: dla każdego symbolu policz pct vs suggested_entry / actual_entry, zaktualizuj max/min observed, ustaw hit_1pct_at jeśli ≥1%
- [ ] Update aggregate_pnl_pct (z unrealized) i hit_target_at na poziomie setu

## Faza 5 — Web Push + okno czasowe

- [ ] VAPID keys + `web-push` package
- [ ] `public/sw.js` service worker
- [ ] Tabela `push_subscriptions` (już w schemacie z Phase 1, ale jest drop'nięta przez nową migrację — **trzeba dorobić ponownie**)
- [ ] Prompt do subskrypcji w panelu Settings
- [ ] Triggery: 09:55 "skanowanie gotowe", on-target-hit "Set #X osiągnął +1%", 16:30 "rozważ sprzedaż przed końcem sesji"
- [ ] Filtr okna 10:00–11:00 w UI (skanuj disabled poza oknem, lub w trybie "preview")

## UI polish backlog

User: "w UI jest sporo do poprawy". Niedoprecyzowane co konkretnie. Podejrzane miejsca do przemyślenia:

- Modale są jeszcze na customowym `<Modal>` (portal), nie na shadcn `Dialog` — przejść by dało lepsze a11y i focus trap
- Buttony na klasycznym className-style. Można zmigrować na shadcn `<Button variant="ghost" size="xs">` (już w `src/components/ui/button.tsx`)
- `NewSetModal` ma sporo state'u — może warto z react-hook-form (jeśli wpadnie do projektu) albo `<form>` server action
- ProposedSetsView / ActiveSetsView mają overlap layoutowy z Calendarem — przy małych ekranach (poniżej ~1200px) ciasno
- "loss" / "sold" / "bought" są tekstowe underline — może shadcn ghost button bardziej oczywisty
- Empty states są generyczne ("brak X") — mogłyby uczyć user'a co dalej (np. "Kliknij skanuj żeby zobaczyć propozycje na dziś")

## Drobiazgi

- `dynamic` import grafik / lazy load itd. nie ruszone
- Tabela `push_subscriptions` w starej migracji zachowana, w nowej wyleciała przy `drop` — przy implementacji Fazy 5 trzeba ją dorzucić w osobnej migracji
- `XTB_LOGIN`/`XTB_PASSWORD` jeśli były ustawione w `.env.local` można usunąć — nieużywane
