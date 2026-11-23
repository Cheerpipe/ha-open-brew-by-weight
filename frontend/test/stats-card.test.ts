import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import presets from "../../tests/fixtures/integration_presets.json";
import charts from "./fixtures/stats-charts.json";
import golden from "./fixtures/stats-golden.json";
import type { StatsData } from "../src/data";
import { chartPreset, densityTicks, layoutTicks, windowChoices, type Density, type StatsChart } from "../src/stats-chart";
import "../src/index";

type Card = HTMLElement & {
  setConfig(config: object): void;
  hass: unknown;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
};
type Miss = { head: string[]; shapes: string[][]; rings: string[]; edges: string[][]; ticks: (string | boolean)[][]; legend: string[]; legendKeys: string[]; pill: string; level: string | null; note: string | null };
type Golden = { density: { paths: string[]; tops: string[]; ticks: unknown[] }; range: { consistency: Miss; cut: Miss }; ewma: { consistency: Miss; cut: Miss } };
const CHARTS = charts as unknown as Record<string, StatsChart>;

function mockHass(stats: (window: number, preset: number) => StatsData) {
  const subscribe = vi.fn(async (callback: (m: object) => void, message: Record<string, unknown>) => {
    callback(
      message.type === "open_brew_by_weight/stats/subscribe"
        ? stats(message.window as number, message.preset as number)
        : { available: true, shotState: "idle", activePresetId: presets.activeId, presets: presets.items, lastShot: null },
    );
    return async () => undefined;
  });
  return { subscribe, hass: { language: "en", themes: {}, entities: {}, states: {}, connection: { subscribeMessage: subscribe } } };
}

const fixture = (window: number, preset: number): StatsData => ({
  available: true,
  supported: true,
  chart: CHARTS[`${window}:${preset}`] ?? null,
});

async function mount(tag: string, config: object, stats = fixture) {
  const card = document.createElement(tag) as Card;
  const { hass, subscribe } = mockHass(stats);
  card.setConfig({ type: `custom:${tag}`, device_id: "dev", ...config });
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  (card as unknown as { _width: number })._width = 600;
  for (let i = 0; i < 4; i++) await card.updateComplete;
  return { card, subscribe, root: card.shadowRoot };
}

// The firmware's class names for the same marks.
const fwClass = (c: string) => c.replace(/^cons([A-Z])/, (_, l: string) => l.toLowerCase());
const shapes = (root: ShadowRoot) =>
  [...root.querySelector(".area")!.children]
    .filter((e) => e.tagName.toLowerCase() !== "defs")
    .map((e) => [e.getAttribute("class")!.trim(), ...["d", "x", "y", "width", "height", "cx", "cy"].map((a) => e.getAttribute(a) ?? "")]);
const texts = (nodes: NodeListOf<Element>) => [...nodes].map((e) => e.textContent);

function expectMiss(root: ShadowRoot, want: Miss) {
  expect(texts(root.querySelectorAll(".zones span"))).toEqual(want.head);
  expect(shapes(root)).toEqual(want.shapes.map(([c, ...rest]) => [fwClass(c), ...rest]));
  expect([...root.querySelectorAll(".ring")].map((e) => e.getAttribute("cx"))).toEqual(want.rings);
  expect([...root.querySelectorAll<HTMLElement>(".edge")].map((e) => [e.textContent, e.style.top])).toEqual(want.edges);
  const [oldest, latest] = root.querySelectorAll<HTMLElement>(".tick");
  expect([oldest.textContent, oldest.style.left, oldest.hidden]).toEqual(want.ticks[0]);
  expect(latest.textContent).toBe(want.ticks[1][0]);
  expect(texts(root.querySelectorAll(".slegend span"))).toEqual(want.legend);
  expect([...root.querySelectorAll(".slegend i")].map((e) => e.getAttribute("class"))).toEqual(want.legendKeys);
  expect(root.querySelector(".plot")!.getAttribute("aria-valuetext")).toBe(want.pill);
}

const cases: [string, object][] = [
  ["10:2", { shots: 10 }],
  ["25:2", { shots: 25 }],
  ["50:0", { shots: 50, preset: "all" }],
  ["100:1", { shots: 100, preset: 1 }],
];

describe("stats cards draw what the Web UI draws", () => {
  beforeEach(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    localStorage.clear();
  });
  afterEach(() => document.body.replaceChildren());

  for (const [key, config] of cases) {
    const want = (golden as unknown as Record<string, Golden>)[key];

    it(`shot time ${key}`, async () => {
      const { root } = await mount("open-brew-by-weight-shot-time-card", config);
      expect([...root.querySelectorAll(".area path")].map((e) => e.getAttribute("d"))).toEqual(want.density.paths);
      expect(texts(root.querySelectorAll(".zones span"))).toEqual(want.density.tops);
      const header = CHARTS[key].stats,
        d = (!header.preset || header.dens![1] === true ? header.dens![0] : header.dens![1]) as Density;
      expect(densityTicks(d, (s) => (s ? "Window start" : "Window end"), "s").map((k) => [k.at, k.text, k.p])).toEqual(
        want.density.ticks,
      );
    });

    for (const band of ["range", "ewma"] as const) {
      it(`shot consistency ${key} ${band}`, async () => {
        const { root } = await mount("open-brew-by-weight-shot-consistency-card", { ...config, band });
        expectMiss(root, want[band].consistency);
        expect(root.querySelector(".zones")!.classList.contains(`level-${want[band].consistency.level}`)).toBe(true);
      });

      it(`cut accuracy ${key} ${band}`, async () => {
        const { root } = await mount("open-brew-by-weight-cut-accuracy-card", { ...config, band });
        if (want[band].cut.note) expect(root.querySelector(".message")!.textContent).toBe(want[band].cut.note);
        else expectMiss(root, want[band].cut);
      });
    }
  }
});

