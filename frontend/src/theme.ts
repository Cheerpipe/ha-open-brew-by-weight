import { css } from "lit";

// The public styling contract (UIX, card-mod, or a theme): every color, line,
// and band reads one of these --obbw-* variables, so a style can change any of
// them without reaching into the card. The defaults are the controller's Web
// UI palette, light and dark. Renaming one is a breaking change. Styles may
// set them on the card (:host) or on ha-card, where UIX and card-mod apply.
export const themeStyles = css`
  /* Defaults live in private variables, so a theme, the card, or ha-card can
     set any --obbw-* variable and win. */
  :host {
    --_d-fast: #d7301f;
    --_d-slow: #2c7fb8;
    --_d-ok: #41ab5d;
    --_d-cut: #d1101f;
    --_d-band-full: 0.14;
    --_d-band-part: 0.07;
    --_d-band-win: 0.26;
    --_d-shot: #0e7490;
    --_d-flow: #7a7a7a;
  }
  :host([dark]) {
    --_d-fast: #ff6b4a;
    --_d-slow: #6cb6e6;
    --_d-ok: #74d68c;
    --_d-cut: #9e1c22;
    --_d-band-full: 0.22;
    --_d-band-part: 0.11;
    --_d-band-win: 0.32;
    --_d-shot: #38bdf8;
    --_d-flow: #b8b8b8;
  }
  /* Resolved where UIX and card-mod styles (on ha-card) already apply. */
  :where(.body) {
    --_fg: var(--obbw-text-color, var(--primary-text-color, #242424));
    --_muted: var(--obbw-muted-color, var(--secondary-text-color, #636363));
    --_surface: var(--obbw-chart-background, var(--ha-card-background, var(--card-background-color, #fff)));
    --_fast: var(--obbw-fast-color, var(--_d-fast));
    --_slow: var(--obbw-slow-color, var(--_d-slow));
    --_ok: var(--obbw-on-recipe-color, var(--_d-ok));
    --_band-full: var(--obbw-band-full, var(--_d-band-full));
    --_band-part: var(--obbw-band-partial, var(--_d-band-part));
    --_band-win: var(--obbw-band-window, var(--_d-band-win));
    --_fast-full: var(--obbw-corridor-fast-full-color, var(--_fast));
    --_fast-part: var(--obbw-corridor-fast-partial-color, var(--_fast));
    --_window: var(--obbw-corridor-on-recipe-color, var(--_ok));
    --_slow-part: var(--obbw-corridor-slow-partial-color, var(--_slow));
    --_slow-full: var(--obbw-corridor-slow-full-color, var(--_slow));
    --_cut: var(--obbw-cut-line-color, var(--_d-cut));
    --_shot: var(--obbw-shot-line-color, var(--_d-shot));
    --_flow: var(--obbw-flow-color, var(--_d-flow));
    --_weight: var(--obbw-weight-color, var(--_ok));
    font-family: var(--obbw-font-family, inherit);
  }

  :where(.chart) {
    position: relative;
    touch-action: pan-y;
    background: var(--obbw-chart-background, transparent);
    border-radius: var(--obbw-chart-radius, 0);
  }
  :where(.chart svg) {
    display: block;
    overflow: visible;
  }
  :where(.grid-line) {
    stroke: var(--obbw-grid-color, var(--divider-color, #dadada));
    stroke-width: 0.8;
    opacity: 0.7;
  }
  :where(.axis-label) {
    fill: var(--obbw-axis-label-color, var(--_muted));
    font-size: var(--obbw-axis-font-size, 11px);
    font-weight: 600;
  }
  :where(.axis-label.strong) {
    fill: var(--obbw-target-label-color, var(--_fg));
  }
  :where(.halo) {
    paint-order: stroke;
    stroke: var(--_surface);
    stroke-width: 3px;
    stroke-linejoin: round;
  }
  :where(.band-off) {
    fill: none;
    stroke: var(--_muted);
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }
  :where(.stop-fast-full) {
    stop-color: var(--_fast-full);
    stop-opacity: var(--obbw-corridor-fast-full-opacity, calc(var(--_band-full) * 2.2));
  }
  :where(.stop-fast-part) {
    stop-color: var(--_fast-part);
    stop-opacity: var(--obbw-corridor-fast-partial-opacity, calc(var(--_band-part) * 2.2));
  }
  :where(.stop-window) {
    stop-color: var(--_window);
    stop-opacity: var(--obbw-corridor-on-recipe-opacity, calc(var(--_band-win) * 2.2));
  }
  :where(.stop-slow-part) {
    stop-color: var(--_slow-part);
    stop-opacity: var(--obbw-corridor-slow-partial-opacity, calc(var(--_band-part) * 2.2));
  }
  :where(.stop-slow-full) {
    stop-color: var(--_slow-full);
    stop-opacity: var(--obbw-corridor-slow-full-opacity, calc(var(--_band-full) * 2.2));
  }
  :where(.stop-fade) {
    stop-opacity: var(--obbw-corridor-fade-opacity, 0.03);
  }
  :where(.pace-line) {
    fill: none;
    stroke: var(--obbw-pace-line-color, var(--_fg));
    stroke-opacity: var(--obbw-pace-line-opacity, 0.35);
    stroke-width: var(--obbw-pace-line-width, 0.8);
  }
  :where(.no-cut-hatch) {
    stroke: var(--obbw-no-cut-hatch-color, var(--_muted));
    stroke-opacity: 0.5;
    stroke-width: 1.1;
  }
  :where(.target-line) {
    stroke: var(--obbw-target-line-color, var(--_fg));
    stroke-opacity: 0.5;
    stroke-width: 1;
    stroke-dasharray: 5 3;
  }
  :where(.max-line) {
    stroke: var(--obbw-max-time-color, var(--_cut));
    stroke-width: 2.5;
    stroke-dasharray: 0 6;
    stroke-linecap: round;
  }
  :where(.window-edge) {
    fill: none;
    stroke: var(--obbw-window-edge-color, var(--_window));
    stroke-opacity: 0.8;
    stroke-width: 1.2;
    stroke-dasharray: 0 3.5;
    stroke-linecap: round;
  }
  :where(.cut-line) {
    fill: none;
    stroke: var(--_cut);
    stroke-width: var(--obbw-cut-line-width, 2.5);
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  :where(.cut-line.off) {
    stroke: var(--_muted);
    stroke-width: 2;
    stroke-dasharray: 5 4;
  }
  :where(.recent-shot) {
    fill: var(--obbw-recent-shot-color, var(--_fg));
    fill-opacity: 0.75;
    stroke: var(--_surface);
    stroke-width: 1;
  }
  :where(.scrub) {
    cursor: ew-resize;
    outline: none;
  }
  :where(.scrub-guide) {
    stroke: var(--obbw-example-shot-color, var(--_fg));
    stroke-width: 1;
    stroke-dasharray: 2 2;
    opacity: 0.6;
  }
  :where(.example-shot) {
    fill: none;
    stroke: var(--obbw-example-shot-color, var(--_fg));
    stroke-width: var(--obbw-example-shot-width, 1.5);
  }
  :where(.scrub-handle) {
    fill: var(--_surface);
    stroke: var(--obbw-handle-color, var(--_cut));
    stroke-width: 2.5;
  }
  :where(.scrub:focus-visible .scrub-handle) {
    stroke: var(--_fg);
    stroke-width: 3.5;
  }
  :where(.pill rect) {
    fill: var(--_surface);
    stroke: var(--obbw-pill-border-color, var(--primary-color, #a83b21));
    stroke-width: 1.5;
  }
  :where(.pill text) {
    font-variant-numeric: tabular-nums;
  }

  :where(.readout) {
    margin: 2px 0 4px;
    text-align: center;
    font-size: var(--obbw-readout-font-size, 12px);
    font-weight: 700;
    line-height: 1.35;
    font-variant-numeric: tabular-nums;
    color: var(--obbw-readout-color, var(--_fg));
  }
  :where(.legend) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    margin-top: 6px;
    font-size: var(--obbw-legend-font-size, 12px);
    color: var(--obbw-legend-color, var(--_muted));
  }
  :where(.legend span) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  :where(.legend i) {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  :where(.legend .key-cut i) {
    height: 3px;
    border-radius: 2px;
    background: var(--_cut);
  }
  :where(.legend .key-pace i) {
    height: 0;
    border-top: 1px solid color-mix(in srgb, var(--_fg) 45%, var(--_surface));
    border-radius: 0;
  }
  :where(.legend .key-example i) {
    height: 0;
    border-top: 1.5px solid var(--obbw-example-shot-color, var(--_fg));
    border-radius: 0;
  }
  :where(.legend .key-arrivals i) {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--obbw-recent-shot-color, var(--_fg));
    opacity: 0.75;
  }
  :where(.legend .key-window i) {
    background: color-mix(in srgb, var(--_window) calc(var(--_band-win) * 100%), var(--_surface));
  }
  :where(.legend .key-fast i:first-child) {
    background: color-mix(in srgb, var(--_fast-full) calc(var(--_band-full) * 100%), var(--_surface));
  }
  :where(.legend .key-fast i + i) {
    background: color-mix(in srgb, var(--_fast-part) calc(var(--_band-part) * 100%), var(--_surface));
  }
  :where(.legend .key-slow i:first-child) {
    background: color-mix(in srgb, var(--_slow-full) calc(var(--_band-full) * 100%), var(--_surface));
  }
  :where(.legend .key-slow i + i) {
    background: color-mix(in srgb, var(--_slow-part) calc(var(--_band-part) * 100%), var(--_surface));
  }
  :where(.legend .key-no-cut i) {
    background: repeating-linear-gradient(45deg, var(--_muted) 0 1px, transparent 1px 4px);
  }
  :where(.note) {
    margin: 6px 0 0;
    text-align: center;
    font-size: var(--obbw-note-font-size, 12px);
    color: var(--obbw-note-color, var(--_muted));
  }
  :where(.message) {
    margin: 0;
    padding: 8px 0;
    color: var(--_muted);
  }
`;

