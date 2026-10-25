import { LitElement, type PropertyValues } from "lit";
import { followCardData, type CardDataState } from "./data";
import type { HomeAssistant } from "./ha";
import { localizer, type Localize } from "./localize";
import { nameCards } from "./registry";

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
