import type { EventDef } from "../../../../engine/types.js";

/** Trade-specific events, gated on the auto-flag "trade:<id>". This is what
 *  makes builds feel different (spec §3: each trade gets 5-10 unique events). */
export const TRADES_EVENTS: EventDef[] = [
  // --- Blacksmith ---
  { id: "smith_lords_commission", category: "trade", weight: 5, conditions: [{ flag: "trade:blacksmith" }], tags: ["good"], statEffects: { wealth: 2 }, textVariants: ["shod the lord's horses and were paid, for once, in coin."] },
  { id: "smith_famous_blade", category: "trade", weight: 3, conditions: [{ flag: "trade:blacksmith" }], statEffects: { standing: 2 }, textVariants: ["forged a blade good enough that men rode from two villages to buy one."] },
  { id: "smith_burn", category: "trade", weight: 4, conditions: [{ flag: "trade:blacksmith" }], statEffects: { health: -1 }, textVariants: ["a spark from the forge left a scar you'd show off for years."] },
  { id: "smith_broken_anvil", category: "trade", weight: 3, conditions: [{ flag: "trade:blacksmith" }], statEffects: { wealth: -1 }, textVariants: ["the anvil cracked. A blacksmith without an anvil is just a strong man in an apron."] },
  { id: "smith_pressed_for_arms", category: "trade", weight: 3, conditions: [{ flag: "trade:blacksmith" }], fatal: 0.2, fatalMitigatedBy: "health", textVariants: ["the army pressed you to make arrowheads at the front. You came back deaf in one ear."], deathText: ["died at a siege, hammering the smith's forge when the wall came down."] },

  // --- Miller (resentment chain) ---
  { id: "miller_toll_dispute", category: "trade", weight: 5, conditions: [{ flag: "trade:miller", notFlag: "millResent" }], setsFlags: ["millResent"], tags: ["accusation"], statEffects: { suspicion: 2, standing: -1 }, textVariants: ["the village swore you skimmed their flour. You swore you didn't. Only one of you was believed."] },
  { id: "miller_good_grinding", category: "trade", weight: 4, conditions: [{ flag: "trade:miller" }], tags: ["good"], statEffects: { wealth: 2 }, textVariants: ["a fine dry year. The mill turned, the tolls came in, the resentment compounded."] },
  { id: "mob_at_the_mill", category: "trade", weight: 4, conditions: [{ flag: "millResent", statAtLeast: ["suspicion", 4] }], fatal: 0.3, fatalMitigatedBy: "standing", textVariants: ["a mob came for the mill with torches, thought better of it, and settled for breaking your gate."], deathText: ["was dragged from the mill by a mob who had run out of patience and grain."] },
  { id: "miller_rebuilds", category: "trade", weight: 3, conditions: [{ flag: "trade:miller", minAge: 30 }], statEffects: { wealth: -2 }, textVariants: ["the mill-wheel rotted through and rebuilding it cost a small fortune, which you had."] },
  { id: "miller_buys_favour", category: "trade", weight: 3, conditions: [{ flag: "trade:miller" }], statEffects: { standing: 1, wealth: -1 }, textVariants: ["bought a stained-glass saint for the church. The village hated you slightly less."] },

  // --- Swineherd ---
  { id: "swine_pannage", category: "trade", weight: 5, conditions: [{ flag: "trade:swineherd" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["drove the pigs into the woods for pannage. They fattened; so, quietly, did you."] },
  { id: "swine_boar", category: "trade", weight: 3, conditions: [{ flag: "trade:swineherd" }], fatal: 0.18, fatalMitigatedBy: "health", textVariants: ["a wild boar took issue with the herd. You took to a tree."], deathText: ["was killed by a wild boar while defending a pig that promptly ran off."] },
  { id: "swine_prize_hog", category: "trade", weight: 3, conditions: [{ flag: "trade:swineherd" }], statEffects: { wealth: 1, standing: 1 }, textVariants: ["raised a hog so vast the lord asked its name. It was Geoffrey."] },
  { id: "swine_fever", category: "trade", weight: 3, conditions: [{ flag: "trade:swineherd" }], statEffects: { wealth: -2 }, textVariants: ["swine fever thinned the herd overnight. A poor season to count pigs."] },
  { id: "swine_low_regard", category: "trade", weight: 3, conditions: [{ flag: "trade:swineherd" }], statEffects: { health: 1, standing: -1 }, textVariants: ["nobody invites the swineherd to feasts. Nobody bothers the swineherd, either."] },

  // --- Midwife ---
  { id: "midwife_saved_lords_child", category: "trade", weight: 4, conditions: [{ flag: "trade:midwife" }], tags: ["good"], statEffects: { standing: 2, wealth: 1 }, textVariants: ["brought the lord's heir safely into the world. Favour, for a while, was yours."] },
  { id: "midwife_blamed", category: "trade", weight: 4, conditions: [{ flag: "trade:midwife", notFlag: "onTrial" }], tags: ["accusation"], statEffects: { suspicion: 3 }, setsFlags: ["onTrial"], textVariants: ["a birth went wrong, as births do, and the whispering started before the grave was dug."] },
  { id: "midwife_herb_lore", category: "trade", weight: 4, conditions: [{ flag: "trade:midwife" }], statEffects: { health: 1 }, textVariants: ["your knowledge of herbs kept the family hale through a bad winter."] },
  { id: "midwife_night_call", category: "trade", weight: 4, conditions: [{ flag: "trade:midwife" }], statEffects: { health: -1, wealth: 1 }, textVariants: ["out again at midnight in the rain. The baby came; you caught a chill."] },
  { id: "midwife_respected", category: "trade", weight: 3, conditions: [{ flag: "trade:midwife" }], statEffects: { standing: 1 }, textVariants: ["every woman in the parish owed you, and quietly, that is power."] },

  // --- Poacher ---
  { id: "poacher_venison", category: "trade", weight: 5, conditions: [{ flag: "trade:poacher" }], statEffects: { health: 1, suspicion: 1 }, textVariants: ["ate venison by firelight like a lord, and slept like a fugitive."] },
  { id: "poacher_forester", category: "trade", weight: 4, conditions: [{ flag: "trade:poacher" }], fatal: 0.22, fatalMitigatedBy: "health", statEffects: { suspicion: 1 }, textVariants: ["the forester's men gave chase. You knew the woods better; barely."], deathText: ["was caught in the forester's man-trap and did not last the night."] },
  { id: "poacher_sold_to_cook", category: "trade", weight: 3, conditions: [{ flag: "trade:poacher" }], tags: ["good"], statEffects: { wealth: 2 }, textVariants: ["sold the lord's own deer back to the lord's own cook. A closed and beautiful loop."] },
  { id: "poacher_snare_master", category: "trade", weight: 3, conditions: [{ flag: "trade:poacher" }], statEffects: { health: 1 }, textVariants: ["your snares never failed and never were found. A craftsman, in your way."] },
  { id: "poacher_greed", category: "trade", weight: 3, conditions: [{ flag: "trade:poacher" }], statEffects: { suspicion: 2 }, textVariants: ["took one deer too many. People noticed the sudden fat winters."] },

  // --- Gravedigger ---
  { id: "grave_plague_wages", category: "trade", weight: 5, conditions: [{ flag: "trade:gravedigger" }], tags: ["good"], statEffects: { wealth: 2 }, textVariants: ["in a bad year for everyone, business was excellent. You didn't say so aloud."] },
  { id: "grave_goods", category: "trade", weight: 3, conditions: [{ flag: "trade:gravedigger" }], statEffects: { wealth: 1, suspicion: 1 }, textVariants: ["a ring came up with the spade. Its owner had no further use for it, you reasoned."] },
  { id: "grave_sexton_trust", category: "trade", weight: 3, conditions: [{ flag: "trade:gravedigger" }], statEffects: { standing: 1 }, textVariants: ["the priest trusted you with the keys and the quiet. A grave sort of respect."] },
  { id: "grave_hard_ground", category: "trade", weight: 4, conditions: [{ flag: "trade:gravedigger" }], statEffects: { health: -1 }, textVariants: ["digging frozen ground in January is a young man's folly and an old man's aches."] },
  { id: "grave_seen_it_all", category: "trade", weight: 3, conditions: [{ flag: "trade:gravedigger", minAge: 40 }], statEffects: { standing: 1 }, textVariants: ["you had buried three generations and outlived most of your customers. A dark boast."] },

  // --- Alewife (tavern chain) ---
  { id: "ale_tavern_thrives", category: "trade", weight: 5, conditions: [{ flag: "trade:alewife" }], tags: ["good"], statEffects: { wealth: 1, standing: 1 }, textVariants: ["the ale was good and the bench was full. The heart of the village met at your door."] },
  { id: "ale_brawl", category: "trade", weight: 4, conditions: [{ flag: "trade:alewife" }], statEffects: { health: -1, suspicion: 1 }, textVariants: ["a brawl broke out over a spilled cup and a decade-old grudge. You cracked heads and kept the peace."] },
  { id: "ale_watered_fine", category: "trade", weight: 4, conditions: [{ flag: "trade:alewife" }], statEffects: { wealth: -1, standing: -1 }, textVariants: ["fined by the ale-conner for a weak brew. A slander; the brew was merely thrifty."] },
  { id: "ale_gossip_hub", category: "trade", weight: 3, conditions: [{ flag: "trade:alewife" }], statEffects: { standing: 1 }, textVariants: ["you heard everything first. Knowledge poured freely with the ale."] },
  { id: "ale_liver", category: "trade", weight: 3, conditions: [{ flag: "trade:alewife", minAge: 35 }], statEffects: { health: -1 }, textVariants: ["quality control, over the years, took its toll on the constitution."] },

  // --- Shepherd ---
  { id: "shep_solitude", category: "trade", weight: 5, conditions: [{ flag: "trade:shepherd" }], tags: ["good"], statEffects: { health: 1 }, textVariants: ["a whole season on the high pasture, alone with the sheep and your thoughts. Both improved."] },
  { id: "shep_wolf", category: "trade", weight: 4, conditions: [{ flag: "trade:shepherd" }], statEffects: { wealth: -1 }, textVariants: ["a wolf took two lambs in the night. The dog took a piece of the wolf."] },
  { id: "shep_lost_in_snow", category: "trade", weight: 3, conditions: [{ flag: "trade:shepherd" }], fatal: 0.2, fatalMitigatedBy: "health", textVariants: ["caught out in a blizzard, you dug into the flock and let the sheep keep you warm."], deathText: ["was lost in a blizzard on the high pasture and found in the thaw."] },
  { id: "shep_fine_fleeces", category: "trade", weight: 4, conditions: [{ flag: "trade:shepherd" }], statEffects: { wealth: 1 }, textVariants: ["the wool clip was heavy and clean. The Flemish buyers paid well."] },
  { id: "shep_calm", category: "trade", weight: 3, conditions: [{ flag: "trade:shepherd" }], statEffects: { health: 1 }, textVariants: ["a shepherd's life is boring, and boring, you were learning, is another word for long."] },

  // --- Carpenter ---
  { id: "carp_church_roof", category: "trade", weight: 5, conditions: [{ flag: "trade:carpenter" }], tags: ["good"], statEffects: { wealth: 1, standing: 1 }, textVariants: ["raised the new church roof-beam. It would outlast you by three hundred years."] },
  { id: "carp_scaffold_fall", category: "trade", weight: 3, conditions: [{ flag: "trade:carpenter" }], fatal: 0.18, fatalMitigatedBy: "health", textVariants: ["fell from the scaffold and caught the beam. Everyone agreed it was a miracle or good reflexes."], deathText: ["fell from the church scaffold, finishing the very roof that outlived him."] },
  { id: "carp_guild", category: "trade", weight: 3, conditions: [{ flag: "trade:carpenter" }], statEffects: { standing: 1, wealth: 1 }, textVariants: ["joined the carpenters' guild. Membership had privileges and a great deal of feasting."] },
  { id: "carp_steady", category: "trade", weight: 4, conditions: [{ flag: "trade:carpenter" }], statEffects: { wealth: 1 }, textVariants: ["carts to mend, doors to hang, coffins to make. Steady work in every season."] },
  { id: "carp_gallows", category: "trade", weight: 2, conditions: [{ flag: "trade:carpenter" }], statEffects: { wealth: 1, standing: -1 }, textVariants: ["built the gallows to order. Good coin, uneasy dreams, no repeat customers."] },

  // --- Fool ---
  { id: "fool_lords_laughter", category: "trade", weight: 5, conditions: [{ flag: "trade:fool" }], tags: ["good"], statEffects: { standing: 1, wealth: 1 }, textVariants: ["made the lord laugh at exactly the right moment. Fed for a month on it."] },
  { id: "fool_truth_in_jest", category: "trade", weight: 4, conditions: [{ flag: "trade:fool" }], statEffects: { suspicion: -1 }, textVariants: ["said the unsayable as a joke, and got away with it, as only a fool may."] },
  { id: "fool_mocked_wrong_man", category: "trade", weight: 3, conditions: [{ flag: "trade:fool" }], statEffects: { standing: -1, suspicion: 1 }, textVariants: ["mocked a man with no sense of humour and a long memory. A miscalculation."] },
  { id: "fool_protected", category: "trade", weight: 3, conditions: [{ flag: "trade:fool" }], statEffects: { suspicion: -1 }, textVariants: ["accused of nothing, suspected of little. Who fears a fool?"] },
  { id: "fool_flat_jest", category: "trade", weight: 3, conditions: [{ flag: "trade:fool" }], statEffects: { standing: -1 }, textVariants: ["the jest fell flat in a silent hall. The longest afternoon of your life."] },
];
