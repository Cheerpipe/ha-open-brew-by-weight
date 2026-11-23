// The controller Web UI's Stats charts (Shot time, Shot consistency, Cut
// accuracy), ported from its stats.js: the same figures, bands, bars and
// limits over the same header, which the firmware builds and the integration
// relays. test/fixtures/stats-golden.json pins it to the firmware's output.

/** One density chart of the header's `dens`. */
export interface Density {
  lo: number;
  hi: number;
  a: number;
  b: number;
  shared: boolean;
  n: [number, number, number];
  h: number[];
}

/** The Web UI Stats header, as the integration relays it. */
export interface StatsHeader {
  window?: number;
  shotCount?: number;
  dens?: (Density | true | null)[];
  cons?: { t: number[]; p: number | number[]; g?: number[] };
  facets?: { presets: [number, string][]; scales: [number, string][] };
  preset?: number;
  cut?: { t: number | number[]; p: number | number[]; e: number[]; g?: number[] };
}

/** What the stats subscription sends: the header, the history's good shots, and who built it. */
export interface StatsChart {
  good: number;
  stats: StatsHeader;
  /** A companion keeping the shot archive covers the whole history; the controller its own. */
  source?: "companion" | "controller";
}

export const WINDOWS = [10, 25, 50, 100, 500, 1000] as const;

/**
 * The windows offered over `good` shots: each smaller one plus the first
 * covering them; past 100 only over the companion's whole history.
 */
export function windowChoices(good: number, companion = false) {
  const sizes = WINDOWS.filter((w) => companion || w <= 100);
  return sizes.filter((_, i) => i === 0 || sizes[i - 1] < good);
}

/** The preset the charts follow: the chosen one, else the active one, else All (0). */
export function chartPreset(chosen: number, active: number, header: StatsHeader | undefined) {
  const has = (id: number) => (header?.facets?.presets ?? []).some(([p]) => p === id);
  return chosen === 0 || !header || has(chosen) ? chosen : has(active) ? active : 0;
}

/** The Web UI's axis label: one decimal and the unit. */
export const axisLabel = (v: number, u: string) => {
  v = Math.round(+v * 10) / 10;
  return isFinite(v) ? `${v} ${u}` : "—";
};

// ── Shot time ───────────────────────────────────────────────────────────────

export type ZoneKey = "fast" | "on_recipe" | "slow";

export interface DensityZone {
  key: ZoneKey;
  t0: number;
  t1: number;
  /** The zone's area and outline on the 0–100 × 0–50 plot. */
  area: string;
  line: string;
  count: number;
  pct: number;
}

export interface DensityModel {
  d: Density;
  zones: DensityZone[];
  /** The time's position, 0–100. */
  x: (t: number) => number;
  /** The curve's height at a time, 0–100 of its peak. */
  dens: (t: number) => number;
  /** The curve's area, for the share of shots near a time. */
  area: number;
  /** Where the cursor starts: the peak. */
  peakT: number;
}

/** The density chart: its three zones, shares adding up to 100 %. */
export function densityModel(d: Density): DensityModel {
  const { lo, hi, a, b, h } = d,
    x = (t: number) => (((t - lo) / (hi - lo)) * 100).toFixed(2),
    dens = (t: number) => {
      const k = ((t - lo) / (hi - lo)) * 120,
        i = Math.max(0, Math.min(119, Math.floor(k)));
      return h[i] + (h[i + 1] - h[i]) * (k - i);
    },
    xs = Array.from({ length: 121 }, (_, i) => lo + ((hi - lo) * i) / 120),
    peak = 100,
    n: Record<ZoneKey, number> = { fast: d.n[0], on_recipe: d.n[1], slow: d.n[2] },
    total = d.n[0] + d.n[1] + d.n[2],
    pct = {} as Record<ZoneKey, number>;
  // Rounding the running total keeps the shares adding up to 100%.
  let sum = 0,
    done = 0;
  for (const k of ["fast", "on_recipe", "slow"] as ZoneKey[])
    done += pct[k] = Math.round((100 * (sum += n[k])) / total) - done;
  const zones = (
    [
      ["fast", lo, a],
      ["on_recipe", a, b],
      ["slow", b, hi],
    ] as [ZoneKey, number, number][]
  ).map(([key, t0, t1]) => {
    const line = [t0, ...xs.filter((t) => t > t0 && t < t1), t1]
      .map((t) => x(t) + " " + (50 - (46 * dens(t)) / peak).toFixed(2))
      .join(" L");
    return { key, t0, t1, area: `M${x(t0)} 50 L${line} L${x(t1)} 50Z`, line: `M${line}`, count: n[key], pct: pct[key] };
  });
  const dx = (hi - lo) / 120;
  return {
    d,
    zones,
    x: (t) => +x(t),
    dens,
    area: h.reduce((s, v, i) => s + (i && (v + h[i - 1]) / 2), 0) * dx,
    peakT: lo + h.indexOf(Math.max(...h)) * dx,
  };
}

