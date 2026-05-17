create type stock_position_status as enum (
  'open',
  'tp_hit',
  'sl_hit',
  'closed_eod',
  'closed_manual'
);

-- Tickers user wants the scanner to track
create table stock_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  ticker text not null,
  xtb_symbol text not null,
  exchange text not null,
  name text,
  created_at timestamptz default now(),
  unique (user_id, xtb_symbol)
);

-- Actual positions the user has opened
create table stock_positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  ticker text not null,
  xtb_symbol text not null,
  exchange text not null,
  entry_price numeric(14, 4) not null,
  quantity numeric(14, 4),
  stop_loss numeric(14, 4) not null,
  take_profit numeric(14, 4) not null,
  status stock_position_status not null default 'open',
  exit_price numeric(14, 4),
  notes text,
  suggestion_id uuid,
  opened_at timestamptz default now() not null,
  closed_at timestamptz
);

-- Output of a scan: top picks for a given day
create table stock_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  scan_date date not null,
  ticker text not null,
  xtb_symbol text not null,
  exchange text not null,
  rank integer not null,
  entry_price numeric(14, 4) not null,
  stop_loss numeric(14, 4) not null,
  take_profit numeric(14, 4) not null,
  rationale text,
  gap_pct numeric(8, 4),
  volume_ratio numeric(8, 4),
  atr numeric(14, 4),
  created_at timestamptz default now()
);

-- Suggestion FK after both tables exist
alter table stock_positions
  add constraint stock_positions_suggestion_id_fkey
  foreign key (suggestion_id) references stock_suggestions(id) on delete set null;

-- Web Push subscriptions for end-of-day reminders, TP-hit alerts, etc.
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now(),
  unique (user_id, endpoint)
);

-- RLS
alter table stock_watchlist enable row level security;
alter table stock_positions enable row level security;
alter table stock_suggestions enable row level security;
alter table push_subscriptions enable row level security;

create policy "own watchlist" on stock_watchlist for all using (auth.uid() = user_id);
create policy "own positions" on stock_positions for all using (auth.uid() = user_id);
create policy "own suggestions" on stock_suggestions for all using (auth.uid() = user_id);
create policy "own subscriptions" on push_subscriptions for all using (auth.uid() = user_id);

-- Indexes
create index stock_positions_user_status_idx on stock_positions (user_id, status);
create index stock_positions_opened_at_idx on stock_positions (user_id, opened_at desc);
create index stock_suggestions_user_date_idx on stock_suggestions (user_id, scan_date desc, rank);
create index stock_watchlist_user_idx on stock_watchlist (user_id);
