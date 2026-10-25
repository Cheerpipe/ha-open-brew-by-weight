import { LitElement, html, nothing } from "lit";
import { loadHaForm } from "./ha-form";
import { DOMAIN, type HomeAssistant } from "./ha";
import { localizer } from "./localize";
import { CHART_VIEWS, type ShotChartCardConfig } from "./shot-chart-card";

const TOGGLES = ["mode_switch", "show_header", "show_readout", "show_legend"] as const;

/** Visual editor for the last shot card, on Home Assistant's own form. */
export class OpenBrewByWeightShotChartCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };

  declare hass?: HomeAssistant;
  declare _config?: ShotChartCardConfig;

  connectedCallback() {
    super.connectedCallback();
    void loadHaForm().then(() => this.requestUpdate());
  }

  setConfig(config: ShotChartCardConfig) {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass.locale?.language ?? this.hass.language),
      schema = [
        { name: "device_id", selector: { device: { integration: DOMAIN } } },
        {
          name: "chart",
          selector: {
            select: { mode: "dropdown", options: CHART_VIEWS.map((v) => ({ value: v, label: t(`view.${v}`) })) },
          },
        },
        { name: "title", selector: { text: {} } },
        { name: "", type: "grid", schema: TOGGLES.map((name) => ({ name, selector: { boolean: {} } })) },
      ],
      data = { chart: "preset_weight", ...Object.fromEntries(TOGGLES.map((n) => [n, true])), ...this._config };
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) => t(`editor.${s.name === "device_id" ? "device" : s.name}` as never)}
      @value-changed=${(e: CustomEvent<{ value: ShotChartCardConfig }>) => {
        const config = { ...e.detail.value };
        if (!config.title) delete config.title;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      }}
    ></ha-form>`;
  }
}
