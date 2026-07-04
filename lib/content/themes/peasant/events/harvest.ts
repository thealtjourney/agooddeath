import type { EventDef } from "../../../../engine/types.js";

export const HARVEST: EventDef[] = [
  {
    id: "good_harvest",
    category: "harvest",
    weight: 5,
    statEffects: { health: 1, wealth: 1 },
    textVariants: [
      "a fat harvest. Ate well, for once.",
      "the barns groaned and so, contentedly, did you.",
    ],
  },
  {
    id: "famine",
    category: "harvest",
    weight: 6,
    statEffects: { health: -2 },
    fatal: 0.12,
    fatalMitigatedBy: "health",
    textVariants: ["went hungry through a lean winter and lived, barely."],
    deathText: [
      "starved in the hungry gap, three weeks before the barley.",
      "died in a famine year, having sold the seed corn in a worse one.",
    ],
  },
  {
    id: "blighted_rye",
    category: "harvest",
    weight: 4,
    setsFlags: ["badBread"],
    statEffects: { health: -1 },
    textVariants: ["the rye came in black and strange. The bread was not right."],
  },
  {
    id: "murrain",
    category: "harvest",
    weight: 4,
    statEffects: { wealth: -2 },
    textVariants: [
      "a murrain took the cattle. A poor year to own a cow.",
      "the sheep rot came through and thinned the flock.",
    ],
  },
  {
    id: "glut_of_eels",
    category: "harvest",
    weight: 3,
    conditions: [{ flag: "village:fen" }],
    statEffects: { health: 1 },
    textVariants: ["the eel traps overflowed. Eel pie, eel stew, eel again."],
  },
  {
    id: "late_frost",
    category: "harvest",
    weight: 4,
    statEffects: { wealth: -1 },
    textVariants: ["a late frost bit the blossom. A thin year ahead."],
  },
  {
    id: "gleaning",
    category: "harvest",
    weight: 4,
    conditions: [{ statAtMost: ["wealth", 1] }],
    statEffects: { health: 1 },
    textVariants: ["gleaned the stubble after the reapers and got by."],
  },
  {
    id: "bumper_apples",
    category: "harvest",
    weight: 3,
    statEffects: { wealth: 1 },
    textVariants: ["a glut of apples became a glut of cider. A merry autumn."],
  },
];
