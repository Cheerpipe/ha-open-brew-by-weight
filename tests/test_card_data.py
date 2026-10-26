"""Card data: preset rules, the last shot row, and the WebSocket feed."""

from __future__ import annotations

import asyncio
import json
from dataclasses import replace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.setup import async_setup_component

from custom_components.open_brew_by_weight import async_setup
from custom_components.open_brew_by_weight.cards import (
    CARDS_FILE,
    CARDS_URL,
    async_register_cards,
)
from custom_components.open_brew_by_weight.const import DOMAIN
from custom_components.open_brew_by_weight.coordinator import (
    OpenBrewByWeightCoordinator,
)
from custom_components.open_brew_by_weight.models import (
    DeviceSnapshot,
    PresetState,
    ProtocolError,
    ShotDetail,
    WebhookEvent,
)
from custom_components.open_brew_by_weight.websocket import SIGNAL_UNLOADED

from .helpers import api_mock, config_entry, coordinator_data, fixture
from .test_api import Response, Session


def _detail(**updates) -> ShotDetail:
    detail = ShotDetail.from_dict(fixture("integration_last_shot.json"))
    assert detail is not None
    return replace(detail, values={**detail.values, **updates})


def _coordinator(hass) -> tuple[OpenBrewByWeightCoordinator, MagicMock]:
    entry = config_entry()
    api = api_mock()
    coordinator = OpenBrewByWeightCoordinator(hass, entry, entry.data["device_id"], api)
    coordinator.async_set_updated_data(coordinator_data())
    return coordinator, api


def test_presets_carry_the_web_ui_rules() -> None:
    """Rules pass through beside the original keys and stay out of the hash."""
    presets = PresetState.from_dict(fixture("integration_presets.json"))
    double = presets.items[0]
    assert double.rule is not None
    assert {"id", "name", "isFactory"}.isdisjoint(double.rule)
    assert double.rule["goalWeightG"] == 36.0
    assert double.rule["arrivalsS"] == [21.4, 29.1, 30.6, 32.7, 34.2]
    # Each preset carries its own Fast and Slow transitions.
    assert (double.rule["fastRampS"], double.rule["slowCurveHardness"]) == (3.0, "soft")
    assert hash(double) == hash(replace(double, rule=None))
    legacy = PresetState.from_dict(fixture("webhook_presets_changed_v1.json") | {"apiVersion": 1})
    assert all(item.rule is None for item in legacy.items)
    broken = fixture("integration_presets.json")
    broken["items"][0]["slowAfterS"] = "36"
    with pytest.raises(ProtocolError):
        PresetState.from_dict(broken)
    broken["items"][0]["slowAfterS"] = 36.0
    broken["items"][0]["brewByWeight"] = 1
    with pytest.raises(ProtocolError):
        PresetState.from_dict(broken)


def test_snapshot_shot_id_round_trips() -> None:
    """The snapshot names the stored shot so the row is read once."""
    snapshot = DeviceSnapshot.from_dict(fixture("integration_snapshot.json"))
    assert snapshot.last_shot is not None
    assert snapshot.last_shot.shot_id == 1042
    assert snapshot.last_shot.to_dict()["shotId"] == 1042
    assert "shotId" not in replace(snapshot.last_shot, shot_id=None).to_dict()


def test_shot_detail_parses_the_stats_row() -> None:
    """Columns name the values; the curve rides last; storage round-trips."""
    payload = fixture("integration_last_shot.json")
    detail = ShotDetail.from_dict(payload)
    assert detail is not None
    assert detail.shot_id == 1042
    assert detail.values["goalG"] == 36.0
    assert detail.values["verdict"] == "on_recipe"
    assert detail.values["curve"]["wD"]
    assert ShotDetail.from_dict(detail.to_dict()) == detail
    assert ShotDetail.from_dict({**payload, "shot": None}) is None
    for broken in (
        {**payload, "apiVersion": 2},
        {**payload, "cols": None},
        {**payload, "shot": payload["shot"][:-1]},
        {**payload, "shot": [*payload["shot"][:-1], []]},
        {**payload, "shot": ["x", *payload["shot"][1:]]},
    ):
        with pytest.raises(ProtocolError):
            ShotDetail.from_dict(broken)


async def test_api_reads_the_last_shot() -> None:
    """The client reads the new route and returns the parsed row."""
    from custom_components.open_brew_by_weight.api import OpenBrewByWeightApi

    session = Session(Response(200, fixture("integration_last_shot.json")))
    detail = await OpenBrewByWeightApi(session, "controller").async_last_shot()
    assert detail is not None and detail.shot_id == 1042
    assert session.calls[0][0] == (
        "GET",
        "http://controller/api/v1/integration/shots/last",
    )


