import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import presets from "../../tests/fixtures/integration_presets.json";
import last from "../../tests/fixtures/integration_last_shot.json";
import type { CardData } from "../src/data";
import "../src/index";

type Card = HTMLElement & { setConfig(c: object): void; hass: unknown; updateComplete: Promise<boolean>; shadowRoot: ShadowRoot };

const row = (values: object = {}, curve: object = {}) => ({
  ...Object.fromEntries(last.cols.split(",").map((c, i) => [c, last.shot[i]])),
  curve: { ...(last.shot.at(-1) as object), endS: 29.4, ...curve },
  ...values,
});
const payload = (lastShot: CardData["lastShot"] = row()): CardData => ({
  available: true,
  shotState: "idle",
  activePresetId: presets.activeId,
  presets: presets.items,
  lastShot,
});

async function mount(config: object, data: CardData = payload(), language = "en") {
  const card = document.createElement("open-brew-by-weight-shot-card") as Card;
  card.setConfig({ type: "custom:open-brew-by-weight-shot-card", device_id: "dev", ...config });
  card.hass = {
    language,
    themes: {},
    entities: {},
    states: {},
    callService: vi.fn(),
    connection: {
      subscribeMessage: vi.fn(async (callback: (m: object) => void) => {
        callback(data);
        return async () => undefined;
      }),
    },
  };
  document.body.append(card);
  for (let i = 0; i < 3; i++) await card.updateComplete;
  return card.shadowRoot;
}
const fields = (root: ShadowRoot, cls = ".field") =>
  [...root.querySelectorAll<HTMLElement>(cls)].map((f) => [f.dataset.field, f.querySelector(".value")!.textContent!.trim()]);

describe("shot details card", () => {
  beforeEach(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => document.body.replaceChildren());

  it("shows the hero numbers and every field in order", async () => {
    const root = await mount({});
    expect(root.querySelector(".chip")?.textContent).toBe("On recipe");
    expect(fields(root, ".hero-field")).toEqual([
      ["duration", "31.0 s"],
      ["yield", "36.3 g"],
    ]);
    expect(fields(root).map(([f]) => f)).toEqual([
      "goal", "error", "drip", "avg_flow", "max_flow", "first_drop", "dose", "ratio", "target_temp",
      "cut_at", "drip_delay", "late_cup", "ended", "shot_type", "preset", "scale", "rating",
    ]);
    expect(root.querySelector('[data-field="error"] .value.high')).not.toBeNull();
    expect(root.querySelectorAll('[data-field="rating"] .on')).toHaveLength(4);
  });

  it("follows the configured fields, columns, and empty-field choice", async () => {
    const root = await mount({ hero: [], fields: ["drip_delay", "goal", "dose"], columns: 2, show_header: false, show_empty: false },
      payload(row({ dripDelayS: null })));
    expect(root.querySelector(".header")).toBeNull();
    expect(root.querySelector(".hero")).toBeNull();
    expect(fields(root)).toEqual([
      ["goal", "36.0 g"],
      ["dose", "18.0 g"],
    ]);
    expect(root.querySelector<HTMLElement>(".fields")!.getAttribute("style")).toContain("repeat(2,");
  });

  it("rejects unknown fields and keeps numbers when the curve is missing", async () => {
    const card = document.createElement("open-brew-by-weight-shot-card") as Card;
    expect(() => card.setConfig({ type: "x", fields: ["goal", "mood"] })).toThrow("fields must list");
    expect(() => card.setConfig({ type: "x", hero: "duration" })).toThrow("hero must list");
    const root = await mount({}, payload(row({}, { wD: "%%%" })));
    expect(fields(root, ".hero-field")[1]).toEqual(["yield", "36.3 g"]);
    expect(fields(root).find(([f]) => f === "max_flow")?.[1]).toBe("—");
    document.body.replaceChildren();
    expect((await mount({}, payload(null))).textContent).toContain("No shot yet");
  });

  it("speaks Spanish when Home Assistant does", async () => {
    const root = await mount({}, payload(), "es");
    expect(root.querySelector('[data-field="duration"] .label')?.textContent).toBe("Duración");
    expect(root.querySelector('[data-field="shot_type"] .value')?.textContent?.trim()).toBe("Automático");
  });
});
