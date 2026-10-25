// Development page: the cards against fixture data and a mock hass, in both
// themes and a few configurations.
import "../src/index";
import presets from "../../tests/fixtures/integration_presets.json";
import type { CardData } from "../src/data";

const data: CardData = {
  available: true,
  shotState: "idle",
  activePresetId: presets.activeId,
  cutRampS: presets.cutRampS,
  presets: presets.items,
  lastShot: null,
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
  { device_id: "dev" },
  { device_id: "dev", preset: 1, show_legend: false, show_note: false, title: "Single, pinned" },
  { device_id: "dev", show_header: false, show_example: false },
];
for (const dark of [false, true])
  for (const config of configs) {
    const card = document.createElement("open-brew-by-weight-preset-card") as HTMLElement & {
      setConfig(c: unknown): void;
      hass: unknown;
    };
    card.setConfig({ type: "custom:open-brew-by-weight-preset-card", ...config });
    card.hass = hass(dark);
    document.getElementById(dark ? "dark" : "light")!.append(card);
  }
