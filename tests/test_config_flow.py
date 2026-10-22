"""Config-flow and reconfiguration tests."""

from __future__ import annotations

import asyncio
import json
from contextlib import contextmanager
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant import config_entries
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_TOKEN
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers.service_info.zeroconf import ZeroconfServiceInfo

from custom_components.open_brew_by_weight.api import (
    AuthRequired,
    CannotConnect,
    IncompatibleApi,
    RequestRejected,
)
from custom_components.open_brew_by_weight.const import (
    CONF_WEBHOOK_ID,
    DOMAIN,
)
from custom_components.open_brew_by_weight.models import ProtocolError
from custom_components.open_brew_by_weight.runtime import webhook_url

from .helpers import WEBHOOK_ID, api_mock, config_entry, coordinator_data, fixture

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")


def _configure_api(api: MagicMock, *, remote_url: str = "") -> None:
    api.async_snapshot = AsyncMock(return_value=coordinator_data().snapshot)
    api.async_webhook_config = AsyncMock(
        return_value={
            "enabled": bool(remote_url),
            "url": remote_url,
            "brewState": bool(remote_url),
            "firstDrop": bool(remote_url),
            "end": bool(remote_url),
            "presetChanges": bool(remote_url),
            "deferDuringShot": False,
        }
    )


async def _start(hass, api: MagicMock):
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            return_value="http://homeassistant.local/api/webhook/candidate",
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook.async_generate_id",
            return_value=WEBHOOK_ID,
        ),
    ):
        initial = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_USER}
        )
        assert initial["type"] is FlowResultType.FORM
        return await hass.config_entries.flow.async_configure(
            initial["flow_id"], {CONF_HOST: "controller.local"}
        )


async def test_user_flow_success_and_one_field(hass) -> None:
    """The initial form accepts only a host and creates one controller entry."""
    api = api_mock()
    _configure_api(api)
    result = await _start(hass, api)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_HOST] == "controller.local"
    assert result["data"][CONF_WEBHOOK_ID] == WEBHOOK_ID


@pytest.mark.parametrize(
    ("failure", "error"),
    [
        (CannotConnect(), "cannot_connect"),
        (IncompatibleApi(), "incompatible_api"),
        (RequestRejected("BAD_RESPONSE", 409), "cannot_connect"),
        (ProtocolError("bad response"), "cannot_connect"),
        (ValueError(), "invalid_host"),
    ],
)
async def test_user_flow_maps_errors(hass, failure, error: str) -> None:
    """Every setup failure is actionable."""
    api = api_mock()
    _configure_api(api)
    if isinstance(failure, ValueError):
        api.async_webhook_config.side_effect = failure
    else:
        api.async_snapshot.side_effect = failure
    result = await _start(hass, api)
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": error}


def test_callback_url_requires_plain_http(hass) -> None:
    """Only controller-reachable, credential-free HTTP callback URLs are allowed."""
    with patch(
        "custom_components.open_brew_by_weight.config_flow.webhook.async_generate_url",
        return_value="http://home.local/api/webhook/id",
    ) as generate:
        assert webhook_url(hass, WEBHOOK_ID).startswith("http://")
    assert generate.call_args.kwargs == {
        "allow_external": False,
        "allow_ip": True,
        "prefer_external": False,
    }
    for value in (
        "https://home.local/hook",
        "http://user:pass@home.local/hook",
        "/hook",
    ):
        with (
            patch(
                "custom_components.open_brew_by_weight.config_flow.webhook.async_generate_url",
                return_value=value,
            ),
            pytest.raises(ValueError),
        ):
            webhook_url(hass, WEBHOOK_ID)


async def test_duplicate_device_aborts(hass) -> None:
    """Stable device identity prevents duplicate entries."""
    existing = config_entry()
    existing.add_to_hass(hass)
    api = api_mock()
    _configure_api(api)
    result = await _start(hass, api)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_takeover_requires_confirmation(hass) -> None:
    """An existing destination is never silently overwritten."""
    api = api_mock()
    _configure_api(api, remote_url="http://other/receiver")
    result = await _start(hass, api)
    assert result["step_id"] == "takeover"
    rejected = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"confirm": False}
    )
    assert rejected["reason"] == "takeover_rejected"

    api = api_mock()
    _configure_api(api, remote_url="http://other/receiver")
    result = await _start(hass, api)
    accepted = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"confirm": True}
    )
    assert accepted["type"] is FlowResultType.CREATE_ENTRY


