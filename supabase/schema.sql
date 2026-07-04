-- A Good Death — daily leaderboard schema.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL -> New query).

create table if not exists public.daily_runs (
  seed        text        not null,
  anon_id     text        not null,
  name        text        not null default 'A Nameless Peasant',
  age         int         not null check (age >= 0 and age <= 120),
  build       text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (seed, anon_id)
);

-- Fast top-N by day.
create index if not exists daily_runs_seed_age_idx
  on public.daily_runs (seed, age desc);

-- Lock the table down: only the service role (our API routes) may touch it.
alter table public.daily_runs enable row level security;

-- Atomic submit: keep the player's BEST age for the day, return standings.
create or replace function public.submit_daily_run(
  p_seed  text,
  p_anon  text,
  p_name  text,
  p_age   int,
  p_build text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_best      int;
  v_rank      int;
  v_total     int;
  v_new_best  boolean;
begin
  insert into public.daily_runs (seed, anon_id, name, age, build)
  values (p_seed, p_anon, p_name, p_age, p_build)
  on conflict (seed, anon_id) do update
    set age   = greatest(public.daily_runs.age, excluded.age),
        name  = excluded.name,
        build = case when excluded.age >= public.daily_runs.age
                     then excluded.build else public.daily_runs.build end,
        updated_at = now()
  returning age into v_best;

  v_new_best := (v_best = p_age);

  select count(*) + 1 into v_rank
    from public.daily_runs where seed = p_seed and age > v_best;
  select count(*) into v_total
    from public.daily_runs where seed = p_seed;

  return jsonb_build_object(
    'best_age', v_best,
    'rank',     v_rank,
    'total',    v_total,
    'is_new_best', v_new_best
  );
end;
$$;

-- Read the board for a day in ONE SQL round-trip: top 50, total, and the
-- caller's rank. Computed in SQL (same path as submit) so the counts always
-- agree with what was written.
create or replace function public.get_daily_board(
  p_seed text,
  p_anon text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_top   jsonb;
  v_total int;
  v_mine  int;
  v_rank  int;
begin
  select coalesce(jsonb_agg(t), '[]'::jsonb) into v_top
  from (
    select name, age, build
    from public.daily_runs
    where seed = p_seed
    order by age desc, updated_at asc
    limit 50
  ) t;

  select count(*) into v_total from public.daily_runs where seed = p_seed;

  select age into v_mine
    from public.daily_runs where seed = p_seed and anon_id = p_anon;
  if v_mine is not null then
    select count(*) + 1 into v_rank
      from public.daily_runs where seed = p_seed and age > v_mine;
  end if;

  return jsonb_build_object(
    'top',   v_top,
    'total', v_total,
    'you',   case when v_mine is null then null
                  else jsonb_build_object('rank', v_rank, 'age', v_mine) end
  );
end;
$$;

-- ============================================================
-- Global badge rarity (distinct players who have earned each badge)
-- ============================================================

create table if not exists public.players (
  anon_id    text primary key,
  first_seen timestamptz not null default now()
);

create table if not exists public.badge_holders (
  anon_id   text not null,
  badge_id  text not null,
  earned_at timestamptz not null default now(),
  primary key (anon_id, badge_id)
);

create table if not exists public.badge_counts (
  badge_id text primary key,
  holders  int  not null default 0
);

create table if not exists public.player_count (
  id    int primary key,
  total int not null default 0
);
insert into public.player_count (id, total) values (1, 0)
  on conflict (id) do nothing;

-- Global vanity counter: total deaths (every completed run, daily or freeplay).
create table if not exists public.global_stats (
  id           int primary key,
  total_deaths bigint not null default 0
);
insert into public.global_stats (id, total_deaths) values (1, 0)
  on conflict (id) do nothing;

alter table public.players       enable row level security;
alter table public.badge_holders enable row level security;
alter table public.badge_counts  enable row level security;
alter table public.player_count  enable row level security;
alter table public.global_stats  enable row level security;

-- Report a run's earned badges. Idempotent: each (player, badge) counts once
-- ever, and each player counts once toward the total. Safe to call every run.
create or replace function public.report_badges(
  p_anon   text,
  p_badges text[]
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  b text;
begin
  -- one completed run = one death, counted here (fires once per run)
  update public.global_stats set total_deaths = total_deaths + 1 where id = 1;

  insert into public.players (anon_id) values (p_anon)
    on conflict (anon_id) do nothing;
  if found then
    update public.player_count set total = total + 1 where id = 1;
  end if;

  foreach b in array p_badges loop
    insert into public.badge_holders (anon_id, badge_id) values (p_anon, b)
      on conflict (anon_id, badge_id) do nothing;
    if found then
      insert into public.badge_counts (badge_id, holders) values (b, 1)
        on conflict (badge_id) do update
          set holders = public.badge_counts.holders + 1;
    end if;
  end loop;
end;
$$;

-- Read functions (security definer so they bypass RLS regardless of API role).
create or replace function public.get_global_stats()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'deaths',  coalesce((select total_deaths from public.global_stats where id = 1), 0),
    'players', coalesce((select total from public.player_count where id = 1), 0)
  );
$$;

create or replace function public.get_badge_counts()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'total',   coalesce((select total from public.player_count where id = 1), 0),
    'holders', coalesce((select jsonb_object_agg(badge_id, holders) from public.badge_counts), '{}'::jsonb)
  );
$$;
