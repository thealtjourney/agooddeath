import type { EventDef } from "../../../../engine/types.js";

export const TAXES: EventDef[] = [
  {
    id: "tax_demand",
    category: "taxes",
    weight: 7,
    statEffects: { wealth: -2 },
    textVariants: [
      "the reeve came for the tax. Paid, resentfully.",
      "a new levy 'for the war effort'. There was no war.",
      "the tallage came round again, earlier than last year.",
    ],
  },
  {
    id: "tithe",
    category: "taxes",
    weight: 5,
    statEffects: { wealth: -1, standing: 1 },
    textVariants: [
      "paid the tithe and received a nod from the priest.",
      "gave the tenth sheaf to the Church, as one does.",
    ],
  },
  {
    id: "heriot",
    category: "taxes",
    weight: 3,
    conditions: [{ minAge: 30 }],
    statEffects: { wealth: -1 },
    textVariants: ["a neighbour died and the lord took his best beast. A grim custom."],
  },
  {
    id: "merchet",
    category: "taxes",
    weight: 3,
    conditions: [{ flag: "married" }],
    statEffects: { wealth: -1 },
    textVariants: ["paid the lord a fee for the privilege of marrying. Romance."],
  },
  {
    id: "boon_work",
    category: "taxes",
    weight: 5,
    statEffects: { health: -1 },
    textVariants: [
      "owed the lord three days' unpaid labour at harvest. Owed, and gave.",
      "spent the best week of summer ploughing the lord's demesne.",
    ],
  },
  {
    id: "the_reeve_relents",
    category: "taxes",
    weight: 2,
    tags: ["good"],
    statEffects: { wealth: 1 },
    textVariants: ["the reeve, drunk and sentimental, waived a fee. Rare weather."],
  },
  {
    id: "counted_twice",
    category: "taxes",
    weight: 3,
    statEffects: { wealth: -1, standing: -1 },
    textVariants: ["the tax was counted twice and corrected never."],
  },
  {
    id: "purveyance",
    category: "taxes",
    weight: 4,
    statEffects: { wealth: -1 },
    textVariants: ["the king's men took your grain 'for the royal table', with a promise of payment. The promise was the payment."],
  },
];
