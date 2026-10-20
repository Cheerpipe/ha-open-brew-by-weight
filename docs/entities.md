# Entity guide

Everything the integration adds lives on one device: your controller. Entity
names below are what you'll see in Home Assistant. Entity IDs are built from
your device's name, so a controller called *Openbrewbyweight* gives you IDs
like `sensor.openbrewbyweight_last_shot_final_weight`. If you renamed the
controller in its Web UI, your IDs use that name instead; check
**Settings → Devices & services → Entities** when in doubt.

## Right now

| Entity | What it tells you |
| --- | --- |
| **Shot state** | *Brewing* while a shot is running, *Idle* otherwise. It changes the instant the controller sees the shot start or end. |

## Last shot

These describe the newest shot the controller recorded, the same one shown on
the controller's Home page when it's idle. Very short or near-empty activations
(2 g or less) don't count as shots, so a quick flush won't replace your last
real espresso here.

| Entity | What it tells you |
| --- | --- |
| **Last shot** | When the shot ended. Unavailable if the controller hadn't set its clock yet when you pulled it. |
| **Last shot duration** | How long the shot ran, in seconds. |
| **Last shot final weight** | What ended up in the cup, in grams. |
| **Last shot target weight** | What you asked for, in grams. |
| **Last shot average flow** | Average flow over the shot, in grams per second. |
| **Last shot first drop** | Seconds from start until the first drop hit the cup. |
| **Last shot type** | *Automatic* (stopped by weight), *Timer only*, or *Manual*. |
| **Last shot stop detail** | Why the shot ended. See below. |
| **Last shot preset** | The preset you were using. |
| **Last shot rating** | The stars you gave it in the Web UI, or *Unrated*. |

### Why a shot ended

**Last shot stop detail** tells you what actually ended the shot. It's about
how it stopped, not whether it ran fast or slow: a fast shot that still stopped
at its target weight reads *Target reached*.

| Shown as | Meaning |
| --- | --- |
| Target reached | The shot hit its target weight and stopped. |
| Fast-shot maximum weight / Fast-shot minimum time | A fast shot was allowed to run a little longer, and it ended at that extended limit. |
| Slow-shot maximum time / Slow-shot minimum weight | A slow shot was cut short at its limit. |
| Automatic to manual | The scale dropped out and the scale-loss backup took over. |
| Cup removed | Cup protection stopped the shot when the cup left the scale. |
| Touch fallback | Touch protection was holding the shot, and sustained weight ended it. |
| Physical control / Physical override | You stopped it at the machine. |
| Web stop / Web heartbeat timeout | It was stopped from the Web UI, or the Web UI connection that was watching it went away. |
| Hard time limit / Configured time limit | A safety time limit ended it. |
| Weight anomaly / Relay safety | The controller stopped because something looked wrong. Worth a look at the controller's log. |
| Other | Anything else. |

In automations, use the raw values: `normal_target`, `extended_max_weight`,
`extended_min_time`, `slow_max_time`, `slow_min_weight`, `auto_to_manual`,
`cup_removed`, `touch_weight_fallback`, `activator`, `physical_override`,
`web_stop`, `web_heartbeat`, `hard_limit`, `wall_limit`, `weight_anomaly`,
`relay_safety`, and `other`.

## Last activation

Your machine does more than pull shots. These follow the newest entry in the
controller's History page, whatever it was.

| Entity | What it tells you |
| --- | --- |
| **Last activation** | When it happened. |
| **Last activation type** | *Shot*, *Rinse*, *Backflush*, *Power on*, *Other*, or *No-scale guard aborted* (a shot attempt blocked because no scale was connected). |
| **Last activation duration** | How long the machine was active, in seconds. |

*Backflush* means the controller confirmed the automatic cleaning program ran,
even if it was interrupted. Backflushes never touch your shot statistics.

## Stats

Averages over your ten most recent recorded shots, the same numbers as the
controller's Stats page. They're great in a history graph.

| Entity | What it tells you |
| --- | --- |
| **Stats shot count** | How many shots the averages are based on (up to ten). |
| **Stats average duration** | Seconds. |
| **Stats average yield** | Grams in the cup. |
| **Stats average error** | How far, on average, shots stopped by weight landed from where they were meant to stop, as a percentage. Lower is better. |
| **Stats average flow** | Grams per second. |
| **Stats shots per day** | Your recent daily pace. |

## Controls

| Entity | What it does |
| --- | --- |
| **Active preset** | Choose which preset the controller uses. The list comes from the presets you've set up on the controller. |
| **Brew by weight** | Off means shots stop by hand for now, without changing your preset. |
| **No-scale BBW** | Watches for shots started without a usable scale and warns or blocks them, depending on how it's set up on the controller. Turning it back on restores the mode you used last. |
| **Scale-loss backup** | Keep a shot under control if the scale disconnects mid-shot. |
| **Shorten slow shots** | Cut a choking shot short at its limits. |
| **Extend fast shots** | Let a gushing shot run a little longer so the cup isn't thin. |
| **Avoid accidental touch** | Ignore brief bumps, like a hand steadying the cup, so they can't end a shot early. |
| **Cup protection** | Turns on the cup checks set up on the controller, such as stopping the shot if the cup is lifted off the scale. |
| **Restart Open Brew by Weight** | Restarts the controller. If a shot is running, it waits until the shot finishes. |

A few things worth knowing about the controls:

- **Changes are temporary.** The switches mirror the Web UI header panel. A
  change lasts until you choose another preset or the controller restarts. If
  someone sets a shorter duration in the Web UI panel, such as *Next shot*,
  changes from Home Assistant end then too.
- **Nothing changes mid-shot.** All switches and the preset selector are
  unavailable while a shot is running. The six protection switches are also
  unavailable while *Brew by weight* is off, since there's no automatic stop to
  protect.
- **What you see is what the controller confirmed.** When you pick a preset or
  flip a switch, Home Assistant waits for the controller to accept it before
  showing the new value. If the controller says no, the old value stays and you
  get an error explaining why.

## Diagnostic entities

These describe the controller itself and live in the device's *Diagnostic*
section.

| Entity | What it tells you |
| --- | --- |
| **Controller** | The controller's hardware profile, such as `esp32-s3-relay-x1-speaker`, with the chip and firmware version as attributes. |
| **Machine** | The espresso machine the firmware was built for, such as *La Marzocco Linea Micra*. |
| **Controller IP** | The controller's current address. It follows along if your router hands out a new one. |

The device page also lists the controller's Wi-Fi and Bluetooth addresses, so
you can match it to what your router or a Bluetooth scanner shows.
