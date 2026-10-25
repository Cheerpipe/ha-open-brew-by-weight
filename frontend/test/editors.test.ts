import { describe, expect, it } from "vitest";
import "../src/index";

// Home Assistant's ha-form asks computeLabel for every schema entry,
// including the unnamed grid that groups the switches.
type Entry = { name: string; schema?: Entry[] };
const entries = (schema: Entry[]): Entry[] => schema.flatMap((e) => [e, ...entries(e.schema ?? [])]);

describe("card editors", () => {
  for (const [tag, config] of [
    ["open-brew-by-weight-preset-card-editor", {}],
    ["open-brew-by-weight-shot-chart-card-editor", {}],
    ["open-brew-by-weight-shot-card-editor", {}],
  ] as const) {
    it(`${tag} labels every entry ha-form asks about`, async () => {
      const editor = document.createElement(tag) as HTMLElement & {
        hass: unknown;
        setConfig(c: object): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = { language: "es", entities: {}, connection: { subscribeMessage: async () => async () => undefined } };
      editor.setConfig({ type: "x", ...config });
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot.querySelector("ha-form") as unknown as {
        schema: Entry[];
        computeLabel(e: Entry): string;
      };
      const labels = entries(form.schema).map((e) => form.computeLabel(e));
      expect(labels).toContain("");
      expect(labels.filter(Boolean).every((l) => !l.startsWith("editor."))).toBe(true);
      editor.remove();
    });
  }
});
