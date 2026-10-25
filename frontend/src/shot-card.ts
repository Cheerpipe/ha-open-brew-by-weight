import { css, html, nothing } from "lit";
import { OpenBrewByWeightCard } from "./base-card";
import { firstDevice, type HomeAssistant } from "./ha";
import type { Localize } from "./localize";
import { FIELDS, shotFields, type Field, type FieldValue } from "./shot-fields";
import { shotHeader } from "./shot-header";
import { buildShotSparkModel, expandShot, type ShotModel, type ShotRow } from "./shot-model";
import { cardStyles, themeStyles } from "./theme";

export interface ShotCardConfig {
  type: string;
  device_id?: string;
  title?: string;
  show_header?: boolean;
  /** Fields shown as large numbers above the grid, in order. */
  hero?: Field[];
  /** Fields in the grid, in order. */
  fields?: Field[];
  /** Grid columns; unset fits as many as the width allows. */
  columns?: number;
  /** Show fields the shot has no value for, as "—". */
  show_empty?: boolean;
}

export const DEFAULT_HERO: Field[] = ["duration", "yield"];
export const DEFAULT_FIELDS: Field[] = FIELDS.filter((f) => !DEFAULT_HERO.includes(f));

const DEFAULTS: Partial<ShotCardConfig> = {
  show_header: true,
  hero: DEFAULT_HERO,
  fields: DEFAULT_FIELDS,
  show_empty: true,
};

/** Every number of the last shot, like a shot card in the Web UI's Stats page. */
export class OpenBrewByWeightShotCard extends OpenBrewByWeightCard<ShotCardConfig> {
  protected readonly defaults = DEFAULTS;
  private _shotKey?: unknown;
  private _shot?: { row: Record<string, unknown>; model: ShotModel | null } | null;

  static getConfigElement() {
    return document.createElement("open-brew-by-weight-shot-card-editor");
  }

  static getStubConfig(hass: HomeAssistant) {
    return { device_id: firstDevice(hass) };
  }

  setConfig(config: ShotCardConfig) {
    for (const key of ["hero", "fields"] as const) {
      const list = config?.[key];
      if (list !== undefined && (!Array.isArray(list) || list.some((f) => !FIELDS.includes(f))))
        throw new Error(`${key} must list fields from: ${FIELDS.join(", ")}`);
    }
    super.setConfig(config);
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  protected render() {
    if (!this._config) return nothing;
    return html`<ha-card><div class="body" part="body">${this._content(this.t)}</div></ha-card>`;
  }

  private _content(t: Localize) {
    const state = this._state;
    if (state.status === "loading") return html`<p class="message">${t("state.loading")}</p>`;
    if (state.status === "not_found") return html`<p class="message">${t("state.not_found")}</p>`;
    const config = this._config!,
      row = state.data.lastShot as ShotRow | null,
      header = (r: Record<string, unknown> | null) =>
        config.show_header
          ? shotHeader(t, r, config.title, this.hass?.locale?.language ?? this.hass?.language)
          : nothing;
    if (!row) return html`${header(null)}<p class="message">${t("shot.none")}</p>`;
    if (row !== this._shotKey) {
      this._shotKey = row;
      const expanded = expandShot(row);
      // Without its curve the shot still has its numbers; only the curve-derived ones go.
      this._shot = { row: expanded ?? row, model: expanded && buildShotSparkModel(expanded) };
    }
    const { row: shot, model } = this._shot!,
      values = shotFields(t, shot, model),
      shown = (list: Field[] = []) =>
        list.filter((f) => values[f] && (config.show_empty || values[f]!.value !== "—"));
    return html`
      ${header(shot)}
      ${state.data.available ? nothing : html`<p class="message" part="status">${t("state.unavailable")}</p>`}
      ${shown(config.hero).length
        ? html`<div class="hero" part="hero">
            ${shown(config.hero).map((f) => this._field(t, f, values[f]!, "hero-field"))}
          </div>`
        : nothing}
      <div
        class="fields"
        part="fields"
        style=${config.columns ? `--_columns: repeat(${config.columns}, minmax(0, 1fr))` : ""}
      >
        ${shown(config.fields).map((f) => this._field(t, f, values[f]!, "field"))}
      </div>
    `;
  }

  private _field(t: Localize, field: Field, value: FieldValue, cls: string) {
    return html`<div class=${cls} part=${cls} data-field=${field}>
      <div class="label" part="label">${t(`field.${field}`)}</div>
      ${value.stars === undefined
        ? html`<div class=${`value ${value.tone ?? ""}`} part="value">${value.value}</div>`
        : html`<div class="value stars" part="value" role="img" aria-label=${value.value}>
            ${Array.from({ length: 5 }, (_, i) => html`<span class=${i < value.stars! ? "on" : "off"}>★</span>`)}
          </div>`}
    </div>`;
  }

  static styles = [
    themeStyles,
    cardStyles,
    css`
      :where(.hero) {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        gap: var(--obbw-field-gap, 10px);
        margin: 4px 0 14px;
      }
      :where(.hero-field) {
        padding: 10px 12px;
        border-radius: var(--obbw-tile-radius, 10px);
        background: var(--obbw-tile-background, color-mix(in srgb, var(--_fg) 5%, var(--_surface)));
      }
      :where(.hero-field .value) {
        font-size: var(--obbw-hero-font-size, 28px);
        font-weight: 500;
        line-height: 1.2;
      }
      :where(.fields) {
        display: grid;
        /* The columns option sets --_columns; a style rule still wins over it. */
        grid-template-columns: var(--_columns, repeat(auto-fill, minmax(var(--obbw-field-min-width, 104px), 1fr)));
        gap: var(--obbw-field-gap, 10px) 12px;
      }
      :where(.label) {
        font-size: var(--obbw-label-font-size, 11px);
        color: var(--obbw-label-color, var(--_muted));
      }
      :where(.value) {
        font-size: var(--obbw-value-font-size, 14px);
        color: var(--obbw-value-color, var(--_fg));
        font-variant-numeric: tabular-nums;
        overflow-wrap: anywhere;
      }
      :where(.value.high) {
        color: var(--obbw-error-high-color, var(--primary-color, #a83b21));
      }
      :where(.value.low) {
        color: var(--obbw-error-low-color, var(--_ok));
      }
      :where(.stars) {
        white-space: nowrap;
      }
      :where(.stars .on) {
        color: var(--obbw-star-color, #e8a317);
      }
      :where(.stars .off) {
        color: var(--obbw-star-off-color, color-mix(in srgb, var(--_fg) 25%, var(--_surface)));
      }
    `,
  ];
}
