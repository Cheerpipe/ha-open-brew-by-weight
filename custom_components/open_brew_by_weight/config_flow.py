"""Configuration and reconfiguration flows."""

from __future__ import annotations

import asyncio
import contextlib
import logging
from collections.abc import Mapping
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.components import webhook
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_TOKEN
from homeassistant.core import callback
from homeassistant.data_entry_flow import AbortFlow
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)
from homeassistant.helpers.service_info.zeroconf import ZeroconfServiceInfo

from .api import (
    ApiError,
    AuthRequired,
    CannotConnect,
    IncompatibleApi,
    OpenBrewByWeightApi,
    RequestRejected,
    describe_error,
    normalize_host,
)
from .const import (
    CONF_DEVICE_ID,
    CONF_WEBHOOK_ID,
    DOMAIN,
    PAIRING_POLL_INTERVAL,
    WEBHOOK_ID_PATTERN,
)
from .models import ProtocolError
from .repairs import async_create_webhook_repair
from .runtime import webhook_url

MDNS_SERVICE_SUFFIX = "._http._tcp.local."
AUTH_ERRORS = {
    "DEVICE_PASSWORD_INVALID": "invalid_password",
    "INVALID_REQUEST": "invalid_password",
    "AUTH_COOLDOWN": "auth_cooldown",
    "PAIRING_BUSY": "pairing_busy",
}
AUTH_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_PASSWORD): TextSelector(
            TextSelectorConfig(type=TextSelectorType.PASSWORD)
        )
    }
)
_LOGGER = logging.getLogger(__package__)


class PairingUnfinished(Exception):
    """No pairing token yet; the message is the error key suffix."""


def _auth_error(err: Exception) -> str:
    """Map an access failure to its form error key."""
    if isinstance(err, PairingUnfinished):
        return f"pairing_{err}"
    if isinstance(err, IncompatibleApi):
        return "incompatible_api"
    if isinstance(err, RequestRejected):
        return AUTH_ERRORS.get(err.code, "cannot_connect")
    return "cannot_connect"


class OpenBrewByWeightConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure a controller from its LAN address."""

    VERSION = 1
    MINOR_VERSION = 1

    def __init__(self) -> None:
        self._pending: dict[str, Any] | None = None
        self._discovered_host: str | None = None
        self._discovered_name: str | None = None
        self._host: str | None = None
        self._token: str | None = None
        self._pairing: asyncio.Task[tuple[str, str | None]] | None = None
        self._pairing_code: str | None = None

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Accept exactly one user field: the controller host."""
        if user_input is None:
            return self.async_show_form(
                step_id="user", data_schema=vol.Schema({vol.Required(CONF_HOST): str})
            )
        errors: dict[str, str] = {}
        try:
            host = normalize_host(user_input[CONF_HOST])
            return await self._prepare_entry(host)
        except CannotConnect:
            errors["base"] = "cannot_connect"
        except IncompatibleApi:
            errors["base"] = "incompatible_api"
        except (ApiError, ProtocolError):
            errors["base"] = "cannot_connect"
        except ValueError:
            errors["base"] = "invalid_host"
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {vol.Required(CONF_HOST, default=user_input[CONF_HOST]): str}
            ),
            errors=errors,
        )

    async def async_step_zeroconf(
        self, discovery_info: ZeroconfServiceInfo
    ) -> config_entries.ConfigFlowResult:
        """Identify a controller announced over mDNS and ask for confirmation."""
        host = discovery_info.host
        if discovery_info.port not in (None, 80):
            host = f"{host}:{discovery_info.port}"
        name = discovery_info.name
        if name.endswith(MDNS_SERVICE_SUFFIX):
            name = name[: -len(MDNS_SERVICE_SUFFIX)]
        api = OpenBrewByWeightApi(async_get_clientsession(self.hass), host)
        try:
            snapshot = (
                None if await api.async_auth_required() else await api.async_snapshot()
            )
        except IncompatibleApi:
            return self.async_abort(reason="incompatible_api")
        except (ApiError, ProtocolError):
            return self.async_abort(reason="cannot_connect")
        if snapshot is None:
            # Identity needs a token here, so match a configured address instead.
            self._async_abort_entries_match({CONF_HOST: host})
        else:
            await self.async_set_unique_id(snapshot.device_id)
            self._abort_if_unique_id_configured(updates={CONF_HOST: host})
        self._discovered_host = host
        self._discovered_name = name
        return await self.async_step_confirm()

    async def async_step_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Confirm adding the discovered controller."""
        assert self._discovered_host is not None
        if user_input is None:
            return self.async_show_form(
                step_id="confirm",
                description_placeholders={"name": self._discovered_name or ""},
            )
        errors: dict[str, str] = {}
        try:
            return await self._prepare_entry(self._discovered_host)
        except IncompatibleApi:
            errors["base"] = "incompatible_api"
        except (ApiError, ProtocolError):
            errors["base"] = "cannot_connect"
        return self.async_show_form(
            step_id="confirm",
            errors=errors,
            description_placeholders={"name": self._discovered_name or ""},
        )

    async def _prepare_entry(
        self, host: str
    ) -> config_entries.ConfigFlowResult:
        """Identify the controller and stage the webhook configuration."""
        api = OpenBrewByWeightApi(async_get_clientsession(self.hass), host, self._token)
        if self._token is None and await api.async_auth_required():
            self._host = host
            return await self.async_step_auth()
        snapshot = await api.async_snapshot()
        await self.async_set_unique_id(snapshot.device_id)
        # A new token replaces the one an existing entry holds, so hand it over.
        self._abort_if_unique_id_configured(
            updates=None
            if self._token is None
            else {CONF_HOST: host, CONF_TOKEN: self._token}
        )
        webhook_id = webhook.async_generate_id()
        callback = webhook_url(self.hass, webhook_id)
        existing = await api.async_webhook_config()
        self._pending = {
            CONF_HOST: host,
            CONF_DEVICE_ID: snapshot.device_id,
            CONF_WEBHOOK_ID: webhook_id,
            "callback": callback,
            "title": self._discovered_name or "Open Brew by Weight",
            "takeover": bool(
                existing.get("enabled") and existing.get("url") != callback
            ),
        }
        if self._pending["takeover"]:
            return await self.async_step_takeover()
        return self._create_pending_entry()

    async def async_step_auth(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Offer the device password and a Web UI pairing side by side."""
        assert self._host is not None
        api = OpenBrewByWeightApi(async_get_clientsession(self.hass), self._host)
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                return await self._async_authorized(
                    await self._async_token(api, user_input.get(CONF_PASSWORD, ""))
                )
            except (ApiError, ProtocolError, PairingUnfinished) as err:
                errors["base"] = _auth_error(err)
        if self._pairing is None:
            try:
                if not await self._async_start_pairing(api):
                    return await self._async_authorized(None)
                if errors.get("base") == "pairing_busy":
                    del errors["base"]
            except (ApiError, ProtocolError) as err:
                errors.setdefault("base", _auth_error(err))
        return self.async_show_form(
            step_id="auth",
            data_schema=AUTH_SCHEMA,
            errors=errors,
            description_placeholders={"code": self._pairing_code or "----"},
        )

    async def _async_start_pairing(self, api: OpenBrewByWeightApi) -> bool:
        """Open a pairing request and poll it; False when no token is needed."""
        if (pairing := await api.async_start_pairing()) is None:
            return False
        pairing_id, self._pairing_code, expires = pairing
        self._pairing = self.hass.async_create_background_task(
            self._async_poll_pairing(api, pairing_id, expires), f"{DOMAIN} pairing"
        )
        return True

    @staticmethod
    async def _async_poll_pairing(
        api: OpenBrewByWeightApi, pairing_id: int, expires: int
    ) -> tuple[str, str | None]:
        """Collect the token the moment the Web UI approves; it is offered once."""
        async with asyncio.timeout(expires + 10):
            while True:
                with contextlib.suppress(CannotConnect):
                    state, token = await api.async_pairing_state(pairing_id)
                    if state != "pending":
                        return state, token
                await asyncio.sleep(PAIRING_POLL_INTERVAL)

    async def _async_token(
        self, api: OpenBrewByWeightApi, password: str
    ) -> str | None:
        """Take whichever token arrived first: an approved pairing or the password."""
        pairing = self._pairing
        if pairing is not None and pairing.done():
            self._pairing = self._pairing_code = None
            try:
                state, token = pairing.result()
            except (ApiError, ProtocolError, TimeoutError):
                state, token = "expired", None
            if token is not None:
                return token
            if not password:
                raise PairingUnfinished("denied" if state == "denied" else "expired")
        if password:
            return await api.async_exchange_password(password)
        raise PairingUnfinished("pending" if self._pairing else "busy")

    async def _async_authorized(
        self, token: str | None
    ) -> config_entries.ConfigFlowResult:
        """Continue setup, or finish reauthentication, with the new token."""
        assert self._host is not None
        self._token = token
        if self.source != config_entries.SOURCE_REAUTH:
            return await self._prepare_entry(self._host)
        entry = self._get_reauth_entry()
        snapshot = await OpenBrewByWeightApi(
            async_get_clientsession(self.hass), self._host, token
        ).async_snapshot()
        await self.async_set_unique_id(snapshot.device_id)
        self._abort_if_unique_id_mismatch()
        data = {key: value for key, value in entry.data.items() if key != CONF_TOKEN}
        return self.async_update_reload_and_abort(
            entry, data=data if token is None else {**data, CONF_TOKEN: token}
        )

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> config_entries.ConfigFlowResult:
        """The controller rejected the stored token."""
        self._host = entry_data[CONF_HOST]
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Wait for the user before opening a pairing request that expires."""
        if user_input is None:
            return self.async_show_form(step_id="reauth_confirm")
        return await self.async_step_auth()

    @callback
    def async_remove(self) -> None:
        """Stop polling a pairing request when the flow ends."""
        if self._pairing is not None:
            self._pairing.cancel()

    async def async_step_takeover(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Require explicit consent before replacing another callback."""
        if user_input is None:
            return self.async_show_form(
                step_id="takeover",
                data_schema=vol.Schema({vol.Required("confirm", default=False): bool}),
            )
        if not user_input["confirm"]:
            return self.async_abort(reason="takeover_rejected")
        return self._create_pending_entry()

    def _create_pending_entry(self) -> config_entries.ConfigFlowResult:
        assert self._pending is not None
        data = {
            key: self._pending[key]
            for key in (
                CONF_HOST,
                CONF_DEVICE_ID,
                CONF_WEBHOOK_ID,
            )
        }
        if self._token is not None:
            data[CONF_TOKEN] = self._token
        return self.async_create_entry(
            title=str(self._pending["title"]), data=data
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Rotate/reapply the callback as one verified transaction."""
        entry = self._get_reconfigure_entry()
        current_id = entry.data[CONF_WEBHOOK_ID]
        if user_input is None:
            return self.async_show_form(
                step_id="reconfigure",
                data_schema=vol.Schema(
                    {
                        vol.Required(CONF_HOST, default=entry.data[CONF_HOST]): str,
                        vol.Required(CONF_WEBHOOK_ID, default=current_id): str,
                    }
                ),
                description_placeholders={
                    "webhook_url": webhook_url(self.hass, current_id)
                },
            )
        host = user_input[CONF_HOST]
        candidate_id = user_input[CONF_WEBHOOK_ID]
        errors: dict[str, str] = {}
        try:
            host = normalize_host(host)
            if not WEBHOOK_ID_PATTERN.fullmatch(candidate_id):
                raise ValueError("weak webhook ID")
            if any(
                other.entry_id != entry.entry_id
                and other.data.get(CONF_WEBHOOK_ID) == candidate_id
                for other in self._async_current_entries()
            ):
                raise ValueError("webhook ID collision")
            runtime = entry.runtime_data
            api = OpenBrewByWeightApi(
                async_get_clientsession(self.hass), host, entry.data.get(CONF_TOKEN)
            )
            snapshot = await api.async_snapshot()
            await self.async_set_unique_id(snapshot.device_id)
            self._abort_if_unique_id_mismatch()
            candidate_url = webhook_url(self.hass, candidate_id)
            previous = await api.async_webhook_config()
            registered_candidate = False
            try:
                if candidate_id != current_id:
                    runtime.async_register_webhook(candidate_id)
                    registered_candidate = True
                await runtime.async_configure_and_test(candidate_url, api)
            except Exception:
                try:
                    await api.async_apply_webhook_config(previous)
                except (ApiError, ProtocolError, TimeoutError):
                    async_create_webhook_repair(self.hass, entry.entry_id)
                else:
                    if registered_candidate:
                        runtime.async_unregister_webhook(candidate_id)
                raise
            runtime.api = runtime.coordinator.api = api
            if candidate_id != current_id:
                runtime.async_unregister_webhook(current_id)
            runtime.webhook_id, runtime.webhook_url = candidate_id, candidate_url
            return self.async_update_reload_and_abort(
                entry,
                data_updates={CONF_HOST: host, CONF_WEBHOOK_ID: candidate_id},
            )
        except CannotConnect:
            errors["base"] = "cannot_connect"
        except AuthRequired:
            errors["base"] = "auth_required"
        except (ApiError, ProtocolError, TimeoutError) as err:
            _LOGGER.warning("Reconfiguration failed: %s", describe_error(err))
            errors["base"] = "reconfigure_failed"
        except ValueError:
            errors["base"] = "invalid_webhook_id"
        except AbortFlow:
            raise
        except Exception:
            _LOGGER.exception("Unexpected reconfiguration failure")
            errors["base"] = "reconfigure_failed"
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST, default=host): str,
                    vol.Required(CONF_WEBHOOK_ID, default=candidate_id): str,
                }
            ),
            errors=errors,
            description_placeholders={
                "webhook_url": webhook_url(
                    self.hass,
                    candidate_id
                    if WEBHOOK_ID_PATTERN.fullmatch(candidate_id)
                    else current_id,
                )
            },
        )
