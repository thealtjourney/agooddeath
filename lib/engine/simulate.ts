/**
 * The simulation core. `simulate(build, seed, theme)` is a PURE, DETERMINISTIC
 * function: same inputs => same LifeRecord, always. This is required for the
 * daily seed, shareable /run/[seed] replays, and testing.
 */
import { makeRng, type Rng } from "./rng.js";
import type {
  Build,
  Condition,
  DeathCause,
  EventDef,
  LifeEvent,
  LifeRecord,
  SaveRule,
  Stats,
  ThemeConfig,
  WeightMod,
  WorldYear,
} from "./types.js";

interface ActiveState {
  stats: Stats;
  flags: Set<string>;
  weightMods: WeightMod[];
  saves: SaveRule[];
  usedEvents: Set<string>;
}

function collectOption(
  theme: ThemeConfig,
  optionId: string,
  state: ActiveState,
): void {
  const opt =
    theme.options.find((o) => o.id === optionId) ??
    theme.gacha.find((g) => g.id === optionId);
  if (!opt) return;
  // Every chosen option exposes its identity as a flag, e.g. "trade:blacksmith",
  // so content can gate build-specific events by condition without extra wiring.
  state.flags.add(`${opt.slot}:${opt.id}`);
  if (opt.statMods) {
    for (const [k, v] of Object.entries(opt.statMods)) {
      state.stats[k] = (state.stats[k] ?? 0) + (v ?? 0);
    }
  }
  for (const f of opt.setsFlags ?? []) state.flags.add(f);
  for (const w of opt.weightMods ?? []) state.weightMods.push(w);
  for (const s of opt.saves ?? []) state.saves.push({ ...s });
}

function conditionsPass(
  conds: Condition[] | undefined,
  state: ActiveState,
  age: number,
): boolean {
  if (!conds) return true;
  for (const c of conds) {
    if (c.flag && !state.flags.has(c.flag)) return false;
    if (c.notFlag && state.flags.has(c.notFlag)) return false;
    if (c.minAge !== undefined && age < c.minAge) return false;
    if (c.maxAge !== undefined && age > c.maxAge) return false;
    if (c.statAtLeast && (state.stats[c.statAtLeast[0]] ?? 0) < c.statAtLeast[1])
      return false;
    if (c.statAtMost && (state.stats[c.statAtMost[0]] ?? 0) > c.statAtMost[1])
      return false;
  }
  return true;
}

function effectiveWeight(
  ev: EventDef,
  state: ActiveState,
  world: WorldYear,
): number {
  let w = ev.weight;
  // world multipliers for this year (plague year boosts disease, etc.)
  const worldMult = world.categoryMultipliers[ev.category];
  if (worldMult !== undefined) w *= worldMult;
  // build-choice weight modifiers
  for (const m of state.weightMods) {
    const matches =
      (m.match.category === undefined || m.match.category === ev.category) &&
      (m.match.id === undefined || m.match.id === ev.id) &&
      (m.match.tag === undefined || (ev.tags ?? []).includes(m.match.tag));
    if (matches) w *= m.multiply;
  }
  return Math.max(0, w);
}

/** Find the first save rule that intercepts this fatal event; consume it. */
function trySave(state: ActiveState, ev: EventDef): SaveRule | undefined {
  for (const s of state.saves) {
    if ((s as SaveRule & { spent?: boolean }).spent) continue;
    const m = s.match;
    const matches =
      m.any === true ||
      (m.category !== undefined && m.category === ev.category) ||
      (m.tag !== undefined && (ev.tags ?? []).includes(m.tag));
    if (matches) {
      if (s.once) (s as SaveRule & { spent?: boolean }).spent = true;
      return s;
    }
  }
  return undefined;
}

function applyEffects(ev: EventDef, state: ActiveState): void {
  if (ev.statEffects) {
    for (const [k, v] of Object.entries(ev.statEffects)) {
      state.stats[k] = (state.stats[k] ?? 0) + (v ?? 0);
    }
  }
  for (const f of ev.setsFlags ?? []) state.flags.add(f);
  for (const f of ev.clearsFlags ?? []) state.flags.delete(f);
}

/** Effective fatality after stat mitigation. */
function effectiveFatal(
  ev: EventDef,
  state: ActiveState,
  scale: number,
  fatalScale: number,
): number {
  if (!ev.fatal) return 0;
  let p = ev.fatal * fatalScale;
  if (ev.fatalMitigatedBy) {
    const s = state.stats[ev.fatalMitigatedBy] ?? 0;
    // higher mitigating stat lowers fatality, bounded to [0.1x, 1x] of base
    const factor = Math.max(0.1, 1 - s * scale);
    p *= factor;
  }
  return Math.min(1, Math.max(0, p));
}