async def test_reconfigure_reapply_rotate_and_rollback(hass) -> None:
    """Reconfiguration tests before committing host or webhook changes."""
    entry = config_entry()
    entry.add_to_hass(hass)
    api = api_mock()
    _configure_api(api)
    runtime = MagicMock()
    runtime.api = api
    runtime.coordinator.api = api
    runtime.async_configure_and_test = AsyncMock()
    entry.runtime_data = runtime
    new_id = "replacement_webhook_id_with_32_chars_123"
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            side_effect=lambda _hass, value: f"http://home/api/webhook/{value}",
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={
                "source": config_entries.SOURCE_RECONFIGURE,
                "entry_id": entry.entry_id,
            },
        )
        assert result["description_placeholders"]["webhook_url"].endswith(WEBHOOK_ID)
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_HOST: "controller.local", CONF_WEBHOOK_ID: new_id}
        )
    assert result["type"] is FlowResultType.ABORT
    runtime.async_register_webhook.assert_called_once_with(new_id)
    runtime.async_unregister_webhook.assert_called_once_with(WEBHOOK_ID)
    assert entry.data[CONF_WEBHOOK_ID] == new_id
    runtime.async_configure_and_test.assert_awaited_with(
        f"http://home/api/webhook/{new_id}", api
    )

    runtime.async_configure_and_test.side_effect = RuntimeError
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            side_effect=lambda _hass, value: f"http://home/api/webhook/{value}",
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={
                "source": config_entries.SOURCE_RECONFIGURE,
                "entry_id": entry.entry_id,
            },
            data={CONF_HOST: "controller.local", CONF_WEBHOOK_ID: WEBHOOK_ID},
        )
    assert result["type"] is FlowResultType.FORM


async def test_reconfigure_double_failure_retains_candidate_receiver(hass) -> None:
    entry = config_entry()
    entry.add_to_hass(hass)
    old_api = api_mock()
    candidate_api = api_mock()
    candidate_api.async_apply_webhook_config.side_effect = ProtocolError("rollback")
    runtime = MagicMock()
    runtime.api = old_api
    runtime.coordinator.api = old_api
    runtime.async_configure_and_test = AsyncMock(side_effect=RuntimeError("test"))
    entry.runtime_data = runtime
    candidate = "candidate_webhook_id_with_32_chars_1234"
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=candidate_api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            side_effect=lambda _hass, value: f"http://home/{value}",
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.async_create_webhook_repair"
        ) as repair,
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={
                "source": config_entries.SOURCE_RECONFIGURE,
                "entry_id": entry.entry_id,
            },
            data={CONF_HOST: "new.local", CONF_WEBHOOK_ID: candidate},
        )
    assert result["type"] is FlowResultType.FORM
    runtime.async_register_webhook.assert_called_once_with(candidate)
    runtime.async_unregister_webhook.assert_not_called()
    assert runtime.api is old_api
    assert runtime.coordinator.api is old_api
    repair.assert_called_once_with(hass, entry.entry_id)


async def test_reconfigure_collision_preserves_runtime_and_identity_abort(hass) -> None:
    entry = config_entry()
    entry.add_to_hass(hass)
    api = api_mock()
    runtime = MagicMock()
    runtime.api = runtime.coordinator.api = api
    runtime.async_register_webhook.side_effect = ValueError("registered")
    entry.runtime_data = runtime
    candidate = "candidate_webhook_id_with_32_chars_1234"
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            side_effect=lambda _hass, value: f"http://home/{value}",
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": config_entries.SOURCE_RECONFIGURE, "entry_id": entry.entry_id},
            data={CONF_HOST: "new.local", CONF_WEBHOOK_ID: candidate},
        )
    assert result["errors"] == {"base": "invalid_webhook_id"}
    assert runtime.api is api

    different = coordinator_data().snapshot.__class__.from_dict(
        {**fixture("integration_snapshot.json"), "deviceId": "11:22:33:44:55:66"}
    )
    api.async_snapshot.return_value = different
    runtime.async_register_webhook.side_effect = None
    with (
        patch("custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi", return_value=api),
        patch("custom_components.open_brew_by_weight.config_flow.webhook_url", side_effect=lambda _hass, value: f"http://home/{value}"),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": config_entries.SOURCE_RECONFIGURE, "entry_id": entry.entry_id},
            data={CONF_HOST: "new.local", CONF_WEBHOOK_ID: candidate},
        )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "unique_id_mismatch"


