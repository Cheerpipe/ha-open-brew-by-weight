import { describe, expect, it } from "vitest";
import golden from "./fixtures/preset-golden.json";
import last from "../../tests/fixtures/integration_last_shot.json";
import { presetGeometry } from "../src/preset-chart";
import { polyline, sparkGeometry } from "../src/shot-chart";
import { buildShotSparkModel, curveAt, expandShot, shotRuleModel, type ShotRow } from "../src/shot-model";

type Golden = { input: Record<string, unknown>; model: Record<string, unknown>; rule: Record<string, unknown>; graph: string };
const shots = golden.shots as Record<string, Golden>;
// The firmware tags segments with CSS colors too; the card keeps only the kind.
// "observed" is always true there and unused.
const uncolored = (value: unknown): unknown =>
  JSON.parse(JSON.stringify(value, (key, v) => (key === "color" || key === "observed" ? undefined : v)));

describe("last shot model", () => {
  it("expands the integration's row like the Web UI stream", () => {
    const row = Object.fromEntries(last.cols.split(",").map((c, i) => [c, last.shot[i]])) as ShotRow;
    row.curve = last.shot.at(-1) as Record<string, unknown>;
    const shot = expandShot(row)!;
    const { curve: _curve, ...expected } = { ...row };
    expect(shot).toMatchObject(expected);
    expect(shot.wAtMs).toEqual(shots.base.input.wAtMs);
    expect(shot.wCg).toEqual(shots.base.input.wCg);
    expect(expandShot({ ...row, curve: { ...row.curve, wD: "%%%" } })).toBeNull();
  });

  for (const [name, { input, model, rule }] of Object.entries(shots)) {
    it(`builds the firmware's model and rule for ${name}`, () => {
      expect(uncolored(buildShotSparkModel(input))).toEqual(uncolored(model));
      const ours = shotRuleModel(input);
      const { pts: _pts, ...theirs } = rule;
      expect(ours).toEqual(theirs);
    });

    it(`draws ${name} over its preset like the Stats card`, () => {
      const m = buildShotSparkModel(input)!;
      const r = shotRuleModel(input)!;
      const g = presetGeometry(r, 600, { compact: true, tens: true, maxG: m.rawMaxW, maxT: Math.max(r.wall, m.dur) });
      const svg = shots[name].graph;
      const paths = (cls: string) => [...svg.matchAll(new RegExp(`<path class="${cls}" d="([^"]*)"`, "g"))].map((x) => x[1]);
      expect(g.grid).toEqual(paths("rvGrid"));
      expect(g.cut).toBe(paths(r.mode === "timerOnly" ? "rvCut off" : "rvCut")[0]);
      const tMax = Math.max(r.wall, m.dur, r.wall);
      expect(m.segs.map((s) => polyline(s.pts, g.X, g.Y, tMax))).toEqual(paths("rvLast"));
      expect(m.dripSegs.map((s) => polyline(s.pts, g.X, g.Y, tMax))).toEqual(paths("rvLast rvLastDrip"));
      const labels = [...svg.matchAll(/<text class="rvLbl[^"]*" x="([^"]+)" y="([^"]+)" text-anchor="([^"]+)">([^<]*)</g)]
        .map(([, x, y, a, t]) => `${x},${y},${a},${t}`);
      const axis = [...g.yLabels, ...g.xLabels].map((l) => `${l.x.toFixed(1)},${l.y.toFixed(1)},${l.anchor},${l.text}`);
      expect(labels.slice(0, axis.length)).toEqual(axis);
    });
  }

  it("rejects curves the Web UI rejects", () => {
    const base = shots.base.input;
    expect(buildShotSparkModel(null)).toBeNull();
    expect(buildShotSparkModel({ ...base, wAtMs: [1, 0] })).toBeNull();
    expect(buildShotSparkModel({ ...base, wHeld: [99999] })).toBeNull();
  });

  it("reads a curve between its samples", () => {
    const curve = [
      { t: 0, cg: 0 },
      { t: 2, cg: 200 },
    ];
    expect(curveAt(curve, 1)).toBe(1);
    expect(curveAt(curve, 5)).toBe(2);
  });
});

describe("weight and flow chart", () => {
  const m = buildShotSparkModel(shots.drip.input)!;

  it("shares one grid: 10 g per line, flow on the same lines", () => {
    const g = sparkGeometry(m, 600, "weight_flow", 50);
    expect(g.weightLabels.map((l) => l.text)).toEqual(["0 g", "10 g", "20 g", "30 g", "40 g"]);
    expect(g.flowLabels.map((l) => l.text)).toEqual(["0 g/s", "1 g/s", "2 g/s", "3 g/s", "4 g/s"]);
    expect(g.xLabels.map((l) => l.text)).toEqual(["0 s", "10 s", "20 s", "30 s", "40 s", "50 s"]);
    expect(g.weight.some((s) => s.drip)).toBe(true);
    expect(g.weight[0].d.startsWith(`M${g.L.toFixed(2)} ${g.B.toFixed(2)}`)).toBe(true);
    expect(g.finalPoint).not.toBeNull();
    expect(g.tAt(g.X(25))).toBeCloseTo(25);
  });

  it("draws one series per view", () => {
    const weight = sparkGeometry(m, 400, "weight");
    expect(weight.flow).toEqual([]);
    expect(weight.flowLabels).toEqual([]);
    const flow = sparkGeometry(m, 400, "flow");
    expect(flow.weight).toEqual([]);
    expect(flow.held).toEqual([]);
    expect(flow.flowLabels[0].anchor).toBe("end");
  });
});
