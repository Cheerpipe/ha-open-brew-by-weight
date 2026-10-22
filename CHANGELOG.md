# Changelog

## Unreleased

- Works with the controller's optional Web UI password. While it is on, setup
  asks for permission once: approve a four-digit code from the Web UI, or type
  the device password, which is used once and never saved.
- If the controller stops accepting Home Assistant (for example after
  **Disconnect** in its **Admin → Access**), Home Assistant shows a
  reauthentication notice instead of retrying forever. Entities stay
  unavailable until you answer it; nothing is removed.
- Controllers with the password off, and older firmware, work exactly as
  before.

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
