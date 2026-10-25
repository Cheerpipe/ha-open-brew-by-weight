import { describe, expect, it } from "vitest";
import golden from "./fixtures/preset-golden.json";
import presets from "../../tests/fixtures/integration_presets.json";
import {
  buildRuleChartModel,
  cutLine,
  defaultScrub,
  presetGeometry,
  scrubReading,
  type PresetRender,
  type RuleModel,
} from "../src/preset-chart";

// The same cases scripts/golden-from-firmware.mjs fed the firmware code.
const base = { ...presets.items[0], cutRampS: presets.cutRampS } as PresetRender & { cutRampS: number };
const cases: Record<string, PresetRender & { cutRampS: number }> = {
  double: base,
  noGuards: { ...base, fastExtractionGuardEnabled: false, slowExtractionGuardEnabled: false },
  timerOnly: { ...base, brewByWeight: false, firstDropS: 0, firstDropN: 0 },
  tightWindow: { ...base, fastBeforeS: 14, slowAfterS: 18, operationalWallMs: 25000, goalWeightG: 18 },
  invalid: { ...base, slowAfterS: 20 },
};
const models = golden.models as Record<string, Record<string, unknown>>;
const model = (name: string) => buildRuleChartModel(cases[name], cases[name].cutRampS) as RuleModel;

// Every class's path data and every label, as the firmware drew them.
function pathsOf(svg: string) {
  const out: Record<string, string[]> = {};
  for (const [, cls, d] of svg.matchAll(/<path class="([^"]+)" d="([^"]*)"/g)) (out[cls] ??= []).push(d);
  out.clip = [svg.match(/<clipPath id="gUnder"><path d="([^"]*)"/)![1]];
  out.labels = [...svg.matchAll(/<text class="rvLbl[^"]*" x="([^"]+)" y="([^"]+)" text-anchor="([^"]+)">([^<]*)</g)]
    .map(([, x, y, a, t]) => `${x},${y},${a},${t}`);
  out.arrivals = [...svg.matchAll(/class="rvArrival" cx="([^"]+)" cy="([^"]+)"/g)].map(([, x, y]) => `${x},${y}`);
  out.hatch = [...svg.matchAll(/<rect x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)" fill="url\(#gHatch\)"/g)]
    .map((r) => r.slice(1).join(","));
  return out;
}

describe("preset chart model", () => {
  for (const name of Object.keys(cases)) {
    it(`matches the firmware model for ${name}`, () => {
      const ours = buildRuleChartModel(cases[name], cases[name].cutRampS);
      const { pts: _pts, ...theirs } = models[name];
      if (theirs.mode === "empty") expect(ours).toBeNull();
      else expect(ours).toEqual(theirs);
    });
  }

  it("cuts at the firmware's weight at every time", () => {
    for (const [name, samples] of Object.entries(golden.cutLine as Record<string, number[][]>)) {
      const m = model(name);
      for (const [t, w] of samples) expect(cutLine(t, m)).toBe(w);
    }
  });

  it("reads the scrubber like the Web UI", () => {
    const m = model("double");
    expect(defaultScrub(m)).toBe(31.5);
    const middle = scrubReading(31.5, m);
    expect(middle).toMatchObject({ weight: 36, verdict: "on_recipe", atTarget: true });
    expect(scrubReading(12, m)).toMatchObject({ weight: 42, verdict: "fast", atTarget: false });
    expect(scrubReading(45, m)).toMatchObject({ weight: 33, verdict: "slow" });
    expect(scrubReading(50, m).verdict).toBe("max_time");
    expect(scrubReading(middle.stop, m).arrival).toBeCloseTo(31.5, 1);
  });
});

describe("preset chart geometry", () => {
  for (const [key, svg] of Object.entries(golden.graphs as Record<string, string>)) {
    it(`draws ${key} exactly like the firmware`, () => {
      const [name, width, compact] = key.split("-");
      const m = model(name);
      const g = presetGeometry(m, Number(width), {
        arrivals: cases[name].arrivalsS,
        compact: compact === "compact",
      });
      const theirs = pathsOf(svg);
      expect(svg).toContain(`viewBox="0 0 ${g.width} ${g.height}"`);
      expect(g.grid).toEqual(theirs.rvGrid);
      expect(g.clip).toBe(theirs.clip[0]);
      expect([g.bands.fastFull]).toEqual(theirs[m.fast ? "rvFastFull" : "rvBandOff"].slice(0, 1));
      expect(g.bands.window).toBe(theirs.rvWindow[0]);
      expect(g.paces).toBe(theirs.rvPace[0]);
      expect(g.cut).toBe(theirs[m.mode === "timerOnly" ? "rvCut off" : "rvCut"][0]);
      expect(g.windowEdges).toBe(theirs.rvWin[0]);
      expect(`M${g.L} ${g.target.toFixed(1)}H${g.R}`).toBe(theirs.rvTarget[0]);
      expect(`M${g.maxX.toFixed(1)} ${g.T}V${g.B}`).toBe(theirs.rvMax[0]);
      expect(g.arrivals.map((a) => `${a.x.toFixed(1)},${a.y.toFixed(1)}`)).toEqual(theirs.arrivals);
      expect(g.hatch ? [[g.hatch.x, g.hatch.y, g.hatch.width.toFixed(1), g.hatch.height].join(",")] : [])
        .toEqual(theirs.hatch);
      const axis = [...g.yLabels, ...g.xLabels].map(
        (l) => `${l.x.toFixed(1)},${l.y.toFixed(1)},${l.anchor},${l.text}`,
      );
      expect(theirs.labels.slice(0, axis.length)).toEqual(axis);
      if (m.fast) {
        expect(g.bands.fastPart).toBe(theirs.rvFastPart[0]);
      }
      if (m.slow) {
        expect(g.bands.slowPart).toBe(theirs.rvSlowPart[0]);
        expect(g.bands.slowFull).toBe(theirs.rvSlowFull[0]);
      }
    });
  }
});
