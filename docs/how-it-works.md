# How it works

You don't need any of this to use the integration. It's here for the curious,
and for when you want to know exactly what to expect.

## How updates reach Home Assistant

The controller tells Home Assistant when something happens, instead of Home
Assistant asking over and over. When you add the integration, Home Assistant
creates a private webhook (a web address with a long, random secret in it) and
gives it to the controller. From then on:

- when a shot starts or ends, a preset changes, a quick toggle flips, or the
  controller restarts or gets a new IP address, the controller sends a short
  message to that address straight away;
- after a shot ends, Home Assistant reads the full record from the controller,
  so the *Last shot*, *Last activation*, and *Stats* sensors always match what
  the controller saved;
- every message carries a revision number. If Home Assistant notices it missed
  one, it re-reads everything once to catch up.

There's no background polling. Home Assistant only reads from the controller
at setup, after a message that calls for it, after you change something, and
while recovering from a failure.

### When the controller goes quiet

If a read fails, Home Assistant marks the entities unavailable and tries again
after 5, 10, 20, 40, and 60 seconds. The first success brings everything back.
After the last attempt it stops trying and waits for the controller to get in
touch, for you to take an action, or for a reload.

Because nothing polls, a controller that loses power without warning can't be
noticed straight away. The entities keep their last values until the next
attempt to talk to it.

If the controller is offline when Home Assistant starts, the integration
waits and retries using Home Assistant's normal setup retry. It never creates
entities from a partial picture.

## Security

Out of the box, the controller's local API has no password: it shares the
same trust model as its Web UI, which is your home network. Anyone on that
network can read its state and change presets or quick toggles, just as they
could from a browser. Nobody can start or stop the machine through it; that
capability doesn't exist.

If you turn on the controller's Web UI password, the API closes too. Home
Assistant then needs its own key, which it gets in one of two ways: you approve
it in the Web UI after checking that both sides show the same four-digit code,
or you type the device password in Home Assistant once. The password is sent to
the controller a single time to get the key and is never stored. The key is
kept in Home Assistant's configuration, never shown in entities or
diagnostics, and sent with every request to the controller.

The controller holds one Home Assistant key at a time. Connecting again, from
a new setup or a reauthentication, replaces it. The key survives restarts and
password changes; it ends when you tap **Disconnect** in **Admin → Access**,
turn the password off, or restore the factory password. When the controller
stops accepting it, Home Assistant marks the entities unavailable and asks you
to reauthenticate. Nothing is deleted meanwhile.

The connection isn't encrypted, with or without the password. It keeps casual
visitors out, not someone who can watch traffic on your Wi-Fi.

The webhook secret is the one thing worth protecting. Anyone who knows it can
send fake updates to Home Assistant. It's never shown in entities, attributes,
or diagnostics. Administrators can see it, and replace it, from
**Reconfigure**.

Keep the controller and Home Assistant on a network you trust, not a guest,
hotel, or shared network.

## Reconfigure

Open the integration and choose **Reconfigure** to:

- change the controller's address;
- see the webhook address the controller uses, or replace the secret (32 to
  128 letters, numbers, hyphens, or underscores);
- resend and retest the current settings, if you suspect the controller lost
  them.

Changes are applied carefully: Home Assistant registers the new webhook first,
gives it to the controller, checks it works, and only then retires the old
one. If the check fails, it keeps your previous setup and puts the controller
back the way it was. If even that fails, a repair appears asking you to save
the settings again.

Reconfigure also refuses to point an existing entry at a different controller,
so you can't accidentally swap devices.

## Reload and removal

Reloading the integration briefly stops Home Assistant from listening; the
controller keeps its settings and the next update arrives as usual.

Deleting the integration tells the controller to stop sending updates, but
only if it's still sending them to this Home Assistant. If you've since
pointed it somewhere else, that setting is left alone.

## Moving from the old YAML package

Before this integration existed, Open Brew by Weight shipped a YAML package
with helpers, template sensors, and an automation that received webhooks. To
switch over:

1. Remove the old package and its receiving automation from your
   configuration.
2. Remove its `input_number`, `input_text`, template sensors, and any `rest` or
   `rest_command` entries. If you want to keep their history, decide that
   first; removing them removes their place in the recorder too.
3. Restart Home Assistant, then add the integration as usual.
4. When asked to replace the existing webhook, confirm.
5. Point your dashboards and automations at the new entities. Their IDs come
   from the device name and won't match the old helpers.

Don't leave the old automation running. The controller sends to one place
only, so the two would fight over it.

## Firmware compatibility

At setup, Home Assistant checks that the controller speaks the integration API
it expects and offers every feature it needs. Older firmware is turned away
with a clear message instead of a half-working device.

The integration and the firmware evolve together. When a new firmware adds a
new kind of value, such as a new reason a shot can end, update the integration
first, then the firmware. An older integration doesn't know how to label
values it has never seen.

## Quality

The integration follows Home Assistant's
[integration quality scale](https://developers.home-assistant.io/docs/core/integration-quality-scale/)
and is built to the Gold tier's rules. It isn't officially rated, since that
only happens for integrations included in Home Assistant itself; the
[readiness notes](gold-readiness.md) record how each rule is met.
