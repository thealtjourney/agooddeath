/**
 * Theme-agnostic engine contracts.
 *
 * HARD RULE: nothing in /lib/engine may contain theme-specific string literals
 * (no "witchcraft", no "dysentery"). The engine references content by id and
 * tag only. All medieval material lives in /lib/content/themes/peasant.
 */

/** Hidden numeric stats, string-keyed. Content declares which keys exist. */
export type Stats = Record<string, number>;

/** A modifier that scales matching event weights (from a choice or gacha item). */
export interface WeightMod {
  match: { category?: string; tag?: string; id?: string };
  multiply: number;
}

/** A rule that can cancel one fatal event (e.g. a lucky charm, a pardon). */
export interface SaveRule {
  id: string; // used for flavour ("a papal indulgence intervenes")
  match: { category?: string; tag?: string; any?: boolean };
  once: boolean; // consumed after use
}

/** A deliberate build choice (trade, village, lord, item...). */
export interface ChoiceOption {
  id: string;
  slot: string;
  label: string;
  flavour: string;
  statMods?: Partial<Stats>;
  weightMods?: WeightMod[];
  setsFlags?: string[];
  saves?: SaveRule[];
}

/** A gacha item — a ChoiceOption with a rarity tier and draw probability. */
export interface GachaOption extends ChoiceOption {
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  prob: number; // relative probability within its tier's roll
}

/** A condition gate for an event. All present fields must pass. */
export interface Condition {
  flag?: string;
  notFlag?: string;
  statAtLeast?: [string, number];
  statAtMost?: [string, number];
  minAge?: number;
  maxAge?: number;
}

export interface EventDef {
  id: string;
  category: string;
  weight: number;
  tags?: string[];
  conditions?: Condition[];
  statEffects?: Partial<Stats>;
  setsFlags?: string[];
  clearsFlags?: string[];
  /** base fatality chance if this event triggers, before mitigation/saves */
  fatal?: number;
  /** stat that mitigates fatality: higher stat => lower effective fatal chance */
  fatalMitigatedBy?: string;
  textVariants: string[];
  deathText?: string[];
  minAge?: number;
  maxAge?: number;
  oncePerLife?: boolean;
}

/** A named cause of death, referenced by id from fatal events or old age. */
export interface DeathCause {
  id: string;
  category: string;
  text: string; // deadpan cause line for the card
  icon?: string; // woodcut icon key
}

/** Per-year world state fixed by the seed (same for everyone that day). */
export interface WorldYear {
  age: number;
  flags: string[]; // e.g. "plagueYear", "warYear", "goodHarvest"
  categoryMultipliers: Record<string, number>;
}

export interface Build {
  /** slot -> chosen option id, e.g. { trade: "blacksmith", village: "fenland" } */
  choices: Record<string, string>;
  /** the gacha item the player pulled (part of the build for replay) */
  gachaId: string;
}

export interface LifeEvent {
  age: number;
  eventId: string;
  text: string;
  category: string;
  noteworthy: boolean;
}

export interface LifeRecord {
  seed: string;
  build: Build;
  name: string;
  ageAtDeath: number;
  deathCauseId: string;
  deathText: string;
  savedBy?: string; // id of a save rule that fired at least once
  events: LifeEvent[]; // the surfaced, noteworthy ones (5-10 typically)
  flags: string[];
  finalStats: Stats;
  goodDeath: boolean; // reached the win threshold
  stats: RunStats; // for the card's compact strip
}

/** Compact tallies for the share-card stat strip. */
export interface RunStats {
  childrenSurvived: number;
  plaguesEndured: number;
  timesAccused: number;
  yearsLived: number;
}

export type BadgeTier = "common" | "uncommon" | "rare" | "epic" | "legendary";

/**
 * An achievement. `predicate` is a pure test over a completed LifeRecord.
 * `baseRarity` is the DESIGNED global fraction (0..1) — the rarity service uses
 * it as a seed/fallback until real global counts exist. Theme-specific content.
 */
export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  baseRarity: number;
  hidden?: boolean; // mask name/description until earned
  predicate: (life: LifeRecord) => boolean;
}

/** Tuning constants for the mortality curve — see balance.ts. */
export interface BalanceConfig {
  /** probability per year that the event table is consulted at all */
  yearlyEventRate: number;
  /** baseline age hazard: chance of a natural-causes check scaling with age */
  ageHazardBase: number;
  ageHazardGrowth: number;
  /** exponent on age for the hazard curve (2 = quadratic, 3 = sharper) */
  ageHazardExp: number;
  /** how strongly the mitigating stat reduces fatality (0..1 per stat point band) */
  mitigationScale: number;
  /** global multiplier on all event fatality — the master lethality dial */
  fatalScale: number;
}

/** A theme = swappable content pack + config. The engine consumes only this. */
export interface ThemeConfig {
  id: string;
  startAge: number;
  maxAge: number;
  statKeys: string[];
  startStats: Stats;
  slots: { id: string; label: string }[];
  scoreLabel: string;
  scoreUnit: string;
  winThreshold: number;
  winLabel: string;
  balance: BalanceConfig;
  options: ChoiceOption[];
  gacha: GachaOption[];
  events: EventDef[];
  deaths: DeathCause[];
  badges: BadgeDef[];
  /** content-provided, still pure/deterministic (uses the passed Rng) */
  generateName: (rng: import("./rng").Rng, build: Build) => string;
  /** build the per-year world skeleton from the seed rng */
  buildWorld: (rng: import("./rng").Rng, startAge: number, maxAge: number) => WorldYear[];
}