/** The axis ticks: the window edges first, then every 5 s out from them, with priorities. */
export function densityTicks(d: Density, edge: (start: boolean) => string, s: string) {
  const { lo, hi, a, b, shared } = d,
    ticks: [number, string, number][] = [
      [a, shared ? axisLabel(a, s) : edge(true), 80],
      [b, shared ? axisLabel(b, s) : edge(false), 80],
    ];
  for (let k = 5; k < hi - lo; k += 5)
    ticks.push(
      [a - k, shared ? axisLabel(a - k, s) : "−" + axisLabel(k, s), 20],
      [b + k, shared ? axisLabel(b + k, s) : "+" + axisLabel(k, s), 20],
    );
  return ticks.filter(([t]) => t > lo && t < hi).map(([t, text, p]) => ({ at: (t - lo) / (hi - lo), text, p }));
}

export interface Tick {
  at: number;
  text: string;
  p: number;
}

/**
 * Which ticks fit, as the Web UI lays them out: highest priority first, each
 * kept inside the axis and 4 px clear of the ones already kept. Returns each
 * kept tick's left edge in px.
 */
export function layoutTicks(ticks: Tick[], width: number, measure: (text: string) => number) {
  const used: [number, number][] = [],
    kept: (Tick & { left: number })[] = [];
  for (const tick of [...ticks].sort((p, q) => q.p - p.p)) {
    const w = measure(tick.text),
      centre = tick.at * width,
      left = centre - w / 2 < 0 ? 0 : centre + w / 2 > width ? width - w : centre - w / 2;
    if (used.every(([l, r]) => left + w + 4 <= l || r + 4 <= left)) {
      used.push([left, left + w]);
      kept.push({ ...tick, left });
    }
  }
  return kept.sort((p, q) => p.at - q.at);
}

// ── Consistency and cut accuracy ────────────────────────────────────────────

export const CONSISTENT = 0.05,
  VARIED = 0.1,
  SPREAD_SHOTS = 5,
  BAND_WEIGHT = 0.5,
  BAND_MIN_SHOTS = 3,
  CUT_CLOSE_G = 0.2,
  CUT_FAR_G = 0.5;

export type Size = "near" | "mid" | "far";
export const sizeOf = (v: number, near: number, far: number): Size =>
  Math.abs(v) <= near + 1e-9 ? "near" : Math.abs(v) <= far + 1e-9 ? "mid" : "far";

/** One timed shot of the header's `cons`. */
export interface TimedShot {
  arrivalS: number;
  presetId: number;
  presetName?: string;
  guard: number;
}

/** The header's timed shots, oldest first, named by the facets. */
export function timedShots(header: StatsHeader): TimedShot[] {
  const names = new Map(header.facets?.presets ?? []),
    p = header.cons?.p;
  return (header.cons?.t ?? []).map((t, i) => {
    const presetId = (Array.isArray(p) ? p[i] : p) ?? 0;
    return { arrivalS: t / 10, presetId, presetName: names.get(presetId), guard: header.cons!.g?.[i] || 0 };
  });
}

export type Level = "good" | "fair" | "poor" | "few";

/**
 * Each shot's time to target as a share of its own preset's average; the
 * level is the median distance from it, so one odd shot cannot decide it.
 */
