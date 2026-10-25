// The last shot's numbers as the Web UI Stats card shows them, ported from
// src/web/js/stats.js (renderShots, shotDisplayActualG, shotDisplayFlowGS,
// shotCut) and runtime.js (formatShotEnded). test/shot-fields.test.ts pins
// them to output generated from that code.
import type { Localize } from "./localize";
import type { ShotModel } from "./shot-model";

export const FIELDS = [
  "duration",
  "yield",
  "goal",
  "error",
  "drip",
  "avg_flow",
  "max_flow",
  "first_drop",
  "dose",
  "ratio",
  "target_temp",
  "cut_at",
  "drip_delay",
  "late_cup",
  "ended",
  "shot_type",
  "preset",
  "scale",
  "rating",
] as const;
export type Field = (typeof FIELDS)[number];

type Row = Record<string, unknown>;
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** The settled yield: the stored weight, else the curve's last nonzero reading. */
export function displayActualG(actual: unknown, wCg: unknown): number | null {
  if (typeof actual === "number" && actual !== 0) return actual;
  if (Array.isArray(wCg))
    for (let i = wCg.length - 1; i >= 0; i--) if (typeof wCg[i] === "number" && wCg[i] !== 0) return wCg[i] / 100;
  return typeof actual === "number" ? actual : null;
}

/** Average flow: the stored one, else yield over the time since the first drop. */
export function displayFlowGS(r: Row): number | null {
  const stored = num(r.avgFlowGS);
  if (stored !== null) return stored;
  const actual = displayActualG(r.actualG, r.wCg),
    dur = num(r.durationS),
    drop = num(r.firstDropS) ?? num(r.dropS);
  if (actual == null || dur == null || drop == null || !(dur - drop > 0.5) || !(actual > 0)) return null;
  return actual / (dur - drop);
}

/**
 * The stop: its time, the reading there, and, against a post-drip yield, the
 * drip. The reading is the drip tail's first point, else the curve's latest
 * weight. (The Web UI takes the model's last point, which can be an event
 * annotation such as the first drop; this reads the curve itself.)
 */
export function shotCut(r: Row, m: ShotModel | null, actual: number | null) {
  const latest = m?.pts.reduce((a, b) => (b.t >= a.t ? b : a), m.pts[0]),
    p = m && r.endS != null && (m.dripSegs[0]?.pts[0] ?? latest),
    g = p ? p.cg / 100 : null;
  return p
    ? { s: Number(r.endS), g, drip: actual !== null && r.actualWeightSource === "post_drip" ? actual - g! : null }
    : { s: null, g: null, drip: null };
}

/** How the shot ended, in the Web UI's words. */
export function shotEnded(t: Localize, detail: unknown, verdict: unknown): string {
  const k = String(detail || "")
    .toLowerCase()
    .replace(/_(failure|timeout)$/, "");
  const label = (v: unknown) =>
    t(v === "fast" ? "verdict.fast" : v === "slow" ? "verdict.slow" : "verdict.on_recipe");
  if (/^(ext|fast_|slow_)/.test(k)) return label(k[0] === "s" ? "slow" : "fast");
  const ended: Record<string, () => string> = {
    paddle: () => t("shot.manual"),
    activator: () => t("shot.manual"),
    physical_override: () => t("shot.manual"),
    normal_target: () => label(verdict),
    scale_threshold: () => label(verdict),
    auto_to_manual: () => t("ended.scale_loss"),
    cup_removed: () => t("ended.cup"),
    web_stop: () => t("ended.web"),
    web_heartbeat: () => t("ended.heartbeat"),
    hard_limit: () => t("ended.hard_limit"),
    global_limit: () => t("ended.hard_limit"),
    wall_limit: () => t("verdict.max_time"),
    configured_wall_limit: () => t("verdict.max_time"),
    relay_safety: () => t("ended.relay"),
    weight_anomaly: () => t("ended.anomaly"),
    touch_weight_fallback: () => t("ended.touch"),
  };
  return ended[k]?.() ?? "—";
}

export interface FieldValue {
  value: string;
  /** "high" or "low" for a yield over or under where the shot was meant to stop. */
  tone?: "high" | "low";
  /** Stars 0–5, for the rating. */
  stars?: number;
}

/**
 * Every field the details card can show, formatted like the Web UI. A field
 * the shot doesn't have reads "—"; the target temperature is left out when the
 * machine didn't report one, as the Web UI does.
 */
export function shotFields(t: Localize, r: Row, m: ShotModel | null): Partial<Record<Field, FieldValue>> {
  const G = " g",
    S = " s",
    dash = "—",
    estimated = r.actualG == null && r.estimatedG != null,
    actual = estimated ? null : displayActualG(r.actualG, r.wCg),
    goal = num(r.goalG),
    planned = num(r.cutLineG)! > 0 ? num(r.cutLineG)! : goal,
    err = actual === null || !planned ? null : ((actual - planned) / planned) * 100,
    flow = displayFlowGS(r),
    cut = shotCut(r, m, actual),
    temp = num(r.targetTempDeciC)! > 0 ? num(r.targetTempDeciC)! / 10 : null,
    fixed = (v: number | null, digits: number, unit: string) => (v === null ? dash : v.toFixed(digits) + unit),
    type = String(r.shotType ?? ""),
    rating = Math.max(0, Math.min(5, num(r.rating) ?? 0));
  const fields: Partial<Record<Field, FieldValue>> = {
    duration: { value: fixed(num(r.durationS), 1, S) },
    yield: {
      value: estimated ? t("field.yield_estimated", Math.round(Number(r.estimatedG))) : fixed(actual, 1, G),
    },
    goal: { value: fixed(goal, 1, G) },
    error: { value: err === null ? dash : err.toFixed(1) + "%", tone: err! > 0 ? "high" : err! < 0 ? "low" : undefined },
    drip: { value: cut.drip === null ? dash : (cut.drip < 0 ? "" : "+") + cut.drip.toFixed(1) + G },
    avg_flow: { value: fixed(flow, 2, " g/s") },
    max_flow: {
      value: m?.maxFlow == null ? dash : m.maxFlow.toFixed(2) + " g/s" + (r.wTruncated ? t("field.recorded") : ""),
    },
    first_drop: { value: fixed(num(r.firstDropS), 1, S) },
    dose: { value: num(r.doseG)! > 0 ? Number(r.doseG).toFixed(1) + G : dash },
    ratio: { value: num(r.ratio)! > 0 ? "1:" + Number(r.ratio).toFixed(1) : dash },
    cut_at: { value: cut.g == null ? dash : cut.g.toFixed(1) + G + " · " + cut.s!.toFixed(1) + S },
    drip_delay: { value: fixed(num(r.dripDelayS), 1, S) },
    late_cup: { value: num(r.tareS) == null ? t("field.none") : Number(r.tareS).toFixed(1) + S },
    ended: { value: shotEnded(t, r.stopDetail, r.verdict) },
    shot_type: {
      value: type === "manual" ? t("shot.manual") : type === "timer_only" ? t("shot.timer_only") : t("shot.auto"),
    },
    preset: { value: String(r.presetName || dash) },
    scale: { value: String(r.scaleName || t("field.none")) },
    rating: { value: rating ? `${rating}/5` : t("field.unrated"), stars: rating },
  };
  if (temp !== null) fields.target_temp = { value: temp.toFixed(1) + " °C" };
  return fields;
}
