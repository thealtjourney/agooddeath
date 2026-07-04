# Backend setup — daily leaderboard

The daily leaderboard talks to Supabase through server-only API routes. The app
runs fine without this configured (the board shows a "warming up" message);
these steps switch it on.

## 1. Create the table + function

In the Supabase dashboard → **SQL Editor** → **New query**, paste the contents
of [`supabase/schema.sql`](./supabase/schema.sql) and run it. This creates the
`daily_runs` table and the `submit_daily_run` function, and locks the table with
row-level security so only the server can write to it.

## 2. Grab two keys

Supabase dashboard → **Project Settings → API**:

- **Project URL** → `SUPABASE_URL`
- **service_role** secret (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

The `service_role` key bypasses row-level security, so it must stay server-side
only. It is **not** prefixed `NEXT_PUBLIC_`, so Next.js will never ship it to the
browser. Never paste it anywhere client-side.

## 3. Add them to Vercel

Vercel project → **Settings → Environment Variables**. Add both for the
Production (and Preview, if you like) environments:

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        (the service_role secret)
```

Redeploy (Vercel does this automatically on the next push, or hit "Redeploy").

## 4. (Optional) run it locally

Create `.env.local` in the project root with the same two lines, then
`npm run dev`. `.env.local` is gitignored, so it won't be committed.

## How it works

- When you finish a **daily** run, the browser POSTs `{ seed, build, name }` to
  `/api/leaderboard/submit`.
- The server **re-runs the deterministic simulation** to compute your true age —
  it never trusts a score sent from the browser. This is the anti-cheat.
- Your best age for the day is stored (one row per anonymous id per seed), and
  the board shows the top 10, your rank, and how much of the parish you outlived.
- Each leaderboard row links to that run's `/run/[seed]` replay.

No login is required; players are identified by an anonymous id kept in their
browser. Accounts and private leagues can build on this later.
