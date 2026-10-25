// Preset chart math and geometry, ported from the firmware Web UI
// (src/web/js/runtime.js: buildRuleChartModel, cutLine, referencePace,
// presetGraph, positionPresetScrub). test/preset-chart.test.ts checks every
// path against output generated from that code; keep the two in step.

/** One item of the integration's preset render (firmware preset_rules_v1). */
export interface PresetRender {
  id: number;
  name: string;
  isFactory?: boolean;
  brewByWeight?: boolean;
  goalWeightG?: number;
  fastBeforeS?: number;
  slowAfterS?: number;
  fastMarginG?: number;
  slowMarginG?: number;
  operationalWallMs?: number;
  bbwProtectionMs?: number;
  fastExtractionGuardEnabled?: boolean;
  slowExtractionGuardEnabled?: boolean;
  firstDropS?: number;
  firstDropN?: number;
  arrivalsS?: number[];
  doseG?: number;
}

export interface RuleModel {
  mode: "active" | "timerOnly";
  fast: boolean;
  slow: boolean;
  fastMargin: number;
  slowMargin: number;
  goal: number;
  ceil: number;
  floor: number;
  t1: number;
  t2: number;
  prot: number;
  wall: number;
  d: number;
  firstDrop: number;
  firstDropN: number;
  scrubMin: number;
}

export const PACE_SOFT = 0.18;

/** The chart model of a preset, or null when its rule cannot be drawn. */
export function buildRuleChartModel(c: PresetRender, cutRampS: number): RuleModel | null {
  const N = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : NaN),
    goal = N(c.goalWeightG),
    t1 = N(c.fastBeforeS),
    t2 = N(c.slowAfterS),
    prot = N(c.bbwProtectionMs) / 1e3,
    wall = N(c.operationalWallMs) / 1e3,
    d = N(cutRampS),
    fast = !!c.fastExtractionGuardEnabled,
    slow = !!c.slowExtractionGuardEnabled,
    fastMargin = N(c.fastMarginG),
    slowMargin = N(c.slowMarginG),
    ceil = fast ? goal + fastMargin : goal,
    floor = slow ? goal - slowMargin : goal,
    // Paces start at the usual first drop, kept 0.5 s before the window.
    start = Math.max(0, Math.min(N(c.firstDropS) || 0, t1 - 0.5));
  if (
    ![goal, t1, t2, prot, wall, d, ceil, floor].every(Number.isFinite) ||
    !(prot < t1 && t1 < t2 && t2 < wall)
  )
    return null;
  return {
    mode: c.brewByWeight === false ? "timerOnly" : "active",
    fast,
    slow,
    fastMargin,
    slowMargin,
    goal,
    ceil,
    floor,
    t1,
    t2,
    prot,
    wall,
    d,
    firstDrop: start,
    firstDropN: N(c.firstDropN) || 0,
    scrubMin: Math.max(prot, start + 0.5),
  };
}

/** Cut weight (g) at t (s), in the firmware's integer units (dg, ms). */
export function cutLine(t: number, m: RuleModel): number {
  const ms = (v: number) => Math.round(v * 1000),
    dg = (v: number) => Math.round(v * 10),
    now = ms(Math.max(m.prot, Math.min(m.wall, t))),
    goal = dg(m.goal),
    a = ms(Math.max(m.prot, m.t1 - m.d)),
    t1 = ms(m.t1),
    t2 = ms(m.t2),
    b = ms(Math.min(m.wall, m.t2 + m.d));
  if (now < t1) {
    const up = m.fast ? dg(m.fastMargin) : 0,
      n = Math.max(0, now - a),
      d = t1 - a;
    return (goal + Math.floor((up * (d ** 3 - 3 * n * n * d + 2 * n ** 3)) / d ** 3)) / 10;
  }
  if (now > t2) {
    const down = m.slow ? dg(m.slowMargin) : 0,
      n = Math.min(now, b) - t2,
      d = b - t2;
    return (goal - Math.floor((down * (3 * n * n * d - 2 * n ** 3)) / d ** 3)) / 10;
  }
  return goal / 10;
}

/** Illustrative pace: a shot reaching `goal` at tArr with a soft start. */
export function referencePace(t: number, goal: number, tArr: number, t0 = 0): number {
  const u = Math.max(0, t - t0) / (tArr - t0);
  return goal * (2 * PACE_SOFT * u + (1 - 2 * PACE_SOFT) * u * u);
}

