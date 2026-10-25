# Changelog

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
