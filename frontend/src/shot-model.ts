// The last shot as the firmware Web UI models it, ported from
// src/web/js/runtime.js (decodeCurveDeltas, buildShotSparkModel,
// shotRuleModel) and src/web/js/stats.js (curveAt). test/shot-model.test.ts
// checks the result against output generated from that code.
import { buildRuleChartModel, type RuleModel } from "./preset-chart";

/** A Stats row with its curve, as the integration's subscription sends it. */
export type ShotRow = Record<string, unknown> & { curve?: Record<string, unknown> };

/** What a stretch of the curve was doing: on recipe, extended, shortened, or scale lost. */
export type SegmentKind = "bbw" | "fast" | "slow" | "atm";

export interface Point {
  t: number;
  /** Weight in centigrams, or flow in centigrams per second. */
  cg: number;
}

export interface Segment {
  kind: SegmentKind;
  pts: Point[];
}

export interface ShotModel {
  truncated: boolean;
  dur: number;
  timeMax: number;
  firstDropS: number | null;
  tareS: number | null;
  segs: Segment[];
  dripSegs: Segment[];
  finalPoint: Point | null;
  pts: Point[];
  held: Point[];
  rawMaxW: number;
  maxW: number;
  flowSegs: Segment[];
  dripFlowSegs: Segment[];
  flowStart: Point | null;
  flowCurve: (number | null)[];
  maxFlow: number | null;
  flowMax: number;
}

/** Weight points from the curve's base64 delta stream ("wD"). */
export function decodeCurveDeltas(text: unknown, ref?: [number, number]) {
  let b: string;
  try {
    b = atob(String(text));
  } catch {
    return null;
  }
  const wAtMs: number[] = [],
    wCg: number[] = [],
    u = (i: number) => (i + 2 > b.length ? NaN : b.charCodeAt(i) | (b.charCodeAt(i + 1) << 8));
  let [t, w] = ref || [0, 0];
  for (let i = 0, x; i < b.length; ) {
    x = b.charCodeAt(i++);
    t = x === 255 ? u((i += 2) - 2) : t + x;
    x = b.charCodeAt(i++);
    w = x === 128 ? (u((i += 2) - 2) << 16) >> 16 : w + ((x << 24) >> 24);
    if (!(t >= 0) || i > b.length || Number.isNaN(x)) return null;
    wAtMs.push(t);
    wCg.push(w);
  }
  return typeof text === "string" ? { wAtMs, wCg } : null;
}

/** The row with its curve decoded and its scalars beside the columns. */
export function expandShot(row: ShotRow): Record<string, unknown> | null {
  const { wD, wRef, ...scalars } = row.curve ?? {},
    points = decodeCurveDeltas(wD, wRef as [number, number] | undefined);
  return points ? { ...row, ...scalars, ...points } : null;
}

