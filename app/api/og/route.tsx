import { ImageResponse } from "next/og";
import { simulate } from "../../../lib/engine/simulate.js";
import { theme, renderParishRecord, prettyDate } from "../../../lib/game/theme-ui.js";
import { decodeBuild } from "../../../lib/game/share-url.js";

export const runtime = "edge";

const PARCH = "#e9dcbe";
const FRAME = "#cdb98f";
const INK = "#2a2117";
const SOFT = "#4a3d2c";
const FADED = "#6b5a43";
const RUBRIC = "#8f2c1c";
const GILT = "#b5872b";

async function loadFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}`;
    const css = await (
      await fetch(cssUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:2.0.1)" },
      })
    ).text();
    const m = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!m || !m[1]) return null;
    return await (await fetch(m[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const seed = searchParams.get("seed") ?? "";
  const build = decodeBuild(searchParams.get("b"));

  let name = "A Good Death";
  let deathText = "How long do you survive medieval England?";
  let survivedBy = "";
  let score: number | null = null;
  let good = false;
  let plague = false;
  let dateLabel = "";
  let stats = { childrenSurvived: 0, plaguesEndured: 0, timesAccused: 0, yearsLived: 0 };

  if (build && seed) {
    const life = simulate(build, seed, theme);
    const record = renderParishRecord(life);
    name = record.title.replace("The Parish Record of ", "");
    deathText = life.deathText;
    survivedBy = record.survivedBy;
    score = life.ageAtDeath;
    good = life.goodDeath;
    plague = life.stats.plaguesEndured > 0 || life.deathCauseId.includes("pestilence");
    dateLabel = prettyDate(seed);
    stats = life.stats;
  }

  const accent = good ? GILT : INK;
  const [blk, body, bodyIt] = await Promise.all([
    loadFont("UnifrakturCook", 700),
    loadFont("EB Garamond", 500),
    loadFont("EB Garamond", 400),
  ]);
  const fonts = [
    blk && { name: "Blk", data: blk, weight: 700 as const, style: "normal" as const },
    body && { name: "Body", data: body, weight: 500 as const, style: "normal" as const },
    bodyIt && { name: "Body", data: bodyIt, weight: 400 as const, style: "italic" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 500 | 700; style: "normal" | "italic" }[];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          backgroundColor: FRAME,
          padding: "22px",
          fontFamily: "Body",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: PARCH,
            border: `3px solid ${good ? GILT : INK}`,
            boxShadow: `inset 0 0 0 8px ${PARCH}, inset 0 0 0 10px ${plague ? INK : "rgba(70,52,30,0.35)"}`,
            padding: "54px 60px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {good && (
              <div style={{ display: "flex", color: GILT, fontSize: 26, fontWeight: 700, fontFamily: "Blk", letterSpacing: 2 }}>
                ✦ A Good Death ✦
              </div>
            )}
            <div style={{ display: "flex", color: FADED, fontSize: 22, letterSpacing: 6, marginTop: 4 }}>
              THE PARISH RECORD OF
            </div>
            <div style={{ display: "flex", color: INK, fontSize: 76, fontFamily: "Blk", lineHeight: 1.05, marginTop: 6 }}>
              {name}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "700px" }}>
              <div style={{ display: "flex", color: SOFT, fontSize: 36, fontStyle: "italic", lineHeight: 1.3 }}>
                {deathText}
              </div>
              {survivedBy && (
                <div style={{ display: "flex", color: INK, fontSize: 27, marginTop: 18 }}>
                  {survivedBy}
                </div>
              )}
            </div>
            {score !== null && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 24 }}>
                <div style={{ display: "flex", color: FADED, fontSize: 20, letterSpacing: 5 }}>AGE AT DEATH</div>
                <div style={{ display: "flex", color: accent, fontSize: 168, fontFamily: "Blk", lineHeight: 0.9 }}>
                  {score}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: FADED, fontSize: 22 }}>
            <div style={{ display: "flex", color: RUBRIC, fontWeight: 500 }}>agooddeath.app</div>
            <div style={{ display: "flex" }}>
              {score !== null
                ? `${stats.childrenSurvived} children · ${stats.plaguesEndured} plagues · ${stats.timesAccused} accused`
                : "Pick a peasant. Watch them die."}
            </div>
            <div style={{ display: "flex" }}>{dateLabel || "play free"}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