@pytest.mark.parametrize(
    "candidate", ["short", "contains spaces and is still invalid________"]
)
async def test_reconfigure_rejects_weak_ids(hass, candidate: str) -> None:
    """Only bounded URL-safe webhook IDs are accepted."""
    entry = config_entry()
    entry.add_to_hass(hass)
    entry.runtime_data = MagicMock()
    with patch(
        "custom_components.open_brew_by_weight.config_flow.webhook_url",
        side_effect=lambda _hass, value: f"http://home/{value}",
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={
                "source": config_entries.SOURCE_RECONFIGURE,
                "entry_id": entry.entry_id,
            },
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_HOST: "controller.local", CONF_WEBHOOK_ID: candidate}
        )
    assert result["errors"] == {"base": "invalid_webhook_id"}


async def test_reconfigure_maps_protocol_error(hass) -> None:
    """Malformed controller responses are not reported as invalid webhook IDs."""
    entry = config_entry()
    entry.add_to_hass(hass)
    entry.runtime_data = MagicMock()
    api = api_mock()
    api.async_snapshot.side_effect = ProtocolError("bad response")
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            side_effect=lambda _hass, value: f"http://home/{value}",
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={
                "source": config_entries.SOURCE_RECONFIGURE,
                "entry_id": entry.entry_id,
            },
            data={CONF_HOST: "controller.local", CONF_WEBHOOK_ID: WEBHOOK_ID},
        )
    assert result["errors"] == {"base": "reconfigure_failed"}


def _discovery_info(host: str = "192.168.1.8", port: int = 80) -> ZeroconfServiceInfo:
    return ZeroconfServiceInfo(
        ip_address=host,
        ip_addresses=[host],
        port=port,
        hostname="controller.local.",
        name="Cafe Bar 2._http._tcp.local.",
        type="_http._tcp.local.",
        properties={"obbw": "1"},
    )


@contextmanager
def _discovery_patches(api: MagicMock):
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            return_value="http://homeassistant.local/api/webhook/candidate",
        ),
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook.async_generate_id",
            return_value=WEBHOOK_ID,
        ),
    ):
        yield


async def _discover(hass, api: MagicMock):
    with _discovery_patches(api):
        return await hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": config_entries.SOURCE_ZEROCONF},
            data=_discovery_info(),
        )


async def _confirm(hass, api: MagicMock, result, user_input):
    with _discovery_patches(api):
        return await hass.config_entries.flow.async_configure(result["flow_id"], user_input)


