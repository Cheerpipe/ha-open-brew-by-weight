// Development page: the cards against fixture data and a mock hass, in both
// themes and a few configurations.
import "../src/index";
import presets from "../../tests/fixtures/integration_presets.json";
import last from "../../tests/fixtures/integration_last_shot.json";
import type { CardData } from "../src/data";

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
    subscribeMessage: async (callback: (m: CardData) => void) => {
      setTimeout(() => callback(data));
      return async () => {};
    },
  },
  callService: async (...args: unknown[]) => console.log("callService", ...args),
});

const configs: Record<string, unknown>[] = [
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
