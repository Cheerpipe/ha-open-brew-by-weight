// Development page: the cards against fixture data and a mock hass, in both
// themes and a few configurations.
import "../src/index";
import presets from "../../tests/fixtures/integration_presets.json";
import last from "../../tests/fixtures/integration_last_shot.json";
import stats from "../test/fixtures/stats-charts.json";
import type { CardData, StatsData } from "../src/data";

const data: CardData = {
  available: true,
  shotState: "idle",
  activePresetId: presets.activeId,
  cutRampS: presets.cutRampS,
  presets: presets.items,
  // As the integration sends it: the Stats row by column name, its curve under "curve".
  lastShot: {
    ...Object.fromEntries(last.cols.split(",").map((c, i) => [c, last.shot[i]])),
    curve: { ...(last.shot.at(-1) as object), endS: 29.4 },
  },
};

const hass = (dark: boolean) => ({
  language: "en",
  themes: { darkMode: dark },
  entities: {
    "select.obbw_active_preset": { entity_id: "select.obbw_active_preset", device_id: "dev", platform: "open_brew_by_weight" },
  },
  states: {},
  connection: {
    subscribeMessage: async (callback: (m: CardData | StatsData) => void, message: Record<string, unknown>) => {
      // A Stats window and preset: the fixture's when it has one, else a stand-in labelled for it.
      const chart = (stats as Record<string, StatsData["chart"]>)[`${message.window}:${message.preset}`] ?? {
        ...stats["25:2"],
        stats: { ...stats["25:2"].stats, preset: message.preset as number },
      };
      setTimeout(() => callback(message.type === "open_brew_by_weight/stats/subscribe" ? { available: true, supported: true, chart } : data));
      return async () => {};
    },
  },
  callService: async (...args: unknown[]) => console.log("callService", ...args),
});

const configs: Record<string, unknown>[] = [
  { type: "custom:open-brew-by-weight-shot-time-card", device_id: "dev", shots: 25 },
  { type: "custom:open-brew-by-weight-shot-consistency-card", device_id: "dev", shots: 25 },
  { type: "custom:open-brew-by-weight-cut-accuracy-card", device_id: "dev", shots: 25 },
  { type: "custom:open-brew-by-weight-shot-time-card", device_id: "dev", preset: "all", shots: 50, show_preset_selector: false, show_shots_selector: false },
  { type: "custom:open-brew-by-weight-shot-consistency-card", device_id: "dev", preset: "all", shots: 50, band: "ewma" },
  { type: "custom:open-brew-by-weight-cut-accuracy-card", device_id: "dev", preset: 1, shots: 100, band: "ewma", show_header: false },
  { type: "custom:open-brew-by-weight-shot-card", device_id: "dev" },
  { type: "custom:open-brew-by-weight-shot-card", device_id: "dev", title: "Compact", hero: ["yield"], fields: ["goal", "error", "first_drop", "ended", "rating"], columns: 3 },
  { type: "custom:open-brew-by-weight-shot-chart-card", device_id: "dev" },
  { type: "custom:open-brew-by-weight-shot-chart-card", device_id: "dev", chart: "weight_flow", mode_switch: false },
  { device_id: "dev" },
  { device_id: "dev", preset: 1, show_legend: false, show_note: false, title: "Single, pinned" },
  { device_id: "dev", show_header: false, show_example: false },
];
for (const dark of [false, true])
  for (const config of configs) {
    const type = String(config.type ?? "custom:open-brew-by-weight-preset-card");
    const card = document.createElement(type.replace("custom:", "")) as HTMLElement & {
      setConfig(c: unknown): void;
      hass: unknown;
    };
    card.setConfig({ type, ...config });
    card.hass = hass(dark);
    document.getElementById(dark ? "dark" : "light")!.append(card);
  }
