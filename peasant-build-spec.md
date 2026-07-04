# PEASANT — Build Specification

**Working title:** Peasant (alternatives: A Good Death, Ye Olde Survival, Parish Record)
**One-liner:** Pick your trade, village, lord, and one lucky item — then find out how long you survive medieval England. Score: age at death.
**Model inspiration:** 38-0.app — a free, zero-friction browser toy with one legible score, a highly shareable result card, daily-seed comparability, and ad/sponsorship monetization.

---

## 1. Product Vision

A free, mobile-first, single-page browser game. The entire loop takes under 90 seconds:

1. Build a peasant (4 choices + 1 random draw) — ~45 seconds
2. Watch the simulation play out year by year — ~20 seconds
3. Get a death card (the share asset) — instant
4. Share it or run it again

There are no accounts, no saves, no backend state (beyond optional lightweight leaderboard later). The **share card is the marketing department** — every design decision should serve making that card funny, beautiful, and screenshot-worthy.

**Tone guardrail (non-negotiable):** Horrible Histories / Monty Python register. Death, disease, absurd feudal justice, bad lords, dysentery — all fair game, played deadpan. NO sexual violence, no content targeting real groups, nothing genuinely grim. Comedy at the expense of a fictional character in a distant past, never at the player or any real-world group.

**Why this theme (strategic rationale):** The relevant peer set is viral browser toys (38-0, Wordle), not console bestsellers — so theme is chosen for identity-performance + legible-score + funny-failure, not chart appeal. Medieval Peasant is structurally a **run-based permadeath roguelike** (the dominant indie format of the era — Balatro, Vampire Survivors, Hades) and leans on **death-as-content** (culturally peaking post-Elden Ring). Its edge over the obvious alternative (dark-comic fantasy) is a *distinctive* rather than *crowded* aesthetic — a blackletter parish register is instantly recognisable in a feed — plus a unique deadpan-British comedy voice, zero IP risk, and underserved history-comedy distribution channels (podcasts, teachers, medieval meme accounts). It is the launch skin; see §9 for the theme roadmap.

---

## 2. Core Game Loop

### 2.1 Build Screen

Four picks plus one gacha pull. Every option needs a one-line flavour description and hidden stat modifiers. Choices must feel like trade-offs, not obvious best picks.

**Pick 1 — Trade** (choose 1 of ~10)

| Trade | Flavour | Mechanical identity |
|---|---|---|
| Blacksmith | Strong arms, valuable skills | +health, +income, conscription risk (armies want smiths) |
| Miller | Rich but universally resented | ++income, +social hostility (accusation risk) |
| Swineherd | Low status, reliable calories | +nutrition, -status |
| Midwife | Respected and feared | +medical (self/family survival), ++witchcraft accusation risk |
| Poacher | Eats like a lord, lives like a fugitive | ++nutrition, ++execution risk on bad rolls |
| Gravedigger | Grim, steady work | +plague resistance (exposure immunity logic), -marriage prospects |
| Alewife | Everyone's friend | +social standing, +income, liver events |
| Shepherd | Solitary, healthy, boring | +health, fewer social events (both good and bad) |
| Carpenter | Steady, useful, unremarkable | Balanced baseline (the "default" pick) |
| Village Fool | Protected by tradition | Immune to some justice events, -income, unique event set |

**Pick 2 — Village** (choose 1 of ~6)

| Village | Flavour | Mechanical identity |
|---|---|---|
| Coastal (e.g. Grimwash-on-Sea) | Fresh fish, fresh Vikings | +nutrition, raid events enabled |
| Forest edge (e.g. Nettlewood) | Foraging and outlaws | +food resilience in famine, outlaw events |
| Castle shadow (e.g. Little Fawning) | Protected and taxed | -war risk, ++tax events |
| Fenland (e.g. Muckle Sump) | Damp. Very damp. | ++disease risk, +eel-based nutrition |
| Crossroads market (e.g. Tuppenny Bridge) | Trade and travellers | +income, +imported disease risk |
| Remote upland (e.g. Bleakthorpe) | Nothing ever happens | Fewer events overall (low variance run) |

Village names should be procedurally flavoured or drawn from a pool of ~20 plausible-silly English names (real precedent: Little Snoring, Nether Wallop, Great Fryup).