export function consistencyModel(rows: TimedShot[]) {
  const n = rows.length,
    avg: Record<number, number> = {},
    lists: Record<number, number[]> = {};
  for (const r of rows) (lists[r.presetId] ??= []).push(r.arrivalS);
  for (const k in lists) avg[k] = lists[k].reduce((s, v) => s + v, 0) / lists[k].length;
  const rel = rows.map((r) => r.arrivalS / avg[r.presetId] - 1),
    d = rel.map(Math.abs).sort((p, q) => p - q),
    typical = n < 5 ? null : (d[(n - 1) >> 1] + d[n >> 1]) / 2,
    // One preset reads in seconds (sec is its average), several in percent.
    sec = Object.keys(lists).length === 1 ? avg[rows[0].presetId] : 0,
    raw = Math.min(6 * CONSISTENT, Math.max(2 * CONSISTENT, Math.max(0, ...rel.map(Math.abs)) * 1.15)),
    step = sec ? (raw * sec < 2 ? 0.5 : 1) / sec : 0.05;
  return {
    rows,
    rel,
    sec,
    typical,
    M: Math.ceil(raw / step - 1e-9) * step,
    level: (typical == null ? "few" : typical <= CONSISTENT ? "good" : typical <= VARIED ? "fair" : "poor") as Level,
    spread: n ? Math.max(...rel) - Math.min(...rel) : 0,
  };
}

export interface CutRow {
  targetG: number;
  presetId: number;
  missG: number;
  guard: number;
}
export type CutKind = Size | "bull" | "guard g1" | "guard g2";

/** How far each automatic stop settled from its target; guard stops are drawn, not scored. */
export function cutModel(cut: NonNullable<StatsHeader["cut"]>) {
  const rows: CutRow[] = cut.e.map((e, i) => ({
      targetG: (Array.isArray(cut.t) ? cut.t[i] : cut.t) / 10,
      presetId: Array.isArray(cut.p) ? cut.p[i] : cut.p,
      missG: e / 100,
      guard: cut.g?.[i] || 0,
    })),
    kind = (r: CutRow): CutKind =>
      r.guard
        ? (`guard g${r.guard}` as CutKind)
        : !Math.round(r.missG * 100)
          ? "bull"
          : sizeOf(r.missG, CUT_CLOSE_G, CUT_FAR_G),
    scored = rows.filter((r) => !r.guard),
    mean = (f: (r: CutRow) => number) => scored.reduce((s, r) => s + f(r), 0) / (scored.length || 1),
    max = Math.max(0, ...scored.map((r) => Math.abs(r.missG)));
  return {
    rows,
    kind,
    scored: scored.length,
    bulls: scored.filter((r) => kind(r) === "bull").length,
    within: scored.filter((r) => Math.abs(r.missG) <= CUT_CLOSE_G + 1e-9).length,
    miss: mean((r) => Math.abs(r.missG)),
    lean: mean((r) => r.missG),
    // At least ±0.5 g, at most ±1.5 g, in 0.25 g steps over the scored misses.
    M: Math.min(1.5, Math.max(0.5, Math.ceil((max * 1.15) / 0.25 - 1e-9) * 0.25)),
  };
}

export type BandMode = "range" | "ewma";

/** A path on the 0–100 × 0–50 plot and the size class it is drawn in. */
export interface SizedPath {
  k: Size;
  d: string;
}

export interface MissGeometry {
  n: number;
  /** The column count: at least ten, latest on the right. */
  W: number;
  gap: number;
  half: number;
  X: (i: number) => number;
  Y: (v: number) => number;
  f: (v: number) => string;
}

export function missGeometry(n: number, M: number): MissGeometry {
  const W = Math.max(10, n),
    gap = 94 / (W - 1);
  return {
    n,
    W,
    gap,
    half: gap * 0.27,
    X: (i) => 3 + (W - n + i) * gap,
    Y: (v) => 25 - (23 * Math.max(-M, Math.min(M, v))) / M,
    f: (v) => v.toFixed(2),
  };
}

/**
 * "ewma": the recent average of the counted shots plus or minus their spread,
 * each older shot weighing half as much as the next; hidden below three.
 */
export function ewmaBand(vals: number[], counts: (i: number) => boolean, near: number, far: number, g: MissGeometry) {
  const band: { i: number; m: number; hi: number; lo: number; k: Size }[] = [];
  for (let i = 0, k = 0, m = 0, v = 0, d = 0; i < vals.length; i++) {
    if (counts(i)) {
      const e = vals[i] - m;
      if (k++) {
        m += BAND_WEIGHT * e;
        v = (1 - BAND_WEIGHT) * (v + BAND_WEIGHT * e * e);
        d += BAND_WEIGHT * (Math.abs(vals[i]) - d);
      } else ((m = vals[i]), (d = Math.abs(m)));
    }
    if (k >= BAND_MIN_SHOTS) {
      const s = Math.sqrt(v);
      band.push({ i, m, hi: Math.max(0, m + s), lo: Math.min(0, m - s), k: sizeOf(d, near, far) });
    }
  }
  const { X, Y, f } = g,
    spread: SizedPath[] = [];
  for (let i = 1; i < band.length; i++) {
    const p = band[i - 1],
      q = band[i];
    spread.push({
      k: q.k,
      d:
        "M" +
        [
          [X(p.i), Y(p.hi)],
          [X(q.i), Y(q.hi)],
          [X(q.i), Y(q.lo)],
          [X(p.i), Y(p.lo)],
        ]
          .map((pt) => f(pt[0]) + " " + f(pt[1]))
          .join("L") +
        "Z",
    });
  }
  return { spread, mean: band.length ? "M" + band.map((p) => f(X(p.i)) + " " + f(Y(p.m))).join("L") : null };
}

