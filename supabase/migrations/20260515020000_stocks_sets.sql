-- Drop everything from the first stocks attempt
drop table if exists stock_positions cascade;
drop table if exists stock_suggestions cascade;
drop table if exists stock_watchlist cascade;
drop type if exists stock_position_status;

-- Enums for the new sets-based model
create type stock_set_status as enum ('proposed', 'bought', 'sold', 'skipped');
create type stock_set_item_status as enum ('pending', 'open', 'stopped_out', 'closed_with_set');

-- A scanner run (also: a manually-created "scan" for proposed sets without scanner)
create table stock_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  scan_date date not null,
  triggered_by text not null default 'manual' check (triggered_by in ('manual', 'cron', 'auto')),
  status text not null default 'complete' check (status in ('pending', 'complete', 'failed')),
  notes text,
  created_at timestamptz default now()
);

-- A kit of tickers — proposed, possibly bought as a unit, sold as a unit (per-item stop-loss exception)
create table stock_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  scan_id uuid references stock_scans on delete cascade not null,
  status stock_set_status not null default 'proposed',
  target_pct numeric(8, 4) not null default 1.0,
  bought_at timestamptz,
  sold_at timestamptz,
  aggregate_pnl_pct numeric(8, 4),
  hit_target_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- One ticker inside a set
create table stock_set_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  set_id uuid references stock_sets on delete cascade not null,
  ticker text not null,
  xtb_symbol text not null,
  exchange text not null,
  rank integer not null default 0,
  -- from scanner / LLM / manual entry
  suggested_entry_price numeric(14, 4) not null,
  suggested_stop_loss numeric(14, 4) not null,
  rationale text,
  gap_pct numeric(8, 4),
  volume_ratio numeric(8, 4),
  atr numeric(14, 4),
  -- filled when user clicks "bought"
  actual_entry_price numeric(14, 4),
  quantity numeric(14, 4),
  -- filled when sold (with set) or stopped out (individually)
  actual_exit_price numeric(14, 4),
  exit_reason text check (exit_reason in ('set_close', 'stop_loss')),
  -- analytics filled by periodic check (works even when not bought)
  hit_1pct_at timestamptz,
  max_pct_observed numeric(8, 4),
  min_pct_observed numeric(8, 4),
  status stock_set_item_status not null default 'pending',
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table stock_scans enable row level security;
alter table stock_sets enable row level security;
alter table stock_set_items enable row level security;

create policy "own scans" on stock_scans for all using (auth.uid() = user_id);
create policy "own sets" on stock_sets for all using (auth.uid() = user_id);
create policy "own set items" on stock_set_items for all using (auth.uid() = user_id);

-- Indexes
create index stock_scans_user_date_idx on stock_scans (user_id, scan_date desc);
create index stock_sets_user_status_idx on stock_sets (user_id, status);
create index stock_sets_scan_idx on stock_sets (scan_id);
create index stock_set_items_set_idx on stock_set_items (set_id);
create index stock_set_items_user_status_idx on stock_set_items (user_id, status);
