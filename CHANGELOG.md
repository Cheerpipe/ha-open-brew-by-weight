# Changelog

## 0.8.1

- **A quiet log while the controller starts.** Right after the controller
  restarts, it can take a moment before the last shot's curve is ready. The
  integration keeps showing the last shot it already has and refreshes it
  shortly after, and no longer writes a warning to the Home Assistant log each
  time this happens. Real errors are still reported as warnings.

## 0.8.0

- **Charts show the whole weight range.** Next to *Target*, the preset and
  last shot charts now name how far the stop line moves: *Up to 42 g* over
  its high level for fast shots and *Down to 33 g* under its low one for
  slow shots, as the controller's own preset graph does. Fixed presets and
  presets without brew by weight keep just the target. Restyle the new
  labels with `--obbw-hold-label-color`.

## 0.7.1

- **Charts never guess a transition.** The preset and last shot charts draw
  each side's transition only as the controller reports it. If one is ever
  missing, the chart stays hidden instead of falling back to a 5-second smooth
  step that might not match where the controller cuts.

## 0.7.0

- **Charts follow each preset's transitions.** The preset and last shot charts
  draw the cut line with each preset's own Fast and Slow transitions — their
  length and curve, as set in the controller's Settings — and cut exactly where
  the controller does. A last shot keeps the transitions it ran with.
  Controllers on earlier firmware keep drawing their 5-second smooth step.

## 0.6.3

- **Card settings show up for real.** The settings of every card could open
  with an empty *Config* tab. Now the device, the chart, the chart buttons,
  the fields, and every other option show up in the visual editor.
- **Charts fit their card.** At a section's usual width, the preset and last
  shot charts no longer run past the card's right edge.
- **Cards load in every browser.** In browsers where Home Assistant adds its
  own support for scoped elements, the cards could show *Configuration
  error*. They now load there too.
- The last shot card's cursor starts where the shot stopped, so it reads both
  weight and flow; the details card spans the section's width by default and
  keeps the rating stars on one line.
- Card names in the card picker follow Home Assistant's language even when it
  differs from the browser's.
- Ready for Home Assistant 2027.10, which drops an older way of finding a
  device's integration.
- Screenshots of every card and styling example in
  [Dashboard cards](docs/cards.md) and the README.

## 0.6.2

- **Card settings show up.** Opening a card's settings could show an empty
  *Config* tab when no built-in card had been edited first in that session.
  Every option is there now: the device, which chart to show, the chart
  buttons, the fields, and the rest.
- Card names in the card picker follow Home Assistant's language instead of
  the browser's.

## 0.6.1

- **Shot details card:** *Cut at* and *Drip* are right on a shot whose
  curve has no reading after the stop when its last reading and an event,
  such as the first drop, fall at the same moment. The controller's Web UI
  gets the same fix in its next firmware.

## 0.6.0

Two more dashboard cards for your last shot, joining the preset card. Like
it, they come with the integration: update, reload your browser once, and look
for them when adding a card. They need the same controller firmware as 0.5.0.

- **Last shot card.** Your last shot four ways, the same charts as the
  controller's Web UI: over the preset it ran with, weight and flow together,
  or either alone. Buttons above the chart switch between them and each
  browser remembers the pick. Hover, drag, or use the arrow keys to read the
  shot at any moment: time, weight, flow, and the stop line there. The weight
  line changes color where a guard stepped in, and a dashed tail shows the
  drips after the stop.
- **Shot details card.** Every number of your last shot, like a shot card on
  the controller's Stats page: duration and yield in large type, then goal,
  error, drip, flow, first drop, dose, ratio, how it ended, the scale, your
  rating, and more. Choose and order the fields, pick which show as large
  numbers, and set the columns.
- Both show when the shot ended, its preset, and how it ended at the top,
  follow dark mode and your language (English and Spanish), and can be
  restyled with UIX, card-mod, or a theme. See
  [Dashboard cards](docs/cards.md).

## 0.5.0

Your first dashboard card: the **preset card** draws how a preset decides when
to stop a shot, the same chart as the controller's Web UI. It comes with the
integration, so there's no dashboard resource to add: install, reload your
browser once, and look for **Open Brew by Weight preset** when adding a card.

The card needs Open Brew by Weight firmware that shares preset settings and
shot curves with Home Assistant; update the controller together with this
release. With older firmware the integration works as before and the card asks
you to update.

- **See the whole preset.** The *Stop at* line, the on-recipe window, how far
  a fast shot is extended and a slow one shortened, the stretch before weight
  cuts start, and dots for when your recent shots reached the target.
- **Try a shot.** Drag the example shot along the chart, or use the arrow
  keys: the card tells you when it would reach the target, whether that's
  fast, on recipe, or slow, and at what weight it would stop.
- **Switch presets from the card.** An optional dropdown changes the active
  preset; it stays locked while a shot runs.
- **Follow the active preset or pin one**, and hide the header, legend, note,
  example shot, or recent shots to fit your dashboard.
- **Make it yours.** Every color, line, and band can be changed with UIX,
  card-mod, or a Home Assistant theme: fast, slow, and on-recipe colors, each
  band on its own, the stop line's color and width, the background, and more.
  See [Dashboard cards](docs/cards.md).
- Follows Home Assistant's dark mode and language (English and Spanish).
- Home Assistant now keeps each preset's settings and the last shot's weight
  curve, the data behind the controller's charts. It reads the curve once per
  shot and remembers it across restarts, so open dashboards never add traffic
  to the controller.

## 0.4.0

Switches changed together now reach the controller as one change. This needs
Open Brew by Weight firmware that accepts several Quick Settings in one
update; update the controller together with this release.

- A scene or an automation that flips several switches sends them in a single
  update: they apply at the same moment, Home Assistant confirms them once, and
  the controller sends one update back instead of one per switch.

## 0.3.0

Adds support for the controller's optional Web UI password. To use it, the
controller needs Open Brew by Weight firmware that includes that password.
With older firmware, or with the password turned off, the integration works
exactly as before and setup asks for nothing new.

- Works with the controller's optional Web UI password. While it is on, setup
  asks for permission once: approve a four-digit code from the Web UI, or type
  the device password, which is used once and never saved.
- If the controller stops accepting Home Assistant (for example after
  **Disconnect** in its **Admin → Access**), Home Assistant shows a
  reauthentication notice instead of retrying forever. Entities stay
  unavailable until you answer it; nothing is removed.

## 0.2.0

First release from its own repository. The integration itself works the same
as the version that shipped inside the firmware repository.

- Install from HACS, with automatic discovery of controllers on your network.
- Live shot state, last shot, last activation, and recent stats sensors.
- Active preset selector, seven quick toggles mirroring the Web UI header, and
  a shot-safe restart button.
- Brand icons ship with the integration, so they appear without waiting for
  Home Assistant's brands repository.
- New user guides: entities, automation and dashboard ideas, troubleshooting,
  and how it works.
