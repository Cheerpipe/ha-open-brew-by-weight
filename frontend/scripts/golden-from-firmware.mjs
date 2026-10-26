// Regenerates test/fixtures/preset-golden.json from the firmware Web UI, so
// the card's chart math is checked against the code it was ported from.
// Usage: node scripts/golden-from-firmware.mjs <path to Open-Brew-by-Weight>
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const firmware = process.argv[2];
if (!firmware) throw new Error("Pass the firmware repository path");
const runtime = fs.readFileSync(path.join(firmware, "src/web/js/runtime.js"), "utf8");
const stats = fs.readFileSync(path.join(firmware, "src/web/js/stats.js"), "utf8");
const block = (head, source = runtime) => {
  const start = source.indexOf(head);
  if (start < 0) throw new Error(`Missing ${head}`);
  let depth = 0;
  // The body opens at ") {", after any default-object parameters.
  const body = start + source.slice(start).search(/\)\s*\{/);
  for (let i = source.indexOf("{", body); i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`Unbalanced ${head}`);
};
const english = JSON.parse(
  fs.readFileSync(path.join(firmware, "src/web/locales/en.json"), "utf8"),
).strings;
const context = vm.createContext({
  __WEBUI_TEXT__: (key) => english[key] ?? key,
  sub: (text, values) => text.replace(/\{(\d+)\}/g, (_, i) => values[i]),
  atob,
});
vm.runInContext(
  [
    "const PACE_SOFT = 0.18;",
    "const PILL = '';",
    block("function buildRuleChartModel("),
    block("function rampCurveIndex("),
    runtime.slice(runtime.indexOf("const RAMP_CURVES = ["), runtime.indexOf("];", runtime.indexOf("const RAMP_CURVES = [")) + 2),
    block("function rampEase("),
    block("function rampDg("),
    block("function cutLine("),
    block("function paceStartNote("),
    block("function referencePace("),
    block("function fadeFill("),
    block("function escHtml("),
    block("function presetGraph("),
    block("function decodeCurveDeltas("),
    block("function buildShotSparkModel("),
    block("function shotRuleModel("),
    block("function verdictLabel("),
    block("function formatShotEnded("),
    block("function lastCurveWeightG(", stats),
    block("function shotDisplayActualG(", stats),
    block("function shotDisplayFlowGS(", stats),
    block("function shotCut(", stats),
    "this.api = { buildRuleChartModel, cutLine, presetGraph, decodeCurveDeltas, buildShotSparkModel, shotRuleModel, formatShotEnded, shotDisplayActualG, shotDisplayFlowGS, shotCut };",
  ].join("\n"),
  context,
);
const {
  buildRuleChartModel,
  cutLine,
  presetGraph,
  decodeCurveDeltas,
  buildShotSparkModel,
  shotRuleModel,
  formatShotEnded,
  shotDisplayActualG,
  shotDisplayFlowGS,
  shotCut,
} = context.api;

const presets = JSON.parse(
  fs.readFileSync(path.join(firmware, "src/tests/fixtures/integration_presets.json"), "utf8"),
);
const base = presets.items[0];
const cases = {
  double: base,
  noGuards: { ...base, fastExtractionGuardEnabled: false, slowExtractionGuardEnabled: false },
  timerOnly: { ...base, brewByWeight: false, firstDropS: 0, firstDropN: 0 },
  tightWindow: { ...base, fastBeforeS: 14, slowAfterS: 18, operationalWallMs: 25000, goalWeightG: 18 },
  invalid: { ...base, slowAfterS: 20 },
  // Each side's own transition: Fast steep late and hard over 2 s, Slow steep
  // early over 8 s.
  curves: {
    ...base,
    fastRampS: 2,
    fastCurve: "late",
    fastCurveHardness: "hard",
    slowRampS: 8,
    slowCurve: "early",
    slowCurveHardness: "medium",
  },
};
const out = { models: {}, cutLine: {}, graphs: {} };
for (const [name, preset] of Object.entries(cases)) {
  const model = JSON.parse(JSON.stringify(buildRuleChartModel(preset)));
  out.models[name] = model;
  if (model.mode === "empty") continue;
  out.cutLine[name] = Array.from({ length: 121 }, (_, i) => {
    const t = (model.wall * i) / 120;
    return [t, cutLine(t, model)];
  });
  for (const [width, compact] of [
    [600, false],
    [320, false],
    [400, true],
  ]) {
    const host = { clientWidth: width, id: "g", innerHTML: "" };
    presetGraph(host, model, { arrivals: preset.arrivalsS || [], compact });
    out.graphs[`${name}-${width}${compact ? "-compact" : ""}`] = host.innerHTML;
  }
}
// The last shot: the integration fixture as a row with its curve, plus
// variants that exercise drips, guards, touches, scale loss, and truncation.
const last = JSON.parse(
  fs.readFileSync(path.join(firmware, "src/tests/fixtures/integration_last_shot.json"), "utf8"),
);
const row = Object.fromEntries(last.cols.split(",").map((c, i) => [c, last.shot[i]]));
const { wD, wRef, ...scalars } = last.shot.at(-1);
const shot = { ...row, ...scalars, ...decodeCurveDeltas(wD, wRef) };
const shots = {
  base: shot,
  drip: { ...shot, endS: 29.4 },
  fast: { ...shot, endS: 29.4, verdict: "fast", extractionExtended: true, extendedS: 20, extCg: 1800 },
  held: { ...shot, wHeld: [120, 121, 122], wBreakBefore: [200] },
  scaleLoss: { ...shot, atmS: 15, atmCg: 900, atmClearedS: 18 },
  truncated: { ...shot, wTruncated: true, durationS: 25, endS: null },
  timerOnly: { ...shot, shotType: "timer_only" },
  scaleLossEnd: { ...shot, actualG: null, estimatedG: 35.4, stopDetail: "auto_to_manual", avgFlowGS: null },
  cupRemoved: { ...shot, stopDetail: "cup_removed", actualWeightSource: "last_known", endS: 29.4 },
};
out.shots = {};
for (const [name, value] of Object.entries(shots)) {
  const model = JSON.parse(JSON.stringify(buildShotSparkModel(value)));
  if (!model) throw new Error(`The firmware drew no model for ${name}`);
  const rule = JSON.parse(JSON.stringify(shotRuleModel(value)));
  const host = { clientWidth: 600, id: "g", innerHTML: "" };
  if (rule.mode !== "empty")
    presetGraph(host, rule, {
      compact: true,
      tens: true,
      last: model.segs.map((s) => s.pts.map((q) => [q.t, q.cg / 100])),
      drip: model.dripSegs.map((s) => s.pts.map((q) => [q.t, q.cg / 100])),
      held: model.held.map((q) => [q.t, q.cg / 100]),
      maxG: model.rawMaxW,
      maxT: Math.max(rule.wall, model.dur),
    });
  // The Stats card's field helpers, on the same shot.
  const actual = shotDisplayActualG(value.actualG, value.wCg);
  const fields = {
    actual,
    flow: shotDisplayFlowGS(value),
    cut: shotCut(value, buildShotSparkModel(value), actual),
    ended: formatShotEnded(value.stopDetail, value.verdict),
  };
  out.shots[name] = { input: value, model, rule, graph: host.innerHTML, fields };
}
const target = path.join(import.meta.dirname, "..", "test", "fixtures", "preset-golden.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${target}`);
