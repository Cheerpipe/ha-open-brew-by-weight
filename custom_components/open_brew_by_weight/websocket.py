"""Card data over the Home Assistant WebSocket API.

The cards never reach the controller: they subscribe here and get what the
coordinator already holds, then every change, so the controller still sees
one read per shot however many dashboards are open.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components.websocket_api import async_register_command
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.const import ERR_NOT_FOUND
from homeassistant.components.websocket_api.decorators import websocket_command
from homeassistant.components.websocket_api.messages import event_message
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import DOMAIN
from .coordinator import OpenBrewByWeightCoordinator

SIGNAL_UNLOADED = f"{DOMAIN}_unloaded_{{}}"


def card_payload(coordinator: OpenBrewByWeightCoordinator) -> dict[str, Any]:
    """The Web UI preset render and the last shot's Stats row with its curve."""
    data = coordinator.data
    return {
        "available": coordinator.last_update_success,
        "shotState": data.snapshot.shot_state,
        "activePresetId": data.presets.active_id,
        "cutRampS": data.presets.cut_ramp_s,
        "presets": [
            {"id": p.id, "name": p.name, "isFactory": p.is_factory, **(p.rule or {})}
            for p in data.presets.items
        ],
        "lastShot": None if data.shot_detail is None else data.shot_detail.values,
    }


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the card commands once per Home Assistant run."""
    async_register_command(hass, ws_subscribe)


@websocket_command(
    {vol.Required("type"): f"{DOMAIN}/subscribe", vol.Required("device_id"): str}
)
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the card data now and after every change, until unsubscribed."""
    device = dr.async_get(hass).async_get(msg["device_id"])
    entry = next(
        (
            entry
            for entry_id in (device.config_entries if device else ())
            if (entry := hass.config_entries.async_get_entry(entry_id))
            and entry.domain == DOMAIN
            and entry.state is ConfigEntryState.LOADED
        ),
        None,
    )
    if entry is None:
        connection.send_error(
            msg["id"], ERR_NOT_FOUND, "Open Brew by Weight device not found"
        )
        return
    coordinator: OpenBrewByWeightCoordinator = entry.runtime_data.coordinator
    sent: dict[str, Any] | None = None

    @callback
    def forward() -> None:
        nonlocal sent
        payload = card_payload(coordinator)
        if payload != sent:
            sent = payload
            connection.send_message(event_message(msg["id"], payload))

    @callback
    def unloaded() -> None:
        # A reload replaces the coordinator: the card subscribes again.
        connection.send_message(event_message(msg["id"], {"unloaded": True}))

    stop_updates = coordinator.async_add_listener(forward)
    stop_unload = async_dispatcher_connect(
        hass, SIGNAL_UNLOADED.format(entry.entry_id), unloaded
    )

    @callback
    def unsubscribe() -> None:
        stop_updates()
        stop_unload()

    connection.subscriptions[msg["id"]] = unsubscribe
    connection.send_result(msg["id"])
    forward()
