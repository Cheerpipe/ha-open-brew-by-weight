"""Stats charts from a companion that keeps the shot archive."""

from __future__ import annotations

import ssl
from dataclasses import replace
from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from aiohttp import ClientConnectorCertificateError, ClientError
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.open_brew_by_weight.api import (
    CannotConnect,
    CompanionUntrusted,
    OpenBrewByWeightApi,
)
from custom_components.open_brew_by_weight.const import COMPANION_RETRY_S, DOMAIN
from custom_components.open_brew_by_weight.coordinator import (
    OpenBrewByWeightCoordinator,
)
from custom_components.open_brew_by_weight.models import DeviceSnapshot, ProtocolError
from custom_components.open_brew_by_weight.repairs import async_create_fix_flow

from .helpers import api_mock, config_entry, coordinator_data, fixture
from .test_api import Request, Response, Session

PEM = "-----BEGIN CERTIFICATE-----\nAAAA\n-----END CERTIFICATE-----\n"
STATS = fixture("integration_stats.json")["stats"]


def test_snapshot_names_the_archive_companion() -> None:
    """The epoch and the companion's address are read; a bad address is refused."""
    payload = fixture("integration_snapshot.json")
    snapshot = DeviceSnapshot.from_dict(payload)
    assert (snapshot.shot_epoch, snapshot.companion_address) == (57, None)
    paired = DeviceSnapshot.from_dict({**payload, "companion": {"address": "192.168.1.20"}})
    assert paired.companion_address == "192.168.1.20"
    for broken in ({"address": "kitchen.local"}, {}, "192.168.1.20"):
        with pytest.raises(ProtocolError):
            DeviceSnapshot.from_dict({**payload, "companion": broken})
    old = {k: v for k, v in payload.items() if k not in ("shotEpoch", "companion")}
    assert DeviceSnapshot.from_dict(old).shot_epoch is None


async def test_api_reads_the_companion() -> None:
    """The authority comes in clear; the header over HTTPS with the integration's token."""
    session = Session(Response(200, PEM.encode()))
    api = OpenBrewByWeightApi(session, "controller", "a" * 32)
    assert await api.async_companion_ca("192.168.1.20") == PEM
    assert str(session.calls[0][0][1]) == "http://192.168.1.20/openbrewbyweight-ca.crt"
    for bad in (Response(404, PEM.encode()), Response(200, b"not a certificate")):
        with pytest.raises(ProtocolError):
            await OpenBrewByWeightApi(Session(bad), "c").async_companion_ca("192.168.1.20")

    context = object()
    session = Session(Response(200, {"stats": STATS, "good": 64, "epoch": 57}))
    api = OpenBrewByWeightApi(session, "controller", "a" * 32)
    assert await api.async_companion_stats("192.168.1.20", context, 500, 2, 57) == {
        "good": 64,
        "stats": STATS,
        "epoch": 57,
    }
    (method, url), kwargs = session.calls[0]
    assert (method, str(url)) == (
        "GET",
        "https://192.168.1.20/__companion/archive/stats?window=500&active=2&epoch=57",
    )
    assert kwargs["ssl"] is context
    assert kwargs["headers"]["Authorization"] == "Bearer " + "a" * 32
    with pytest.raises(ProtocolError):
        await OpenBrewByWeightApi(
            Session(Response(200, {"stats": [], "good": 1, "epoch": 1})), "c"
        ).async_companion_stats("192.168.1.20", context, 10, 0, 1)


class Failing:
    """A session whose every request raises."""

    def __init__(self, error: BaseException) -> None:
        self.error = error

    def request(self, *args, **kwargs) -> Request:
        raise self.error


async def test_api_tells_an_untrusted_companion_apart() -> None:
    """A certificate the pinned authority does not sign is not a network error."""
    untrusted = ClientConnectorCertificateError(MagicMock(), ssl.SSLCertVerificationError("x"))
    with pytest.raises(CompanionUntrusted):
        await OpenBrewByWeightApi(Failing(untrusted), "c").async_companion_stats(
            "192.168.1.20", None, 10, 0, 1
        )
    for call in ("async_companion_stats", "async_companion_ca"):
        api = OpenBrewByWeightApi(Failing(ClientError("down")), "c")
        args = ("192.168.1.20", None, 10, 0, 1) if call == "async_companion_stats" else ("x",)
        with pytest.raises(CannotConnect):
            await getattr(api, call)(*args)


def _coordinator(hass) -> tuple[OpenBrewByWeightCoordinator, MagicMock]:
    entry = config_entry()
    entry.add_to_hass(hass)
    api = api_mock()
    api.async_companion_ca = AsyncMock(return_value=PEM)
    api.async_companion_stats = AsyncMock(return_value={"good": 900, "stats": STATS, "epoch": 57})
    api.async_stats_charts.return_value = {"good": 64, "stats": STATS}
    coordinator = OpenBrewByWeightCoordinator(hass, entry, entry.data["device_id"], api)
    data = coordinator_data()
    snapshot = replace(data.snapshot, companion_address="192.168.1.20")
    coordinator.async_set_updated_data(replace(data, snapshot=snapshot))
    entry.runtime_data = MagicMock(coordinator=coordinator)
    return coordinator, api


