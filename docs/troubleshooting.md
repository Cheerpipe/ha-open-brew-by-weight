# Troubleshooting

When something's off, it's almost always one of two things: the controller
can't reach Home Assistant, or something else is set as the controller's
webhook. This page helps you figure out which, and fix it.

## Common situations

### The controller doesn't show up under Discovered

Discovery relies on your network passing local announcements (mDNS). Many
mesh systems, guest networks, and hotel or office Wi-Fi block them.

- Make sure Home Assistant and the controller are on the same network, not
  one on the main network and the other on a guest or IoT network.
- Add it by hand instead: **Add integration → Open Brew by Weight**, and enter
  the controller's IP address. You'll find it in the controller's Web UI under
  **Admin → Network**, or in your router's list of connected devices. Its
  local name, `openbrewbyweight.local` unless you renamed it, also works on
  most networks.

### Setup says the callback URL is unavailable

Home Assistant doesn't know an address the controller can use to reach it. Go
to **Settings → System → Network**, and under **Home Assistant URL** set
*Local network* to an address like `http://192.168.1.20:8123`. It must start
with `http://` (the controller can't use `https://`) and must be reachable
from your LAN, not only from the internet.

### Setup says another webhook is configured

The controller already sends its updates somewhere else: an old YAML package,
Node-RED, or a custom webhook. It can only send to one place. Confirm the
takeover if Home Assistant should be the one; otherwise cancel and the existing
setup stays untouched.

### Setup fails at the callback test

Home Assistant registered its webhook, but the test message from the
controller never arrived. Check that:

- the Internal URL above points at the right machine and port;
- nothing between the two blocks the connection, such as a firewall on the
  Home Assistant host or client isolation on the Wi-Fi access point;
- Home Assistant isn't only listening on a different network interface.

The Home Assistant log names the step that failed and the reason the
controller gave.

### The firmware isn't compatible

The controller is running firmware too old to talk to this integration. Update
it from the controller's Web UI (**Admin → Firmware update**), then try again.

### Entities are unavailable

Home Assistant couldn't read from the controller. Usually it's powered off,
changed address, or dropped off Wi-Fi.

When a read fails, Home Assistant retries on its own after 5, 10, 20, 40, and
60 seconds, and stops as soon as one succeeds. If all of those fail, it waits
for the next sign of life: an update from the controller, an action you take
in Home Assistant, or a reload of the integration.

If the controller has a new IP address and discovery works on your network,
Home Assistant picks it up automatically. Otherwise, open the integration and
choose **Reconfigure** to enter the new address.

### Values look stale after a shot

Updates are pushed by the controller and are best effort. If one was lost (a
Wi-Fi hiccup at the wrong moment), the sensors keep the previous shot until
the next update, the next action you take, or a reload. If this happens
often, the controller is probably struggling to reach Home Assistant; see
[Find the cause](#find-the-cause).

### A preset or switch change fails

The error message carries the controller's reason. The usual ones:

- **A shot is running.** Changes are refused mid-shot on purpose. Try again
  when it's done.
- **A stale revision.** Home Assistant missed some earlier changes, usually
  because updates from the controller aren't arriving. It refreshes itself;
  if it keeps happening, check the callback path.

### A repair says the controller callback needs attention

A reconfiguration couldn't verify the new callback and couldn't restore the
old one either. Open **Reconfigure** and save the displayed values again.

## Find the cause

### Turn on debug logging

This shows each step of setup and every update that arrives from the
controller. Add to `configuration.yaml` and restart, or turn it on from the
integration's page with **Enable debug logging**:

```yaml
logger:
  logs:
    custom_components.open_brew_by_weight: debug
```

### Ask the controller

Open `http://<controller-address>/api/v1/integration/webhook` in a browser.
The `delivery` section tells you whether the controller is sending updates,
holding them back, or failing, and why. A failed update is retried after 3, 6,
and 9 seconds.

To keep a record of failures on the controller, open its Web UI, go to
**Diagnostic → Log**, and set **Ring log level** to **Warning**. With
**Error**, only updates that were finally given up on are kept.

### Download diagnostics

On the device page, **Download diagnostics** saves a file with the
integration's state. Addresses and the webhook secret are removed, so it's
safe to attach to an issue.

## Still stuck?

[Open an issue](https://github.com/Cheerpipe/ha-open-brew-by-weight/issues)
with your Home Assistant, integration, and firmware versions, what you
expected, what happened, and the debug log around it. If the problem is with
the controller itself (scale connection, Web UI, shots not stopping), the
[firmware repository](https://github.com/Cheerpipe/Advanced-Shot-Stopper/issues)
is the better place.
