import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import presets from "../../tests/fixtures/integration_presets.json";
import last from "../../tests/fixtures/integration_last_shot.json";
import type { CardData } from "../src/data";
import "../src/index";

type Card = HTMLElement & { setConfig(c: object): void; hass: unknown; updateComplete: Promise<boolean>; shadowRoot: ShadowRoot };

const row = (curve: object = {}, values: object = {}) => ({
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
  const card = document.createElement("open-brew-by-weight-shot-chart-card") as Card;
  card.setConfig({ type: "custom:open-brew-by-weight-shot-chart-card", device_id: "dev", ...config });
  card.hass = {
    language,
    themes: { darkMode: false },
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
  await card.updateComplete;
  (card as unknown as { _width: number })._width = 600;
  for (let i = 0; i < 3; i++) await card.updateComplete;
  return { card, root: card.shadowRoot };
}

const readout = (root: ShadowRoot) => root.querySelector(".readout")?.textContent;
const settle = async (card: Card) => {
  for (let i = 0; i < 3; i++) await card.updateComplete;
};

describe("last shot card", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.ResizeObserver ??= class {
      observe() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => document.body.replaceChildren());

  it("draws the shot over its preset with the verdict, cursor, and legend", async () => {
    const { root } = await mount({});
    expect(root.querySelector(".title")?.textContent).toBe("Last shot");
    expect(root.querySelector(".subtitle")?.textContent).toContain("Double");
    expect(root.querySelector(".chip.on_recipe")?.textContent).toBe("On recipe");
    expect(root.querySelector(".cut-line")).not.toBeNull();
    expect(root.querySelectorAll(".shot-line.drip").length).toBeGreaterThan(0);
    expect(root.querySelector(".band.on-recipe")).not.toBeNull();
    expect(root.querySelector(".band.fast-full")).toBeNull();
    expect(readout(root)).toBe("29.4 s · 33.9 g · cut line 36.0 g");
    expect([...root.querySelectorAll(".legend span")].map((s) => s.textContent)).toEqual([
      "Stop at",
      "On-recipe window",
      "Last shot",
      "Drip after the stop",
      "Shot stopped",
      "Final weight, after drips",
    ]);
  });

  it("switches between the four charts and remembers the pick", async () => {
    const { card, root } = await mount({});
    const views = () => [...root.querySelectorAll<HTMLButtonElement>(".view")];
    expect(views().map((b) => b.textContent?.trim())).toEqual(["Preset + weight", "Weight + flow", "Weight", "Flow"]);
    views()[1].click();
    await settle(card);
    expect(root.querySelectorAll(".series.flow").length).toBeGreaterThan(0);
    expect(root.querySelectorAll(".series.bbw").length).toBeGreaterThan(0);
    views()[2].click();
    await settle(card);
    expect(root.querySelector(".series.flow")).toBeNull();
    expect(readout(root)).toBe("29.4 s · 33.9 g");
    views()[3].click();
    await settle(card);
    expect(root.querySelector(".series.bbw")).toBeNull();
    expect(localStorage.getItem("obbw-shot-view:dev:preset_weight")).toBe("flow");
    document.body.replaceChildren();
    const again = await mount({});
    expect(again.root.querySelector("[aria-pressed=true]")?.textContent?.trim()).toBe("Flow");
  });

  it("starts on the configured chart without a switch, and moves the cursor by keyboard", async () => {
    const { card, root } = await mount({ chart: "weight_flow", mode_switch: false, show_legend: false });
    expect(root.querySelector(".views")).toBeNull();
    expect(root.querySelector(".legend")).toBeNull();
    root.querySelector(".chart")!.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }));
    root.querySelector(".chart")!.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }));
    await settle(card);
    expect(readout(root)).toMatch(/^19\.4 s · \d+\.\d g · \d+\.\d g\/s$/);
    expect(() => card.setConfig({ type: "x", chart: "pie" })).toThrow("Unknown chart");
  });

  it("names how the shot ended and falls back when the rule is missing", async () => {
    const { root } = await mount({}, payload(row({}, { verdict: "fast", wallS: 0 })));
    expect(root.querySelector(".chip.fast")?.textContent).toBe("Fast");
    expect(root.querySelector(".cut-line")).toBeNull();
    expect(root.querySelectorAll(".view")).toHaveLength(3);
    document.body.replaceChildren();
    const manual = await mount({}, payload(row({}, { shotType: "manual" })));
    expect(manual.root.querySelector(".chip.manual")?.textContent).toBe("Manual");
    document.body.replaceChildren();
    const timer = await mount({}, payload(row({}, { shotType: "timer_only" })));
    expect(timer.root.querySelector(".chip")?.textContent).toBe("Timer only");
    expect(timer.root.querySelector(".cut-line.off")).not.toBeNull();
  });

  it("explains a missing shot or curve", async () => {
    expect((await mount({}, payload(null))).root.textContent).toContain("No shot yet");
    document.body.replaceChildren();
    expect((await mount({}, payload(row({ wD: "%%%" })))).root.textContent).toContain("no curve");
  });

  it("speaks Spanish when Home Assistant does", async () => {
    const { root } = await mount({}, payload(), "es");
    expect(root.querySelector(".title")?.textContent).toBe("Último shot");
    expect(root.querySelector(".chip")?.textContent).toBe("En receta");
    expect(readout(root)).toBe("29.4 s · 33.9 g · línea de corte 36.0 g");
  });
});
