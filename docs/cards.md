# Dashboard cards

The integration comes with dashboard cards that draw your controller's data
the way its Web UI does. They're installed with the integration: there's no
resource to add and nothing else to download. After installing or updating,
reload your browser once so it picks up the new cards.

The cards need controller firmware that shares preset settings and shot
curves with Home Assistant. With older firmware the card asks you to update.

## Preset card

Shows how a preset decides when to stop a shot: the weight it stops at over
time (the red *Stop at* line), the on-recipe window, how far it extends a fast
shot or shortens a slow one, and when your recent shots reached the target.

Drag along the chart, or use the arrow keys once it has focus, to move the
example shot. The line under the chart tells you when that shot would reach
the target, whether the preset calls it fast, on recipe, or slow, and at what
weight it would stop.

### Add it

Edit a dashboard, choose **Add card**, and search for **Open Brew by Weight
preset**. Pick your controller in the card settings. In YAML:

```yaml
type: custom:open-brew-by-weight-preset-card
device_id: 0123456789abcdef0123456789abcdef
```

`device_id` is the Home Assistant device, which the visual editor fills in for
you.

### Options

| Option | Default | What it does |
| --- | --- | --- |
| `device_id` | | The controller to show. |
| `preset` | `active` | `active` follows whichever preset is active. A preset number pins one preset, even when another is active. |
| `title` | the preset's name | Replaces the title. |
| `show_header` | `true` | The title, the preset's target and dose, and the preset selector. |
| `show_selector` | `true` | A dropdown that changes the active preset. Only shown while following the active preset; it's unavailable while a shot is running. |
| `show_example` | `true` | The example shot you can drag. |
| `show_readout` | `true` | The line under the chart that reads the example shot. |
| `show_arrivals` | `true` | Dots for when your recent shots reached the target. |
| `show_legend` | `true` | The legend. |
| `show_note` | `true` | The note on how the typical pace is drawn. |

A pinned, minimal card for a wall tablet:

```yaml
type: custom:open-brew-by-weight-preset-card
device_id: 0123456789abcdef0123456789abcdef
preset: 2
title: Morning double
show_selector: false
show_legend: false
show_note: false
```

## Last shot card

Charts your last shot the moment the controller saves it. Four charts, the
same ones the controller's Web UI draws:

- **Preset + weight**: the shot's weight over the preset it ran with, so you
  see where it crossed the stop line and whether it landed on recipe. Only
  the band the shot ended in is shaded.
- **Weight + flow**: weight and flow rate on one grid, weight on the left
  axis and flow on the right. Each 10 g line is also a flow line.
- **Weight** or **Flow** alone.

In the weight charts the line changes color where a guard stepped in: green
on recipe, red once a fast shot was extended, blue once a slow one was
shortened, gray while the scale was lost. A dashed tail shows the drips after
the stop, and faint dots mark touches the controller ignored.

Hover over the chart, drag along it, or use the arrow keys once it has focus
to read the shot at any moment. In *Preset + weight* the reading includes the
stop line at that time.

Viewers can switch charts with the buttons above it; the pick is remembered
in that browser. Turn the buttons off to always show the configured chart.

### Add it

Search for **Open Brew by Weight last shot** when adding a card. In YAML:

```yaml
type: custom:open-brew-by-weight-shot-chart-card
device_id: 0123456789abcdef0123456789abcdef
chart: weight_flow
```

### Options

| Option | Default | What it does |
| --- | --- | --- |
| `device_id` | | The controller to show. |
| `chart` | `preset_weight` | The chart shown first: `preset_weight`, `weight_flow`, `weight`, or `flow`. A shot without its preset settings shows `weight_flow` instead of `preset_weight`. |
| `mode_switch` | `true` | Buttons that switch the chart. |
| `title` | Last shot | Replaces the title. |
| `show_header` | `true` | The title, when the shot ended, its preset, and how it ended. |
| `show_readout` | `true` | The line under the chart that reads the shot at the cursor. |
| `show_legend` | `true` | The legend. |

A flow chart for a small tile, with nothing to switch:

```yaml
type: custom:open-brew-by-weight-shot-chart-card
device_id: 0123456789abcdef0123456789abcdef
chart: flow
mode_switch: false
show_legend: false
```

## Styling the cards

