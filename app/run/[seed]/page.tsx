import type { Metadata } from "next";
import { simulate } from "../../../lib/engine/simulate.js";
import { theme, renderParishRecord } from "../../../lib/game/theme-ui.js";
import { decodeBuild, ogImagePath } from "../../../lib/game/share-url.js";
import { SharedRun } from "../../../components/SharedRun.js";

type Params = { seed: string };
type Search = { b?: string };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}): Promise<Metadata> {
  const seed = decodeURIComponent(params.seed);
  const build = decodeBuild(searchParams.b);

  let title = "A Good Death";
  let description = "How long do you survive medieval England?";

  if (build) {
    const life = simulate(build, seed, theme);
    const record = renderParishRecord(life);
    const name = record.title.replace("The Parish Record of ", "");
    title = `${name} — dead at ${life.ageAtDeath}`;
    description = `${life.deathText} ${record.survivedBy} How long do you last?`;
  }

  const image = build ? ogImagePath(seed, build) : "/api/og";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RunPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  return <SharedRun seed={decodeURIComponent(params.seed)} b={searchParams.b} />;
}