async def test_refresh_reads_the_row_once_per_shot(hass) -> None:
    """A new shot or rating reads the row; anything else reuses it."""
    coordinator, api = _coordinator(hass)
    api.async_last_shot.return_value = _detail()
    first = await coordinator._async_update_data()
    assert first.shot_detail == _detail()
    assert api.async_last_shot.await_count == 1
    await coordinator._async_update_data()
    assert api.async_last_shot.await_count == 1

    snapshot = api.async_snapshot.return_value
    rated = replace(snapshot.last_shot, rating=5)
    api.async_snapshot.return_value = replace(snapshot, last_shot=rated)
    api.async_last_shot.side_effect = RuntimeError("offline")
    kept = await coordinator._async_update_data()
    assert kept.shot_detail == _detail()
    assert api.async_last_shot.await_count == 2

    newer = replace(rated, shot_id=1043)
    api.async_snapshot.return_value = replace(snapshot, last_shot=newer)
    assert (await coordinator._async_update_data()).shot_detail is None

    older = replace(snapshot, capabilities=snapshot.capabilities - {"last_shot_curve_v1"})
    api.async_snapshot.return_value = older
    assert (await coordinator._async_update_data()).shot_detail is None


async def test_store_keeps_the_row_across_restarts(hass) -> None:
    """The row is saved with the shot and restored without a controller read."""
    coordinator, api = _coordinator(hass)
    api.async_last_shot.return_value = _detail()
    await coordinator._async_update_data()
    stored = coordinator._storage_data()
    assert stored["shot_detail"] == _detail().to_dict()

    restored, api = _coordinator(hass)
    with patch.object(restored._store, "async_load", AsyncMock(return_value=stored)):
        await restored.async_load_store()
    await restored._async_update_data()
    api.async_last_shot.assert_not_awaited()

    corrupt = {**stored, "shot_detail": {"apiVersion": 1, "cols": "id", "shot": []}}
    with patch.object(restored._store, "async_load", AsyncMock(return_value=corrupt)):
        await restored.async_load_store()
    assert restored._stored_detail is None


async def test_presets_webhook_keeps_rules_then_reads_them(hass) -> None:
    """A presets webhook keeps the known rules and reads the new ones once."""
    coordinator, api = _coordinator(hass)
    payload = fixture("webhook_presets_changed_v1.json") | {"revision": 20}
    event = WebhookEvent.from_bytes(json.dumps(payload).encode())
    fresh = replace(coordinator.data.presets, revision=20)
    api.async_presets.return_value = fresh
    await coordinator.async_process_webhook(event)
    held = coordinator.data.presets
    assert held.revision == 20
    assert held.items[0].rule == coordinator_data().presets.items[0].rule
    await coordinator._presets_task
    assert coordinator.data.presets == fresh

    api.async_presets.side_effect = RuntimeError("offline")
    await coordinator._async_refresh_presets()
    assert coordinator.data.presets == fresh
    await coordinator.async_shutdown()


async def test_websocket_feed(hass, hass_ws_client) -> None:
    """Cards get the data now, on change, and a note when the entry unloads."""
    assert await async_setup_component(hass, "websocket_api", {})
    with patch("custom_components.open_brew_by_weight.async_register_cards"):
        assert await async_setup(hass, {})
    coordinator, _api = _coordinator(hass)
    coordinator.async_set_updated_data(
        replace(coordinator.data, shot_detail=_detail())
    )
    entry = config_entry()
    entry.add_to_hass(hass)
    entry.mock_state(hass, ConfigEntryState.LOADED)
    entry.runtime_data = MagicMock(coordinator=coordinator)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={(DOMAIN, "AA:BB:CC:DD:EE:FF")}
    )
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": f"{DOMAIN}/subscribe", "device_id": "nope"})
    assert (await client.receive_json())["error"]["code"] == "not_found"

    await client.send_json({"id": 2, "type": f"{DOMAIN}/subscribe", "device_id": device.id})
    assert (await client.receive_json())["success"]
    first = (await client.receive_json())["event"]
    assert first["activePresetId"] == 2 and "cutRampS" not in first
    assert first["presets"][0]["fastCurve"] == "even"
    assert first["presets"][0]["goalWeightG"] == 36.0
    assert first["lastShot"]["id"] == 1042

    coordinator.async_set_updated_data(coordinator.data)  # unchanged: nothing sent
    coordinator.async_set_updated_data(replace(coordinator.data, shot_detail=None))
    assert (await client.receive_json())["event"]["lastShot"] is None

    async_dispatcher_send(hass, SIGNAL_UNLOADED.format(entry.entry_id))
    assert (await client.receive_json())["event"] == {"unloaded": True}

    await client.send_json({"id": 3, "type": "unsubscribe_events", "subscription": 2})
    assert (await client.receive_json())["success"]
    await asyncio.sleep(0)
    await coordinator.async_shutdown()


async def test_cards_are_served_to_every_dashboard(hass) -> None:
    """The bundled module is served and loaded with a content-hash version."""
    assert CARDS_FILE.is_file()
    with patch("custom_components.open_brew_by_weight.cards.add_extra_js_url") as add:
        await async_register_cards(hass)  # headless: nothing to serve
    add.assert_not_called()
    hass.http = MagicMock(async_register_static_paths=AsyncMock())
    hass.config.components.add("frontend")
    with patch("custom_components.open_brew_by_weight.cards.add_extra_js_url") as add:
        await async_register_cards(hass)
    (config,) = hass.http.async_register_static_paths.await_args.args[0]
    assert (config.url_path, config.path, config.cache_headers) == (
        CARDS_URL,
        str(CARDS_FILE),
        True,
    )
    url = add.call_args.args[1]
    assert url.startswith(f"{CARDS_URL}?v=") and len(url) == len(CARDS_URL) + 15
