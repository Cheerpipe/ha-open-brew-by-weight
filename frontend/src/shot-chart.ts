// Geometry for the last shot's charts. The shot over its preset reuses the
// preset graph (presetGeometry) like the Web UI Stats card; the weight and
// flow chart follows the Web UI's fillShotCharts: one grid of 10 g lines,
// with flow taking the smallest step that fits on the same lines.
import type { Label } from "./preset-chart";
import type { Point, Segment, ShotModel } from "./shot-model";

/** A stroke through [t, grams] points, as the firmware's presetGraph draws it. */
export function polyline(
  points: Point[],
  X: (t: number) => number,
  Y: (g: number) => number,
  tMax: number,
): string {
  return points
    .filter((q) => q.t <= tMax)
    .map((q, i) => (i ? "L" : "M") + X(q.t).toFixed(2) + " " + Y(q.cg / 100).toFixed(2))
    .join("");
}

export type SparkView = "weight_flow" | "weight" | "flow";

export interface SeriesPath {
  kind: Segment["kind"];
  d: string;
  /** The same stroke closed down to the baseline, for its fill. */
  area: string | null;
  drip: boolean;
}

export interface SparkGeometry {
  width: number;
  height: number;
  L: number;
  R: number;
  T: number;
  B: number;
  timeMax: number;
  X: (t: number) => number;
  /** Grams to y. */
  Yw: (g: number) => number;
  /** Grams per second to y. */
  Yf: (v: number) => number;
  grid: string[];
  xLabels: Label[];
  weightLabels: Label[];
  flowLabels: Label[];
  weight: SeriesPath[];
  flow: SeriesPath[];
  held: { x: number; y: number }[];
  finalPoint: { x: number; y: number } | null;
  tAt: (px: number) => number;
}

/**
 * The weight and flow chart for a host `width` wide. `timeMax` stretches the
 * time axis (the Web UI uses the preset's max time when the shot has one).
 */
export function sparkGeometry(
  m: ShotModel,
  width: number,
  view: SparkView,
  timeMax = m.timeMax,
): SparkGeometry {
  const weight = view !== "flow",
    flow = view !== "weight",
    n = m.maxW / 10,
    step = [0.25, 0.5, 1, 2, 5].find((s) => s * n >= m.flowMax) ?? Math.ceil(m.flowMax / n),
    W = width,
    H = Math.round(Math.min(220, Math.max(160, W * 0.42))),
    L = flow && !weight ? 48 : 38,
    R = W - (weight && flow ? 52 : 10),
    T = 14,
    B = H - 18,
    X = (t: number) => L + (R - L) * Math.min(1, t / timeMax),
    clamp = (v: number) => Math.max(0, Math.min(1, v)),
    Yw = (g: number) => B - (B - T) * clamp(g / m.maxW),
    Yf = (v: number) => B - (B - T) * clamp(v / (step * n)),
    f = (v: number) => v.toFixed(2),
    path = (pts: Point[], Y: (v: number) => number) =>
      pts.map((q, i) => (i ? "L" : "M") + f(X(q.t)) + " " + f(Y(q.cg / 100))).join("") + (pts.length === 1 ? "h0" : ""),
    series = (segs: Segment[], drips: Segment[], Y: (v: number) => number, start: Point[]) => {
      const out: SeriesPath[] = [];
      const add = (pts: Point[], kind: Segment["kind"], drip: boolean) => {
        const d = path(pts, Y);
        out.push({
          kind,
          d,
          drip,
          area: !drip && pts.length > 1 && pts.some((q) => q.cg > 0) ? `${d}V${B}H${f(X(pts[0].t))}Z` : null,
        });
      };
      // Before the first drop the cup is empty: a flat line from zero.
      if (m.firstDropS) add([{ t: 0, cg: 0 }, { t: m.firstDropS, cg: 0 }, ...start], "bbw", false);
      for (const s of segs) add(s.pts, s.kind, false);
      for (const s of drips) add(s.pts, s.kind, true);
      return out;
    },
    grid: string[] = [],
    xLabels: Label[] = [],
    weightLabels: Label[] = [],
    flowLabels: Label[] = [];
  for (let i = 0; i <= n; i++) {
    const y = B - ((B - T) * i) / n;
    grid.push(`M${L} ${y.toFixed(1)}H${R}`);
    if (weight) weightLabels.push({ x: L - 4, y: y + 3, text: `${i * 10} g`, anchor: "end" });
    if (flow)
      flowLabels.push({
        x: weight ? R + 4 : L - 4,
        y: y + 3,
        text: `${+(i * step).toFixed(2)} g/s`,
        anchor: weight ? "start" : "end",
      });
  }
  for (let t = 0; t <= timeMax; t += 10) {
    grid.push(`M${X(t).toFixed(1)} ${T}V${B}`);
    xLabels.push({ x: X(t), y: B + 13, text: `${t} s`, anchor: t === 0 ? "start" : t + 10 > timeMax ? "end" : "middle" });
  }
  return {
    width: W,
    height: H,
    L,
    R,
    T,
    B,
    timeMax,
    X,
    Yw,
    Yf,
    grid,
    xLabels,
    weightLabels,
    flowLabels,
    weight: weight ? series(m.segs, m.dripSegs, Yw, []) : [],
    flow: flow ? series(m.flowSegs, m.dripFlowSegs, Yf, m.flowStart ? [m.flowStart] : []) : [],
    held: weight ? m.held.map((q) => ({ x: X(q.t), y: Yw(q.cg / 100) })) : [],
    finalPoint: weight && m.finalPoint ? { x: X(m.finalPoint.t), y: Yw(m.finalPoint.cg / 100) } : null,
    tAt: (px) => ((px - L) * timeMax) / (R - L),
  };
}
