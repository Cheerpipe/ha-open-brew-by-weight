<p align="center">
  <img src="https://raw.githubusercontent.com/Cheerpipe/ha-open-brew-by-weight/main/custom_components/open_brew_by_weight/brand/logo.png" alt="Open Brew by Weight" width="256">
</p>

# Open Brew by Weight for Home Assistant

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
[![Validate](https://github.com/Cheerpipe/ha-open-brew-by-weight/actions/workflows/validate.yml/badge.svg)](https://github.com/Cheerpipe/ha-open-brew-by-weight/actions/workflows/validate.yml)
[![Tests](https://github.com/Cheerpipe/ha-open-brew-by-weight/actions/workflows/tests.yml/badge.svg)](https://github.com/Cheerpipe/ha-open-brew-by-weight/actions/workflows/tests.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/LICENSE)

Your espresso machine already knows when it pulled a great shot. This
integration lets Home Assistant know too.

[Open Brew by Weight](https://github.com/Cheerpipe/Advanced-Shot-Stopper) is a
small controller that sits inside your espresso machine, listens to a Bluetooth
scale, and stops the shot when it reaches the weight you asked for. This
integration brings it into Home Assistant: every shot you pull shows up on your
dashboard a moment after it ends, you can switch presets from your phone, and
you can build automations around your coffee routine.

It runs entirely on your local network. No cloud, no account, no polling.

> **It will never start or stop your machine.** Home Assistant can read what
> happened, choose a preset, and change how shots stop, but pulling a shot is
> always something you do with your own hands at the machine.

## What you get

- **Your last shot, at a glance.** Time, duration, final and target weight,
  average flow, time to first drop, the preset you used, how the shot ended,
  and the star rating you gave it.
- **A live brewing indicator.** A sensor flips to *Brewing* the moment a shot
  starts and back to *Idle* when it ends, so you can dim the lights, pause the
  music, or just watch.
- **Everything the machine does.** Rinses, backflushes, power-ons, and blocked
  attempts land in a separate *Last activation* group, so they never muddy your
  shot numbers.
- **Your recent form.** Averages over your last ten shots: duration, yield,
  flow, how close you landed to target, and how many shots you pull per day.
- **Preset switching.** Pick *Morning double* or *Decaf* from a dropdown, a
  dashboard button, or an automation.
- **The same quick toggles as the Web UI header.** Brew by weight, No-scale
  BBW, scale-loss backup, shorten slow shots, extend fast shots, avoid
  accidental touch, and cup protection, all in sync with the controller.
- **A safe restart button** that waits for a shot to finish before it acts.
- **Dashboard cards.** A preset card draws how the preset stops a shot, a
  last shot card charts the shot over its preset or as weight and flow, and a
  shot details card lists every number of the shot, just like the
  controller's Web UI. Every color in them can be restyled. See
  [Dashboard cards](docs/cards.md).

<p>
  <img src="https://raw.githubusercontent.com/Cheerpipe/ha-open-brew-by-weight/main/docs/images/cards/preset.png" alt="Preset card" width="270">
  <img src="https://raw.githubusercontent.com/Cheerpipe/ha-open-brew-by-weight/main/docs/images/cards/shot-chart-preset.png" alt="Last shot card" width="270">
  <img src="https://raw.githubusercontent.com/Cheerpipe/ha-open-brew-by-weight/main/docs/images/cards/shot-details.png" alt="Shot details card" width="270">
</p>

Updates arrive the instant they happen, pushed by the controller itself.

## Before you start

You'll need:

- **Home Assistant 2026.9 or newer.**
- **An Open Brew by Weight controller** running firmware recent enough to talk
  to Home Assistant. If your firmware is too old, setup tells you so; update it
  from the controller's Web UI.
- **Both on the same trusted home network.** Like its Web UI, the controller's
  local API is open on your LAN unless you turn on the controller's Web UI
  password, so keep it off guest or shared networks.
- **A Home Assistant address the controller can reach.** In Home Assistant, go
  to **Settings → System → Network** and make sure *Local network* (the
  Internal URL) is set to an `http://` address on your LAN, for example
  `http://192.168.1.20:8123`. The controller sends its updates there.

## Install

### With HACS (recommended)

[![Open your Home Assistant instance and open this repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Cheerpipe&repository=ha-open-brew-by-weight&category=integration)

1. Click the button above, or open **HACS**, search for
   **Open Brew by Weight**, and open it. If it doesn't show up yet, add this
   repository first: **HACS → ⋮ → Custom repositories**, paste
   `https://github.com/Cheerpipe/ha-open-brew-by-weight`, and choose
   **Integration**.
2. Select **Download**.
3. Restart Home Assistant.

### By hand

1. Download the latest release from the
   [releases page](https://github.com/Cheerpipe/ha-open-brew-by-weight/releases).
2. Copy the `custom_components/open_brew_by_weight` folder into the
   `custom_components` folder of your Home Assistant configuration directory
   (create it if it doesn't exist).
3. Restart Home Assistant.

## Connect your controller

Most of the time there's nothing to type. Your controller announces itself on
the network, and Home Assistant shows it under **Discovered** in
**Settings → Devices & services**. Select **Add**, confirm, and you're done.

If it doesn't appear (some routers and guest networks block the announcements
that make discovery work), add it yourself:

[![Open your Home Assistant instance and start setting up Open Brew by Weight.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=open_brew_by_weight)

1. Go to **Settings → Devices & services → Add integration** and choose
   **Open Brew by Weight**.
2. Enter the controller's IP address, or its local name such as
   `openbrewbyweight.local`.
3. If the controller is already sending updates somewhere else, for example an
   older YAML setup or a custom webhook, Home Assistant asks before replacing
   it. The controller can only send to one place at a time.

### If your controller has a Web UI password

When the controller's Web UI password is turned on (**Admin → Access** in its
Web UI), Home Assistant needs your permission to connect. Setup shows one extra
screen with two ways to give it; use whichever is handier:

- **Approve it from the Web UI.** Home Assistant shows a four-digit code. Open
  the controller's Web UI on your phone: it asks whether Home Assistant may
  connect and shows a code too. If the two codes match, tap **Allow**, then
  select **Submit** in Home Assistant. The request lasts two minutes.
- **Type the device password** in Home Assistant. It's used once, right then,
  and never saved.

Home Assistant then keeps its own key, so it stays connected through restarts
and password changes. If you later tap **Disconnect** in **Admin → Access**,
turn the password off and on again, or restore the factory password, Home
Assistant shows a *reauthentication* notice. Its entities read *unavailable*
until you answer it the same way; nothing is lost.

Turning the password on? Update this integration first, so Home Assistant
knows how to ask.

Behind the scenes, Home Assistant creates a private webhook, tells the
controller where to send updates, sends a test message to make sure the path
works both ways, reads the current state, and only then creates the entities.
If any of that fails, you'll see why instead of a half-working device.

## Using it

Your controller appears as one device with all its entities. The device page
also has a **Visit** link that opens the controller's Web UI.

A few ideas to get going:

- **Get a shot summary on your phone** when a shot finishes.
- **Switch to your decaf preset** automatically after 3 p.m.
- **Turn the kitchen lights warmer** while a shot is brewing.
- **Track your consistency** over weeks with the average-error and yield
  sensors in a history graph.

Ready-to-paste examples are in
[Automation and dashboard ideas](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/automations.md).
Every entity and what it means is in the
[entity guide](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/entities.md).

### About the quick toggles

The seven switches mirror the panel in the controller's Web UI header, and they
behave the same way: a change is **temporary**. It lasts until you pick another
preset or the controller restarts, and then your saved settings come back.
Nothing you flip in Home Assistant rewrites a preset. While a shot is running,
the switches and the preset selector are unavailable, so nothing can change
under your cup mid-shot.

## Good to know

- **Updates are pushed, not polled.** That keeps your network quiet and the
  dashboard instant. The trade-off: if the controller loses power without
  warning, Home Assistant may keep showing the last known values until the next
  update or action.
- **One receiver at a time.** The controller sends updates to a single
  address. If you also use a custom webhook, Home Assistant takes over that
  slot when you add the integration (it asks first).
- **Local HTTP only.** The controller can't send to an `https://` address, which
  is why Home Assistant needs a plain `http://` Internal URL on your LAN.
- **Nothing to copy or paste.** With the Web UI password off, trust comes from
  your home network, the same as the controller's Web UI. With it on, you
  approve Home Assistant once from the Web UI or type the device password once;
  Home Assistant never stores the password.

## When something isn't right

Most problems come down to one of two things: the controller can't reach Home
Assistant's Internal URL, or something else is set as the controller's
webhook. The
[troubleshooting guide](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/troubleshooting.md)
walks through each symptom and how to see exactly what's going on.

To change the controller's address later, or to resend and retest the
connection, open the integration and choose **Reconfigure**.

## More

- [How it works](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/how-it-works.md):
  updates, recovery, security, removal, and moving from the old YAML package.
- [Contributing](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/CONTRIBUTING.md):
  running the tests and making a release.
- [Changelog](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/CHANGELOG.md)
- Problems with the controller itself, its scale connection, or its Web UI
  belong in the
  [firmware repository](https://github.com/Cheerpipe/Advanced-Shot-Stopper).

## License

Copyright © 2024–2026 Felipe Urzúa and contributors.

Licensed under the [GNU Affero General Public License v3.0 or later](https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/LICENSE),
the same license as the Open Brew by Weight firmware.
