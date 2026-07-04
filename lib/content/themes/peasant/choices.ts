import type { ChoiceOption, GachaOption } from "../../../engine/types.js";

/**
 * Stat keys used by this theme: health, wealth, standing, suspicion.
 * Event categories: disease, harvest, taxes, justice, war, family, accident,
 * fortune, lord, trade.
 */

export const TRADES: ChoiceOption[] = [
  {
    id: "blacksmith",
    slot: "trade",
    label: "Blacksmith",
    flavour: "Strong arms, valuable skills. Armies notice both.",
    statMods: { health: 2, wealth: 2 },
    weightMods: [{ match: { category: "war" }, multiply: 1.4 }],
  },
  {
    id: "miller",
    slot: "trade",
    label: "Miller",
    flavour: "Rich, and universally resented for it.",
    statMods: { wealth: 4, standing: -2, suspicion: 2 },
    weightMods: [{ match: { category: "justice" }, multiply: 1.3 }],
  },
  {
    id: "swineherd",
    slot: "trade",
    label: "Swineherd",
    flavour: "Low status, but the pigs eat, so you eat.",
    statMods: { health: 2, standing: -2 },
  },
  {
    id: "midwife",
    slot: "trade",
    label: "Midwife",
    flavour: "Respected, feared, and one bad birth from an accusation.",
    statMods: { health: 1, standing: 1, suspicion: 3 },
    weightMods: [{ match: { tag: "accusation" }, multiply: 1.8 }],
  },
  {
    id: "poacher",
    slot: "trade",
    label: "Poacher",
    flavour: "Eats like a lord, lives like a fugitive.",
    statMods: { health: 3, suspicion: 2 },
    weightMods: [{ match: { category: "justice" }, multiply: 1.6 }],
  },
  {
    id: "gravedigger",
    slot: "trade",
    label: "Gravedigger",
    flavour: "Grim, steady, strangely plague-proof.",
    statMods: { health: 1, standing: -1 },
    weightMods: [{ match: { category: "disease" }, multiply: 0.6 }],
  },
  {
    id: "alewife",
    slot: "trade",
    label: "Alewife",
    flavour: "Everyone's friend. The liver keeps the accounts.",
    statMods: { wealth: 2, standing: 3, health: -1 },
  },
  {
    id: "shepherd",
    slot: "trade",
    label: "Shepherd",
    flavour: "Solitary, healthy, gloriously uneventful.",
    statMods: { health: 3 },
    weightMods: [
      { match: { category: "justice" }, multiply: 0.6 },
      { match: { category: "fortune" }, multiply: 0.6 },
    ],
  },
  {
    id: "carpenter",
    slot: "trade",
    label: "Carpenter",
    flavour: "Steady, useful, unremarkable. The honest default.",
    statMods: { health: 1, wealth: 1, standing: 1 },
  },
  {
    id: "fool",
    slot: "trade",
    label: "Village Fool",
    flavour: "Protected by tradition. Untaxable, unemployable.",
    statMods: { wealth: -2, standing: 0 },
    weightMods: [{ match: { category: "justice" }, multiply: 0.4 }],
    setsFlags: ["fool"],
  },
];

export const VILLAGES: ChoiceOption[] = [
  {
    id: "coastal",
    slot: "village",
    label: "Grimwash-on-Sea",
    flavour: "Fresh fish. Fresh Vikings.",
    statMods: { health: 1 },
    weightMods: [{ match: { tag: "raid" }, multiply: 2 }],
  },
  {
    id: "forest",
    slot: "village",
    label: "Nettlewood",
    flavour: "Foraging keeps you fed. Outlaws keep you nervous.",
    statMods: { health: 1 },
    weightMods: [{ match: { category: "harvest" }, multiply: 0.7 }],
  },
  {
    id: "castle",
    slot: "village",
    label: "Little Fawning",
    flavour: "Protected by the castle. Taxed by the castle.",
    weightMods: [
      { match: { category: "war" }, multiply: 0.6 },
      { match: { category: "taxes" }, multiply: 1.6 },
    ],
  },
  {
    id: "fen",
    slot: "village",
    label: "Muckle Sump",
    flavour: "Damp. Very damp. Eel-rich, though.",
    statMods: { health: 1 },
    weightMods: [{ match: { category: "disease" }, multiply: 1.6 }],
  },
  {
    id: "market",
    slot: "village",
    label: "Tuppenny Bridge",
    flavour: "Trade and travellers, and whatever they're carrying.",
    statMods: { wealth: 2 },
    weightMods: [{ match: { category: "disease" }, multiply: 1.3 }],
  },
  {
    id: "upland",
    slot: "village",
    label: "Bleakthorpe",
    flavour: "Nothing ever happens here. Blissfully.",
    weightMods: [{ match: { category: "fortune" }, multiply: 0.7 }],
  },
];

export const LORDS: ChoiceOption[] = [
  {
    id: "pious",
    slot: "lord",
    label: "Pious but Broke",
    flavour: "Prays for you. Also tithes you.",
    weightMods: [
      { match: { category: "taxes" }, multiply: 1.3 },
      { match: { category: "war" }, multiply: 0.6 },
    ],
  },
  {
    id: "cruel",
    slot: "lord",
    label: "Cruel but Competent",
    flavour: "Awful. But the roads are safe.",
    weightMods: [
      { match: { category: "justice" }, multiply: 1.6 },
      { match: { category: "war" }, multiply: 0.5 },
    ],
  },
  {
    id: "crusade",
    slot: "lord",
    label: "Absent on Crusade",
    flavour: "Nobody is driving the manor.",
    statMods: { wealth: 1 },
    weightMods: [{ match: { category: "taxes" }, multiply: 0.6 }],
    setsFlags: ["chaos"],
  },
  {
    id: "child",
    slot: "lord",
    label: "Twelve Years Old",
    flavour: "The regent is stealing everything.",
    weightMods: [{ match: { category: "taxes" }, multiply: 1.8 }],
  },
  {
    id: "dying",
    slot: "lord",
    label: "Ancient and Dying",
    flavour: "A succession crisis is loading.",
    setsFlags: ["successionPending"],
  },
  {
    id: "wealthy",
    slot: "lord",
    label: "Suspiciously Wealthy",
    flavour: "Don't ask where it comes from.",
    statMods: { wealth: 2 },
    weightMods: [{ match: { tag: "downfall" }, multiply: 3 }],
  },
];

