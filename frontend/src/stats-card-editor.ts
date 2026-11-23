import { LitElement, html, nothing, type PropertyValues } from "lit";
import { followCardData, type CardDataState } from "./data";
import { loadHaForm } from "./ha-form";
import { DOMAIN, type HomeAssistant } from "./ha";
import { localizer } from "./localize";
import type { StatsCardConfig, StatsKind } from "./stats-card";
import { WINDOWS } from "./stats-chart";

const TOGGLES = ["show_header", "show_shots_selector", "show_preset_selector", "show_figures", "show_legend"] as const;

/** Visual editor for the three Stats cards, on Home Assistant's own form. */
export class OpenBrewByWeightStatsCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    kind: { attribute: false },
    _config: { state: true },
    _state: { state: true },
  };

  declare hass?: HomeAssistant;
  declare kind: StatsKind;
  declare _config?: StatsCardConfig;
  declare _state?: CardDataState;
  private _following?: string;
  private _stop?: () => void;

  constructor() {
    super();
    this.kind = "time";
  }

  connectedCallback() {
    super.connectedCallback();
    void loadHaForm().then(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stop?.();
    this._following = undefined;
  }

  setConfig(config: StatsCardConfig) {
    this._config = config;
  }

  protected updated(_changed: PropertyValues) {
    const device = this._config?.device_id;
    if (!this.hass || device === this._following) return;
    this._stop?.();
    this._following = device;
    this._state = undefined;
    if (device) this._stop = followCardData(this.hass, device, (state) => (this._state = state));
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass.locale?.language ?? this.hass.language),
      presets = this._state?.status === "ready" ? this._state.data.presets : [],
      dropdown = (options: { value: string; label: string }[]) => ({ select: { mode: "dropdown", options } }),
      schema = [
        { name: "device_id", selector: { device: { integration: DOMAIN } } },
        {
          name: "",
          type: "grid",
          schema: [
            {
              name: "preset",
              selector: dropdown([
                { value: "active", label: t("editor.preset_active") },
                { value: "all", label: t("editor.preset_all") },
                ...presets.map((p) => ({ value: String(p.id), label: p.name })),
              ]),
            },
            {
              name: "shots",
              selector: dropdown(WINDOWS.map((w) => ({ value: String(w), label: t("stats.last_n", w) }))),
            },
          ],
        },
        { name: "title", selector: { text: {} } },
        ...(this.kind === "time"
          ? []
          : [
              {
                name: "band",
                selector: dropdown(["range", "ewma"].map((b) => ({ value: b, label: t(`band.${b}` as "band.range") }))),
              },
            ]),
        { name: "", type: "grid", schema: TOGGLES.map((name) => ({ name, selector: { boolean: {} } })) },
      ],
      data = {
        preset: "active",
        shots: "10",
        band: "range",
        ...Object.fromEntries(TOGGLES.map((name) => [name, true])),
        ...this._config,
        ...(typeof this._config.preset === "number" ? { preset: String(this._config.preset) } : {}),
        ...(this._config.shots ? { shots: String(this._config.shots) } : {}),
      };
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) =>
        // ha-form also asks for the grid's label, which has no name.
        s.name ? t(`editor.${s.name === "device_id" ? "device" : s.name}` as never) : ""}
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  private _changed(e: CustomEvent<{ value: Record<string, unknown> }>) {
    const value = { ...e.detail.value };
    if (value.preset != null && value.preset !== "active" && value.preset !== "all") value.preset = Number(value.preset);
    if (value.shots != null) value.shots = Number(value.shots);
    if (!value.title) delete value.title;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: value }, bubbles: true, composed: true }));
  }
}