function deathById(theme: ThemeConfig, id: string): DeathCause | undefined {
  return theme.deaths.find((d) => d.id === id);
}

export function simulate(
  build: Build,
  seed: string,
  theme: ThemeConfig,
): LifeRecord {
  const rng: Rng = makeRng(`${theme.id}:${seed}`);

  // The world skeleton is drawn FIRST, from the seed only — so the world
  // (plague years, wars, harvests) is identical for everyone on a given day.
  const world = theme.buildWorld(rng, theme.startAge, theme.maxAge);

  // Name is drawn from the same stream after the world (still deterministic).
  const name = theme.generateName(rng, build);

  const state: ActiveState = {
    stats: { ...theme.startStats },
    flags: new Set<string>(),
    weightMods: [],
    saves: [],
    usedEvents: new Set<string>(),
  };

  for (const slotOptId of Object.values(build.choices)) {
    collectOption(theme, slotOptId, state);
  }
  collectOption(theme, build.gachaId, state);

  const surfaced: LifeEvent[] = [];
  const bal = theme.balance;
  let savedBy: string | undefined;
  let childrenSurvived = 0;
  let plaguesEndured = 0;
  let timesAccused = 0;

  let ageAtDeath = theme.maxAge;
  let deathCauseId = "old_age";
  let deathText = "died peacefully in bed, of being extremely old.";

  outer: for (let i = 0; i < world.length; i++) {
    const wy = world[i]!;
    const age = wy.age;

    // 1) Event table consultation for the year.
    if (rng.chance(bal.yearlyEventRate)) {
      const eligible = theme.events.filter((ev) => {
        if (ev.oncePerLife && state.usedEvents.has(ev.id)) return false;
        if (ev.minAge !== undefined && age < ev.minAge) return false;
        if (ev.maxAge !== undefined && age > ev.maxAge) return false;
        if (!conditionsPass(ev.conditions, state, age)) return false;
        return effectiveWeight(ev, state, wy) > 0;
      });

      if (eligible.length > 0) {
        const ev = rng.weighted(eligible, (e) => effectiveWeight(e, state, wy));
        state.usedEvents.add(ev.id);
        applyEffects(ev, state);

        // tally strip stats via tags
        const tags = ev.tags ?? [];
        if (tags.includes("childGained")) childrenSurvived++;
        if (tags.includes("childLost") && childrenSurvived > 0) childrenSurvived--;
        if (ev.category === "disease" && tags.includes("plague")) plaguesEndured++;
        if (tags.includes("accusation")) timesAccused++;

        const fatalP = effectiveFatal(ev, state, bal.mitigationScale, bal.fatalScale);
        let died = fatalP > 0 && rng.chance(fatalP);

        if (died) {
          const save = trySave(state, ev);
          if (save) {
            died = false;
            savedBy = save.id;
          }
        }

        const text = rng.pick(ev.textVariants);
        surfaced.push({
          age,
          eventId: ev.id,
          text,
          category: ev.category,
          noteworthy: true,
        });

        if (died) {
          ageAtDeath = age;
          const dt = ev.deathText && ev.deathText.length > 0
            ? rng.pick(ev.deathText)
            : deathById(theme, ev.category)?.text ?? "died, deadpan.";
          deathText = dt;
          deathCauseId = ev.id;
          break outer;
        }
      }
    }

    // 2) Baseline age hazard — makes old age eventually fatal (A Good Death).
    const health = state.stats["health"] ?? 0;
    // Old age catches everyone: health mitigates the age hazard only gently
    // (floor 0.6), unlike acute events which it mitigates strongly.
    const hazard =
      (bal.ageHazardBase + Math.pow(age, bal.ageHazardExp) * bal.ageHazardGrowth) *
      Math.max(0.6, 1 - health * (bal.mitigationScale * 0.25));
    if (rng.chance(hazard)) {
      // dying of "natural causes" — mitigated deaths pick a generic cause
      const natural = deathById(theme, "old_age");
      ageAtDeath = age;
      deathCauseId = "old_age";
      deathText =
        age >= theme.winThreshold
          ? natural?.text ?? deathText
          : "died of a fever that the physician could not name.";
      break outer;
    }
  }

  const goodDeath = ageAtDeath >= theme.winThreshold;

  return {
    seed,
    build,
    name,
    ageAtDeath,
    deathCauseId,
    deathText,
    savedBy,
    events: surfaced,
    flags: [...state.flags],
    finalStats: state.stats,
    goodDeath,
    stats: {
      childrenSurvived,
      plaguesEndured,
      timesAccused,
      yearsLived: ageAtDeath - theme.startAge,
    },
  };
}
