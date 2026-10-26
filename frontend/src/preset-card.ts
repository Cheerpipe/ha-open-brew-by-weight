import { html, nothing, svg } from "lit";
import { OpenBrewByWeightCard } from "./base-card";
import type { CardData } from "./data";
import { firstDevice, presetSelectEntity, type HomeAssistant } from "./ha";
import type { Localize } from "./localize";
import {
  buildRuleChartModel,
  defaultScrub,
  presetGeometry,
  scrubReading,
  type PresetGeometry,
  type PresetRender,
  type RuleModel,
} from "./preset-chart";
import { cardStyles, themeStyles } from "./theme";

export interface PresetCardConfig {
  type: string;
  device_id?: string;
  /** "active" (default) follows the active preset; a number pins one preset. */
  preset?: "active" | number;
  title?: string;
  show_header?: boolean;
  show_selector?: boolean;
  show_example?: boolean;
  show_readout?: boolean;
  show_arrivals?: boolean;
  show_legend?: boolean;
  show_note?: boolean;
}

type Resolved = PresetCardConfig & Required<Omit<PresetCardConfig, "device_id" | "title">>;

const DEFAULTS: Omit<Resolved, "type"> = {
  preset: "active",
  show_header: true,
  show_selector: true,
  show_example: true,
  show_readout: true,
  show_arrivals: true,
  show_legend: true,
  show_note: true,
};

const n = (v: number) => +(+v).toFixed(1);
let uid = 0;

export class OpenBrewByWeightPresetCard extends OpenBrewByWeightCard<Resolved> {
  static properties = {
    ...OpenBrewByWeightCard.properties,
    _scrub: { state: true },
    _held: { state: true },
  };

  declare _scrub?: number;
  declare _held: boolean;

  protected readonly defaults = DEFAULTS;
  private _id = `obbw${++uid}`;
  private _scrubKey?: string;
  private _geometry?: PresetGeometry;
  private _model?: RuleModel;

  constructor() {
    super();
    this._held = false;
  }

  static getConfigElement() {
    return document.createElement("open-brew-by-weight-preset-card-editor");
  }

  static getStubConfig(hass: HomeAssistant) {
    return { device_id: firstDevice(hass), preset: "active" };
  }