async def test_zeroconf_flow_creates_entry(hass) -> None:
    """A discovered controller is confirmed once, then set up like the user flow."""
    api = api_mock()
    _configure_api(api)
    result = await _discover(hass, api)
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "confirm"
    assert result["description_placeholders"]["name"] == "Cafe Bar 2"
    result = await _confirm(hass, api, result, {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_HOST] == "192.168.1.8"
    assert result["data"][CONF_WEBHOOK_ID] == WEBHOOK_ID


async def test_zeroconf_flow_updates_existing_entry_host(hass) -> None:
    """Rediscovery of a configured controller refreshes its address (discovery-update-info)."""
    existing = config_entry()
    existing.add_to_hass(hass)
    api = api_mock()
    _configure_api(api)
    result = await _discover(hass, api)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
    assert existing.data[CONF_HOST] == "192.168.1.8"


async def test_zeroconf_flow_takeover_still_requires_confirmation(hass) -> None:
    """Discovery never silently replaces another webhook destination."""
    api = api_mock()
    _configure_api(api, remote_url="http://other/receiver")
    result = await _discover(hass, api)
    assert result["step_id"] == "confirm"
    result = await _confirm(hass, api, result, {})
    assert result["step_id"] == "takeover"
    rejected = await _confirm(hass, api, result, {"confirm": False})
    assert rejected["reason"] == "takeover_rejected"

    api = api_mock()
    _configure_api(api, remote_url="http://other/receiver")
    result = await _discover(hass, api)
    result = await _confirm(hass, api, result, {})
    accepted = await _confirm(hass, api, result, {"confirm": True})
    assert accepted["type"] is FlowResultType.CREATE_ENTRY


@pytest.mark.parametrize(
    ("failure", "reason"),
    [
        (CannotConnect(), "cannot_connect"),
        (IncompatibleApi(), "incompatible_api"),
        (ProtocolError("bad response"), "cannot_connect"),
    ],
)
async def test_zeroconf_flow_unreachable_aborts(
    hass, failure, reason: str
) -> None:
    """A controller that fails identity probing is not offered for setup."""
    api = api_mock()
    _configure_api(api)
    api.async_snapshot.side_effect = failure
    result = await _discover(hass, api)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == reason


async def test_zeroconf_flow_confirm_retries_after_transient_failure(hass) -> None:
    """Confirm keeps the form with an error when the second probe fails once."""
    api = api_mock()
    _configure_api(api)
    result = await _discover(hass, api)
    api.async_snapshot.side_effect = CannotConnect()
    result = await _confirm(hass, api, result, {})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "confirm"
    assert result["errors"] == {"base": "cannot_connect"}


TOKEN = "0123456789abcdef0123456789abcdef"
OLD_TOKEN = "ffffffffffffffffffffffffffffffff"


def _auth_api() -> MagicMock:
    """A controller with its Web UI login on and a pairing request still open."""
    api = api_mock()
    _configure_api(api)
    api.async_auth_required.return_value = True
    api.async_start_pairing.return_value = (7, "4821", 120)
    api.async_pairing_state.return_value = ("pending", None)
    api.async_exchange_password.return_value = TOKEN
    return api


async def _auth_form(hass, api: MagicMock):
    with _discovery_patches(api):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_USER}
        )
        return await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_HOST: "controller.local"}
        )


def _pairing_task(hass, result) -> asyncio.Task:
    return hass.config_entries.flow._progress[result["flow_id"]]._pairing


async def test_auth_password_stores_only_the_token(hass) -> None:
    """The device password is exchanged once and never kept."""
    api = _auth_api()
    result = await _auth_form(hass, api)
    assert result["step_id"] == "auth"
    assert result["description_placeholders"] == {"code": "4821"}
    pairing = _pairing_task(hass, result)
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "secret-password"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    api.async_exchange_password.assert_awaited_once_with("secret-password")
    assert result["data"][CONF_TOKEN] == TOKEN
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    assert "secret-password" not in json.dumps({**entry.data, **entry.options})
    await asyncio.sleep(0)
    assert pairing.cancelled()


async def test_auth_approved_pairing_wins_over_password(hass) -> None:
    """A pairing approved in the Web UI is used without sending the password."""
    api = _auth_api()
    api.async_pairing_state.return_value = ("approved", TOKEN)
    result = await _auth_form(hass, api)
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "typed anyway"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_TOKEN] == TOKEN
    api.async_exchange_password.assert_not_awaited()


