import { css, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { OpenBrewByWeightCard } from "./base-card";
import { followStats, type StatsData } from "./data";
import { firstDevice, type HomeAssistant } from "./ha";
import type { Localize } from "./localize";
import {
  CONSISTENT,
  CUT_CLOSE_G,
  CUT_FAR_G,
  SPREAD_SHOTS,
  VARIED,
  WINDOWS,
  axisLabel,
  chartPreset,
  consistencyModel,
  cutModel,
  densityModel,
  densityTicks,
  ewmaBand,
  grams,
  layoutTicks,
  missBars,
  missGeometry,
  rangeBand,
  sizeOf,
  timedShots,
  windowChoices,
  type BandMode,
  type Size,
  type StatsHeader,
} from "./stats-chart";
import { cardStyles, themeStyles } from "./theme";

export type StatsKind = "time" | "consistency" | "cut";

export interface StatsCardConfig {
  type: string;
  device_id?: string;
  title?: string;
  /** "active" (default) follows the active preset, "all" every preset, a number one preset. */
  preset?: "active" | "all" | number;
  /** How many of the newest good shots the chart covers first. */
  shots?: (typeof WINDOWS)[number];
  show_header?: boolean;
  show_preset_selector?: boolean;
  show_shots_selector?: boolean;
  show_figures?: boolean;
  show_legend?: boolean;
  /** The band behind the consistency and cut accuracy bars. */
  band?: BandMode;
}

const DEFAULTS: Partial<StatsCardConfig> = {
  preset: "active",
  shots: 10,
  show_header: true,
  show_preset_selector: true,
  show_shots_selector: true,
  show_figures: true,
  show_legend: true,
  band: "range",
};

// The chosen preset when it is the active one, whichever that is.
const ACTIVE = -1;
// The colours a size, a guard, and a zone are drawn in.
const SIZE_COLORS: Record<Size, string> = { near: "var(--_ok)", mid: "var(--_mid)", far: "var(--_fast)" };
const guardColor = (g: number) => (g === 1 ? "var(--_fast)" : "var(--_slow)");
const ZONE_COLORS = { fast: "var(--_fast)", on_recipe: "var(--_ok)", slow: "var(--_slow)" };
// Room right of the bars for the scale, as in the Web UI (2.4rem).
const GUTTER = 38.4;
let uid = 0;

/** What one bar chart (consistency or cut accuracy) draws, as the Web UI's missChart takes it. */
interface MissSpec {
  /** The figures above the chart and their grid's class. */
  head: TemplateResult;
  headClass: string;
  vals: number[];
  M: number;
  counts: (i: number) => boolean;
  cls: (i: number) => string;
  ring?: (i: number) => boolean;
  guard: (i: number) => number;
  color: (i: number) => string;
  near: number;
  far: number;
  edges: string[];
  pill: (i: number) => string;
  aria: string;
  legend: [string | null, string][];
}

/**
 * A Web UI Stats chart in a card: it follows the device's presets and one
 * window and chart preset of the Stats header, which viewers may change when
 * the card shows the selectors. Their picks stick in this browser only.
 */
abstract class OpenBrewByWeightStatsCard extends OpenBrewByWeightCard<StatsCardConfig> {
  static properties = {
    ...OpenBrewByWeightCard.properties,
    _stats: { state: true },
    _pickPreset: { state: true },
    _pickWindow: { state: true },
    _held: { state: true },
  };

  declare _stats?: StatsData;
  declare _pickPreset?: number;
  declare _pickWindow?: number;
  declare _held: boolean;
  // Not reactive: render resets it when the data changes; a seek asks for the update.
  protected _cursor?: number;

  protected abstract readonly kind: StatsKind;
  protected readonly defaults = DEFAULTS;
  protected _id = `obbwst${++uid}`;
  private _asked?: string;
  private _stopStats?: () => void;
  private _cursorKey?: unknown;
  // The plot's size in px while a pointer holds the cursor, for the pill.
  private _plot = { w: 0, h: 0 };

  constructor() {
    super();
    this._held = false;
  }

  static getStubConfig(hass: HomeAssistant) {
    return { device_id: firstDevice(hass) };
  }

  setConfig(config: StatsCardConfig) {
    if (config?.shots != null && !WINDOWS.includes(config.shots)) throw new Error(`Unknown shots: ${config.shots}`);
    if (config?.band != null && !["range", "ewma"].includes(config.band)) throw new Error(`Unknown band: ${config.band}`);
    const preset = config?.preset;
    if (preset != null && preset !== "active" && preset !== "all" && !(Number.isInteger(preset) && preset > 0))
      throw new Error(`Unknown preset: ${preset}`);
    super.setConfig(config);
    let stored: { preset?: number; window?: number } = {};
    try {
      stored = JSON.parse(localStorage.getItem(this._pickKey) ?? "{}");
    } catch {
      // Storage may be off (private browsing): keep the configured choice.
    }
    this._pickPreset = this._config!.show_preset_selector ? stored.preset : undefined;
    this._pickWindow = this._config!.show_shots_selector ? stored.window : undefined;
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopStats?.();
    this._stopStats = this._asked = undefined;
  }

  protected updated(changed: PropertyValues) {
    super.updated(changed);
    this._followStats();
  }

  // A viewer's picks stick per device, card kind and configured choice.
  private get _pickKey() {
    const c = this._config!;
    return `obbw-stats:${this.kind}:${c.device_id}:${c.preset}:${c.shots}`;
  }

  /** The window and preset the chart follows, after the Web UI's fallbacks. */
  private _choice() {
    const config = this._config!,
      chart = this._stats?.chart,
      active = this._state.status === "ready" ? this._state.data.activePresetId : 0,
      configured = config.preset === "all" ? 0 : config.preset === "active" || config.preset == null ? ACTIVE : config.preset,
      chosen = this._pickPreset ?? configured,
      windows = chart ? windowChoices(chart.good, chart.source === "companion") : [...WINDOWS],
      want = this._pickWindow ?? config.shots ?? 10;
    return {
      preset: chartPreset(chosen === ACTIVE ? active : chosen, active, chart?.stats),
      window: windows.includes(want as never) ? want : windows.at(-1)!,
      windows,
    };
  }

  private _followStats() {
    const device = this._config?.device_id;
    if (!this.hass || !device || !this.isConnected || this._state.status !== "ready") return;
    const { window, preset } = this._choice(),
      key = `${device}:${window}:${preset}`;
    if (key === this._asked) return;
    this._stopStats?.();
    this._asked = key;
    this._stopStats = followStats(this.hass, device, window, preset, (state) => {
      if (state.status !== "ready") return;
      // Until the new window or preset arrives, the chart keeps the last one.
      this._stats = state.data.chart || !this._stats?.chart ? state.data : { ...this._stats, available: state.data.available };
    });
  }

  private _pick(change: { preset?: number; window?: number }) {
    if ("preset" in change) this._pickPreset = change.preset;
    if ("window" in change) this._pickWindow = change.window;
    try {
      localStorage.setItem(this._pickKey, JSON.stringify({ preset: this._pickPreset, window: this._pickWindow }));
    } catch {
      // Storage may be off: the pick lasts until the page reloads.
    }
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
      stats = this._stats,
      chart = stats?.chart,
      header = config.show_header ? this._header(t) : nothing;
    if (stats && !stats.supported) return html`${header}<p class="message">${t("stats.unsupported")}</p>`;
    if (!chart) return html`${header}<p class="message">${t("state.loading")}</p>`;
    const h = chart.stats;
    if (!h.facets?.presets?.length) return html`${header}<p class="message">${t("shot.none")}</p>`;
    // The chart follows the preset its header was built for, until the next one arrives.
    const only = h.preset ?? this._choice().preset;
    return html`${header}
      ${stats!.available ? nothing : html`<p class="message" part="status">${t("stats.unavailable")}</p>`}
      ${this._width ? this._chart(t, h, only) : html`<div class="plot"></div>`}`;
  }

  /** A preset's name: the controller's current one, else the one its shots carry. */
  protected _nameOf(id: number, h: StatsHeader) {
    const presets = this._state.status === "ready" ? this._state.data.presets : [];
    return presets.find((p) => p.id === id)?.name ?? new Map(h.facets?.presets ?? []).get(id) ?? "—";
  }

  private _header(t: Localize) {
    const config = this._config!,
      chart = this._stats?.chart,
      { preset, window, windows } = this._choice(),
      ids = (chart?.stats.facets?.presets ?? []).map(([id]) => id),
      presetName = preset ? this._nameOf(preset, chart?.stats ?? {}) : t("stats.all_presets"),
      pickPreset = config.show_preset_selector && chart && ids.length,
      pickWindow = config.show_shots_selector && chart,
      details = [
        ...(pickWindow ? [] : [t("stats.last_n", window)]),
        ...(pickPreset ? [] : [presetName]),
      ].join(" · ");
    return html`<div class="header" part="header">
      <div class="titles">
        <div class="title" part="title">${config.title || t(`stats.title_${this.kind}`)}</div>
        ${details ? html`<div class="subtitle" part="subtitle">${details}</div>` : nothing}
      </div>
      <div class="selectors">
        ${pickWindow
          ? html`<select
              class="selector"
              part="selector"
              aria-label=${t("stats.window")}
              title=${t("stats.window")}
              @change=${(e: Event) => this._pick({ window: Number((e.target as HTMLSelectElement).value) })}
            >
              ${windows.map((w) => html`<option value=${w} ?selected=${w === window}>${t("stats.last_n", w)}</option>`)}
            </select>`
          : nothing}
        ${pickPreset
          ? html`<select
              class="selector"
              part="selector"
              aria-label=${t("stats.preset")}
              title=${t("stats.preset")}
              @change=${(e: Event) => this._pick({ preset: Number((e.target as HTMLSelectElement).value) })}
            >
              ${[0, ...ids].map(
                (id) =>
                  html`<option value=${id} ?selected=${id === preset}>
                    ${id ? this._nameOf(id, chart!.stats) : t("stats.all_presets")}
                  </option>`,
              )}
            </select>`
          : nothing}
      </div>
    </div>`;
  }

  protected abstract _chart(t: Localize, h: StatsHeader, only: number): TemplateResult;

  /** The cursor's value, reset to `start` whenever the chart's data changes. */
  protected _cursorAt(key: unknown, start: number) {
    if (key !== this._cursorKey) {
      this._cursorKey = key;
      this._cursor = start;
    }
    return this._cursor!;
  }

  /** The cursor pill, shown while a pointer holds the cursor. */
  protected _pill(text: string, xPct: number, yFrac: number) {
    if (!this._held) return nothing;
    const { w, h } = this._plot;
    return this._pillAt(text, (xPct / 100) * w, yFrac * h, w, h);
  }

  /**
   * A plot the cursor scrubs: any mouse press, or a touch near the handle,
   * grabs it and drags it; arrow keys step it once focused. A vertical swipe
   * elsewhere still scrolls the page.
   */
  protected _scrub(
    content: TemplateResult,
    cls: string,
    at: (x: number, width: number) => number,
    seek: (v: number) => void,
    label: string,
    range: [number, number, number],
    text: string,
  ) {
    const move = (e: PointerEvent) => {
      const overlay = (e.currentTarget as HTMLElement).querySelector<SVGSVGElement>(".cursor")!,
        r = overlay.getBoundingClientRect();
      this._plot = { w: r.width, h: r.height };
      seek(at(e.clientX - r.left, r.width));
    };
    return html`<div
      class=${`plot ${cls} ${this._held ? "held" : ""}`}
      part="chart"
      tabindex="0"
      role="slider"
      aria-label=${label}
      aria-valuemin=${range[0]}
      aria-valuemax=${range[1]}
      aria-valuenow=${range[2]}
      aria-valuetext=${text}
      @pointerdown=${(e: PointerEvent) => {
        const plot = e.currentTarget as HTMLElement,
          handle = plot.querySelector(".handle")?.getBoundingClientRect();
        if (
          e.pointerType !== "mouse" &&
          (!handle || Math.hypot(e.clientX - handle.x - handle.width / 2, e.clientY - handle.y - handle.height / 2) >= 22)
        )
          return;
        e.preventDefault();
        plot.setPointerCapture(e.pointerId);
        plot.focus({ preventScroll: true });
        this._held = true;
        move(e);
      }}
      @pointermove=${(e: PointerEvent) => (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId) && move(e)}
      @lostpointercapture=${() => (this._held = false)}
      @keydown=${(e: KeyboardEvent) => {
        const step = ({ ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5, PageUp: 5, PageDown: -5 } as Record<string, number>)[e.key];
        if (!step) return;
        e.preventDefault();
        seek(this._cursor! + step);
      }}
    >
      ${content}
    </div>`;
  }

  protected _legend(items: [string | null, string][]) {
    return this._config!.show_legend
      ? html`<div class="slegend" part="legend">
          ${items.map(([k, text]) => html`<span>${k ? html`<i class=${k}></i>` : nothing}${text}</span>`)}
        </div>`
      : nothing;
  }

  /** The three sizes, the band and each guard, the limits in the chart's own units. */
  protected _sizeLegend(t: Localize, near: string, mid: [string, string], far: string): [string, string][] {
    return [
      ["near", t("stats.legend_within", near)],
      ["mid", t("stats.legend_off_range", ...mid)],
      ["far", t("stats.legend_off_more", far)],
      this._config!.band === "ewma"
        ? ["spread", t("stats.legend_spread")]
        : ["spread", t("stats.legend_range", SPREAD_SHOTS)],
      ["guard g1", t("stats.legend_guard_fast")],
      ["guard g2", t("stats.legend_guard_slow")],
    ];
  }

  /**
   * Consistency and cut accuracy share one frame: a column per shot (at least
   * ten, latest on the right) whose centre line is the reference, the band of
   * recent counted shots behind the bars, the scale in a right gutter, and the
   * shot cursor with its pill.
   */
  protected _miss(t: Localize, c: MissSpec, key: unknown) {
    const { vals, M } = c,
      n = vals.length,
      g = missGeometry(n, M),
      { X, Y, f } = g,
      u = this._id,
      band =
        this._config!.band === "ewma"
          ? ewmaBand(vals, c.counts, c.near, c.far, g)
          : { range: rangeBand(vals, c.counts, c.near, c.far, g) },
      bars = missBars(vals, M, g, c.cls, c.guard, c.ring),
      at = this._cursorAt(key, n - 1),
      y = c.ring?.(at) ? 25 : Y(vals[at]),
      text = c.pill(at),
      seek = (v: number) => {
        this._cursor = Math.max(0, Math.min(n - 1, v > at ? Math.ceil(v) : Math.floor(v)));
        this.requestUpdate();
      };
    return html`
      ${this._config!.show_figures ? html`<div class=${`zones ${c.headClass}`} part="figures">${c.head}</div>` : nothing}
      ${this._scrub(
        html`<svg class="area" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            ${"range" in band
              ? svg`<defs>${(["near", "mid", "far"] as Size[]).map(
                  (k) => svg`<linearGradient id=${`${u}band${k}`} gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="48">
                    ${[0, 0.5, 1].map((o) => svg`<stop class=${`band-stop ${k} ${o === 0.5 ? "mid-stop" : ""}`} offset=${o}/>`)}
                  </linearGradient>`,
                )}</defs>
                ${band.range.map((p) => svg`<path class=${`range ${p.k}`} d=${p.d} fill=${`url(#${u}band${p.k})`}/>`)}`
              : svg`${band.spread.map((p) => svg`<path class=${`spread ${p.k}`} d=${p.d}/>`)}
                ${band.mean ? svg`<path class="mean" d=${band.mean}/>` : nothing}`}
            ${bars.map((b) =>
              b.ring
                ? nothing
                : svg`<rect class=${`bar ${b.cls}`} x=${b.x} width=${b.w} y=${b.y} height=${b.h}/>
                  <path class=${`${b.rim ? "rim" : "cap"} ${b.cls}`} d=${b.edge}/>
                  ${b.over ? svg`<path class=${`over ${b.cls}`} d=${b.over}/>` : nothing}`,
            )}
            <path class="avg" d="M0 25H100" />
          </svg>
          ${c.edges.map((e, k) => html`<span class="edge" style=${`top:${[Y(M), 25, Y(-M)][k] * 2}%`}>${e}</span>`)}
          <svg class="cursor" aria-hidden="true">
            ${bars.map((b, i) => (b.ring ? svg`<circle class="ring" cx=${`${f(X(i))}%`} cy="50%" r="4"/>` : nothing))}
            <g style=${`--c:${c.color(at)}`}>
              <line class="guide" x1=${`${X(at)}%`} x2=${`${X(at)}%`} y1="0" y2="100%" />
              <circle class="handle" cx=${`${X(at)}%`} cy=${`${y * 2}%`} r="5" />
              ${this._pill(text, X(at), y / 50)}
            </g>
          </svg>`,
        "miss",
        (x, w) => Math.round(((x / w) * 100 - 3) / g.gap) - (g.W - n),
        seek,
        c.aria,
        [1, n, at + 1],
        text,
      )}
      <div class="ticks miss-ticks">
        <span class="tick" ?hidden=${n < 4} style=${`left:${X(0) - g.half}%`}>${t("stats.consistency_oldest")}</span>
        <span class="tick last">${t("stats.consistency_latest")}</span>
      </div>
      ${this._legend(c.legend)}
    `;
  }

  static styles = [
    themeStyles,
    cardStyles,
    css`
      :where(ha-card) {
        display: flex;
        flex-direction: column;
      }
      :where(.body) {
        flex: 1;
        display: flex;
        flex-direction: column;
        container-type: inline-size;
      }
      /* The selectors move under the title rather than cut it short. */
      :where(.header) {
        flex-wrap: wrap;
        row-gap: 6px;
      }
      :where(.titles) {
        flex: 1 1 9rem;
      }
      :where(.selectors) {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 100%;
      }
      :where(.selectors .selector) {
        max-width: 100%;
      }
      /* The figures above each chart: the Web UI's statsDensZones. */
      :where(.zones) {
        display: grid;
        grid-template-columns: var(--zf, 33.333%) var(--zo, 33.333%) 1fr;
        align-items: end;
        min-height: 2.35rem;
      }
      :where(.zones span) {
        justify-self: center;
        text-align: center;
        font-size: 0.72rem;
        font-weight: 650;
        white-space: nowrap;
        color: var(--_muted);
      }
      :where(.zones b) {
        display: block;
        font-size: 1.1rem;
        color: var(--_fg);
      }
      :where(.zones.cut) {
        grid-template-columns: repeat(4, 1fr);
      }
      /* Narrow cards wrap the captions, never the figures; the four cut figures go two by two. */
      @container (width < 300px) {
        :where(.zones span) {
          max-width: 100%;
          font-size: 0.66rem;
          white-space: normal;
          hyphens: auto;
          overflow-wrap: break-word;
        }
        :where(.zones b) {
          white-space: nowrap;
        }
        :where(.zones.cut) {
          grid-template-columns: repeat(2, 1fr);
          row-gap: 0.4rem;
        }
      }
      :where(.zones.cut > :first-child) {
        color: var(--_ok);
      }
      :where(.zones.level > :first-child) {
        color: var(--_z);
      }
      :where(.zones.time > :nth-child(1)) {
        color: var(--_fast);
      }
      :where(.zones.time > :nth-child(2)) {
        color: var(--_ok);
      }
      :where(.zones.time > :nth-child(3)) {
        color: var(--_slow);
      }
      :where(.level-good) {
        --_z: var(--_ok);
      }
      :where(.level-fair) {
        --_z: var(--_fair);
      }
      :where(.level-poor) {
        --_z: var(--_poor);
      }
      :where(.level-few) {
        --_z: var(--_muted);
      }
      /* The plot grows with the card; the Web UI's height is its least. */
      :where(.plot) {
        position: relative;
        flex: 1;
        min-height: 3.75rem;
        touch-action: pan-y;
        cursor: ew-resize;
      }
      :where(.plot.miss) {
        min-height: 4.5rem;
        margin: 0.85rem ${GUTTER}px 0 0;
      }
      /* Stretched to the plot: the viewBox's own ratio would set its height. */
      :where(.area) {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      :where(.cursor) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      :where(.guide) {
        stroke: var(--_fg);
        stroke-opacity: 0.5;
        stroke-width: 1;
      }
      :where(.handle) {
        fill: var(--c, var(--_shot));
        stroke: var(--_surface);
        stroke-width: 1.5;
      }
      :where(.cursor .pill rect) {
        stroke: var(--c, var(--_cut));
      }
      :where(.edge) {
        position: absolute;
        left: 100%;
        padding-left: 0.35rem;
        transform: translateY(-50%);
        font-size: 0.68rem;
        line-height: 1;
        white-space: nowrap;
        color: var(--_muted);
      }
      :where(.ticks) {
        position: relative;
        height: 1.05rem;
        margin: 0.15rem 0.1rem 0;
        font-size: 0.68rem;
        color: var(--_muted);
        overflow: hidden;
      }
      @container (width <= 420px) {
        :where(.ticks) {
          font-size: 0.62rem;
        }
      }
      :where(.miss-ticks) {
        margin-right: calc(${GUTTER}px + 1.6px);
      }
      :where(.tick) {
        position: absolute;
        top: 0;
        white-space: nowrap;
      }
      :where(.tick.last) {
        right: 0;
      }
      /* Density: each zone fades from its curve to the base. */
      :where(.dens-top) {
        stop-opacity: 0.45;
      }
      :where(.dens-base) {
        stop-opacity: 0.02;
      }
      :where(.fast) {
        --bc: var(--_fast);
        stop-color: var(--_fast);
      }
      :where(.on_recipe, .on) {
        --bc: var(--_ok);
        stop-color: var(--_ok);
      }
      :where(.slow) {
        --bc: var(--_slow);
        stop-color: var(--_slow);
      }
      :where(.dens-line) {
        fill: none;
        stroke: var(--bc);
        stroke-width: 1.35;
        vector-effect: non-scaling-stroke;
      }
      /* Bars: their colour by how far the shot landed, or the guard that stopped it. */
      :where(.near) {
        --bc: var(--_ok);
      }
      :where(.mid) {
        --bc: var(--_mid);
      }
      :where(.far) {
        --bc: var(--_fast);
      }
      :where(.g1) {
        --bc: var(--_fast);
      }
      :where(.g2) {
        --bc: var(--_slow);
      }
      :where(.bar) {
        fill: var(--bc);
        fill-opacity: 0.3;
      }
      :where(.bar.guard) {
        fill: color-mix(in srgb, var(--_fg) 12%, var(--_surface));
        fill-opacity: 1;
      }
      :where(.cap, .rim) {
        fill: none;
        stroke: var(--bc);
        vector-effect: non-scaling-stroke;
      }
      :where(.cap) {
        stroke-width: 2;
      }
      :where(.rim) {
        stroke-width: 1.5;
        stroke-dasharray: 3 2;
      }
      :where(.spread) {
        fill: var(--bc);
        fill-opacity: 0.26;
        stroke: none;
      }
      :where(.range) {
        stroke: none;
      }
      :where(.band-stop) {
        stop-color: var(--bc);
        stop-opacity: 0.45;
      }
      :where(.band-stop.mid-stop) {
        stop-opacity: 0.02;
      }
      :where(.mean) {
        fill: none;
        stroke: var(--_fg);
        stroke-opacity: 0.55;
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke;
      }
      :where(.ring) {
        fill: var(--_surface);
        stroke: var(--_ok);
        stroke-width: 2.5;
      }
      :where(.over) {
        stroke: var(--bc);
        stroke-width: 2.5;
        stroke-dasharray: 2 1.5;
        vector-effect: non-scaling-stroke;
      }
      :where(.avg) {
        fill: none;
        stroke: var(--_fg);
        stroke-opacity: 0.45;
        stroke-dasharray: 3 3;
        vector-effect: non-scaling-stroke;
      }
      /* The Web UI's chart legend: a swatch per mark, as the mark is drawn. */
      :where(.slegend) {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem 0.8rem;
        margin: 0.55rem 0 0;
        font-size: 0.72rem;
        color: var(--_muted);
      }
      :where(.slegend i) {
        display: inline-block;
        width: 0.65rem;
        height: 0.65rem;
        margin-right: 0.3rem;
        border-radius: 2px;
        vertical-align: -1px;
        background: color-mix(in srgb, var(--bc) 30%, var(--_surface));
        box-shadow: inset 0 2px var(--bc);
      }
      :where(.slegend .spread) {
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--_ok) 35%, var(--_surface)) 0 33%,
          color-mix(in srgb, var(--_mid) 35%, var(--_surface)) 33% 67%,
          color-mix(in srgb, var(--_fast) 35%, var(--_surface)) 67%
        );
        box-shadow: none;
      }
      :where(.slegend .bull) {
        border-radius: 50%;
        background: var(--_surface);
        box-shadow: inset 0 0 0 2px var(--_ok);
      }
      :where(.slegend .guard) {
        background: color-mix(in srgb, var(--_fg) 12%, var(--_surface));
        box-shadow: none;
        outline: 1.5px dashed var(--bc, var(--_muted));
        outline-offset: -1.5px;
      }
    `,
  ];
}

/** Shot time: when the window's timed shots reach their target, as a density curve. */
export class OpenBrewByWeightShotTimeCard extends OpenBrewByWeightStatsCard {
  protected readonly kind = "time";

  static getConfigElement() {
    return Object.assign(document.createElement("open-brew-by-weight-stats-card-editor"), { kind: "time" });
  }

  protected _chart(t: Localize, h: StatsHeader, only: number) {
    const charts = h.dens ?? [],
      d = !only || charts[1] === true ? charts[0] : charts[1];
    if (!d || d === true) return html`<p class="message">${t("stats.no_timed")}</p>`;
    const m = densityModel(d),
      { lo, hi, a, b, shared } = d,
      s = t("stats.s"),
      u = this._id,
      names = { fast: t("verdict.fast"), on_recipe: t("verdict.on_recipe"), slow: t("verdict.slow") },
      now = this._cursorAt(d, m.peakT),
      label = (v: number) =>
        shared
          ? axisLabel(v, s)
          : v < a
            ? "−" + axisLabel(a - v, s)
            : v > b
              ? "+" + axisLabel(v - b, s)
              : t("stats.time_window", axisLabel(v - a, s)),
      text = t("stats.time_pill", label(now), Math.round((100 * m.dens(now)) / m.area)),
      y = 1 - (0.92 * m.dens(now)) / 100,
      zone = m.zones[now < a ? 0 : now > b ? 2 : 1].key,
      small = this._width <= 420,
      ticks = layoutTicks(
        densityTicks(d, (start) => t(start ? "stats.window_start" : "stats.window_end"), s),
        this._width,
        (text) => this._measure(text, small ? 9.92 : 10.88),
      );
    return html`
      ${this._config!.show_figures
        ? html`<div class="zones time" part="figures" style=${`--zf:${m.x(a)}%;--zo:${m.x(b) - m.x(a)}%`}>
            ${m.zones.map((z) => html`<span><b>${z.pct}%</b>${z.count} ${names[z.key]}</span>`)}
          </div>`
        : nothing}
      ${this._scrub(
        html`<svg class="area" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              ${m.zones.map(
                (z) => svg`<linearGradient id=${`${u}sd${z.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop class=${`dens-top ${z.key}`}/><stop class=${`dens-base ${z.key}`} offset="1"/></linearGradient>`,
              )}
            </defs>
            ${m.zones.map(
              (z) => svg`<path d=${z.area} fill=${`url(#${u}sd${z.key})`}/><path class=${`dens-line ${z.key}`} d=${z.line}/>`,
            )}
          </svg>
          <svg class="cursor" aria-hidden="true">
            <g style=${`--c:${ZONE_COLORS[zone]}`}>
              <line class="guide" x1=${`${m.x(now)}%`} x2=${`${m.x(now)}%`} y1="0" y2="100%" />
              <circle class="handle" cx=${`${m.x(now)}%`} cy=${`${y * 100}%`} r="5" />
              ${this._pill(text, m.x(now), y)}
            </g>
          </svg>`,
        "dens",
        (x, w) => lo + (x / w) * (hi - lo),
        (v) => {
          this._cursor = Math.round(Math.max(lo, Math.min(hi, v)) * 10) / 10;
          this.requestUpdate();
        },
        t("stats.time_cursor"),
        [lo, hi, now],
        text,
      )}
      <div class="ticks" role="img" aria-label=${ticks.map((k) => k.text).join(", ")}>
        ${ticks.map((k) => html`<span class="tick" style=${`left:${k.left}px`}>${k.text}</span>`)}
      </div>
      ${this._legend([
        ["fast", shared ? t("stats.legend_fast", axisLabel(a, s)) : t("stats.legend_fast_window")],
        ["on", shared ? t("stats.legend_on", axisLabel(a, s), axisLabel(b, s)) : t("stats.legend_on_window")],
        ["slow", shared ? t("stats.legend_slow", axisLabel(b, s)) : t("stats.legend_slow_window")],
      ])}
    `;
  }
}

/** Shot consistency: each timed shot's time to target against its preset's average. */
export class OpenBrewByWeightShotConsistencyCard extends OpenBrewByWeightStatsCard {
  protected readonly kind = "consistency";

  static getConfigElement() {
    return Object.assign(document.createElement("open-brew-by-weight-stats-card-editor"), { kind: "consistency" });
  }

  protected _chart(t: Localize, h: StatsHeader, only: number) {
    const shots = timedShots(h).filter((r) => !only || r.presetId === only),
      m = consistencyModel(shots),
      { rows, rel, sec, M } = m,
      n = rows.length;
    if (!n) return html`<p class="message">${t("stats.no_timed")}</p>`;
    const s = t("stats.s"),
      L = (v: number) => (sec ? axisLabel(v * sec, s) : +(v * 100).toFixed(1) + "%"),
      signed = (v: number, k = Math.round(v * (sec || 100) * 10)) => (k > 0 ? "+" : k < 0 ? "−" : "") + L(Math.abs(v)),
      size = (i: number) => sizeOf(rel[i], CONSISTENT, VARIED),
      pct = (v: number) => Math.round(v * 100);
    return this._miss(
        t,
        {
          head: html`<span><b>${m.typical == null ? "—" : "±" + L(m.typical)}</b>${t(`stats.consistency_${m.level}`)}</span>
            <span><b>${L(m.spread)}</b>${t("stats.consistency_spread")}</span>
            <span><b>${n}</b>${t("stats.consistency_shots")}</span>`,
          headClass: `level level-${m.level}`,
          vals: rel,
          M,
          // Guard-stopped shots still count: their timing is the variation shown.
          counts: () => true,
          cls: (i) => (rows[i].guard ? "guard g" + rows[i].guard : size(i)),
          guard: (i) => rows[i].guard,
          color: (i) => (rows[i].guard ? guardColor(rows[i].guard) : SIZE_COLORS[size(i)]),
          near: CONSISTENT,
          far: VARIED,
          edges: ["+" + L(M), sec ? L(1) : t("stats.consistency_avg"), "−" + L(M)],
          pill: (i) =>
            t(
              "stats.consistency_pill",
              i + 1,
              sec ? "" : " · " + (rows[i].presetName || "—"),
              axisLabel(rows[i].arrivalS, s),
              signed(rel[i]),
            ),
          aria: t("stats.consistency_cursor"),
          legend: this._sizeLegend(t, pct(CONSISTENT) + "%", [String(pct(CONSISTENT)), pct(VARIED) + "%"], pct(VARIED) + "%"),
        },
        h.cons,
      );
  }
}

/** Cut accuracy: how far each automatic stop settled from its own shot's target. */
export class OpenBrewByWeightCutAccuracyCard extends OpenBrewByWeightStatsCard {
  protected readonly kind = "cut";

  static getConfigElement() {
    return Object.assign(document.createElement("open-brew-by-weight-stats-card-editor"), { kind: "cut" });
  }

  protected _chart(t: Localize, h: StatsHeader, only: number) {
    if (!h.cut?.e?.length) return html`<p class="message">${t("stats.cut_none")}</p>`;
    const m = cutModel(h.cut),
      { rows, kind, M } = m,
      g = t("stats.g"),
      gram = (v: number) => grams(v) + " " + g,
      // The sign follows the hundredths shown, so a rounded zero reads ±0.
      signed = (v: number, k = Math.round(v * 100)) => (k > 0 ? "+" : k < 0 ? "−" : "±") + gram(Math.abs(v)),
      pct = (k: number) => (m.scored ? Math.round((100 * k) / m.scored) + "%" : "—");
    return this._miss(
      t,
      {
        head: html`<span><b>${t("stats.cut_of", m.bulls, m.scored)}</b>${t("stats.cut_bullseyes")}</span>
          <span><b>${pct(m.within)}</b>${t("stats.cut_within", gram(CUT_CLOSE_G))}</span>
          <span><b>${m.scored ? gram(m.miss) : "—"}</b>${t("stats.cut_avg_miss")}</span>
          <span
            ><b>${m.scored ? signed(m.lean) : "—"}</b>${Math.abs(m.lean) < 0.05
              ? t("stats.cut_centred")
              : m.lean > 0
                ? t("stats.cut_leans_over")
                : t("stats.cut_leans_under")}</span
          >`,
        headClass: "cut",
        vals: rows.map((r) => r.missG),
        M,
        counts: (i) => !rows[i].guard,
        cls: (i) => kind(rows[i]),
        ring: (i) => kind(rows[i]) === "bull",
        guard: (i) => rows[i].guard,
        color: (i) => (rows[i].guard ? guardColor(rows[i].guard) : SIZE_COLORS[sizeOf(rows[i].missG, CUT_CLOSE_G, CUT_FAR_G)]),
        near: CUT_CLOSE_G,
        far: CUT_FAR_G,
        edges: ["+" + gram(M), t("stats.cut_target"), "−" + gram(M)],
        pill: (i) =>
          t(
            "stats.cut_pill",
            i + 1,
            only ? "" : " · " + this._nameOf(rows[i].presetId, h),
            t("stats.cut_of", gram(rows[i].targetG + rows[i].missG), gram(rows[i].targetG)),
            kind(rows[i]) === "bull" ? t("stats.cut_bullseye") : signed(rows[i].missG),
          ),
        aria: t("stats.cut_cursor"),
        legend: [
          ["bull", t("stats.cut_bullseye")],
          ...this._sizeLegend(t, gram(CUT_CLOSE_G), [grams(CUT_CLOSE_G), gram(CUT_FAR_G)], gram(CUT_FAR_G)),
        ],
      },
      h.cut,
    );
  }
}
