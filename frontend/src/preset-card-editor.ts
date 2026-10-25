import { LitElement, html, nothing, type PropertyValues } from "lit";
import { followCardData, type CardDataState } from "./data";
import { DOMAIN, type HomeAssistant } from "./ha";
import { localizer } from "./localize";
import type { PresetCardConfig } from "./preset-card";

const TOGGLES = [
  "show_header",
  "show_selector",
  "show_example",
  "show_readout",
  "show_arrivals",
  "show_legend",
  "show_note",
] as const;

/** Visual editor: Home Assistant's own form, with the device's presets listed. */
export class OpenBrewByWeightPresetCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _state: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: PresetCardConfig;
  declare _state?: CardDataState;
  private _following?: string;
  private _stop?: () => void;

  setConfig(config: PresetCardConfig) {
    this._config = config;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stop?.();
    this._following = undefined;
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
      schema = [
        { name: "device_id", selector: { device: { integration: DOMAIN } } },
        {
          name: "preset",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "active", label: t("editor.preset_active") },
                ...presets.map((p) => ({ value: String(p.id), label: p.name })),
              ],
            },
          },
        },
        { name: "title", selector: { text: {} } },
        { name: "", type: "grid", schema: TOGGLES.map((name) => ({ name, selector: { boolean: {} } })) },
      ],
      data = {
        preset: "active",
        ...Object.fromEntries(TOGGLES.map((name) => [name, true])),
        ...this._config,
        ...(typeof this._config.preset === "number" ? { preset: String(this._config.preset) } : {}),
      };
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) => t(`editor.${s.name === "device_id" ? "device" : s.name}` as never)}
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  private _changed(e: CustomEvent<{ value: PresetCardConfig & { preset?: string | number } }>) {
    const value = { ...e.detail.value };
    if (value.preset != null && value.preset !== "active") value.preset = Number(value.preset);
    if (!value.title) delete value.title;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: value }, bubbles: true, composed: true }));
  }
}
