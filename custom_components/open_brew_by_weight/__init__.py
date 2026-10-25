"""Open Brew by Weight integration."""

from __future__ import annotations

import contextlib

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_TOKEN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.typing import ConfigType

from .api import ApiError, AuthRequired, OpenBrewByWeightApi, describe_error
from .const import (
    CONF_DEVICE_ID,
    CONF_WEBHOOK_ID,
    DOMAIN,
    PLATFORMS,
)
from .coordinator import OpenBrewByWeightCoordinator
from .entity import _configuration_url, _connections
from .models import DEFAULT_MANUFACTURER, DEFAULT_MODEL
from .runtime import OpenBrewByWeightRuntimeData, webhook_url
from .websocket import SIGNAL_UNLOADED
from .websocket import async_register as async_register_websocket

type OpenBrewByWeightConfigEntry = ConfigEntry[OpenBrewByWeightRuntimeData]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the card data commands."""
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: OpenBrewByWeightConfigEntry) -> bool:
    """Register the receiver before configuring the controller."""
    api = OpenBrewByWeightApi(
        async_get_clientsession(hass), entry.data[CONF_HOST], entry.data.get(CONF_TOKEN)
    )
    coordinator = OpenBrewByWeightCoordinator(hass, entry, entry.data[CONF_DEVICE_ID], api)
    await coordinator.async_load_store()
    webhook_id = entry.data[CONF_WEBHOOK_ID]
    callback_url = webhook_url(hass, webhook_id)
    runtime = OpenBrewByWeightRuntimeData(hass, api, coordinator, webhook_id, callback_url)
    previous: dict[str, object] | None = None
    runtime.async_register_webhook(webhook_id)
    step = "reading the webhook configuration"
    try:
        previous = await api.async_webhook_config()
        step = "configuring and verifying the callback"
        await runtime.async_configure_and_test(callback_url)
        step = "reading the initial state"
        await coordinator.async_config_entry_first_refresh()
    except Exception as err:
        runtime.async_unregister_webhook()
        if previous is not None:
            with contextlib.suppress(ApiError):
                await api.async_apply_webhook_config(previous)
        if isinstance(err, (AuthRequired, ConfigEntryAuthFailed)):
            raise ConfigEntryAuthFailed(f"Failed {step}: {describe_error(err)}") from err
        raise ConfigEntryNotReady(f"Failed {step}: {describe_error(err)}") from err

    entry.runtime_data = runtime
    registry = dr.async_get(hass)
    snapshot = coordinator.data.snapshot
    registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, snapshot.device_id)},
        name=snapshot.model or DEFAULT_MODEL,
        manufacturer=snapshot.manufacturer or DEFAULT_MANUFACTURER,
        model=snapshot.model or DEFAULT_MODEL,
        hw_version=snapshot.hardware_profile or None,
        sw_version=snapshot.firmware_version,
        configuration_url=_configuration_url(api.host, snapshot.mdns_host),
        connections=_connections(snapshot),
    )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: OpenBrewByWeightConfigEntry
) -> bool:
    """Unload entities and remove only the local receiver."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    await entry.runtime_data.coordinator.async_shutdown()
    entry.runtime_data.async_unregister_webhook()
    async_dispatcher_send(hass, SIGNAL_UNLOADED.format(entry.entry_id))
    return True


async def async_remove_entry(
    hass: HomeAssistant, entry: OpenBrewByWeightConfigEntry
) -> None:
    """Best-effort conditional callback cleanup."""
    api = OpenBrewByWeightApi(
        async_get_clientsession(hass), entry.data[CONF_HOST], entry.data.get(CONF_TOKEN)
    )
    owned_url = webhook_url(hass, entry.data[CONF_WEBHOOK_ID])
    current: dict[str, object] | None = None
    with contextlib.suppress(ApiError):
        current = await api.async_webhook_config()
    if current is not None and current.get("url") == owned_url:
        with contextlib.suppress(ApiError):
            await api.async_configure_webhook("", enabled=False)
