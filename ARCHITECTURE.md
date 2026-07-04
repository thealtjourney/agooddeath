# Peasant — Architecture & Decisions

Companion to `peasant-build-spec.md`. Covers the two questions Sean flagged
(iOS + "socials") and how the socials scope you chose changes the plan.

## 1. Desktop + iOS — recommended path

A Next.js web app already IS your desktop app (and mobile-browser app). For iOS,
the recommendation is **web-first, wrap with Capacitor later**:

| Option | One codebase? | App Store listing | Cost/effort | Verdict |
|---|---|---|---|---|
| PWA (add to home screen) | yes | no | ~zero | Ship this in the web build anyway |
| **Capacitor wrapper** | **yes (shares the TS engine)** | **yes** | low–medium | **Recommended for the store** |
| React Native rewrite | no (rebuild UI) | yes | high | Not justified |
| Native Swift | no (rebuild everything) | yes | very high | No |

Why Capacitor: the engine (`/lib/engine`) and content are pure TypeScript with
zero DOM dependency, so the exact same simulation runs unchanged inside the iOS
shell. You only add a thin native layer for share sheet, haptics, and push.

**Apple review caveat:** Apple rejects "thin wrappers" (guideline 4.2). A
Capacitor build passes when it uses genuine native capabilities — native share
sheet, haptic feedback on the death card, and (optional) local notifications for
"today's plague seed is live." Budget for those three so review goes smoothly.
Requires a Mac + Xcode + an Apple Developer account ($99/yr).

**Sequence:** ship web (desktop + mobile browser + installable PWA) → prove
virality → add the Capacitor iOS target. 38-0 shipped web first and added its
native app after it took off; same order here.

## 2. "Socials" — you picked share cards + leaderboard + leagues

This is the important change from the spec. The spec's MVP is deliberately
**zero-backend**. Two of your three picks (global leaderboard, friends/leagues)
**cannot** be zero-backend — they need a server, accounts, and anti-cheat.
So the plan splits into two tiers:

### Tier A — Acquisition (no backend, ship first)
Downloadable death-card image, OG/Twitter unfurls, native share sheet,
X/WhatsApp intents. This is the growth engine and it stays on the CDN. Nothing
here needs a login. **This is milestones 1–5 of the spec and should launch
alone.** Don't gate the viral loop behind a server.

### Tier B — Retention (backend, ship second)
Global leaderboard, accounts/profiles, friends & leagues. Recommended stack:

- **Supabase** (Postgres + Auth + Row-Level Security) — generous free tier,
  minimal ops, one dependency covers auth + DB + edge functions.
- Auth: anonymous → optional upgrade (Apple/Google) so the friction-free loop
  survives; you only sign in when you want a league.

### The anti-cheat insight (this is why the architecture matters)

Your sim runs client-side, so a naive leaderboard is trivially forgeable — a
user can POST `{age: 99}`. **But `simulate()` is pure and deterministic.** So the
client never submits a score; it submits only `{ build, seed }`. The **server
re-runs the identical engine** on that build+seed and computes the authoritative
age itself. A forged score is impossible because the server derives it, not the
client. Same code, same result, guaranteed — that's what the determinism tests
protect.

```
client:  play run  ──►  POST { build, seed }  ──►
server:  age = simulate(build, seed, theme).ageAtDeath   // authoritative
         ──► store (user, seed, build, age) ──► leaderboard / league standings
```

This means the engine must be runnable server-side too (it is — pure TS, no DOM).
Leagues become "same daily seed, your build vs. your mates', highest age wins" —
exactly 38-0's Leagues feature, and cheat-proof by construction.

## 3. Build status (this session)

Done and tested:
- `/lib/engine` — seeded PRNG, pure deterministic `simulate()`, balance harness.
  **Theme-agnostic**: no medieval string literals in the engine (hard rule met).
- `/lib/content/themes/peasant` — trades/villages/lords/items + tiered gacha,
  ~24 starter events (incl. the accusation→witch-trial and marriage→children
  chains), death pool, name generator, seed-driven world (plague/war/harvest
  years), parish-record renderer.
- Tests: determinism (same build+seed ⇒ identical life), gacha odds
  (legendary ≈ 1%), and balance targets. **9/9 passing, clean typecheck.**
- Balance tuned to spec: median death ~30–34, 50+ ~15–22%, 70+ ~2–4%.

Next milestones (spec §7): UI (build screen → year-ticker → death card),
share/OG infra (Tier A), daily-seed + localStorage, then content pass to 300+
events, then Tier B backend.

## 4. Naming / domain

Undecided. `.app` fits the 38-0 precedent. Candidates to check live at Cloudflare
Registrar or Porkbun (I couldn't verify availability from the sandbox):
`peasant.app`, `agooddeath.app`, `parishrecord.app`. My lean: **A Good Death** —
it names the win condition, sounds like a title rather than a genre, and the
irony (a game where you mostly die badly) is the hook. `peasant.app` is the safe
literal choice if available.
