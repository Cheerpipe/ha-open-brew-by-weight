# Automation and dashboard ideas

A handful of starting points you can paste and adapt. They assume your
controller has the default name, so entity IDs start with `openbrewbyweight_`.
If yours is different, swap in your own IDs; the
[entity guide](entities.md) explains what each one means.

To use an automation, go to **Settings → Automations & scenes → Create
automation → ⋮ → Edit in YAML**, paste it, and adjust the names.

## Tell me how the shot went

A phone notification a moment after each shot, with the numbers that matter.

```yaml
alias: Espresso shot summary
triggers:
  - trigger: state
    entity_id: sensor.openbrewbyweight_last_shot
conditions:
  - condition: template
    value_template: >
      {{ trigger.to_state.state not in ['unknown', 'unavailable'] }}
actions:
  - action: notify.mobile_app_your_phone
    data:
      title: "☕ Shot done"
      message: >
        {{ states('sensor.openbrewbyweight_last_shot_final_weight') }} g
        of {{ states('sensor.openbrewbyweight_last_shot_target_weight') }} g
        in {{ states('sensor.openbrewbyweight_last_shot_duration') | round(1) }} s
        ({{ states('sensor.openbrewbyweight_last_shot_preset') }}).
```

The **Last shot** sensor changes once per new shot, which makes it a clean
trigger. If your controller's clock isn't set, that sensor stays unavailable;
trigger on **Last shot final weight** instead.

## Flag a shot that missed

Only hear about it when something was off: more than 2 g away from target.

```yaml
alias: Espresso shot missed target
triggers:
  - trigger: state
    entity_id: sensor.openbrewbyweight_last_shot_final_weight
conditions:
  - condition: template
    value_template: >
      {% set final = states('sensor.openbrewbyweight_last_shot_final_weight') | float(0) %}
      {% set target = states('sensor.openbrewbyweight_last_shot_target_weight') | float(0) %}
      {{ target > 0 and (final - target) | abs > 2 }}
actions:
  - action: notify.mobile_app_your_phone
    data:
      message: >
        That shot ended at {{ states('sensor.openbrewbyweight_last_shot_final_weight') }} g
        instead of {{ states('sensor.openbrewbyweight_last_shot_target_weight') }} g.
        It stopped because: {{ state_translated('sensor.openbrewbyweight_last_shot_stop_detail') }}.
```

## Decaf after three

Switch presets on a schedule. Use the preset name exactly as it appears in the
**Active preset** dropdown.

```yaml
alias: Afternoon decaf
triggers:
  - trigger: time
    at: "15:00:00"
actions:
  - action: select.select_option
    target:
      entity_id: select.openbrewbyweight_active_preset
    data:
      option: Decaf
```

If a shot happens to be running at 15:00, the controller refuses the change
and the automation logs an error. Add a condition on **Shot state** being
`idle` if you'd rather skip quietly.

## Set the mood while it brews

```yaml
alias: Espresso lighting
triggers:
  - trigger: state
    entity_id: sensor.openbrewbyweight_shot_state
    to: brewing
    id: start
  - trigger: state
    entity_id: sensor.openbrewbyweight_shot_state
    to: idle
    id: end
actions:
  - choose:
      - conditions:
          - condition: trigger
            id: start
        sequence:
          - action: light.turn_on
            target:
              entity_id: light.kitchen_counter
            data:
              color_temp_kelvin: 2400
              brightness_pct: 70
    default:
      - action: light.turn_on
        target:
          entity_id: light.kitchen_counter
        data:
          color_temp_kelvin: 4000
          brightness_pct: 100
```

## Remind me to backflush

A gentle nudge when the machine hasn't been cleaned in a week. **Last
activation type** only remembers the newest activation, so first give Home
Assistant somewhere to keep the date: create a **Date and/or time** helper
(**Settings → Devices & services → Helpers**) with date and time, named
*Last backflush*. Then add two automations.

Remember each backflush:

```yaml
alias: Record backflush
triggers:
  - trigger: state
    entity_id: sensor.openbrewbyweight_last_activation_time
conditions:
  - condition: state
    entity_id: sensor.openbrewbyweight_last_activation_type
    state: backflush
actions:
  - action: input_datetime.set_datetime
    target:
      entity_id: input_datetime.last_backflush
    data:
      timestamp: "{{ now().timestamp() }}"
```

Remind when it's been too long:

```yaml
alias: Backflush reminder
triggers:
  - trigger: time
    at: "09:00:00"
conditions:
  - condition: template
    value_template: >
      {{ now() - states('input_datetime.last_backflush') | as_datetime | as_local
         > timedelta(days=7) }}
actions:
  - action: notify.mobile_app_your_phone
    data:
      message: It's been a week since the last backflush. Time to give the group head some love.
```

Triggering on **Last activation** rather than the type means two backflushes
in a row are both recorded: the time changes every time, even when the type
stays the same.

## A dashboard card

An **Entities** card with the essentials. In a dashboard, choose
**Add card → Manual** and paste:

```yaml
type: entities
title: Espresso
entities:
  - entity: sensor.openbrewbyweight_shot_state
  - entity: select.openbrewbyweight_active_preset
  - type: section
    label: Last shot
  - entity: sensor.openbrewbyweight_last_shot
    format: relative
  - entity: sensor.openbrewbyweight_last_shot_final_weight
  - entity: sensor.openbrewbyweight_last_shot_duration
  - entity: sensor.openbrewbyweight_last_shot_average_flow
  - entity: sensor.openbrewbyweight_last_shot_stop_detail
  - type: section
    label: How shots stop
  - entity: switch.openbrewbyweight_brew_by_weight
  - entity: switch.openbrewbyweight_extend_fast_shots
  - entity: switch.openbrewbyweight_shorten_slow_shots
  - entity: switch.openbrewbyweight_cup_protection
```

For a sense of how consistent you're getting, add a **History graph** card
with **Stats average error** and **Stats average yield** over the last month.
