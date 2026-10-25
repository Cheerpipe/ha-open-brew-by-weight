import { afterEach, describe, expect, it, vi } from "vitest";

describe("loading Home Assistant's form", () => {
  afterEach(() => {
    vi.resetModules();
    delete (window as { loadCardHelpers?: unknown }).loadCardHelpers;
  });

  it("asks Home Assistant for a built-in editor once, when ha-form is missing", async () => {
    const getConfigElement = vi.fn(async () => customElements.define("ha-form", class extends HTMLElement {}));
    const createCardElement = vi.fn(async () => ({ constructor: { getConfigElement } }));
    (window as { loadCardHelpers?: unknown }).loadCardHelpers = vi.fn(async () => ({ createCardElement }));
    const { loadHaForm } = await import("../src/ha-form");
    await Promise.all([loadHaForm(), loadHaForm()]);
    expect(createCardElement).toHaveBeenCalledTimes(1);
    expect(customElements.get("ha-form")).toBeDefined();
    await loadHaForm();
    expect(createCardElement).toHaveBeenCalledTimes(1);
  });

  it("does nothing outside Home Assistant", async () => {
    const { loadHaForm } = await import("../src/ha-form");
    await expect(loadHaForm()).resolves.toBeUndefined();
  });
});

describe("card picker names", () => {
  it("follow Home Assistant's language, not the browser's", async () => {
    vi.resetModules();
    document.documentElement.lang = "es";
    (window as { customCards?: unknown[] }).customCards = [];
    await import("../src/index");
    const names = (window as unknown as { customCards: { name: string }[] }).customCards.map((c) => c.name);
    expect(names).toContain("Preset de Open Brew by Weight");
    // Once a card knows Home Assistant's own language, the names follow it.
    const { nameCards } = await import("../src/registry");
    nameCards("en");
    const renamed = (window as unknown as { customCards: { name: string }[] }).customCards.map((c) => c.name);
    expect(renamed).toEqual([
      "Open Brew by Weight preset",
      "Open Brew by Weight last shot",
      "Open Brew by Weight shot details",
    ]);
    document.documentElement.lang = "";
  });
});