**Pick 3 — Lord** (choose 1 of ~6). This is the biggest personality slot; the lord drives the tax/war/justice event weightings.

| Lord | Flavour | Mechanical identity |
|---|---|---|
| Pious but broke | Prays for you, taxes you | +tithe events, -war, church favour possible |
| Cruel but competent | Awful, but the roads are safe | +justice severity, -raid/famine risk |
| Absent on Crusade | Nobody's driving | Random governance events, low taxes, chaos variance |
| Twelve years old | The regent is stealing everything | ++tax, unpredictable |
| Ancient and dying | Succession crisis pending | Mid-run "new lord" event guaranteed (re-rolls lord traits) |
| Suspiciously wealthy | Don't ask questions | +income trickle-down, rare catastrophic downfall event |

**Pick 4 — Practical item** (choose 1 of ~8): good boots (+travel/escape events), a sharp knife (+defence rolls), a chicken (renewable nutrition), a warm cloak (+winter survival), a lucky horseshoe (+1 reroll on one fatal event), a sturdy bucket (+well/fire events), a bag of salt (food preservation, famine resistance), a loyal dog (+defence, +companionship flavour lines).

**Gacha pull — one random item by rarity tier** (the dopamine moment; animate this):

- **Common (60%):** a turnip, a second slightly better turnip, a wooden spoon, half a candle — deliberately useless, flavour-only, and the uselessness is the joke
- **Uncommon (25%):** goose that lays reliably, small barrel of ale, a donkey — modest real modifiers
- **Rare (10%):** a cousin who's a monk (literacy → unlocks clerk events, upward mobility), a longbow (Agincourt-adjacent events), a written deed to a strip of land (+income)
- **Epic (4%):** a suspiciously fine sword (great in war events, "where did you get that" justice risk), a bezoar stone (one poison/disease save), a royal pardon (one justice-death cancellation)
- **Legendary (1%):** a papal indulgence — **cancels any one death, once** (historically accurate pay-to-win; lean into this joke in the flavour text)

### 2.2 Simulation

- Peasant starts at **age 12**. Simulate year by year until death.
- Each year: roll against weighted event tables (see §3). Most years produce nothing noteworthy; 5–10 events per lifetime surface in the final story.
- Internal hidden stats (never shown as numbers to the player — this is a toy, not an RPG): `health`, `wealth`, `standing` (social), `suspicion` (accusation risk), plus flags (married, children[], literate, veteran, etc.).
- Death occurs when a fatal event lands and isn't cancelled by an item/save. Baseline mortality curve should make **median death ≈ age 31–35**, age 50+ a genuinely good run (~15% of runs), and **age 70+ rare (~1–2%)** — the "perfect season" equivalent.
- **"A Good Death":** dying peacefully in bed of old age (70+) is the win condition and gets a special gold/illuminated card variant.
- Presentation: brief animated year-ticker (age counting up, notable events flashing past) for ~15–20 seconds of tension, then the death card. Include a "skip" tap.

### 2.3 Story Output (the parish record)

The final narrative reads like a parish record / chronicle. Template-driven, NOT LLM-generated (zero marginal cost, zero latency, fully controlled tone). Example target output:

> **The Parish Record of Wat the Gravedigger, of Muckle Sump**
> Age 14: survived the sweating sickness. The pig did not.
> Age 19: married Agnes. The dowry was a different pig.
> Age 23: accused of witchcraft. Cleared, but the vibes lingered.
> Age 27: your lord departed on Crusade and pawned the village to a Genoese banker.
> Age 31: died of dysentery, three days before the harvest festival.
> *Survived by Agnes, four children, and the pig.*

**Signature elements every card must include:**
- Name (procedurally generated: medieval first name + trade/village epithet)
- Final line always begins **"Survived by…"** (the recurring epitaph signature — running gag potential: "Survived by no one. Even the pig left.")
- Cause of death, stated deadpan
- **Score: age at death**, large and legible

### 2.4 The Share Card (the whole marketing strategy)