Every color and line in the cards can be changed with
[UIX](https://github.com/Lint-Free-Technology/uix) (or card-mod), or set once
for all cards in a Home Assistant theme. The defaults follow the controller's
Web UI and switch with Home Assistant's dark mode.

Set the variables on `ha-card`:

```yaml
type: custom:open-brew-by-weight-preset-card
device_id: 0123456789abcdef0123456789abcdef
uix:
  style: |
    ha-card {
      --obbw-fast-color: #8e44ad;
      --obbw-slow-color: #f39c12;
      --obbw-on-recipe-color: #00897b;
      --obbw-cut-line-color: #000;
      --obbw-cut-line-width: 4px;
    }
```

The cards' own rules are written so a plain selector in your style wins without
`!important`. To hide the legend and enlarge the title:

```yaml
uix:
  style: |
    .legend { display: none; }
    .title { font-size: 20px; }
```

In a theme, the same variables apply to every card:

```yaml
my_theme:
  obbw-fast-color: "#8e44ad"
  obbw-cut-line-width: 3px
```

### Colors

| Variable | Used for |
| --- | --- |
| `--obbw-fast-color` | Fast shots: the *Extend* bands. |
| `--obbw-slow-color` | Slow shots: the *Shorten* bands. |
| `--obbw-on-recipe-color` | The on-recipe window and its edges. |
| `--obbw-corridor-fast-full-color`, `--obbw-corridor-fast-partial-color`, `--obbw-corridor-on-recipe-color`, `--obbw-corridor-slow-partial-color`, `--obbw-corridor-slow-full-color` | One band each, when it should differ from its fast, slow, or on-recipe color. |
| `--obbw-corridor-…-opacity` (same five names) | How strong each band is at the top. |
| `--obbw-corridor-fade-opacity` | How strong every band is at the bottom (default `0.03`). |
| `--obbw-band-full`, `--obbw-band-partial`, `--obbw-band-window` | Base strength of the full, partial, and window bands. |
| `--obbw-cut-line-color` | The *Stop at* line. |
| `--obbw-max-time-color` | The dotted *Max* line (defaults to the stop line's color). |
| `--obbw-window-edge-color` | The dotted window edges. |
| `--obbw-pace-line-color`, `--obbw-pace-line-opacity` | The typical-pace curves. |
| `--obbw-example-shot-color` | The example shot and its guide. |
| `--obbw-handle-color` | The example shot's handle. |
| `--obbw-recent-shot-color` | Recent-shot dots. |
| `--obbw-target-line-color`, `--obbw-target-label-color` | The target line and its label. |
| `--obbw-no-cut-hatch-color` | The hatching before weight cuts start. |
| `--obbw-grid-color`, `--obbw-axis-label-color` | Grid lines and axis labels. |
| `--obbw-chart-background`, `--obbw-chart-radius` | Behind the chart (transparent by default). |
| `--obbw-text-color`, `--obbw-muted-color` | Main and secondary text. |
| `--obbw-title-color`, `--obbw-subtitle-color` | The header. |
| `--obbw-readout-color`, `--obbw-legend-color`, `--obbw-note-color` | Text under the chart. |
| `--obbw-selector-background`, `--obbw-selector-border-color`, `--obbw-selector-radius` | The preset dropdown. |
| `--obbw-pill-border-color` | The bubble shown while dragging. |
| `--obbw-shot-line-color` | The last shot over its preset, its stop and final-weight dots. |
| `--obbw-weight-color` | Weight while on recipe (defaults to the on-recipe color). |
| `--obbw-flow-color` | The flow rate line and its fill. |
| `--obbw-weight-fill-opacity`, `--obbw-flow-fill-opacity` | How strong the fill under each line is at the top. |
| `--obbw-flow-label-color` | Flow axis labels in *Weight + flow*. |
| `--obbw-cursor-color` | The cursor's dot on the weight line. |
| `--obbw-switch-background`, `--obbw-switch-active-background` | The chart buttons and the selected one. |

### Sizes and type

| Variable | Default |
| --- | --- |
| `--obbw-cut-line-width` | `2.5` |
| `--obbw-pace-line-width` | `0.8` |
| `--obbw-example-shot-width` | `1.5` |
| `--obbw-shot-line-width` | `1.8` |
| `--obbw-series-line-width` | `1.6` (weight and flow lines) |
| `--obbw-card-padding` | `16px` |
| `--obbw-font-family` | Home Assistant's font |
| `--obbw-title-font-size` | `16px` |
| `--obbw-axis-font-size`, `--obbw-readout-font-size`, `--obbw-legend-font-size`, `--obbw-note-font-size` | `11px`, `12px`, `12px`, `12px` |

### Parts you can target

| Selector | Element |
| --- | --- |
| `.header`, `.title`, `.subtitle`, `.selector` | The header. |
| `.chart` | The chart area. |
| `.band.fast-full`, `.band.fast-partial`, `.band.on-recipe`, `.band.slow-partial`, `.band.slow-full` | The bands. |
| `.cut-line`, `.pace-line`, `.target-line`, `.max-line`, `.window-edge` | Lines. |
| `.recent-shot`, `.no-cut`, `.grid-line`, `.axis-label` | Marks and axes. |
| `.scrub`, `.example-shot`, `.scrub-handle` | The example shot. |
| `.readout`, `.legend`, `.note`, `.message` | Text under the chart, and status messages. |
| `.chip`, `.chip.on_recipe`, `.chip.fast`, `.chip.slow`, `.chip.manual` | How the last shot ended. |
| `.views`, `.view`, `.view[aria-pressed="true"]` | The chart buttons. |
| `.shot-line`, `.shot-line.drip`, `.stop-point`, `.final-point`, `.held` | The last shot over its preset. |
| `.series.bbw`, `.series.fast`, `.series.slow`, `.series.atm`, `.series.flow`, `.series-fill` | Weight by phase, flow, and their fills. |
| `.cursor`, `.cursor-guide`, `.cursor-dot` | The cursor. |

The same names are exposed as CSS `part`s. Variable and part names are kept
stable between releases; a rename is announced in the changelog.
