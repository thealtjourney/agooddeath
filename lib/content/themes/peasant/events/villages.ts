import type { EventDef } from "../../../../engine/types.js";

/** Village-specific events, gated on the auto-flag "village:<id>". Gives each
 *  village its own distinct tales — the last build slot to get unique content. */
export const VILLAGES_EVENTS: EventDef[] = [
  // --- Coastal: Grimwash-on-Sea (fish & Vikings) ---
  { id: "coast_herring_glut", category: "harvest", weight: 5, conditions: [{ flag: "village:coastal" }], tags: ["good"], statEffects: { health: 1, wealth: 1 }, textVariants: ["the herring came in so thick you could walk on the bay. Salted enough to last two winters."] },
  { id: "coast_viking_raid", category: "war", weight: 4, tags: ["raid"], conditions: [{ flag: "village:coastal" }], fatal: 0.28, fatalMitigatedBy: "health", textVariants: ["longships on the horizon at dawn. You took to the dunes and watched the smoke rise behind you."], deathText: ["was cut down on the shingle when the longships came, defending a net."] },
  { id: "coast_wildfowl", category: "harvest", weight: 4, conditions: [{ flag: "village:coastal" }], statEffects: { health: 1 }, textVariants: ["the salt marsh gave up ducks and samphire all summer. You ate like a minor lord."] },
  { id: "coast_wreck", category: "fortune", weight: 3, conditions: [{ flag: "village:coastal" }], statEffects: { wealth: 2, suspicion: 1 }, textVariants: ["a ship broke up on the bar and the sea gave freely. The coroner asked questions; the village answered vaguely."] },
  { id: "coast_pressed", category: "war", weight: 3, conditions: [{ flag: "village:coastal" }], fatal: 0.24, fatalMitigatedBy: "health", textVariants: ["press-ganged onto a cog for the king's fleet, and set ashore a year later, greener and wiser."], deathText: ["was lost overboard from the king's fleet in a storm off the coast."] },
  { id: "coast_storm", category: "accident", weight: 3, conditions: [{ flag: "village:coastal" }], statEffects: { wealth: -1, health: -1 }, textVariants: ["a storm surge came through the cottages. You bailed till dawn and saved the pig, if not the floor."] },

  // --- Forest edge: Nettlewood (foraging & outlaws) ---
  { id: "forest_forage", category: "harvest", weight: 5, conditions: [{ flag: "village:forest" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["mast years for the pigs, mushrooms for the pot, nuts for the winter. The woods provided."] },
  { id: "forest_toll", category: "justice", weight: 4, conditions: [{ flag: "village:forest" }], statEffects: { wealth: -1 }, textVariants: ["outlaws on the road relieved you of a shilling and, oddly, wished you a good day."] },
  { id: "forest_charcoal", category: "trade", weight: 4, conditions: [{ flag: "village:forest" }], statEffects: { wealth: 1 }, textVariants: ["burned charcoal in the deep wood for the smith's forge. Filthy work, fair coin."] },
  { id: "forest_wolves", category: "accident", weight: 3, conditions: [{ flag: "village:forest" }], fatal: 0.2, fatalMitigatedBy: "health", textVariants: ["wolves came close to the cottages in a hard winter. The dog and the fire kept them out."], deathText: ["was taken by wolves on the wood-path in a starving winter."] },
  { id: "forest_join_outlaws", category: "justice", weight: 2, conditions: [{ flag: "village:forest", notFlag: "outlaw", statAtMost: ["wealth", 1] }], setsFlags: ["outlaw"], statEffects: { standing: -1, wealth: 1 }, textVariants: ["hungry and desperate, you took to the greenwood with the other outlaws. It seemed a good idea at the time."] },
  { id: "forest_shelter", category: "fortune", weight: 3, conditions: [{ flag: "village:forest" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["the forest hid you from the tax man, the recruiter, and the plague, all in one good year."] },

  // --- Castle shadow: Little Fawning (protected & taxed) ---
  { id: "castle_protection", category: "war", weight: 4, conditions: [{ flag: "village:castle" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["war rolled past and the castle's shadow kept you safe. Being taxed to death is better than the other kind."] },
  { id: "castle_extra_levy", category: "taxes", weight: 5, conditions: [{ flag: "village:castle" }], statEffects: { wealth: -2 }, textVariants: ["the garrison needed feeding, so the garrison taxed you to feed it. Protection has a price, itemised."] },
  { id: "castle_wall_work", category: "trade", weight: 4, conditions: [{ flag: "village:castle" }], statEffects: { wealth: 1, health: -1 }, textVariants: ["hauled stone for the castle's new curtain wall. Hard days, but the steward paid in actual coin."] },
  { id: "castle_lords_hunt", category: "harvest", weight: 3, conditions: [{ flag: "village:castle" }], statEffects: { wealth: -1 }, textVariants: ["the lord's hunt rode straight through your barley in pursuit of a stag. No apology was offered or expected."] },
  { id: "castle_feast", category: "fortune", weight: 3, conditions: [{ flag: "village:castle" }], tags: ["good"], statEffects: { standing: 1, health: 1 }, textVariants: ["the castle threw open its doors at Christmas and even the villeins ate meat. A rare, greasy joy."] },
  { id: "castle_curfew", category: "justice", weight: 3, conditions: [{ flag: "village:castle" }], statEffects: { standing: -1 }, textVariants: ["caught out after the curfew bell and lectured by a bored watchman for an hour."] },

  // --- Fenland: Muckle Sump (damp & eels) ---
  { id: "fen_eel_harvest", category: "harvest", weight: 5, conditions: [{ flag: "village:fen" }], tags: ["good"], statEffects: { health: 1, wealth: 1 }, textVariants: ["the eel traps ran black and full. Eels paid the rent, eels filled the belly, eels haunted the dreams."] },
  { id: "fen_damp_rot", category: "accident", weight: 4, conditions: [{ flag: "village:fen" }], statEffects: { wealth: -1 }, textVariants: ["everything you owned grew a fine green fur that winter. The fen takes back all it can."] },
  { id: "fen_mists", category: "disease", weight: 4, conditions: [{ flag: "village:fen" }], fatal: 0.18, fatalMitigatedBy: "health", textVariants: ["the marsh fever came up with the autumn mists, and passed, this time."], deathText: ["died of a fever that rose off the fen with the evening mist."] },
  { id: "fen_wildfowling", category: "harvest", weight: 4, conditions: [{ flag: "village:fen" }], statEffects: { health: 1 }, textVariants: ["punted out at dawn and came back with a boat-load of fowl. The fen feeds those who know it."] },
  { id: "fen_drainage_feud", category: "justice", weight: 3, conditions: [{ flag: "village:fen" }], statEffects: { standing: -1, suspicion: 1 }, textVariants: ["a bitter dispute over who might drain which ditch. In the fens, water is a matter of life, death, and litigation."] },
  { id: "fen_sinking", category: "accident", weight: 3, conditions: [{ flag: "village:fen" }], statEffects: { health: -1 }, textVariants: ["your cottage settled a foot into the peat over the years, until the door would only half open."] },

  // --- Crossroads market: Tuppenny Bridge (trade & travellers) ---
  { id: "market_brisk_trade", category: "fortune", weight: 5, conditions: [{ flag: "village:market" }], tags: ["good"], statEffects: { wealth: 2 }, textVariants: ["a good year on the road. Everyone passing through needed something, and you had it, at a price."] },
  { id: "market_imported_fever", category: "disease", weight: 4, tags: ["plague"], conditions: [{ flag: "village:market" }], fatal: 0.3, fatalMitigatedBy: "health", textVariants: ["a merchant brought a fever from the south along with his silks. You survived; he did not."], deathText: ["died of a fever a passing merchant carried in from a foreign port."] },
  { id: "market_fair_day", category: "fortune", weight: 4, conditions: [{ flag: "village:market" }], tags: ["good"], statEffects: { wealth: 1, standing: 1 }, textVariants: ["the summer fair filled the crossroads with jugglers, relic-sellers, and a two-headed calf. A grand day out."] },
  { id: "market_cutpurse", category: "justice", weight: 3, conditions: [{ flag: "village:market" }], statEffects: { wealth: -1 }, textVariants: ["a cutpurse in the fair-day crowd had your money before you'd finished admiring the two-headed calf."] },
  { id: "market_news", category: "fortune", weight: 3, conditions: [{ flag: "village:market" }], statEffects: { standing: 1 }, textVariants: ["travellers brought news from London, France, and the edge of the known world. You were the best-informed peasant for miles."] },
  { id: "market_toll_keeper", category: "trade", weight: 3, conditions: [{ flag: "village:market" }], statEffects: { wealth: 1 }, textVariants: ["kept the bridge toll for the lord a while. A penny a cart adds up, and some of it even reached the lord."] },

  // --- Remote upland: Bleakthorpe (nothing ever happens) ---
  { id: "upland_nothing", category: "fortune", weight: 6, conditions: [{ flag: "village:upland" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["another year in which nothing whatsoever happened. Bliss, of a very quiet kind.", "the great events of the age passed Bleakthorpe by entirely, as they always did, thank God."] },
  { id: "upland_isolation", category: "accident", weight: 4, conditions: [{ flag: "village:upland" }], statEffects: { health: -1 }, textVariants: ["snowed in for six weeks with the sheep and your own thoughts. Both grew a little strange."] },
  { id: "upland_long_walk", category: "taxes", weight: 3, conditions: [{ flag: "village:upland" }], statEffects: { wealth: -1 }, textVariants: ["a full day's walk each way to the nearest market. You bought little and complained about it for a week."] },
  { id: "upland_independence", category: "fortune", weight: 3, conditions: [{ flag: "village:upland" }], tags: ["good"], statEffects: { standing: 1 }, textVariants: ["so far from any lord that nobody quite remembered who you owed. You didn't remind them."] },
  { id: "upland_stranger", category: "fortune", weight: 3, conditions: [{ flag: "village:upland" }], statEffects: { standing: 1 }, textVariants: ["a stranger passed through Bleakthorpe. It was the talk of the village for eleven years."] },
  { id: "upland_view", category: "fortune", weight: 3, conditions: [{ flag: "village:upland" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["from the high pasture you could see three counties and not a single tax collector. A good place to be forgotten."] },
];
