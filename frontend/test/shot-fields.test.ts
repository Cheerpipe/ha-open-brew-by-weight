import { describe, expect, it } from "vitest";
import golden from "./fixtures/preset-golden.json";
import { localizer } from "../src/localize";
import { displayActualG, displayFlowGS, shotCut, shotEnded, shotFields } from "../src/shot-fields";
import { buildShotSparkModel } from "../src/shot-model";

type Shot = { input: Record<string, unknown>; fields: { actual: number | null; flow: number | null; cut: { s?: number; g?: number; drip?: number | null }; ended: string } };
const shots = golden.shots as unknown as Record<string, Shot>;
const t = localizer("en");

describe("shot fields", () => {
  for (const [name, { input, fields }] of Object.entries(shots)) {
    it(`computes ${name} like the Web UI Stats card`, () => {
      const actual = displayActualG(input.actualG, input.wCg);
      expect(actual).toBe(fields.actual);
      expect(displayFlowGS(input)).toBe(fields.flow);
      const m = buildShotSparkModel(input);
      const cut = shotCut(input, m, actual);
      if (m?.dripSegs.length || !fields.cut.s) {
        // Same reading wherever the Web UI reads the curve itself.
        expect(cut.s).toBe(fields.cut.s ?? null);
        expect(cut.g).toBe(fields.cut.g ?? null);
        expect(cut.drip).toBe(fields.cut.drip ?? null);
      } else {
        // Without a drip tail the Web UI reads an event annotation; the card reads the last weight.
        const latest = m!.pts.reduce((a, b) => (b.t >= a.t ? b : a));
        expect(cut.g).toBe(latest.cg / 100);
      }
      // The Web UI says "Cup"; the card spells out "Cup removed".
      expect(shotEnded(t, input.stopDetail, input.verdict)).toBe(fields.ended === "Cup" ? "Cup removed" : fields.ended);
    });
  }

  it("formats every field of a drip shot", () => {
    const input = shots.drip.input;
    const values = Object.fromEntries(
      Object.entries(shotFields(t, input, buildShotSparkModel(input))).map(([k, v]) => [k, v!.value]),
    );
    expect(values).toEqual({
      duration: "31.0 s",
      yield: "36.3 g",
      goal: "36.0 g",
      error: "5.6%",
      drip: "+2.5 g",
      avg_flow: "1.41 g/s",
      max_flow: `${buildShotSparkModel(input)!.maxFlow!.toFixed(2)} g/s`,
      first_drop: "5.2 s",
      dose: "18.0 g",
      ratio: "1:2.0",
      target_temp: "93.0 °C",
      cut_at: "33.9 g · 29.4 s",
      drip_delay: "1.6 s",
      late_cup: "0.8 s",
      ended: "On recipe",
      shot_type: "Automatic",
      preset: "Double",
      scale: "BOOKOO_SC 715097",
      rating: "4/5",
    });
  });

  it("handles estimates, missing values, and unknown endings", () => {
    const base = shots.drip.input;
    const est = shotFields(t, { ...base, actualG: null, estimatedG: 35.4 }, null);
    expect(est.yield!.value).toBe("~35 g est.");
    expect(est.error!.value).toBe("—");
    expect(est.max_flow!.value).toBe("—");
    const bare = shotFields(t, { durationS: 20, goalG: 18, actualG: 17, shotType: "manual", rating: 0 }, null);
    expect(bare.target_temp).toBeUndefined();
    expect(bare.error).toMatchObject({ tone: "low" });
    expect(bare.late_cup!.value).toBe("None");
    expect(bare.scale!.value).toBe("None");
    expect(bare.rating!.value).toBe("Unrated");
    expect(bare.shot_type!.value).toBe("Manual");
    expect(shotFields(t, { ...base, wTruncated: true }, buildShotSparkModel({ ...base, wTruncated: true }))
      .max_flow!.value).toContain("(recorded)");
    expect(shotEnded(t, "fast_extraction_max_weight_timeout", null)).toBe("Fast");
    expect(shotEnded(t, "slow_max_time", null)).toBe("Slow");
    expect(shotEnded(t, "wall_limit", null)).toBe("Max time");
    expect(shotEnded(t, "mystery", null)).toBe("—");
    expect(displayFlowGS({ actualG: 36, durationS: 30, firstDropS: 6 })).toBe(1.5);
    expect(displayFlowGS({ actualG: 36, durationS: 6.2, firstDropS: 6 })).toBeNull();
    expect(displayActualG(0, [100, 0])).toBe(1);
    expect(displayActualG(0, [])).toBe(0);
  });
});