// Card chrome shared by every card: padding, header, status messages.
export const cardStyles = css`
  :where(ha-card) {
    height: 100%;
    box-sizing: border-box;
  }
  :where(.body) {
    padding: var(--obbw-card-padding, 16px);
  }
  :where(.header) {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  :where(.titles) {
    flex: 1;
    min-width: 0;
  }
  :where(.title) {
    font-size: var(--obbw-title-font-size, 16px);
    font-weight: 500;
    color: var(--obbw-title-color, var(--_fg));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :where(.subtitle) {
    font-size: 12px;
    color: var(--obbw-subtitle-color, var(--_muted));
  }
  :where(.selector) {
    max-width: 50%;
    padding: 4px 8px;
    border: 1px solid var(--obbw-selector-border-color, var(--divider-color, #dadada));
    border-radius: var(--obbw-selector-radius, 8px);
    background: var(--obbw-selector-background, var(--_surface));
    color: var(--_fg);
    font: inherit;
    font-size: 13px;
  }
  :where(.chip) {
    flex: none;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    --_c: var(--_ok);
    color: color-mix(in srgb, var(--_c) 70%, var(--_fg));
    background: color-mix(in srgb, var(--_c) 18%, var(--_surface));
  }
  :where(.chip.fast) {
    --_c: var(--_fast);
  }
  :where(.chip.slow) {
    --_c: var(--_slow);
  }
  :where(.chip.manual) {
    --_c: var(--_muted);
  }
`;
