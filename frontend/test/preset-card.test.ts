import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import presets from "../../tests/fixtures/integration_presets.json";
import type { CardData } from "../src/data";
import "../src/index";

type Card = HTMLElement & {
  setConfig(config: object): void;
  hass: unknown;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
};

const payload = (updates: Partial<CardData> = {}): CardData => ({
  available: true,
  shotState: "idle",
  activePresetId: presets.activeId,
  presets: presets.items,
  lastShot: null,
  ...updates,
});

function mockHass(message: object | Error) {
  const callService = vi.fn(async () => undefined);
  return {
    callService,
    hass: {
      language: "en",
      themes: { darkMode: false },
      entities: {
        "select.obbw": { entity_id: "select.obbw", device_id: "dev", platform: "open_brew_by_weight" },
      },
      states: {},
      callService,
      connection: {
        subscribeMessage: vi.fn(async (callback: (m: object) => void) => {
          if (message instanceof Error) throw message;
          callback(message);
          return async () => undefined;
        }),
      },
    },
  };
}

async function mount(config: object, message: object | Error = payload()) {
  const card = document.createElement("open-brew-by-weight-preset-card") as Card;
  const { hass, callService } = mockHass(message);
  card.setConfig({ type: "custom:open-brew-by-weight-preset-card", device_id: "dev", ...config });
  card.hass = hass;
  document.body.append(card);
  // Lay the body out: happy-dom has no layout, so give it a width.
  await card.updateComplete;
  const body = card.shadowRoot.querySelector<HTMLElement>(".body")!;
  Object.defineProperty(body, "clientWidth", { value: 600 });
  (card as unknown as { _width: number })._width = 600;
  await card.updateComplete;
  await card.updateComplete;
  return { card, callService, root: card.shadowRoot };
}

describe("preset card", () => {
  beforeEach(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => document.body.replaceChildren());

  it("draws the active preset with its header, readout, legend, and note", async () => {
    const { root } = await mount({});
    expect(root.querySelector(".title")?.textContent).toBe("Double");
    expect(root.querySelector(".subtitle")?.textContent).toBe("Active preset · Target 36 g · 18 g in");
    expect(root.querySelector(".cut-line")).not.toBeNull();
    expect(root.querySelectorAll(".recent-shot")).toHaveLength(5);
    expect(root.querySelector(".readout")?.textContent).toBe("36 g at 31.5 s → On recipe · stops at 36.0 g");
    expect(root.querySelector(".legend .key-arrivals")).not.toBeNull();
    expect(root.querySelector(".note")?.textContent).toContain("Reference pace starts at 4.9 s");
  });

  it("pins a preset, hides what the config turns off, and keeps unknown keys", async () => {
    const { root } = await mount({
      preset: 1,
      title: "Single",
      show_legend: false,
      show_note: false,
      show_example: false,
      show_selector: false,
      uix: { style: "ha-card { --obbw-fast-color: purple; }" },
    });
    expect(root.querySelector(".subtitle")?.textContent).toBe("Preset · Target 18 g · 9 g in");
    for (const hidden of [".legend", ".note", ".scrub", ".readout", ".selector"])
      expect(root.querySelector(hidden)).toBeNull();
  });

  it("changes the active preset through the device's selector", async () => {
    const { root, callService } = await mount({});
    const select = root.querySelector("select")!;
    select.value = "1";
    select.dispatchEvent(new Event("change"));
    expect(callService).toHaveBeenCalledWith("select", "select_option", {
      entity_id: "select.obbw",
      option: "Single",
    });
  });

  it("moves the example shot with the keyboard", async () => {
    const { card, root } = await mount({});
    root.querySelector(".scrub")!.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }));
    await card.updateComplete;
    expect(root.querySelector(".readout")?.textContent).toBe("36 g at 26.4 s → Fast · stops at 36.4 g, 26.5 s");
  });

  it("explains every state it cannot draw", async () => {
    const cases: [object, object | Error, string][] = [
      [{ device_id: undefined }, payload(), "Choose an Open Brew by Weight device"],
      [{}, new Error("not found"), "Choose an Open Brew by Weight device"],
      [{ preset: 9 }, payload(), "no longer exists"],
      [{}, payload({ presets: presets.items.map(({ id, name }) => ({ id, name })) }), "Update the controller firmware"],
      [{}, payload({ presets: [{ ...presets.items[0], slowAfterS: 20 }] }), "can't be drawn"],
    ];
    for (const [config, message, text] of cases) {
      const { root } = await mount(config, message);
      await new Promise((r) => setTimeout(r));
      expect(root.textContent).toContain(text);
      document.body.replaceChildren();
    }
    const { root } = await mount({}, payload({ available: false, shotState: "brewing" }));
    expect(root.textContent).toContain("isn't responding");
    expect(root.querySelector("select")?.disabled).toBe(true);
  });

  it("speaks Spanish when Home Assistant does", async () => {
    const card = document.createElement("open-brew-by-weight-preset-card") as Card;
    const { hass } = mockHass(payload());
    card.setConfig({ type: "x", device_id: "dev" });
    card.hass = { ...hass, language: "es" };
    document.body.append(card);
    await card.updateComplete;
    await card.updateComplete;
    expect(card.shadowRoot.querySelector(".subtitle")?.textContent).toBe("Preset activo · Meta 36 g · 18 g de café");
  });
});
