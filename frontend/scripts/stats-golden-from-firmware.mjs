// Regenerates test/fixtures/stats-golden.json from the firmware Web UI: its
// own Stats chart code draws test/fixtures/stats-charts.json, so the Stats
// cards are checked against the code they were ported from.
// Usage: node scripts/stats-golden-from-firmware.mjs <path to Open-Brew-by-Weight>
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { Window } from "happy-dom";

const firmware = process.argv[2];
if (!firmware) throw new Error("Pass the firmware repository path");
const here = path.dirname(new URL(import.meta.url).pathname);
const stats = fs.readFileSync(path.join(firmware, "src/web/js/stats.js"), "utf8");
const english = JSON.parse(fs.readFileSync(path.join(firmware, "src/web/locales/en.json"), "utf8")).strings;
const block = (head) => {
  const start = stats.indexOf(head);
  if (start < 0) throw new Error(`Missing ${head}`);
  let depth = 0;
  const body = start + stats.slice(start).search(/\)\s*\{/);
  for (let i = stats.indexOf("{", body); i < stats.length; i++) {
    if (stats[i] === "{") depth++;
    else if (stats[i] === "}" && --depth === 0) return stats.slice(start, i + 1);
  }
  throw new Error(`Unbalanced ${head}`);
};
const between = (from, to) => {
  const start = stats.indexOf(from),
    end = stats.indexOf(to, start);
  if (start < 0 || end < 0) throw new Error(`Missing ${from}`);
  return stats.slice(start, end);
};

const window = new Window(),
  document = window.document,
  roots = {},
  R = {
    uiState: { statsBand: "range" },
    axisLabel: (v, u) => ((v = Math.round(+v * 10) / 10), isFinite(v) ? v + " " + u : "—"),
    sub: (text, values) => text.replace(/\{(\d+)\}/g, (_, i) => values[i]),
    escHtml: (text) => String(text),
    fadeFill: (id, color, top, base = 0) =>
      `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}" stop-opacity="${top}"/><stop offset="1" stop-color="${color}" stop-opacity="${base}"/></linearGradient>`,
    PILL: '<g class="rvPill"><rect/><text/></g>',
    placePill() {},
    bindScrub() {},
  },
  context = vm.createContext({
    R,
    $: (id) => (roots[id] ??= document.createElement("div")),
    __WEBUI_TEXT__: (key) => english[key] ?? key,
    Math,
  });
vm.runInContext(
  [
    between("const CONSISTENT = 0.05,", "function consistencyModel("),
    block("function consistencyModel("),
    block("function statsLegend("),
    block("function statsSizeLegend("),
    between("const SPREAD_SHOTS = 5,", "// The band behind the bars"),
    block("function statsBand("),
    block("function statsEwmaBand("),
    block("function statsRangeBand("),
    block("function missChart("),
    "const guardColor = (g) => (g === 1 ? \"var(--gFast)\" : \"var(--gSlow)\");",
    block("function shotPresetName("),
    block("function renderStatsConsistency("),
    between("const CUT_CLOSE_G = 0.2,", "function cutModel("),
    block("function cutModel("),
    block("function renderStatsCutAccuracy("),
    // The density chart's drawing, cut out of renderStatsDurChart.
    "function density(d) {" +
      between("const { lo, hi, a, b, shared, h } = d,", 'host.style.setProperty("--zf"') +
      "return { svg, tops, ticks: ticks.filter(([t]) => t > lo && t < hi).map(([t, s, p]) => [(t - lo) / (hi - lo), s, p]) }; }",
    "this.api = { renderStatsConsistency, renderStatsCutAccuracy, density };",
  ].join("\n"),
  context,
);
const { renderStatsConsistency, renderStatsCutAccuracy, density } = context.api;

// Every drawn shape with the attributes that place it, and the texts around.
const shapes = (svg) =>
  [...svg.children]
    .filter((e) => e.tagName.toLowerCase() !== "defs")
    .map((e) => [e.getAttribute("class") ?? "", ...["d", "x", "y", "width", "height", "cx", "cy"].map((a) => e.getAttribute(a) ?? "")]);
const texts = (nodes) => [...nodes].map((e) => e.textContent);
const miss = (root) => ({
  head: texts(root.querySelectorAll(".statsDensZones span")),
  shapes: shapes(root.querySelector(".statsDensPlot")),
  rings: [...root.querySelectorAll(".cutRing")].map((e) => e.getAttribute("cx")),
  edges: [...root.querySelectorAll(".consEdge")].map((e) => [e.textContent, e.style.top]),
  ticks: [...root.querySelectorAll(".ruleTick")].map((e) => [e.textContent, e.style.left, e.hidden]),
  legend: texts(root.querySelectorAll(".statsLegend span")),
  legendKeys: [...root.querySelectorAll(".statsLegend i")].map((e) => e.getAttribute("class")),
  pill: root.querySelector(".consPlot").getAttribute("aria-valuetext"),
  level: root.dataset.level ?? null,
  note: root.querySelector(".fieldHint")?.textContent ?? null,
});

const charts = JSON.parse(fs.readFileSync(path.join(here, "../test/fixtures/stats-charts.json"), "utf8"));
const out = {};
// One window per kind of header: one preset, a bigger window, All, the other preset.
for (const name of ["10:2", "25:2", "50:0", "100:1"]) {
  const st = charts[name].stats;
  {
  const only = st.preset,
    names = new Map(st.facets.presets),
    p = st.cons.p,
    shots = st.cons.t
      .map((t, i) => {
        const presetId = Array.isArray(p) ? p[i] : p;
        return { arrivalS: t / 10, presetId, presetName: names.get(presetId), guard: st.cons.g?.[i] || 0 };
      })
      .filter((r) => !only || r.presetId === only),
    d = !only || st.dens[1] === true ? st.dens[0] : st.dens[1],
    dens = density(d),
    svg = new window.DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${dens.svg}</svg>`, "image/svg+xml");
  out[name] = {
    density: {
      paths: [...svg.documentElement.children].filter((e) => e.tagName === "path").map((e) => e.getAttribute("d")),
      tops: texts(new window.DOMParser().parseFromString(`<div>${dens.tops}</div>`, "text/html").querySelectorAll("span")),
      ticks: dens.ticks,
    },
  };
  for (const band of ["range", "ewma"]) {
    R.uiState.statsBand = band;
    renderStatsConsistency(shots);
    renderStatsCutAccuracy(st, !only && ((id) => names.get(id)));
    out[name][band] = { consistency: miss(roots.statsConsistency), cut: miss(roots.statsCutAccuracy) };
  }
  }
}
fs.writeFileSync(path.join(here, "../test/fixtures/stats-golden.json"), JSON.stringify(out, null, 1) + "\n");
await window.happyDOM.close();