@pytest.fixture(autouse=True)
def _contexts():
    with patch(
        "custom_components.open_brew_by_weight.coordinator.ssl.create_default_context",
        side_effect=lambda **kw: ("context", kw["cadata"]),
    ):
        yield


async def _read(hass, coordinator, window=500, preset=2):
    coordinator.stats_chart(window, preset)
    await hass.async_block_till_done()
    return coordinator.stats_chart(window, preset)


async def test_companion_answers_over_the_whole_history(hass) -> None:
    """The authority is trusted once and kept; the header comes from the companion."""
    coordinator, api = _coordinator(hass)
    assert await _read(hass, coordinator) == {"good": 900, "stats": STATS, "source": "companion"}
    api.async_companion_stats.assert_awaited_once_with(
        "192.168.1.20", ("context", PEM), 500, 2, 57
    )
    api.async_stats_charts.assert_not_awaited()
    assert coordinator._storage_data()["companion_ca"] == {"address": "192.168.1.20", "pem": PEM}

    moved = replace(coordinator.data.snapshot, shot_epoch=58)
    coordinator.async_set_updated_data(replace(coordinator.data, snapshot=moved))
    api.async_companion_stats.return_value = {"good": 901, "stats": STATS, "epoch": 58}
    assert (await _read(hass, coordinator))["good"] == 901
    api.async_companion_ca.assert_awaited_once()

    # The trusted authority survives a restart.
    restored, api2 = _coordinator(hass)
    with patch.object(
        restored._store, "async_load", AsyncMock(return_value=coordinator._storage_data())
    ):
        await restored.async_load_store()
    await _read(hass, restored)
    api2.async_companion_ca.assert_not_awaited()
    await coordinator.async_shutdown()
    await restored.async_shutdown()


async def test_companion_behind_is_asked_again(hass) -> None:
    """A copy still behind the controller shows, and is asked again shortly."""
    coordinator, api = _coordinator(hass)
    api.async_companion_stats.return_value = {"good": 899, "stats": STATS, "epoch": 56}
    assert (await _read(hass, coordinator))["good"] == 899
    api.async_companion_stats.return_value = {"good": 900, "stats": STATS, "epoch": 57}
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=COMPANION_RETRY_S + 1))
    await hass.async_block_till_done()
    assert (await _read(hass, coordinator))["good"] == 900
    assert api.async_companion_stats.await_count == 2
    await coordinator.async_shutdown()


async def test_controller_stands_in_for_the_companion(hass) -> None:
    """A companion that cannot answer leaves the controller's newest 100 shots."""
    coordinator, api = _coordinator(hass)
    api.async_companion_stats.side_effect = CannotConnect("down")
    assert await _read(hass, coordinator) == {"good": 64, "stats": STATS, "source": "controller"}
    api.async_stats_charts.assert_awaited_once_with(100, 2)

    # Without the controller's route either, nothing is held.
    coordinator._charts.clear()
    snapshot = coordinator.data.snapshot
    older = replace(snapshot, capabilities=snapshot.capabilities - {"stats_charts_v1"})
    coordinator.async_set_updated_data(replace(coordinator.data, snapshot=older))
    assert await _read(hass, coordinator) is None
    await coordinator.async_shutdown()


async def test_untrusted_companion_asks_to_trust_it_again(hass) -> None:
    """A changed certificate opens a repair; confirming it trusts the new authority."""
    coordinator, api = _coordinator(hass)
    await _read(hass, coordinator)
    api.async_companion_stats.side_effect = CompanionUntrusted("changed")
    moved = replace(coordinator.data.snapshot, shot_epoch=58)
    coordinator.async_set_updated_data(replace(coordinator.data, snapshot=moved))
    assert (await _read(hass, coordinator))["source"] == "controller"
    entry_id = coordinator.config_entry.entry_id
    issue = ir.async_get(hass).async_get_issue(DOMAIN, f"companion_untrusted_{entry_id}")
    assert issue is not None and issue.is_fixable

    flow = await async_create_fix_flow(hass, issue.issue_id, issue.data)
    flow.hass = hass
    flow.issue_id = issue.issue_id
    assert (await flow.async_step_init())["type"] == "form"
    assert (await flow.async_step_confirm({}))["type"] == "create_entry"
    assert coordinator._storage_data()["companion_ca"] is None
    api.async_companion_stats.side_effect = None
    api.async_companion_stats.return_value = {"good": 902, "stats": STATS, "epoch": 58}
    assert (await _read(hass, coordinator))["good"] == 902
    assert api.async_companion_ca.await_count == 2
    await coordinator.async_shutdown()