export const ITEMS: ChoiceOption[] = [
  { id: "boots", slot: "item", label: "Good Boots", flavour: "For running away.", statMods: { health: 1 }, weightMods: [{ match: { tag: "raid" }, multiply: 0.6 }] },
  { id: "knife", slot: "item", label: "Sharp Knife", flavour: "Persuasive in a corner.", statMods: { health: 1 } },
  { id: "chicken", slot: "item", label: "A Chicken", flavour: "Renewable breakfast.", statMods: { health: 1 } },
  { id: "cloak", slot: "item", label: "Warm Cloak", flavour: "Winter is undefeated, but slowed.", statMods: { health: 1 } },
  {
    id: "horseshoe",
    slot: "item",
    label: "Lucky Horseshoe",
    flavour: "One reroll on one fatal roll of the dice.",
    saves: [{ id: "horseshoe", match: { any: true }, once: true }],
  },
  { id: "bucket", slot: "item", label: "Sturdy Bucket", flavour: "Underrated in a fire.", weightMods: [{ match: { tag: "fire" }, multiply: 0.5 }] },
  { id: "salt", slot: "item", label: "Bag of Salt", flavour: "Beats a famine.", weightMods: [{ match: { category: "harvest" }, multiply: 0.6 }] },
  { id: "dog", slot: "item", label: "Loyal Dog", flavour: "Good boy. Great deterrent.", statMods: { health: 1, standing: 1 } },
];

export const GACHA: GachaOption[] = [
  // Common (60%) — flavour only, the uselessness is the joke
  { id: "turnip", slot: "gacha", rarity: "common", prob: 1, label: "A Turnip", flavour: "It is a turnip." },
  { id: "turnip2", slot: "gacha", rarity: "common", prob: 1, label: "A Slightly Better Turnip", flavour: "Marginally rounder." },
  { id: "spoon", slot: "gacha", rarity: "common", prob: 1, label: "A Wooden Spoon", flavour: "Participation prize of the manor." },
  { id: "candle", slot: "gacha", rarity: "common", prob: 1, label: "Half a Candle", flavour: "The good half." },
  // Uncommon (25%)
  { id: "goose", slot: "gacha", rarity: "uncommon", prob: 1, label: "A Reliable Goose", flavour: "Lays, and judges.", statMods: { health: 1, wealth: 1 } },
  { id: "barrel", slot: "gacha", rarity: "uncommon", prob: 1, label: "A Small Barrel of Ale", flavour: "Liquid standing.", statMods: { standing: 2 } },
  { id: "donkey", slot: "gacha", rarity: "uncommon", prob: 1, label: "A Donkey", flavour: "Stubborn but load-bearing.", statMods: { wealth: 1, health: 1 } },
  // Rare (10%)
  { id: "monk", slot: "gacha", rarity: "rare", prob: 1, label: "A Cousin Who's a Monk", flavour: "Literacy. Upward mobility. Gossip.", statMods: { standing: 2, wealth: 1 }, setsFlags: ["literate"] },
  { id: "longbow", slot: "gacha", rarity: "rare", prob: 1, label: "A Longbow", flavour: "Agincourt-adjacent.", statMods: { health: 1 }, weightMods: [{ match: { category: "war" }, multiply: 0.6 }] },
  { id: "deed", slot: "gacha", rarity: "rare", prob: 1, label: "A Deed to a Strip of Land", flavour: "Written down and everything.", statMods: { wealth: 3 } },
  // Epic (4%)
  { id: "finesword", slot: "gacha", rarity: "epic", prob: 1, label: "A Suspiciously Fine Sword", flavour: "Great in a war. 'Where did you get that.'", statMods: { health: 1, suspicion: 2 }, weightMods: [{ match: { category: "war" }, multiply: 0.5 }] },
  { id: "bezoar", slot: "gacha", rarity: "epic", prob: 1, label: "A Bezoar Stone", flavour: "One poison or plague, cancelled.", saves: [{ id: "bezoar", match: { category: "disease" }, once: true }] },
  { id: "pardon", slot: "gacha", rarity: "epic", prob: 1, label: "A Royal Pardon", flavour: "One justice death, void.", saves: [{ id: "pardon", match: { category: "justice" }, once: true }] },
  // Legendary (1%)
  { id: "indulgence", slot: "gacha", rarity: "legendary", prob: 1, label: "A Papal Indulgence", flavour: "Cancels any one death, once. Historically accurate pay-to-win.", saves: [{ id: "indulgence", match: { any: true }, once: true }] },
];

export const RARITY_TIER_PROB: Record<GachaOption["rarity"], number> = {
  common: 0.6,
  uncommon: 0.25,
  rare: 0.1,
  epic: 0.04,
  legendary: 0.01,
};

export const ALL_CHOICES: ChoiceOption[] = [...TRADES, ...VILLAGES, ...LORDS, ...ITEMS];