describe("stats cards", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => document.body.replaceChildren());

  it("follows the Web UI's window and preset choices", () => {
    expect(windowChoices(0)).toEqual([10]);
    expect(windowChoices(10)).toEqual([10]);
    expect(windowChoices(11)).toEqual([10, 25]);
    expect(windowChoices(64)).toEqual([10, 25, 50, 100]);
    expect(windowChoices(640)).toEqual([10, 25, 50, 100]);
    expect(windowChoices(640, true)).toEqual([10, 25, 50, 100, 500, 1000]);
    expect(windowChoices(64, true)).toEqual([10, 25, 50, 100]);
    const header = CHARTS["25:2"].stats;
    expect(chartPreset(1, 2, header)).toBe(1);
    expect(chartPreset(9, 2, header)).toBe(2);
    expect(chartPreset(9, 7, header)).toBe(0);
    expect(chartPreset(9, 7, undefined)).toBe(9);
    expect(chartPreset(0, 2, header)).toBe(0);
  });

  it("keeps ticks inside the axis and clear of each other, by priority", () => {
    const kept = layoutTicks(
      [
        { at: 0.02, text: "edge", p: 20 },
        { at: 0.5, text: "window", p: 80 },
        { at: 0.52, text: "close", p: 20 },
      ],
      200,
      (text) => text.length * 6,
    );
    expect(kept.map((k) => [k.text, k.left])).toEqual([
      ["edge", 0],
      ["window", 82],
    ]);
  });

  it("offers the windows and presets the log holds, and remembers a pick", async () => {
    const { root, subscribe } = await mount("open-brew-by-weight-shot-consistency-card", { shots: 25 });
    expect(root.querySelector(".title")!.textContent).toBe("Shot consistency");
    expect(root.querySelector(".subtitle")).toBeNull();
    const [windows, picker] = root.querySelectorAll<HTMLSelectElement>("select");
    expect([...windows.options].map((o) => o.textContent)).toEqual(["Last 10", "Last 25", "Last 50", "Last 100"]);
    expect([...picker.options].map((o) => o.textContent!.trim())).toEqual(["All", "Double", "Single"]);
    picker.value = "0";
    picker.dispatchEvent(new Event("change"));
    windows.value = "50";
    windows.dispatchEvent(new Event("change"));
    const card = root.host as Card;
    for (let i = 0; i < 3; i++) await card.updateComplete;
    expect(subscribe.mock.calls.at(-1)![1]).toMatchObject({ window: 50, preset: 0 });
    expect(JSON.parse(localStorage.getItem("obbw-stats:consistency:dev:active:25")!)).toEqual({ preset: 0, window: 50 });
  });

  it("names the window and preset when viewers cannot pick them", async () => {
    const { root } = await mount("open-brew-by-weight-shot-time-card", {
      shots: 25,
      show_preset_selector: false,
      show_shots_selector: false,
      title: "Espresso",
      show_legend: false,
      show_figures: false,
    });
    expect(root.querySelector(".title")!.textContent).toBe("Espresso");
    expect(root.querySelector(".subtitle")!.textContent).toBe("Last 25 · Double");
    expect(root.querySelectorAll("select")).toHaveLength(0);
    expect(root.querySelector(".slegend")).toBeNull();
    expect(root.querySelector(".zones")).toBeNull();
  });

  it("offers the companion's whole history and keeps a big window while it answers", async () => {
    const whole = { ...CHARTS["25:2"], good: 900, source: "companion" as const };
    const { root, subscribe } = await mount("open-brew-by-weight-shot-time-card", { shots: 500 }, (_w, preset) => ({
      available: true,
      supported: true,
      chart: { ...whole, stats: { ...whole.stats, preset } },
    }));
    expect(subscribe.mock.calls.at(-1)![1]).toMatchObject({ window: 500, preset: 2 });
    const [windows] = root.querySelectorAll<HTMLSelectElement>("select");
    expect([...windows.options].map((o) => o.textContent)).toEqual([
      "Last 10",
      "Last 25",
      "Last 50",
      "Last 100",
      "Last 500",
      "Last 1000",
    ]);
  });

  it("falls back to the largest window the log fills and says what is missing", async () => {
    const few = { ...CHARTS["25:2"], good: 12 };
    const { subscribe } = await mount("open-brew-by-weight-shot-time-card", { shots: 100 }, (_window, preset) => ({
      available: true,
      supported: true,
      chart: { ...few, stats: { ...few.stats, preset } },
    }));
    expect(subscribe.mock.calls.at(-1)![1]).toMatchObject({ window: 25, preset: 2 });

    const old = await mount("open-brew-by-weight-cut-accuracy-card", {}, () => ({ available: true, supported: false, chart: null }));
    expect(old.root.querySelector(".message")!.textContent).toBe("Update the controller firmware to see these charts here.");
    const none = await mount("open-brew-by-weight-shot-time-card", {}, () => ({
      available: false,
      supported: true,
      chart: { good: 0, stats: { facets: { presets: [], scales: [] }, dens: [null, null] } },
    }));
    expect(none.root.querySelector(".message")!.textContent).toBe("No shot yet. Pull one and it shows up here.");
  });

  it("refuses unknown settings", () => {
    const card = document.createElement("open-brew-by-weight-cut-accuracy-card") as Card;
    expect(() => card.setConfig({ shots: 20 })).toThrow("Unknown shots");
    expect(() => card.setConfig({ shots: 1000 })).not.toThrow();
    expect(() => card.setConfig({ band: "wide" })).toThrow("Unknown band");
    expect(() => card.setConfig({ preset: "first" })).toThrow("Unknown preset");
  });
});