// Derive one estimate per distinct accepted endpoint, without resampling weights.
// Held readings (a hand on the cup) are what the scale showed, not coffee: they
// sit beside the weight line and no flow window may touch them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildShotSparkModel(shot: any): ShotModel | null {
  if (!shot) return null;
  const w: number[] = Array.isArray(shot.wCg) ? shot.wCg : [],
    at: number[] = shot.wAtMs,
    markers: number[] = shot.wBreakBefore ?? [],
    heldIndex: number[] = shot.wHeld ?? [],
    indices = (list: unknown) =>
      !Array.isArray(list) ||
      list.some((v, i) => !Number.isInteger(v) || v < 0 || v >= w.length || (i && v <= list[i - 1]));
  if (
    !Array.isArray(at) ||
    at.length !== w.length ||
    w.length > 1201 ||
    indices(markers) ||
    indices(heldIndex) ||
    at.some((t, i) => !Number.isInteger(t) || t < 0 || t > 60000 || (i && t < at[i - 1]))
  )
    return null;
  const breaks = new Set(markers),
    held = new Set(heldIndex),
    num = (v: unknown) => (v == null || !Number.isFinite(+(v as number)) ? null : +(v as number));
  const end = num(shot.endS),
    duration = num(shot.durationS),
    drop = num(shot.dropS) ?? num(shot.firstDropS),
    tare = num(shot.tareS),
    ext = num(shot.extendedS),
    atm = num(shot.atmS),
    clear = num(shot.atmClearedS),
    limit = Math.round((end ?? duration ?? Infinity) * 1000);
  // Weight stays on-recipe until a guard fires at extendedS; only then does it
  // take that guard's color.
  const guard: SegmentKind = shot.extractionExtended
      ? "fast"
      : shot.slowExtractionExtended
        ? "slow"
        : (({ fast: "fast", slow: "slow" }) as Record<string, SegmentKind>)[shot.verdict] || "bbw",
    kind = (t: number): SegmentKind =>
      atm != null && t >= atm && (clear == null || t < clear) ? "atm" : ext != null && t >= ext ? guard : "bbw";
  const transitions = [ext, atm, clear].filter((t): t is number => t != null).sort((a, b) => a - b),
    segs: Segment[] = [],
    dripSegs: Segment[] = [],
    pts: Point[] = [],
    flowSegs: Segment[] = [],
    dripFlowSegs: Segment[] = [],
    flowCurve: (number | null)[] = Array(w.length).fill(null),
    observations: { t: number; cg: number; index: number; segment: number }[] = [],
    heldPts: Point[] = [],
    // A contact's leading edge may pass as weight one sample early.
    touched: [number, number][] = [];
  let maxFlow: number | null = null,
    plotMaxFlow = 0,
    segment = 0,
    weightPrevious: Point | null = null;
  // Color splits interpolate only the drawn line; they are never measured rates.
  const append = (segments: Segment[], p: Point, previous: Point | null) => {
    const add = (q: Point) => {
      const k = kind(q.t),
        s = segments.at(-1);
      if (!s || !previous || s.kind !== k) segments.push({ kind: k, pts: [q] });
      else s.pts.push(q);
      previous = q;
    };
    if (previous)
      for (const t of transitions) {
        const from: Point = previous!;
        if (t > from.t && t <= p.t && kind(t) !== kind(from.t)) {
          const q: Point = { t, cg: from.cg + ((p.cg - from.cg) * (t - from.t)) / (p.t - from.t) },
            s = segments.at(-1)!;
          s.pts.push(q);
          previous = q;
          add(q);
        }
      }
    add(p);
  };
  for (let i = 0; i < w.length; i++) {
    if (breaks.has(i)) segment++;
    const drip = at[i] > limit;
    if (drip && end == null) continue;
    if (!Number.isFinite(w[i])) {
      segment++;
      weightPrevious = null;
      continue;
    }
    const p = { t: at[i] / 1000, cg: w[i] };
    if (held.has(i)) {
      if (breaks.has(i)) weightPrevious = null;
      if (touched.at(-1)?.[1]! >= at[i] - 500) touched.at(-1)![1] = at[i];
      else touched.push([at[i] - 500, at[i]]);
      heldPts.push(p);
      continue;
    }
    if (breaks.has(i)) weightPrevious = null;
    if (drip && !dripSegs.length && weightPrevious) append(dripSegs, weightPrevious, null);
    append(drip ? dripSegs : segs, p, weightPrevious);
    weightPrevious = p;
    pts.push(p);
    const last = observations.at(-1),
      gray = atm != null && p.t >= atm && (clear == null || p.t < clear);
    if (gray) {
      segment++;
      continue;
    }
    if (last && atm != null && last.t < Math.round(atm * 1000) && at[i] >= Math.round(atm * 1000)) segment++;
    if (last && clear != null && last.t < Math.round(clear * 1000) && at[i] >= Math.round(clear * 1000))
      segment++;
    const observation = { t: at[i], cg: w[i], index: i, segment };
    if (last && last.segment === segment && last.t === at[i]) observations[observations.length - 1] = observation;
    else observations.push(observation);
  }
  let boundary = 0,
    previousFlow: Point | null = null,
    flowStart: Point | null = null;
  const dropSegment = observations.findLast((p) => p.t <= Math.round(drop! * 1000))?.segment;
  for (let i = 0; i < observations.length; i++) {
    const p = observations[i],
      previous = observations[i - 1];
    if (!previous || p.segment !== previous.segment) {
      boundary = i;
      previousFlow = null;
      continue;
    }
    const span = Math.max(1000, p.t - previous.t),
      start = p.t - span;
    while (boundary + 1 < i && observations[boundary + 1].t <= start) boundary++;
    const a = observations[boundary],
      b = observations[boundary + 1];
    if (
      a.segment !== p.segment ||
      a.t > start ||
      (drop != null && a.t < Math.round(drop * 1000)) ||
      touched.some(([from, to]) => start <= to && p.t >= from)
    ) {
      previousFlow = null;
      continue;
    }
    const startCg = a.t === start ? a.cg : a.cg + ((b.cg - a.cg) * (start - a.t)) / (b.t - a.t);
    const rate = Math.max(0, ((p.cg - startCg) * 10) / span),
      point = { t: (p.t - span / 2) / 1000, cg: rate * 100 };
    const drip = p.t > limit,
      cutoff = limit / 1000;
    flowCurve[p.index] = rate;
    plotMaxFlow = Math.max(plotMaxFlow, rate);
    if (!drip) maxFlow = Math.max(maxFlow ?? 0, rate);
    if (!drip && !flowSegs.length && drop! > 0 && p.segment === dropSegment) flowStart = point;
    if (drip && point.t < cutoff) {
      previousFlow = point;
      continue;
    }
    if (drip && !dripFlowSegs.length && previousFlow) {
      const q = {
        t: cutoff,
        cg: previousFlow.cg + ((point.cg - previousFlow.cg) * (cutoff - previousFlow.t)) / (point.t - previousFlow.t),
      };
      if (flowSegs.length) append(flowSegs, q, previousFlow);
      append(dripFlowSegs, q, null);
      previousFlow = q;
    }
    append(drip ? dripFlowSegs : flowSegs, point, previousFlow);
    previousFlow = point;
  }
  // Exact event annotations cannot supply estimator support.
  for (const [t, cg] of [
    [drop, num(shot.dropCg)],
    [ext, num(shot.extCg)],
    [atm, num(shot.atmCg)],
  ]) {
    if (t == null || t < 0 || Math.round(t * 1000) > limit || cg == null) continue;
    const p = { t, cg };
    pts.push(p);
    segs.push({ kind: kind(t), pts: [p] });
  }
  const dur = Math.max(duration || 0, end || 0, ...pts.map((p) => p.t), 0);
  if (!pts.length || dur <= 0) return null;
  const rawMaxW = Math.max(shot.goalG || 0, ...pts.map((p) => p.cg / 100), 0);
  const lastDrip = dripSegs.at(-1)?.pts.at(-1),
    finalPoint = !shot.wTruncated && lastDrip?.cg === num(shot.endCg) ? lastDrip! : null;
  return {
    truncated: !!shot.wTruncated,
    dur,
    timeMax: Math.max(10, Math.ceil(dur / 10) * 10),
    firstDropS: drop! > 0 ? drop : null,
    tareS: tare! > 0 ? tare : null,
    segs,
    dripSegs,
    finalPoint,
    pts,
    held: heldPts,
    rawMaxW,
    maxW: Math.max(10, Math.ceil(rawMaxW / 10) * 10),
    flowSegs,
    dripFlowSegs,
    flowStart,
    flowCurve,
    maxFlow,
    flowMax: Math.max(0.5, Math.ceil(plotMaxFlow / 0.5) * 0.5),
  };
}

