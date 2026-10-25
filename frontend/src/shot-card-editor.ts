import { LitElement, html, nothing } from "lit";
import { loadHaForm } from "./ha-form";
import { DOMAIN, type HomeAssistant } from "./ha";
import { localizer } from "./localize";
import { DEFAULT_FIELDS, DEFAULT_HERO, type ShotCardConfig } from "./shot-card";
import { FIELDS } from "./shot-fields";

/** Visual editor for the shot details card: device, fields in order, layout. */
export class OpenBrewByWeightShotCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, _config: { state: true } };

  declare hass?: HomeAssistant;
  declare _config?: ShotCardConfig;

  connectedCallback() {
    super.connectedCallback();
    void loadHaForm().then(() => this.requestUpdate());
  }

  setConfig(config: ShotCardConfig) {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = localizer(this.hass.locale?.language ?? this.hass.language),
      options = FIELDS.map((f) => ({ value: f, label: t(`field.${f}`) })),
      // Reorderable multi-selects keep the order the fields are shown in.
      list = { select: { multiple: true, reorder: true, mode: "list", options } },
      schema = [
        { name: "device_id", selector: { device: { integration: DOMAIN } } },
        { name: "title", selector: { text: {} } },
        { name: "hero", selector: list },
        { name: "fields", selector: list },
        {
          name: "",
          type: "grid",
          schema: [
            { name: "columns", selector: { number: { min: 1, max: 6, mode: "box" } } },
            { name: "show_header", selector: { boolean: {} } },
            { name: "show_empty", selector: { boolean: {} } },
          ],
        },
      ],
      data = { show_header: true, show_empty: true, hero: DEFAULT_HERO, fields: DEFAULT_FIELDS, ...this._config },
      label = (name: string) =>
        name === "device_id"
          ? t("editor.device")
          : name === "show_empty"
            ? t("editor.show_empty")
            : t(`editor.${name}` as never);
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(s: { name: string }) => label(s.name)}
      @value-changed=${(e: CustomEvent<{ value: ShotCardConfig }>) => {
        const config = { ...e.detail.value };
        if (!config.title) delete config.title;
        if (!config.columns) delete config.columns;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      }}
    ></ha-form>`;
  }
}