/**
 * "range": the spread of the last five counted shots, fading from its edges to
 * the centre line, each half in the size of its own farthest shot.
 */
export function rangeBand(vals: number[], counts: (i: number) => boolean, near: number, far: number, g: MissGeometry) {
  const { n, X, Y, half, f } = g,
    spread: (number[] | null)[] = [],
    out: SizedPath[] = [];
  for (let i = 0, win: number[] = []; i < n; i++) {
    if (counts(i)) win = [...win, vals[i]].slice(-SPREAD_SHOTS);
    spread.push(win.length ? win : null);
  }
  const up = (y: number) => Math.min(y, 25),
    down = (y: number) => Math.max(y, 25),
    part = (k: Size, x0: number, a0: number, b0: number, x1: number, a1: number, b1: number) => {
      if (Math.max(b0 - a0, b1 - a1) > 0.01)
        out.push({
          k,
          d: [x0, a0, x1, a1, x1, b1, x0, b0].map((v, i) => (i % 2 ? " " : i ? "L" : "M") + f(v)).join("") + "Z",
        });
    };
  let prev: { x: number; hi: number; lo: number; up: Size; down: Size } | null = null;
  for (let i = 0; i < n; i++) {
    const w = spread[i];
    if (!w) continue;
    const s = {
        x: X(i),
        hi: Y(Math.max(...w)),
        lo: Y(Math.min(...w)),
        up: sizeOf(Math.max(0, ...w), near, far),
        down: sizeOf(Math.min(0, ...w), near, far),
      },
      L = s.x - half;
    if (prev) {
      part(prev.up, prev.x + half, up(prev.hi), up(prev.lo), L, up(s.hi), up(s.lo));
      part(prev.down, prev.x + half, down(prev.hi), down(prev.lo), L, down(s.hi), down(s.lo));
    }
    part(s.up, L, up(s.hi), up(s.lo), s.x + half, up(s.hi), up(s.lo));
    part(s.down, L, down(s.hi), down(s.lo), s.x + half, down(s.hi), down(s.lo));
    prev = s;
  }
  return out;
}

/** One shot's column: a tinted bar under a solid tip, or a dashed rim for a guard stop. */
export interface MissBar {
  cls: string;
  /** A bullseye: a ring on the line instead of a bar. */
  ring: boolean;
  x: string;
  w: string;
  y: string;
  h: string;
  /** The tip (solid) or the rim (dashed, guard stops). */
  edge: string;
  rim: boolean;
  /** Past the scale: a dashed mark at the plot's edge. */
  over: string | null;
}

export function missBars(
  vals: number[],
  M: number,
  g: MissGeometry,
  cls: (i: number) => string,
  guard: (i: number) => number,
  ring: (i: number) => boolean = () => false,
): MissBar[] {
  const { X, Y, half, f } = g;
  return vals.map((v, i) => {
    const x = f(X(i) - half),
      w = f(2 * half),
      y = Y(v),
      h = Math.abs(y - 25),
      rim = !!guard(i);
    return {
      cls: cls(i),
      ring: ring(i),
      x,
      w,
      y: f(h < 0.6 ? 24.7 : Math.min(y, 25)),
      h: f(Math.max(h, 0.6)),
      edge: rim ? `M${x} 25V${f(y)}h${w}V25` : `M${x} ${f(y)}h${w}`,
      rim,
      over: Math.abs(v) > M ? `M${x} ${v > 0 ? 1 : 49}h${w}` : null,
    };
  });
}

/** The Web UI's grams: two decimals, a trailing zero dropped. */
export function grams(v: number) {
  const t = (Math.round(v * 100) / 100).toFixed(2);
  return t.endsWith("0") ? t.slice(0, -1) : t;
}