/** The shot's own preset graph, from the rule it ran with (never the live preset). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shotRuleModel(r: any): RuleModel | null {
  const timer = String(r.shotType || "").toLowerCase() === "timer_only";
  return buildRuleChartModel({
    id: 0,
    name: "",
    goalWeightG: r.goalG,
    fastBeforeS: r.fastBeforeS,
    slowAfterS: r.slowAfterS,
    bbwProtectionMs: r.delayS * 1e3,
    operationalWallMs: r.wallS * 1e3,
    fastExtractionGuardEnabled: !timer && r.extractionGuardEnabled,
    slowExtractionGuardEnabled: !timer && r.slowExtractionGuardEnabled,
    fastMarginG: r.fastMarginG,
    slowMarginG: r.slowMarginG,
    firstDropS: r.firstDropS,
    brewByWeight: !timer,
    fastRampS: r.fastRampS,
    slowRampS: r.slowRampS,
    fastCurve: r.fastCurve,
    slowCurve: r.slowCurve,
    fastCurveHardness: r.fastCurveHardness,
    slowCurveHardness: r.slowCurveHardness,
  });
}

/** The value of a time-sorted curve at t, linear between samples and held at its ends. */
export function curveAt(curve: Point[], t: number) {
  let i = 0;
  while (i < curve.length - 2 && curve[i + 1].t < t) i++;
  const a = curve[i],
    b = curve[i + 1] ?? a,
    k = b.t > a.t ? Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))) : 0;
  return (a.cg + (b.cg - a.cg) * k) / 100;
}
