import type { DeathCause } from "../../../engine/types.js";

/**
 * Fallback death pool. Most death lines come from an event's own `deathText`;
 * these cover natural/generic causes and add colour to the pool. Launch
 * target is 60+; this is the growing set.
 */
export const DEATHS: DeathCause[] = [
  { id: "old_age", category: "old_age", text: "died peacefully in bed, of being remarkably, scandalously old.", icon: "bed" },
  { id: "fever", category: "disease", text: "died of a fever the physician could not name and would not stop charging for.", icon: "bed" },
  { id: "quiet_decline", category: "old_age", text: "faded gently over one long winter, and was missed.", icon: "bed" },
  { id: "a_chill", category: "disease", text: "died of a chill caught at a funeral, which was, at least, convenient.", icon: "bed" },
  { id: "the_gripes", category: "disease", text: "died of the gripes, having eaten something the dog refused.", icon: "bed" },
  { id: "worn_out", category: "old_age", text: "simply wore out, like a good spade, and was set down at last.", icon: "bed" },
  { id: "a_hard_winter", category: "disease", text: "did not see the spring, as the old and the unlucky often do not.", icon: "bed" },
  { id: "the_stone", category: "disease", text: "died of the stone, having refused the surgeon's knife, which was the wiser refusal.", icon: "bed" },
  { id: "childbed", category: "family", text: "died in childbed, as too many did, and was mourned by the whole parish.", icon: "bed" },
  { id: "apoplexy", category: "old_age", text: "was carried off by an apoplexy mid-argument, winning it by default.", icon: "bed" },
  { id: "a_surfeit", category: "disease", text: "died of a surfeit of eels, which is a very Muckle Sump way to go.", icon: "bed" },
  { id: "consumption", category: "disease", text: "wasted slowly of a consumption, coughing politely to the end.", icon: "bed" },
];