- Rendered as a downloadable/shareable image (canvas or SVG→PNG client-side; also an OG image via Vercel OG for link unfurls)
- **Aesthetic:** illuminated manuscript / parish register — parchment texture, blackletter display type (readable body type underneath), red-ink capitals, and a **woodcut-style icon of the cause of death** (a man falling off a hay cart is funnier than any sentence; commission or generate ~30 woodcut icons mapped to death categories)
- Card variants: standard (parchment), plague-year (black border), A Good Death (gold/illuminated)
- Compact stat strip: Age at Death · Children Survived · Plagues Endured · Times Accused of Witchcraft
- Share targets: native share sheet, copy-image, X/WhatsApp intents. Card must include the URL and the daily-seed date.

---

## 3. Event System (the real product)

**This is a content project wearing a code project's clothes.** The engine is simple; the writing carries everything. Target **300+ event lines at launch** so a player's third run doesn't feel samey.

### 3.1 Architecture

- Events live as **data (JSON/TS files), not code** — categories, weights, condition tags, outcome modifiers, and 2–4 text variants per event
- Event categories: `disease` (sweating sickness, ague, flux/dysentery, plague), `harvest/famine`, `taxes/tithes`, `justice` (accusations, trials, ordeals, the stocks), `war/conscription/raids`, `family` (marriage, births, deaths, inheritance disputes), `weather/accident` (hay carts, wells, kicked by donkey, struck by lightning during blasphemy), `fortune` (rare good events: found a coin, lord's favour, miracle attributed to you), `lord` (driven by lord pick), `trade-specific` (each trade gets 5–10 unique events — this is what makes builds feel different)
- Each event: `{ id, category, weight, conditions[], statEffects, fatal?: chance, textVariants[], deathText? }`
- Weightings modified by build choices (see mechanical identities above) and by era/seed flags (plague year multiplies disease weights 4–5x)
- **Chained events:** some events set flags that unlock later events (accused → suspicion+ → witch trial; married → children → inheritance dispute). 10–15 chains at launch give runs narrative shape.

### 3.2 Fatality design

- Every fatal event has a save chance modified by stats/items; indulgence/pardon/bezoar/horseshoe items intercept specific death types
- Death causes must be **specific and funny in the deadpan register**: not "died of illness" but "died of the flux, having ignored the physician's advice to be bled, which was also wrong"
- Maintain a death-cause pool of 60+ at launch; the death line is the most-screenshotted sentence in the product

### 3.3 Daily seed

- **Seeded PRNG** (e.g. mulberry32 / xoshiro seeded from date string). Same date = same year-theme, same event schedule skeleton, same gacha pool odds for everyone, worldwide
- Player choices still matter: the seed fixes the world (which years are plague years, whether war breaks out, harvest quality), the build determines how you fare in it
- Header shows the day's theme: **"This day in 1348. It is a plague year. Good luck."** — plague-year days are community events for free
- Freeplay mode (random seed) available after completing the daily run
- Result card shows daily date so screenshots are comparable ("Day of 3 July 1327 — I made 44, what did you get?")

---

## 4. Technical Specification

- **Stack:** Next.js (App Router) on Vercel, TypeScript, Tailwind. Static/client-rendered game; no database for MVP. This matches an existing Claude Code → GitHub → Vercel pipeline.
- **State:** all client-side. localStorage for: personal best age, runs played, daily-completed flag, stats history. No accounts.
- **Share/OG images:** `@vercel/og` for link-unfurl cards keyed by querystring (age, name, death cause, seed date); client-side canvas export for the downloadable image.
- **PRNG:** small seeded RNG util; all randomness must flow through it (testability + daily seed integrity). No `Math.random()` anywhere in game logic.
- **Performance:** the whole game should be interactive in <2s on a mid-range phone. No heavy frameworks, no LLM calls, no per-run server cost. Must survive a Reddit/X front-page traffic spike on Vercel's edge/CDN with zero backend scaling concerns — this is a core architectural requirement, not an optimisation.
- **Analytics:** Plausible or Vercel Analytics (privacy-friendly, no cookie banner needed). Track: runs started, runs completed, shares clicked, gacha tier distribution, age-at-death distribution (for balance tuning).
- **SEO/meta:** proper OG/Twitter cards; the unfurl IS the ad.
- **Accessibility:** blackletter for display only; body text in a readable serif. Respect `prefers-reduced-motion` for the year-ticker.

### Suggested repo structure

```
/app                    — Next.js routes (/, /daily, /run/[seed], /api/og)
/lib/engine             — simulation core (pure functions, fully unit-testable)
  rng.ts                — seeded PRNG
  simulate.ts           — year loop, event resolution, death handling
  balance.ts            — mortality curve tuning constants
/lib/content            — THE PRODUCT (theme-agnostic loader + per-theme packs)
  themes.ts             — ThemeConfig registry, active-theme resolution
  themes/peasant/       — launch skin (all medieval material lives here)
    choices.ts          — trades, villages, lords, items (choice-slot data)
    events/*.ts         — event tables by category
    deaths.ts           — death cause pool
    names.ts            — peasant name generator
    theme.config.ts     — labels, score unit, win condition, card tokens
  themes/_template/     — empty scaffold for adding skin 2 (fantasy, Roman…)
/components             — BuildScreen, YearTicker, DeathCard, ShareBar
/tests                  — engine determinism tests, balance simulations
```

### Engine requirements

- `simulate(build, seed) → LifeRecord` must be a **pure, deterministic function** — same inputs, same life, always (needed for daily seed, shareable replays via `/run/[seed]`, and testing)
- Include a balance-test script that runs 100k simulated lives per build combo and asserts the mortality distribution (median ~31–35, P(70+) ≈ 1–2%, no build with median >45 or <22)
- **The engine must be theme-agnostic and the content must be a swappable pack (hard requirement, not a nice-to-have).** The simulation core (`/lib/engine`) knows nothing about peasants specifically — it operates on abstract concepts: a **build** (N choice-slots + 1 tiered gacha slot), **hidden stats**, **weighted event tables**, **flags/chains**, and **fatality resolution**. All medieval-specific material lives in `/lib/content/themes/peasant/`. A second theme = a new content folder + a theme config, with zero changes to the engine. This decoupling is required from day one because it is far cheaper to enforce upfront than to retrofit, and it is what makes the roadmap in §9 a low-risk second swing rather than a rewrite. Concretely: no string literals like "witchcraft" or "dysentery" anywhere under `/lib/engine`; the engine references content by id and tag only.
- A `ThemeConfig` object defines per-theme: the choice-slot schema (labels: Trade/Village/Lord/Item vs. Class/Origin/Patron/Relic etc.), the score label and unit ("age at death" vs. "dungeon depth"), the win condition ("A Good Death" at 70+ vs. theme equivalent), the card aesthetic tokens (parchment/blackletter vs. theme skin), and the death-cause pool reference.

---

## 5. Monetization (mirror the 38-0 playbook)

1. **Free, no paywall, no accounts** — friction kills virality
2. **AdSense from day one** — account verified and tag present pre-launch even if ads start disabled; one unobtrusive unit below the death card (never interrupting the loop)
3. **Sponsorship-ready:** build a `/partners` page template (traffic stats auto-populated) to activate the moment there's a spike; sponsorable surfaces = share-card footer branding, sponsored gacha item ("The Greggs Pasty of Vitality"), title sponsorship. The ironic-sponsor angle is itself PR-able.
4. **Later (not MVP):** iOS/Android wrapper, merch (the woodcut death icons are a t-shirt line), themed content packs

**Legal posture:** everything fictional — no real people, no licensed IP, no real institutions beyond generic historical ones (the Church, the Crown as historical concepts are fine). This removes 38-0's biggest risk entirely.

---

## 6. Launch & Distribution

- **Channels:** history-meme accounts and history Twitter/X, Reddit (r/InternetIsBeautiful, r/WebGames, history subs), The Rest Is History-adjacent podcast audiences, history teachers (slow-burn classroom channel)
- **Launch hook:** launch on a plague-year seed. "Everyone dies today. See how far you get."
- **Built-in loops:** daily seed (return visits), personal best (self-competition), "Survived by…" running gag (recognition), death-card screenshots (acquisition)

---

## 7. Build Order (suggested milestones for Claude Code)

1. **Engine core** — seeded RNG, pure `simulate()`, minimal event set (~30 events), determinism + balance tests passing
2. **Content pass 1** — full build-screen options (trades/villages/lords/items), 150 events, 40 death causes, name generator, parish-record renderer
3. **UI** — build screen, year-ticker animation, death card, mobile-first, parchment/woodcut aesthetic (consult frontend-design guidance; avoid generic-template look — the aesthetic is a differentiator)
4. **Share infrastructure** — OG image route, client image export, share bar, `/run/[seed]` replay links
5. **Daily seed** — date-seeded world, daily header, localStorage streak/best tracking
6. **Content pass 2** — to 300+ events, 60+ deaths, 10–15 event chains, plague-year seed logic, A Good Death gold card
7. **Launch prep** — analytics, AdSense tag, /partners template, OG polish, balance tuning from 100k-run simulations

**MVP = milestones 1–5.** A weekend of engine and UI; the long pole is writing. Content passes can continue post-launch — shipping new events weekly is also a retention/community feature ("new deaths added").

---

## 8. Open Decisions (flag these before/during build)

- Final name and domain (check availability: peasant.app / agooddeath.app / parishrecord.app etc.)
- Whether the year-ticker shows events live or reveals all at the death card (recommend live — tension is the fun)
- Woodcut icon sourcing: commissioned set vs. generated vs. adapted public-domain woodcuts (genuine public-domain medieval woodcuts exist and would be both free and authentic — verify licensing per source)
- Leaderboard: recommend NO global leaderboard at MVP (requires backend + anti-cheat since the sim is client-side); personal best + share comparisons deliver the same social value at zero cost

---

## 9. Theme Roadmap (build the content layer decoupled from day one)

The engine is theme-agnostic (see §4 engine requirements). Peasant ships first because its aesthetic and comedy voice are the *most differentiated* — the right way to spend the first swing. Additional skins are content packs, not rewrites, so hold them in pocket and deploy based on what the launch teaches. **Do not build skins 2–3 now** — just ensure milestone 1's engine and milestone 2's content structure make them a folder-drop later.

**Skin 1 — Medieval Peasant (LAUNCH).** Everything above. Distinctive parish-register aesthetic, deadpan-British voice, zero IP risk, history-channel distribution. Score: age at death.

**Skin 2 — Dark-Comic Fantasy Dungeon-Delver (strongest rival; hold as second swing).**
- *Why:* richer identity performance (class/race self-signalling), wilder and more visual death causes, rides the Elden Ring / Baldur's Gate 3 wave, larger addressable audience than history-Twitter.
- *Trade-off vs. peasant:* crowded aesthetic (every itch.io toy is fantasy — the share card has to fight harder to stand out) and a comedy register that trends earnest, so the writing must work harder to stay funny.
- *Slot mapping:* Trade→Class (rogue, barbarian, hedge wizard…), Village→Origin, Lord→Patron/Guild, Item→Relic, gacha→cursed loot table. Score: **dungeon depth reached** (or gold banked). Win condition: clearing the final floor / "retiring rich."
- *Death pool:* mimic, owlbear, own fireball, gelatinous cube, trap you disarmed wrong. Card aesthetic: illuminated bestiary / tavern ledger.
- *Deploy trigger:* peasant demonstrates the engine travels; fantasy becomes a low-risk shot at a bigger tent.

**Skin 3 — Roman (strong third).**
- *Why:* the "how often do you think about the Roman Empire" meme is free marketing; historical-strategy audience; assassination as the funny death is native to the setting.
- *Two framings to pick from:* **Emperor** (score: years of reign; death: stabbed / poisoned / praetorian coup / "declared a god, then a corpse") or **Legionary/citizen** (score: age at death, closer to peasant's shape). Emperor has the sharper hook.
- *Slot mapping:* Class→station (senator, general, freedman…), Village→province, Lord→faction/patron, gacha→omens and imperial favours. Card aesthetic: carved stone / SPQR tablet.

**Reusable across all skins (build once, in the engine/shared layer):** seeded daily-world logic, year/step ticker, share-card renderer (skinned via theme tokens), OG image route, localStorage best/streak, analytics events, AdSense slot, /partners template.

**Rule of thumb:** one engine, many costumes. Launch the most distinctive costume first; let virality data choose which costume gets the next investment. If peasant travels you have a proven engine and a bigger-audience follow-up ready; if it doesn't, you spent your first swing on the freshest option rather than the most crowded — the correct order to fail in.
