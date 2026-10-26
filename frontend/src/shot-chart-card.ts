import { css, html, nothing, svg, type TemplateResult } from "lit";
import { OpenBrewByWeightCard } from "./base-card";
import { firstDevice, type HomeAssistant } from "./ha";
import type { Localize } from "./localize";
import { cutLine, presetGeometry, type Label, type RuleModel } from "./preset-chart";
import { polyline, sparkGeometry, type SeriesPath, type SparkView } from "./shot-chart";
import {
  buildShotSparkModel,
  curveAt,
  expandShot,
  shotRuleModel,
  type Point,
  type ShotModel,
  type ShotRow,
} from "./shot-model";
import { shotHeader } from "./shot-header";
import { cardStyles, themeStyles } from "./theme";

export type ChartView = "preset_weight" | SparkView;
export const CHART_VIEWS: ChartView[] = ["preset_weight", "weight_flow", "weight", "flow"];

export interface ShotChartCardConfig {
  type: string;
  device_id?: string;
  /** The chart shown first. */
  chart?: ChartView;
  /** Buttons that let whoever views the dashboard switch the chart. */
  mode_switch?: boolean;
  title?: string;
  show_header?: boolean;
  show_readout?: boolean;
  show_legend?: boolean;
}

const DEFAULTS: Partial<ShotChartCardConfig> = {
  chart: "preset_weight",
  mode_switch: true,
  show_header: true,
  show_readout: true,
  show_legend: true,
};

// A viewer's pick sticks per device and configured chart, in this browser only.
const viewKey = (config: ShotChartCardConfig) => `obbw-shot-view:${config.device_id}:${config.chart}`;
let uid = 0;

interface Prepared {
  row: Record<string, unknown>;
  model: ShotModel;
  rule: RuleModel | null;
  weight: Point[];
  flow: Point[];
}

export class OpenBrewByWeightShotChartCard extends OpenBrewByWeightCard<ShotChartCardConfig> {
  static properties = {
    ...OpenBrewByWeightCard.properties,
    _view: { state: true },
    _cursor: { state: true },
  };

  declare _view?: ChartView;
  declare _cursor?: number;
  protected readonly defaults = DEFAULTS;
  private _id = `obbws${++uid}`;
  private _shotKey?: unknown;
  private _prepared?: Prepared | null;
  private _tAt?: (px: number) => number;

  static getConfigElement() {
    return document.createElement("open-brew-by-weight-shot-chart-card-editor");
  }

  static getStubConfig(hass: HomeAssistant) {
    return { device_id: firstDevice(hass), chart: "preset_weight" };
  }

  setConfig(config: ShotChartCardConfig) {
    if (config?.chart && !CHART_VIEWS.includes(config.chart)) throw new Error(`Unknown chart: ${config.chart}`);
    super.setConfig(config);
    let stored: string | null = null;
    try {
      stored = this._config!.mode_switch ? localStorage.getItem(viewKey(this._config!)) : null;
    } catch {
      // Storage may be off (private browsing): keep the configured chart.
    }
    this._view = CHART_VIEWS.includes(stored as ChartView) ? (stored as ChartView) : this._config!.chart;
  }