async def test_auth_pairing_poll_survives_a_dropped_request(hass) -> None:
    """Polling keeps going through a transient failure until approval."""
    api = _auth_api()
    api.async_pairing_state.side_effect = [
        CannotConnect(),
        ("pending", None),
        ("approved", TOKEN),
    ]
    with patch(
        "custom_components.open_brew_by_weight.config_flow.PAIRING_POLL_INTERVAL", 0
    ):
        result = await _auth_form(hass, api)
        await hass.async_block_till_done(wait_background_tasks=True)
    result = await _confirm(hass, api, result, {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_TOKEN] == TOKEN
    api.async_pairing_state.assert_awaited_with(7)


async def test_auth_pending_pairing_and_flow_abort(hass) -> None:
    """Submitting before approval explains why; closing the flow stops polling."""
    api = _auth_api()
    result = await _auth_form(hass, api)
    pairing = _pairing_task(hass, result)
    result = await _confirm(hass, api, result, {})
    assert result["errors"] == {"base": "pairing_pending"}
    api.async_start_pairing.assert_awaited_once()
    hass.config_entries.flow.async_abort(result["flow_id"])
    await asyncio.sleep(0)
    assert pairing.cancelled()


@pytest.mark.parametrize(
    ("poll", "error"),
    [
        (("denied", None), "pairing_denied"),
        (("expired", None), "pairing_expired"),
        (("unknown", None), "pairing_expired"),
        (ProtocolError("bad"), "pairing_expired"),
    ],
)
async def test_auth_finished_pairing_without_token(hass, poll, error: str) -> None:
    """A denied or lapsed request is reported and a new one is opened."""
    api = _auth_api()
    if isinstance(poll, Exception):
        api.async_pairing_state.side_effect = poll
    else:
        api.async_pairing_state.return_value = poll
    result = await _auth_form(hass, api)
    result = await _confirm(hass, api, result, {})
    assert result["errors"] == {"base": error}
    assert api.async_start_pairing.await_count == 2
    hass.config_entries.flow.async_abort(result["flow_id"])


@pytest.mark.parametrize(
    ("failure", "error"),
    [
        (RequestRejected("DEVICE_PASSWORD_INVALID", 401), "invalid_password"),
        (RequestRejected("INVALID_REQUEST", 400), "invalid_password"),
        (RequestRejected("AUTH_COOLDOWN", 429), "auth_cooldown"),
        (RequestRejected("PERSISTENCE_FAILED", 500), "cannot_connect"),
        (CannotConnect(), "cannot_connect"),
    ],
)
async def test_auth_password_errors_keep_pairing_open(
    hass, failure, error: str
) -> None:
    api = _auth_api()
    api.async_exchange_password.side_effect = failure
    result = await _auth_form(hass, api)
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "wrong"})
    assert result["errors"] == {"base": error}
    assert result["description_placeholders"] == {"code": "4821"}
    api.async_start_pairing.assert_awaited_once()
    hass.config_entries.flow.async_abort(result["flow_id"])


async def test_auth_busy_pairing_retries_on_submit(hass) -> None:
    """Another open request is reported until a new one can start."""
    api = _auth_api()
    busy = RequestRejected("PAIRING_BUSY", 429)
    api.async_start_pairing.side_effect = [busy, busy, (9, "1357", 120)]
    result = await _auth_form(hass, api)
    assert result["errors"] == {"base": "pairing_busy"}
    assert result["description_placeholders"] == {"code": "----"}
    result = await _confirm(hass, api, result, {})
    assert result["errors"] == {"base": "pairing_busy"}
    result = await _confirm(hass, api, result, {})
    assert result["errors"] == {}
    assert result["description_placeholders"] == {"code": "1357"}
    hass.config_entries.flow.async_abort(result["flow_id"])


async def test_auth_start_maps_transport_failure(hass) -> None:
    api = _auth_api()
    api.async_start_pairing.side_effect = CannotConnect()
    result = await _auth_form(hass, api)
    assert result["errors"] == {"base": "cannot_connect"}


