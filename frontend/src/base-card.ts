import { LitElement, svg, type PropertyValues } from "lit";
import { followCardData, type CardDataState } from "./data";
import type { HomeAssistant } from "./ha";
import { localizer, type Localize } from "./localize";
import { nameCards } from "./registry";

let canvas: CanvasRenderingContext2D | null | undefined;

/** A label's width in px in a CSS font, estimated where there is no canvas. */
export function textWidth(text: string, font: string) {
  if (canvas === undefined)
    try {
      canvas = document.createElement("canvas").getContext("2d");
    } catch {
      canvas = null;
    }
  if (!canvas) return text.length * 6.5;
  canvas.font = font;
  return canvas.measureText(text).width;
}

/**
 * Where a cursor pill goes, as the Web UI's placePill: beside the handle
 * (left of it unless that leaves the chart) while it fits; too wide for
 * either side of a narrow chart, its last two parts (the reading) move to a
 * second line; still too wide, it sits above or below the handle, on the
 * roomier side, kept within the chart's width W (and height H).
 */
export function pillLayout(
  text: string,
  x: number,
  y: number,
  W: number,
  H: number,
  measure: (text: string) => number,
) {
  const parts = text.split(" · "),
    beside = (width: number) => !W || width + 28 <= Math.max(x, W - x);
  let lines = [text],
    width = measure(text),
    h = 9;
  if (!beside(width) && parts.length > 1) {
    const k = Math.max(1, parts.length - 2);
    lines = [parts.slice(0, k).join(" · "), parts.slice(k).join(" · ")];
    width = Math.max(...lines.map(measure));
    h = 17;
  }
  const pw = width + 16,
    [px, py] = beside(width)
      ? [x - 11 - pw < 1 ? x + 11 : x - 11 - pw, y]
      : [Math.max(1, Math.min(x - pw / 2, W - pw - 1)), y < H / 2 ? y + h + 12 : y - h - 12];
  return { lines, pw, h, px, py };
}

/**
 * What every card shares: it follows one device's card data, measures the
 * width it draws in, and follows Home Assistant's dark mode. Unknown config
 * keys (uix, card_mod, layout) are kept and ignored.
 */
export abstract class OpenBrewByWeightCard<C extends { device_id?: string }> extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _state: { state: true },
    _width: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: C;
  declare _state: CardDataState;
  declare _width: number;

  // The device being followed; null until the first follow, "" for none.
  private _following: string | null = null;
  private _stop?: () => void;
  private _resize?: ResizeObserver;

  protected abstract readonly defaults: Partial<C>;

  constructor() {
    super();
    this._state = { status: "loading" };
    this._width = 0;
  }

  setConfig(config: C) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    this._config = { ...this.defaults, ...config };
  }

  connectedCallback() {
    super.connectedCallback();
    this._following = null;
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stop?.();
    this._stop = undefined;
    this._resize?.disconnect();
    this._resize = undefined;
  }

  /** A label's width in px in this card's font. */
  protected _measure(text: string, px: number, weight = 400) {
    return textWidth(text, `${weight} ${px}px ${getComputedStyle(this).fontFamily || "sans-serif"}`);
  }

  /** The cursor pill at (x, y) on a chart W by H, in the chart's own units. */
  protected _pillAt(text: string, x: number, y: number, W: number, H: number) {
    const p = pillLayout(text, x, y, W, H, (line) => this._measure(line, 11, 600));
    return svg`<g class="pill" transform=${`translate(${p.px} ${p.py})`}>
      <rect y=${-p.h} rx="9" height=${2 * p.h} width=${p.pw}/>
      <text class="axis-label strong" x="8" y="4">${
        p.lines.length === 1
          ? p.lines[0]
          : p.lines.map((line, i) => svg`<tspan x="8" dy=${i ? 16 : -9}>${line}</tspan>`)
      }</text></g>`;
  }

  protected get t(): Localize {
    return localizer(this.hass?.locale?.language ?? this.hass?.language);
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("hass")) {
      this.toggleAttribute("dark", !!this.hass?.themes?.darkMode);
      nameCards(this.hass?.locale?.language ?? this.hass?.language);
    }
    this._follow();
    const body = this.renderRoot.querySelector<HTMLElement>(".body");
    if (body && !this._resize) {
      // The content box: clientWidth would include the padding and draw past it.
      this._resize = new ResizeObserver(([entry]) => (this._width = Math.floor(entry.contentRect.width)));
      this._resize.observe(body);
    }
  }

  private _follow() {
    const device = this._config?.device_id ?? "";
    if (!this.hass || !this.isConnected || device === this._following) return;
    this._stop?.();
    this._following = device;
    if (!device) {
      this._state = { status: "not_found" };
      return;
    }
    this._state = { status: "loading" };
    this._stop = followCardData(this.hass, device, (state) => (this._state = state));
  }
}
