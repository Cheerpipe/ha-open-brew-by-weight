# Changelog

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