  getCardSize() {
    return 6;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  protected render() {
    if (!this._config) return nothing;
    return html`<ha-card><div class="body" part="body">${this._content(this.t)}</div></ha-card>`;
  }

  /** The shot ready to draw, rebuilt only when the subscription sends a new one. */
  private _prepare(row: ShotRow): Prepared | null {
    if (row === this._shotKey) return this._prepared!;
    this._shotKey = row;
    this._cursor = undefined;
    const shot = expandShot(row),
      model = shot && buildShotSparkModel(shot);
    this._prepared = model
      ? {
          row: shot!,
          model,
          rule: shotRuleModel(shot),
          weight: model.pts.slice().sort((a, b) => a.t - b.t),
          flow: model.flowSegs
            .concat(model.dripFlowSegs)
            .flatMap((s) => s.pts)
            .sort((a, b) => a.t - b.t),
        }
      : null;
    return this._prepared;
  }

  private _content(t: Localize) {
    const state = this._state;
    if (state.status === "loading") return html`<p class="message">${t("state.loading")}</p>`;
    if (state.status === "not_found") return html`<p class="message">${t("state.not_found")}</p>`;
    const config = this._config!,
      row = state.data.lastShot as ShotRow | null;
    if (!row) return html`${config.show_header ? this._header(t, null) : nothing}<p class="message">${t("shot.none")}</p>`;
    const shot = this._prepare(row);
    if (!shot) return html`${config.show_header ? this._header(t, row) : nothing}<p class="message">${t("shot.no_curve")}</p>`;
    // Without the rule it ran with, the shot can't sit over its preset.
    const view = this._view === "preset_weight" && !shot.rule ? "weight_flow" : this._view!;
    // The cursor starts at the stop, where both weight and flow read; else at the last reading.
    this._cursor ??= Number.isFinite(Number(shot.row.endS))
      ? Math.min(Number(shot.row.endS), shot.weight.at(-1)!.t)
      : shot.weight.at(-1)!.t;
    return html`
      ${config.show_header ? this._header(t, shot.row) : nothing}
      ${state.data.available ? nothing : html`<p class="message" part="status">${t("state.unavailable")}</p>`}
      ${config.mode_switch ? this._switch(t, view, !!shot.rule) : nothing}
      ${view === "preset_weight" ? this._presetView(t, shot) : this._sparkView(t, shot, view)}
    `;
  }

  private _header(t: Localize, row: Record<string, unknown> | null) {
    return shotHeader(t, row, this._config!.title, this.hass?.locale?.language ?? this.hass?.language);
  }

  private _switch(t: Localize, view: ChartView, hasRule: boolean) {
    return html`<div class="views" part="views" role="group" aria-label=${t("view.label")}>
      ${CHART_VIEWS.filter((v) => hasRule || v !== "preset_weight").map(
        (v) => html`<button
          type="button"
          class="view"
          part="view"
          aria-pressed=${String(v === view)}
          @click=${() => this._pick(v)}
        >
          ${t(`view.${v}`)}
        </button>`,
      )}
    </div>`;
  }

  private _pick(view: ChartView) {
    this._view = view;
    try {
      localStorage.setItem(viewKey(this._config!), view);
    } catch {
      // Storage may be off: the pick lasts until the page reloads.
    }
  }

  private _label(l: Label, cls = "") {
    return svg`<text class=${`axis-label ${cls}`} x=${l.x.toFixed(1)} y=${l.y.toFixed(1)} text-anchor=${l.anchor}>${l.text}</text>`;
  }

  /** The shot over the preset it ran with, like the Web UI Stats card. */
  private _presetView(t: Localize, shot: Prepared) {
    if (!this._width) return html`<div class="chart"></div>`;
    const { model: m, rule: r, row } = shot,
      rule = r!,
      tMax = Math.max(rule.wall, m.dur),
      g = presetGeometry(rule, this._width, { compact: true, tens: true, maxG: m.rawMaxW, maxT: tMax }),
      u = this._id,
      // Only the zone the shot ended in keeps its fill; timer-only shots keep none.
      zone = String(row.shotType).toLowerCase() === "timer_only" ? "none" : ["fast", "slow"].includes(String(row.verdict)) ? String(row.verdict) : "on_recipe",
      band = (cls: string, d: string, on: boolean, shown: boolean) =>
        !on
          ? svg`<path class="band-off" d=${d}/>`
          : shown
            ? svg`<path class=${`band ${cls}`} part=${`band ${cls}`} d=${d} fill=${`url(#${u}${cls})`}/>`
            : nothing,
      fade = (cls: string, stop: string) =>
        svg`<linearGradient id=${u + cls} x1="0" y1="0" x2="0" y2="1"><stop class=${stop}/><stop class=${`${stop} stop-fade`} offset="1"/></linearGradient>`,
      stop = m.dripSegs.length && Number.isFinite(Number(row.endS)) ? Number(row.endS) : null,
      tc = this._cursor!,
      w = curveAt(shot.weight, tc),
      cut = rule.mode === "active" ? `${cutLine(tc, rule).toFixed(1)} g` : "—",
      readout = t("shot.cursor", tc.toFixed(1), w.toFixed(1), cut);
    this._tAt = g.tAt;
    return html`
      ${this._chart(
        g.width,
        g.height,
        svg`
          <defs>
            ${fade("fast-full", "stop-fast-full")} ${fade("fast-partial", "stop-fast-part")}
            ${fade("on-recipe", "stop-window")} ${fade("slow-partial", "stop-slow-part")}
            ${fade("slow-full", "stop-slow-full")}
            <clipPath id=${`${u}under`}><path d=${g.clip}/></clipPath>
          </defs>
          ${g.grid.map((d) => svg`<path class="grid-line" part="grid-line" d=${d}/>`)}
          <g clip-path=${`url(#${u}under)`}>
            ${band("fast-full", g.bands.fastFull, rule.fast, zone === "fast")}
            ${band("fast-partial", g.bands.fastPart, rule.fast, zone === "fast")}
            ${band("on-recipe", g.bands.window, true, zone === "on_recipe")}
            ${band("slow-partial", g.bands.slowPart, rule.slow, zone === "slow")}
            ${band("slow-full", g.bands.slowFull, rule.slow, zone === "slow")}
            <path class="pace-line" part="pace-line" d=${g.paces}/>
          </g>
          ${[...g.yLabels, ...g.xLabels].map((l) => this._label(l))}
          <path class="target-line" part="target-line" d=${`M${g.L} ${g.target.toFixed(1)}H${g.R}`}/>
          <path class="max-line" part="max-line" d=${`M${g.maxX.toFixed(1)} ${g.T}V${g.B}`}/>
          <path class="window-edge" part="window-edge" d=${g.windowEdges}/>
          <path class=${`cut-line ${rule.mode === "timerOnly" ? "off" : ""}`} part="cut-line" d=${g.cut}/>
          ${m.segs.map((s) => svg`<path class="shot-line" part="shot-line" d=${polyline(s.pts, g.X, g.Y, tMax)}/>`)}
          ${m.dripSegs.map((s) => svg`<path class="shot-line drip" part="shot-line drip" d=${polyline(s.pts, g.X, g.Y, tMax)}/>`)}
          ${m.held.map((q) => svg`<circle class="held" part="held" cx=${g.X(q.t).toFixed(1)} cy=${g.Y(q.cg / 100).toFixed(1)} r="2"/>`)}
          ${this._label({ x: g.R - 2, y: g.target + (g.targetAbove ? -4 : 13), text: t("graph.target", +rule.goal.toFixed(1)), anchor: "end" }, "halo strong")}
          ${g.holds.up ? this._label({ ...g.holds.up, text: t("graph.up_to", +rule.ceil.toFixed(1)) }, "halo hold") : nothing}
          ${g.holds.down ? this._label({ ...g.holds.down, text: t("graph.down_to", +rule.floor.toFixed(1)) }, "halo hold") : nothing}
          ${stop == null ? nothing : svg`<circle class="stop-point" part="stop-point" r="3" cx=${g.X(stop).toFixed(2)} cy=${g.Y(curveAt(shot.weight, stop)).toFixed(2)}/>`}
          ${m.finalPoint ? svg`<circle class="final-point shot" part="final-point" r="3" cx=${g.X(m.finalPoint.t).toFixed(1)} cy=${g.Y(m.finalPoint.cg / 100).toFixed(1)}/>` : nothing}
          <g class="cursor" part="cursor">
            <path class="cursor-guide" d=${`M${g.X(tc).toFixed(1)} ${g.T}V${g.B}`}/>
            <circle class="cursor-dot" r="5" cx=${g.X(tc).toFixed(2)} cy=${g.Y(w).toFixed(2)}/>
          </g>
        `,
        readout,
        shot,
      )}
      ${this._config!.show_readout ? html`<p class="readout" part="readout">${readout}</p>` : nothing}
      ${this._config!.show_legend
        ? html`<div class="legend" part="legend">
            ${this._key("cut", t("legend.cut"))}
            ${zone === "fast"
              ? this._key("fast", t("legend.fast"), 2)
              : zone === "slow"
                ? this._key("slow", t("legend.slow"), 2)
                : zone === "on_recipe"
                  ? this._key("window", t("legend.window"))
                  : nothing}
            ${this._key("last", t("legend.last"))}
            ${stop == null ? nothing : this._key("stopped", t("legend.stopped"))}
            ${m.finalPoint ? this._key("final", t("legend.final")) : nothing}
            ${m.held.length ? this._key("held", t("legend.held")) : nothing}
          </div>`
        : nothing}
    `;
  }

  /** Weight and flow on one grid, or either alone. */
  private _sparkView(t: Localize, shot: Prepared, view: SparkView) {
    if (!this._width) return html`<div class="chart"></div>`;
    const { model: m, rule } = shot,
      g = sparkGeometry(m, this._width, view, rule ? Math.max(rule.wall, m.dur) : m.timeMax),
      u = this._id,
      tc = this._cursor!,
      w = curveAt(shot.weight, tc),
      f = shot.flow.length && tc >= shot.flow[0].t && tc <= shot.flow.at(-1)!.t ? curveAt(shot.flow, tc) : null,
      readout =
        view === "weight"
          ? `${tc.toFixed(1)} s · ${w.toFixed(1)} g`
          : view === "flow"
            ? `${tc.toFixed(1)} s · ${f?.toFixed(1) ?? "—"} g/s`
            : t("shot.flow_cursor", tc.toFixed(1), w.toFixed(1), f?.toFixed(1) ?? "—"),
      kinds = [...new Set(m.segs.map((s) => s.kind))],
      series = (paths: SeriesPath[], flow: boolean) => {
        const cls = (s: SeriesPath) => (flow ? "flow" : `weight ${s.kind}`);
        return svg`${paths.map((s, i) =>
          s.area
            ? svg`<linearGradient id=${`${u}${flow ? "f" : "w"}${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop class=${`fill-top ${cls(s)}`}/><stop class=${`fill-base ${cls(s)}`} offset="1"/></linearGradient>
                <path class="series-fill" d=${s.area} fill=${`url(#${u}${flow ? "f" : "w"}${i})`}/>`
            : nothing,
        )}${paths.map((s) => svg`<path class=${`series ${cls(s)} ${s.drip ? "drip" : ""}`} part=${flow ? "flow-line" : "weight-line"} d=${s.d}/>`)}`;
      },
      drip = m.dripSegs.length || m.dripFlowSegs.length;
    this._tAt = g.tAt;
    return html`
      ${this._chart(
        g.width,
        g.height,
        svg`
          ${g.grid.map((d) => svg`<path class="grid-line" part="grid-line" d=${d}/>`)}
          ${[...g.weightLabels, ...g.flowLabels, ...g.xLabels].map((l) => this._label(l, g.flowLabels.includes(l) && view === "weight_flow" ? "flow-label" : ""))}
          ${series(g.flow, true)} ${series(g.weight, false)}
          ${g.held.map((p) => svg`<circle class="held" part="held" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="2"/>`)}
          ${g.finalPoint ? svg`<circle class="final-point" part="final-point" r="3" cx=${g.finalPoint.x.toFixed(1)} cy=${g.finalPoint.y.toFixed(1)}/>` : nothing}
          <g class="cursor" part="cursor">
            <path class="cursor-guide" d=${`M${g.X(tc).toFixed(1)} ${g.T}V${g.B}`}/>
            ${view === "flow" ? nothing : svg`<circle class="cursor-dot weight" r="4" cx=${g.X(tc).toFixed(2)} cy=${g.Yw(w).toFixed(2)}/>`}
            ${view === "weight" || f == null ? nothing : svg`<circle class="cursor-dot flow" r="4" cx=${g.X(tc).toFixed(2)} cy=${g.Yf(f).toFixed(2)}/>`}
          </g>
        `,
        readout,
        shot,
      )}
      ${this._config!.show_readout ? html`<p class="readout" part="readout">${readout}</p>` : nothing}
      ${this._config!.show_legend
        ? html`<div class="legend" part="legend">
            ${view === "flow" ? nothing : html`<span class="key-weight">${kinds.map((k) => html`<i class=${k}></i>`)}${t("legend.weight")}</span>`}
            ${view === "weight" ? nothing : this._key("flow", t("legend.flow"))}
            ${drip ? this._key("drip", t("legend.drip")) : nothing}
            ${m.held.length && view !== "flow" ? this._key("held", t("legend.held")) : nothing}
            ${m.truncated ? html`<span>${t("legend.incomplete")}</span>` : nothing}
          </div>`
        : nothing}
    `;
  }

  private _key(cls: string, text: string, swatches = 1) {
    return html`<span class=${`key-${cls}`}>${Array.from({ length: swatches }, () => html`<i></i>`)}${text}</span>`;
  }

  /** The chart frame: drag, hover, or arrow keys move the cursor along the shot. */
  private _chart(width: number, height: number, content: TemplateResult, readout: string, shot: Prepared) {
    const first = shot.weight[0].t,
      last = shot.weight.at(-1)!.t;
    return html`<div
      class="chart"
      part="chart"
      tabindex="0"
      role="slider"
      aria-label=${this.t("shot.cursor_label")}
      aria-valuemin=${first.toFixed(1)}
      aria-valuemax=${last.toFixed(1)}
      aria-valuenow=${this._cursor!.toFixed(1)}
      aria-valuetext=${readout}
      @pointerdown=${(e: PointerEvent) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        this._seekAt(e, shot);
      }}
      @pointermove=${(e: PointerEvent) => {
        if (e.pointerType === "mouse" || (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId))
          this._seekAt(e, shot);
      }}
      @keydown=${(e: KeyboardEvent) => {
        const step = ({ ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5, PageUp: 5, PageDown: -5 } as Record<string, number>)[e.key];
        if (!step) return;
        e.preventDefault();
        this._seek(this._cursor! + step, shot);
      }}
    >
      <svg viewBox="0 0 ${width} ${height}" width=${width} height=${height}>${content}</svg>
    </div>`;
  }

  private _seekAt(e: PointerEvent, shot: Prepared) {
    const svgElement = (e.currentTarget as HTMLElement).querySelector("svg");
    if (!svgElement || !this._tAt) return;
    const rect = svgElement.getBoundingClientRect();
    this._seek(this._tAt(((e.clientX - rect.left) * this._width) / (rect.width || this._width)), shot);
  }

  private _seek(t: number, shot: Prepared) {
    this._cursor = Math.round(Math.max(shot.weight[0].t, Math.min(shot.weight.at(-1)!.t, t)) * 10) / 10;
  }

  static styles = [
    themeStyles,
    cardStyles,
    css`
      :where(.views) {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 2px;
        padding: 3px;
        margin: 0 0 8px;
        border-radius: 999px;
        background: var(--obbw-switch-background, color-mix(in srgb, var(--_fg) 6%, var(--_surface)));
      }
      :where(.view) {
        border: none;
        border-radius: 999px;
        padding: 4px 12px;
        background: transparent;
        color: var(--_muted);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      :where(.view[aria-pressed="true"]) {
        background: var(--obbw-switch-active-background, var(--_surface));
        color: var(--_fg);
        box-shadow: 0 0 0 1px var(--obbw-grid-color, var(--divider-color, #dadada));
      }
      :where(.chart) {
        cursor: crosshair;
        outline: none;
      }
      :where(.chart:focus-visible) {
        box-shadow: 0 0 0 2px var(--primary-color, #03a9f4);
        border-radius: 4px;
      }
      :where(.shot-line) {
        fill: none;
        stroke: var(--_shot);
        stroke-width: var(--obbw-shot-line-width, 1.8);
        stroke-linejoin: round;
      }
      :where(.drip) {
        stroke-dasharray: 3 3;
      }
      :where(.held) {
        fill: var(--_muted);
        opacity: 0.6;
      }
      :where(.stop-point) {
        fill: var(--_shot);
        stroke: var(--_surface);
        stroke-width: 1.5;
      }
      :where(.series) {
        fill: none;
        stroke-width: var(--obbw-series-line-width, 1.6);
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      :where(.series.flow) {
        stroke: var(--_flow);
      }
      :where(.series.bbw) {
        stroke: var(--_weight);
      }
      :where(.series.fast) {
        stroke: var(--_fast);
      }
      :where(.series.slow) {
        stroke: var(--_slow);
      }
      :where(.series.atm) {
        stroke: var(--_muted);
      }
      :where(.fill-top) {
        stop-opacity: var(--obbw-weight-fill-opacity, 0.36);
      }
      :where(.fill-top.flow) {
        stop-opacity: var(--obbw-flow-fill-opacity, 0.42);
      }
      :where(.fill-base) {
        stop-opacity: 0;
      }
      :where(.fill-base.flow) {
        stop-opacity: 0.02;
      }
      :where(.fill-top.flow, .fill-base.flow) {
        stop-color: var(--_flow);
      }
      :where(.fill-top.bbw, .fill-base.bbw) {
        stop-color: var(--_weight);
      }
      :where(.fill-top.fast, .fill-base.fast) {
        stop-color: var(--_fast);
      }
      :where(.fill-top.slow, .fill-base.slow) {
        stop-color: var(--_slow);
      }
      :where(.fill-top.atm, .fill-base.atm) {
        stop-color: var(--_muted);
      }
      :where(.final-point) {
        fill: var(--_surface);
        stroke: var(--_weight);
        stroke-width: 1.4;
      }
      :where(.final-point.shot) {
        stroke: var(--_shot);
      }
      :where(.flow-label) {
        fill: var(--obbw-flow-label-color, var(--_muted));
      }
      :where(.cursor-guide) {
        stroke: var(--_fg);
        stroke-opacity: 0.5;
        stroke-width: 1;
      }
      :where(.cursor-dot) {
        fill: var(--obbw-cursor-color, var(--_shot));
        stroke: var(--_surface);
        stroke-width: 1.5;
      }
      :where(.cursor-dot.weight) {
        fill: var(--obbw-cursor-color, var(--_weight));
      }
      :where(.cursor-dot.flow) {
        fill: var(--_flow);
      }
      :where(.legend .key-last i) {
        height: 0;
        border-top: 2.5px solid var(--_shot);
        border-radius: 0;
      }
      :where(.legend .key-stopped i, .legend .key-final i) {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--_shot);
      }
      :where(.legend .key-final i) {
        background: var(--_surface);
        border: 1.5px solid var(--_shot);
        box-sizing: border-box;
      }
      :where(.legend .key-held i) {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--_muted);
        opacity: 0.6;
      }
      :where(.legend .key-weight i) {
        width: 7px;
        height: 3px;
        border-radius: 0;
        background: var(--_weight);
      }
      :where(.legend .key-weight i:first-child) {
        margin-left: 0;
      }
      :where(.legend .key-weight i + i) {
        margin-left: -4px;
      }
      :where(.legend .key-weight i.fast) {
        background: var(--_fast);
      }
      :where(.legend .key-weight i.slow) {
        background: var(--_slow);
      }
      :where(.legend .key-weight i.atm) {
        background: var(--_muted);
      }
      :where(.legend .key-flow i) {
        height: 3px;
        background: var(--_flow);
      }
      :where(.legend .key-drip i) {
        height: 0;
        border-top: 2.5px dashed var(--_muted);
        border-radius: 0;
      }
    `,
  ];
}
