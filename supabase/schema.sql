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