export type Verdict = "fast" | "on_recipe" | "slow" | "max_time";

/** What a shot cut at `stop` means: its weight and when it reached the target. */
export function scrubReading(stop: number, m: RuleModel) {
  const w = cutLine(stop, m),
    c = PACE_SOFT,
    u = (Math.sqrt(4 * c * c + (4 * (1 - 2 * c) * w) / m.goal) - 2 * c) / (2 * (1 - 2 * c)),
    tArr = m.firstDrop + (stop - m.firstDrop) / u,
    verdict: Verdict =
      stop >= m.wall ? "max_time" : tArr < m.t1 - 0.5 ? "fast" : tArr > m.t2 + 0.5 ? "slow" : "on_recipe";
  return { stop, weight: w, arrival: tArr, verdict, atTarget: Math.abs(w - m.goal) < 0.05 };
}

/** Where the scrubber starts: the middle of the window, on a tenth. */
export const defaultScrub = (m: RuleModel) => Math.max(m.scrubMin, Math.round((m.t1 + m.t2) * 5) / 10);

export interface Label {
  x: number;
  y: number;
  text: string;
  anchor: "start" | "middle" | "end";
}

export interface PresetGeometry {
  width: number;
  height: number;
  L: number;
  R: number;
  T: number;
  B: number;
  X: (t: number) => number;
  Y: (g: number) => number;
  tAt: (px: number) => number;
  grid: string[];
  yLabels: Label[];
  xLabels: Label[];
  clip: string;
  bands: { fastFull: string; fastPart: string; window: string; slowPart: string; slowFull: string };
  paces: string;
  cut: string;
  target: number;
  maxX: number;
  windowEdges: string;
  hatch: { x: number; y: number; width: number; height: number } | null;
  arrivals: { x: number; y: number }[];
  /** Seconds to x and grams to y, for a shot drawn over the preset. */
  /** Pace curve from the first drop through (tArr at the target), ending at `end`. */
  pace: (tArr: number, end: number) => string;
  noCutLabel: boolean;
  targetAbove: boolean;
}

/**
 * The preset graph laid out in pixels for a host `width` wide: the firmware's
 * presetGraph, minus markup. `compact` drops the no-cut hatch and the scrubber
 * room, like the Stats card; `tens` ticks every 10 s; `maxG` and `maxT` grow
 * the axes to fit a shot drawn over the preset.
 */