  getCardSize() {
    return 6;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  protected render() {
    if (!this._config) return nothing;
    const t = this.t;
    return html`<ha-card>
      <div class="body" part="body">${this._content(t)}</div>
    </ha-card>`;
  }

  private _content(t: Localize) {
    const state = this._state;
    if (state.status === "loading") return html`<p class="message">${t("state.loading")}</p>`;
    if (state.status === "not_found") return html`<p class="message">${t("state.not_found")}</p>`;
    const { data } = state,
      config = this._config!,
      following = config.preset === "active" || config.preset == null,
      preset = data.presets.find((p) => p.id === (following ? data.activePresetId : Number(config.preset)));
    if (!preset) return html`<p class="message">${t("state.missing_preset")}</p>`;
    if (preset.goalWeightG == null) return html`<p class="message">${t("state.no_rules")}</p>`;
    const m = buildRuleChartModel(preset);
    return html`
      ${config.show_header ? this._header(t, data, preset, following) : nothing}
      ${data.available ? nothing : html`<p class="message" part="status">${t("state.unavailable")}</p>`}
      ${m ? this._chart(t, m, preset) : html`<p class="message">${t("state.empty")}</p>`}
    `;
  }

  private _header(t: Localize, data: CardData, preset: PresetRender, following: boolean) {
    const config = this._config!,
      select = following && config.show_selector && this.hass
        ? presetSelectEntity(this.hass, config.device_id!)
        : undefined,
      details = [
        following ? t("header.active") : t("header.preset"),
        t("header.target", n(preset.goalWeightG!)),
        ...(preset.doseG ? [t("header.dose", n(preset.doseG))] : []),
      ].join(" · ");
    return html`<div class="header" part="header">
      <div class="titles">
        <div class="title" part="title">${config.title || preset.name}</div>
        <div class="subtitle" part="subtitle">${details}</div>
      </div>
      ${select
        ? html`<select
            class="selector"
            part="selector"
            aria-label=${t("header.select")}
            .value=${String(preset.id)}
            ?disabled=${!data.available || data.shotState === "brewing"}
            @change=${(e: Event) => this._select(select, data, (e.target as HTMLSelectElement).value)}
          >
            ${data.presets.map(
              (p) => html`<option value=${String(p.id)} ?selected=${p.id === preset.id}>${p.name}</option>`,
            )}
          </select>`
        : nothing}
    </div>`;
  }

  private _select(entity: string, data: CardData, id: string) {
    const option = data.presets.find((p) => String(p.id) === id)?.name;
    if (option) void this.hass?.callService("select", "select_option", { entity_id: entity, option });
  }

  private _chart(t: Localize, m: RuleModel, preset: PresetRender) {
    if (!this._width) return html`<div class="chart"></div>`;
    const config = this._config!,
      g = presetGeometry(m, this._width, { arrivals: config.show_arrivals ? preset.arrivalsS : [] }),
      key = `${preset.id}:${m.t1}:${m.t2}:${m.wall}`,
      u = this._id;
    this._geometry = g;
    this._model = m;
    if (this._scrubKey !== key || !(this._scrub! >= m.scrubMin && this._scrub! <= m.wall)) {
      this._scrub = defaultScrub(m);
      this._scrubKey = key;
    }
    const reading = scrubReading(this._scrub!, m),
      values = [n(m.goal), reading.arrival.toFixed(1), t(`verdict.${reading.verdict}`), reading.weight.toFixed(1), reading.stop.toFixed(1)],
      readout = t(reading.atTarget ? "graph.readout_target" : "graph.readout", ...values),
      a = Math.max(m.prot, m.t1 - m.dFast),
      b = Math.min(m.wall, m.t2 + m.dSlow),
      summary = t("graph.summary", n(m.prot), n(m.ceil), n(a), n(m.goal), n(m.t1), n(m.t2), n(m.floor), n(b), n(m.wall)),
      band = (cls: string, d: string, on: boolean) =>
        svg`<path class=${on ? `band ${cls}` : "band-off"} part=${`band ${cls}`} d=${d} fill=${`url(#${u}${cls})`}/>`,
      fade = (cls: string, stop: string) =>
        svg`<linearGradient id=${u + cls} x1="0" y1="0" x2="0" y2="1"><stop class=${stop}/><stop class=${`${stop} stop-fade`} offset="1"/></linearGradient>`,
      label = (x: number, y: number, text: string, cls = "", anchor = "middle") =>
        svg`<text class=${`axis-label ${cls}`} x=${x.toFixed(1)} y=${y.toFixed(1)} text-anchor=${anchor}>${text}</text>`,
      hx = g.X(reading.stop),
      hy = g.Y(reading.weight),
      pillText = t("graph.pill", ...values),
      pw = pillText.length * 6.5 + 16;
    return html`
      <div
        class="chart ${this._held ? "held" : ""}"
        part="chart"
        @pointerdown=${config.show_example ? this._down : null}
        @pointermove=${config.show_example ? this._move : null}
        @lostpointercapture=${() => (this._held = false)}
      >
        <svg viewBox="0 0 ${g.width} ${g.height}" width=${g.width} height=${g.height}>
          <defs>
            ${fade("fast-full", "stop-fast-full")} ${fade("fast-partial", "stop-fast-part")}
            ${fade("on-recipe", "stop-window")} ${fade("slow-partial", "stop-slow-part")}
            ${fade("slow-full", "stop-slow-full")}
            <pattern id="${u}hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path class="no-cut-hatch" d="M0 0V6" />
            </pattern>
            <clipPath id="${u}under"><path d=${g.clip} /></clipPath>
          </defs>
          <g role="img" aria-label=${summary}>
            ${g.grid.map((d) => svg`<path class="grid-line" part="grid-line" d=${d}/>`)}
            <g clip-path="url(#${u}under)">
              ${band("fast-full", g.bands.fastFull, m.fast)} ${band("fast-partial", g.bands.fastPart, m.fast)}
              ${band("on-recipe", g.bands.window, true)} ${band("slow-partial", g.bands.slowPart, m.slow)}
              ${band("slow-full", g.bands.slowFull, m.slow)}
              <path class="pace-line" part="pace-line" d=${g.paces}><title>${t("legend.pace")}</title></path>
            </g>
            ${[...g.yLabels, ...g.xLabels].map((l) => label(l.x, l.y, l.text, "", l.anchor))}
            ${g.hatch
              ? svg`<rect class="no-cut" part="no-cut" x=${g.hatch.x} y=${g.hatch.y} width=${g.hatch.width.toFixed(1)} height=${g.hatch.height} fill=${`url(#${u}hatch)`}/>`
              : nothing}
            <path class="target-line" part="target-line" d="M${g.L} ${g.target.toFixed(1)}H${g.R}" />
            <path class="max-line" part="max-line" d="M${g.maxX.toFixed(1)} ${g.T}V${g.B}" />
            <path class="window-edge" part="window-edge" d=${g.windowEdges} />
            <path class="cut-line ${m.mode === "timerOnly" ? "off" : ""}" part="cut-line" d=${g.cut} />
            ${g.arrivals.map(
              (p) => svg`<circle class="recent-shot" part="recent-shot" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="3"/>`,
            )}
            ${g.noCutLabel ? label((g.L + g.hatch!.x + g.hatch!.width) / 2, (g.T + g.B) / 2, t("graph.no_cut"), "halo") : nothing}
            ${label(g.R - 2, g.target + (g.targetAbove ? -4 : 13), t("graph.target", n(m.goal)), "halo strong", "end")}
            ${g.holds.up ? label(g.holds.up.x, g.holds.up.y, t("graph.up_to", n(m.ceil)), "halo hold", "start") : nothing}
            ${g.holds.down ? label(g.holds.down.x, g.holds.down.y, t("graph.down_to", n(m.floor)), "halo hold", "end") : nothing}
            ${label(g.maxX, g.T - 4, t("graph.max", n(m.wall)), "", "end")}
          </g>
          ${config.show_example
            ? svg`<g class="scrub" part="scrub" role="slider" tabindex="0" aria-label=${t("graph.scrub")}
                aria-valuemin=${m.scrubMin} aria-valuemax=${m.wall} aria-valuenow=${reading.stop.toFixed(1)}
                aria-valuetext=${readout} @keydown=${this._key}>
                <path class="scrub-guide" d=${`M${hx.toFixed(1)} ${g.T}V${g.B}`}/>
                <path class="example-shot" part="example-shot" d=${g.pace(reading.arrival, reading.stop)}/>
                <circle class="scrub-handle" part="scrub-handle" cx=${hx.toFixed(2)} cy=${hy.toFixed(2)} r="5"/>
                ${this._held
                  ? svg`<g class="pill" transform=${`translate(${hx - 11 - pw < 1 ? hx + 11 : hx - 11 - pw} ${hy})`}>
                      <rect y="-9" rx="9" height="18" width=${pw}/>
                      <text class="axis-label strong" x="8" y="4">${pillText}</text></g>`
                  : nothing}
              </g>`
            : nothing}
        </svg>
      </div>
      ${config.show_example && config.show_readout ? html`<p class="readout" part="readout">${readout}</p>` : nothing}
      ${config.show_legend ? this._legend(t, m, g) : nothing}
      ${config.show_note ? html`<p class="note" part="note">${this._note(t, m)}</p>` : nothing}
    `;
  }

  private _legend(t: Localize, m: RuleModel, g: PresetGeometry) {
    const config = this._config!,
      key = (cls: string, text: string, swatches = 1) =>
        html`<span class=${`key-${cls}`}>${Array.from({ length: swatches }, () => html`<i></i>`)}${text}</span>`;
    return html`<div class="legend" part="legend">
      ${key("cut", t("legend.cut"))} ${key("pace", t("legend.pace"))}
      ${config.show_example ? key("example", t("legend.example")) : nothing}
      ${g.arrivals.length ? key("arrivals", t("legend.arrivals")) : nothing}
      ${key("window", t("legend.window"))} ${m.fast ? key("fast", t("legend.fast"), 2) : nothing}
      ${m.slow ? key("slow", t("legend.slow"), 2) : nothing} ${key("no-cut", t("legend.no_cut"))}
    </div>`;
  }

  private _note(t: Localize, m: RuleModel) {
    const start = m.firstDropN > 0 ? "note.start_preset" : m.firstDrop > 0 ? "note.start_others" : "note.start_none";
    return [
      ...(m.mode === "timerOnly" ? [t("state.timer_only")] : []),
      t("note.pace"),
      t(start, m.firstDrop.toFixed(1)),
    ].join(" ");
  }

  private _seek(stop: number) {
    const m = this._model;
    if (m) this._scrub = Math.max(m.scrubMin, Math.min(m.wall, Math.round(stop * 10) / 10));
  }

  private _at(e: PointerEvent) {
    const svgElement = this.renderRoot.querySelector("svg");
    if (!svgElement || !this._geometry) return;
    const rect = svgElement.getBoundingClientRect();
    this._seek(this._geometry.tAt(((e.clientX - rect.left) * this._geometry.width) / rect.width));
  }

  private _down = (e: PointerEvent) => {
    const chart = e.currentTarget as HTMLElement;
    chart.setPointerCapture(e.pointerId);
    this.renderRoot.querySelector<SVGGElement>(".scrub")?.focus({ preventScroll: true });
    this._held = true;
    this._at(e);
  };

  private _move = (e: PointerEvent) => {
    if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) this._at(e);
  };

  private _key = (e: KeyboardEvent) => {
    const step = ({ ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5, PageUp: 5, PageDown: -5 } as Record<string, number>)[e.key];
    if (!step || this._scrub == null) return;
    e.preventDefault();
    this._seek(this._scrub + step);
  };

  static styles = [themeStyles, cardStyles];
}
