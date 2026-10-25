// Regenerates test/fixtures/preset-golden.json from the firmware Web UI, so
// the card's chart math is checked against the code it was ported from.
// Usage: node scripts/golden-from-firmware.mjs <path to Open-Brew-by-Weight>
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const firmware = process.argv[2];
if (!firmware) throw new Error("Pass the firmware repository path");
const runtime = fs.readFileSync(path.join(firmware, "src/web/js/runtime.js"), "utf8");
const block = (head) => {
  const start = runtime.indexOf(head);
  if (start < 0) throw new Error(`Missing ${head}`);
  let depth = 0;
  // The body opens at ") {", after any default-object parameters.
  const body = start + runtime.slice(start).search(/\)\s*\{/);
  for (let i = runtime.indexOf("{", body); i < runtime.length; i++) {
    if (runtime[i] === "{") depth++;
    else if (runtime[i] === "}" && --depth === 0) return runtime.slice(start, i + 1);
  }
  throw new Error(`Unbalanced ${head}`);
};
const english = JSON.parse(
  fs.readFileSync(path.join(firmware, "src/web/locales/en.json"), "utf8"),
).strings;
const context = vm.createContext({
  __WEBUI_TEXT__: (key) => english[key] ?? key,
  sub: (text, values) => text.replace(/\{(\d+)\}/g, (_, i) => values[i]),
  presetState: { cutRampS: 3 },
});
vm.runInContext(
  [
    "const PACE_SOFT = 0.18;",
    "const PILL = '';",
    block("function buildRuleChartModel("),
    block("function cutLine("),
    block("function paceStartNote("),
    block("function referencePace("),
    block("function fadeFill("),
    block("function escHtml("),
    block("function presetGraph("),
    "this.api = { buildRuleChartModel, cutLine, presetGraph };",
  ].join("\n"),
  context,
);
const { buildRuleChartModel, cutLine, presetGraph } = context.api;

const presets = JSON.parse(
  fs.readFileSync(path.join(firmware, "src/tests/fixtures/integration_presets.json"), "utf8"),
);
const base = { ...presets.items[0], cutRampS: presets.cutRampS };
const cases = {
  double: base,
  noGuards: { ...base, fastExtractionGuardEnabled: false, slowExtractionGuardEnabled: false },
  timerOnly: { ...base, brewByWeight: false, firstDropS: 0, firstDropN: 0 },
  tightWindow: { ...base, fastBeforeS: 14, slowAfterS: 18, operationalWallMs: 25000, goalWeightG: 18 },
  invalid: { ...base, slowAfterS: 20 },
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
const target = path.join(import.meta.dirname, "..", "test", "fixtures", "preset-golden.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${target}`);