export function presetGeometry(
  m: RuleModel,
  width: number,
  options: { arrivals?: number[]; compact?: boolean; tens?: boolean; maxG?: number; maxT?: number } = {},
): PresetGeometry {
  const { arrivals = [], compact = false, tens = false, maxG = 0, maxT = 0 } = options,
    W = width,
    H = Math.round(
      compact ? Math.min(180, Math.max(140, W * 0.48)) : Math.min(220, Math.max(180, W * 0.56)),
    ),
    L = 34,
    R = W - 10,
    T = 14,
    B = H - 18,
    top = Math.ceil(Math.max(m.ceil, maxG) + 2),
    step = top > 30 ? 10 : 5,
    tMax = Math.max(m.wall, maxT),
    X = (t: number) => L + ((R - L) * t) / tMax,
    Y = (g: number) => B - ((B - T) * g) / top,
    n = (v: number) => +(+v).toFixed(1),
    P = (t: number, g: number) => X(t).toFixed(2) + " " + Y(g).toFixed(2),
    // Holds and the window are straight; each S-ramp is one cubic Bézier with
    // control points (x0 + Δx/3, y0) and (x0 + 2Δx/3, y1): exactly smoothstep.
    ramp = (t0: number, y0: number, t1: number, y1: number) =>
      `C${P(t0 + (t1 - t0) / 3, y0)} ${P(t0 + (2 * (t1 - t0)) / 3, y1)} ${P(t1, y1)}`,
    xa = Math.max(m.prot, m.t1 - m.d),
    xb = Math.min(m.wall, m.t2 + m.d),
    fastEdge = `L${P(xa, m.ceil)}` + ramp(xa, m.ceil, m.t1, m.goal),
    windowEdge = `L${P(m.t2, m.goal)}`,
    slowEdge = ramp(m.t2, m.goal, xb, m.floor) + `L${P(m.wall, m.floor)}`,
    // Reference paces as exact quadratic Béziers, ending where they leave the plot.
    t0 = m.firstDrop,
    paceEnd = (ta: number) => {
      const c = PACE_SOFT,
        k = (top + 1) / m.goal;
      return Math.min(
        tMax,
        t0 + ((ta - t0) * (Math.sqrt(4 * c * c + 4 * (1 - 2 * c) * k) - 2 * c)) / (2 * (1 - 2 * c)),
      );
    },
    ctrl = (ta: number, end: number) =>
      P(t0 + (end - t0) / 2, (m.goal * PACE_SOFT * (end - t0)) / (ta - t0)),
    endOf = (ta: number, end = paceEnd(ta)) => P(end, referencePace(end, m.goal, ta, t0)),
    paceTo = (ta: number, end = paceEnd(ta)) => `Q${ctrl(ta, end)} ${endOf(ta, end)}`,
    paceBack = (ta: number, end = paceEnd(ta)) => `Q${ctrl(ta, end)} ${P(t0, 0)}`,
    // Areas run along the baseline to the first drop; strokes start there.
    O = `M${P(0, 0)}L${P(t0, 0)}`,
    S = `M${P(t0, 0)}`,
    corner = `L${P(tMax, top + 1)}`,
    tA = Math.max(t0 + 0.5, m.t1 - m.d),
    tB = m.t2 + m.d,
    grid: string[] = [],
    yLabels: Label[] = [],
    xLabels: Label[] = [];
  for (let v = 0; v <= top; v += step) {
    grid.push(`M${L} ${Y(v).toFixed(1)}H${R}`);
    yLabels.push({ x: L - 4, y: Y(v) + 3, text: `${v} g`, anchor: "end" });
  }
  // Every tick carries its unit; one that would spill past the edge ends there,
  // one that would overlap the previous is dropped (never the last).
  let lastR = -99;
  (tens
    ? Array.from({ length: Math.floor(tMax / 10) + 1 }, (_, i) => i * 10)
    : [0, m.prot, m.t1, m.t2, m.wall]
  ).forEach((t, i, ts) => {
    const s = n(t) + " s",
      w = s.length * 6.5,
      edge = X(t) + w / 2 > W - 1,
      x0 = edge ? W - 1 - w : i ? X(t) - w / 2 : X(t);
    if (x0 < lastR + 4 && i < ts.length - 1) return;
    lastR = x0 + w;
    if (tens) grid.push(`M${X(t).toFixed(1)} ${T}V${B}`);
    xLabels.push({ x: edge ? W - 1 : X(t), y: B + 13, text: s, anchor: edge ? "end" : i ? "middle" : "start" });
  });
  return {
    width: W,
    height: H,
    L,
    R,
    T,
    B,
    X,
    Y,
    tAt: (px) => ((px - L) * tMax) / (R - L),
    grid,
    yLabels,
    xLabels,
    clip: `M${P(0, 0)}L${P(0, m.ceil)}L${P(m.prot, m.ceil)}${fastEdge}${windowEdge}${slowEdge}L${P(m.wall, 0)}Z`,
    bands: {
      fastFull: O + paceTo(tA) + `L${P(paceEnd(tA), top + 1)}L${P(0, top + 1)}Z`,
      fastPart: O + paceTo(m.t1) + corner + `L${endOf(tA)}` + paceBack(tA) + "Z",
      window: O + paceTo(m.t1, m.t1) + `L${P(m.t2, m.goal)}` + paceBack(m.t2, m.t2) + "Z",
      slowPart: O + paceTo(m.t2) + corner + `L${endOf(tB)}` + paceBack(tB) + "Z",
      slowFull: O + paceTo(tB) + corner + `L${P(tMax, 0)}Z`,
    },
    paces: [tA, m.t1, m.t2, tB].map((ta) => S + paceTo(ta)).join(""),
    cut: `M${P(m.prot, m.ceil)}${fastEdge}${windowEdge}${slowEdge}`,
    target: Y(m.goal),
    maxX: X(m.wall),
    windowEdges: `M${X(m.t1).toFixed(1)} ${T}V${B}M${X(m.t2).toFixed(1)} ${T}V${B}`,
    hatch: compact ? null : { x: L, y: T, width: X(m.prot) - L, height: B - T },
    arrivals: arrivals.filter((t) => t <= tMax).map((t) => ({ x: X(t), y: Y(m.goal) })),
    pace: (ta, end) => S + paceTo(ta, end),
    noCutLabel: !compact && X(m.prot) - L >= 96,
    targetAbove: compact || Y(m.goal) - 4 - T >= 16,
  };
}