@pytest.mark.parametrize("turned_off_at", ["pairing", "password"])
async def test_auth_login_turned_off_meanwhile(hass, turned_off_at: str) -> None:
    """AUTH_NOT_REQUIRED continues setup without a token."""
    api = _auth_api()
    api.async_auth_required.side_effect = [True, False]
    if turned_off_at == "pairing":
        api.async_start_pairing.return_value = None
        result = await _auth_form(hass, api)
    else:
        api.async_exchange_password.return_value = None
        result = await _auth_form(hass, api)
        result = await _confirm(hass, api, result, {CONF_PASSWORD: "pw"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert CONF_TOKEN not in result["data"]


async def test_auth_new_token_is_handed_to_the_existing_entry(hass) -> None:
    """Connecting again replaces the controller's single token, so keep it."""
    existing = config_entry(token=OLD_TOKEN)
    existing.add_to_hass(hass)
    api = _auth_api()
    result = await _auth_form(hass, api)
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "pw"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
    assert existing.data[CONF_TOKEN] == TOKEN


async def test_zeroconf_with_login_on(hass) -> None:
    """Discovery cannot read identity without a token, so it matches the address."""
    existing = config_entry(host="192.168.1.8")
    existing.add_to_hass(hass)
    api = _auth_api()
    result = await _discover(hass, api)
    assert result["reason"] == "already_configured"
    api.async_snapshot.assert_not_awaited()

    hass.config_entries.async_update_entry(
        existing, data={**existing.data, CONF_HOST: "10.0.0.2"}
    )
    result = await _discover(hass, api)
    assert result["step_id"] == "confirm"
    result = await _confirm(hass, api, result, {})
    assert result["step_id"] == "auth"
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "pw"})
    assert result["reason"] == "already_configured"
    assert existing.data[CONF_HOST] == "192.168.1.8"
    assert existing.data[CONF_TOKEN] == TOKEN


async def _reauth(hass, entry, api: MagicMock):
    with _discovery_patches(api):
        return await entry.start_reauth_flow(hass)


async def test_reauth_replaces_the_token(hass) -> None:
    """Reauthentication waits for the user, then offers both ways again."""
    entry = config_entry(token=OLD_TOKEN)
    entry.add_to_hass(hass)
    api = _auth_api()
    result = await _reauth(hass, entry, api)
    assert result["step_id"] == "reauth_confirm"
    api.async_start_pairing.assert_not_awaited()
    result = await _confirm(hass, api, result, {})
    assert result["step_id"] == "auth"
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "secret-password"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert entry.data[CONF_TOKEN] == TOKEN
    assert "secret-password" not in json.dumps(dict(entry.data))


async def test_reauth_after_login_turned_off_drops_the_token(hass) -> None:
    entry = config_entry(token=OLD_TOKEN)
    entry.add_to_hass(hass)
    api = _auth_api()
    api.async_start_pairing.return_value = None
    result = await _reauth(hass, entry, api)
    result = await _confirm(hass, api, result, {})
    assert result["reason"] == "reauth_successful"
    assert CONF_TOKEN not in entry.data


async def test_reauth_refuses_another_controller(hass) -> None:
    entry = config_entry(token=OLD_TOKEN)
    entry.add_to_hass(hass)
    api = _auth_api()
    api.async_snapshot.return_value = coordinator_data().snapshot.__class__.from_dict(
        {**fixture("integration_snapshot.json"), "deviceId": "11:22:33:44:55:66"}
    )
    result = await _reauth(hass, entry, api)
    result = await _confirm(hass, api, result, {})
    result = await _confirm(hass, api, result, {CONF_PASSWORD: "pw"})
    assert result["reason"] == "unique_id_mismatch"
    assert entry.data[CONF_TOKEN] == OLD_TOKEN


async def test_reconfigure_reports_revoked_token(hass) -> None:
    entry = config_entry(token=OLD_TOKEN)
    entry.add_to_hass(hass)
    entry.runtime_data = MagicMock()
    api = api_mock()
    api.async_snapshot.side_effect = AuthRequired("INTEGRATION_AUTH_REQUIRED", 401)
    with (
        patch(
            "custom_components.open_brew_by_weight.config_flow.OpenBrewByWeightApi",
            return_value=api,
        ) as factory,
        patch(
            "custom_components.open_brew_by_weight.config_flow.webhook_url",
            side_effect=lambda _hass, value: f"http://home/{value}",
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN,
            context={
                "source": config_entries.SOURCE_RECONFIGURE,
                "entry_id": entry.entry_id,
            },
            data={CONF_HOST: "controller.local", CONF_WEBHOOK_ID: WEBHOOK_ID},
        )
    assert result["errors"] == {"base": "auth_required"}
    assert factory.call_args.args[2] == OLD_TOKEN
