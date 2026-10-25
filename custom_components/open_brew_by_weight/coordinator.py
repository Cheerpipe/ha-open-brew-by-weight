"""Push-first state coordinator for Open Brew by Weight."""

from __future__ import annotations

import asyncio
from collections import deque
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, replace
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import AuthRequired, CannotConnect, OpenBrewByWeightApi
from .const import (
    DOMAIN,
    QUICK_SETTINGS_COALESCE_S,
    RECOVERY_DELAYS,
    STORE_KEY_PREFIX,
    STORE_VERSION,
)
from .models import (
    DeviceSnapshot,
    LastActivation,
    PresetState,
    ProtocolError,
    QuickSettings,
    Shot,
    ShotDetail,
    ShotStats,
    WebhookEvent,
)


@dataclass(frozen=True, slots=True)
class CoordinatorData:
    """State shared by every entity."""

    snapshot: DeviceSnapshot
    presets: PresetState
    last_shot: Shot | None
    last_activation: LastActivation | None = None
    stats: ShotStats | None = None
    shot_detail: ShotDetail | None = None


class OpenBrewByWeightCoordinator(DataUpdateCoordinator[CoordinatorData]):
    """Reconcile REST snapshots and validated webhook pushes."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        device_id: str,
        api: OpenBrewByWeightApi,
    ) -> None:
        super().__init__(
            hass,
            logger=__import__("logging").getLogger(__name__),
            config_entry=entry,
            name=DOMAIN,
        )
        self.api = api
        self.device_id = device_id
        self.command_lock = asyncio.Lock()
        self._quick_changes: dict[str, bool | str] = {}
        self._quick_batch: asyncio.Task[None] | None = None
        self._store = Store[dict[str, Any]](
            hass, STORE_VERSION, f"{STORE_KEY_PREFIX}.{entry.entry_id}"
        )
        self._stored_last: Shot | None = None
        self._stored_activation: LastActivation | None = None
        self._stored_detail: ShotDetail | None = None
        self._presets_task: asyncio.Task[None] | None = None
        self._seen_order: deque[tuple[str, int, int, str, int]] = deque(maxlen=256)
        self._seen: set[tuple[str, int, int, str, int]] = set()
        self._last_uptime_by_boot: dict[int, int] = {}
        self._test_waiters: dict[str, asyncio.Future[None]] = {}
        self._recovery_task: asyncio.Task[None] | None = None
        self._refresh_task: asyncio.Task[None] | None = None
        self._refresh_pending = False
        self._required_boot_id: int | None = None

    async def async_load_store(self) -> None:
        """Restore the compact shot aggregate, ignoring corrupt local data."""
        stored = await self._store.async_load()
        if not isinstance(stored, dict):
            return
        try:
            self._stored_last = (
                None
                if stored.get("last_shot") is None
                else Shot.from_dict(stored["last_shot"])
            )
            self._stored_activation = (
                None
                if stored.get("last_activation") is None
                else LastActivation.from_dict(stored["last_activation"])
            )
            if stored.get("shot_detail") is not None:
                self._stored_detail = ShotDetail.from_dict(stored["shot_detail"])
        except KeyError, TypeError, ValueError:
            self._stored_last = self._stored_activation = self._stored_detail = None

    async def _async_update_data(self) -> CoordinatorData:
        for attempt in range(2):
            try:
                snapshot, presets = await asyncio.gather(
                    self.api.async_snapshot(), self.api.async_presets()
                )
            except AuthRequired as err:
                raise ConfigEntryAuthFailed(str(err)) from err
            except Exception as err:
                raise UpdateFailed(str(err)) from err
            if snapshot.device_id != self.device_id:
                raise UpdateFailed("controller identity changed")
            if (
                snapshot.preset_revision == presets.revision
                and snapshot.active_preset_id == presets.active_id
            ):
                break
            if attempt:
                raise UpdateFailed("controller snapshots are inconsistent")
        last = snapshot.last_shot
        activation = snapshot.last_activation
        stats = await self._async_fetch_stats(snapshot)
        detail = await self._async_fetch_detail(snapshot, last)
        if (
            last != self._stored_last
            or activation != self._stored_activation
            or detail != self._stored_detail
            or stats != getattr(self.data, "stats", None)
        ):
            self._stored_last = last
            self._stored_activation = activation
            self._stored_detail = detail
            self._store.async_delay_save(self._storage_data, 1)
        return CoordinatorData(snapshot, presets, last, activation, stats, detail)

    async def _async_fetch_detail(
        self, snapshot: DeviceSnapshot, last: Shot | None
    ) -> ShotDetail | None:
        """Read the last shot's row and curve once per shot (or new rating)."""
        if (
            "last_shot_curve_v1" not in snapshot.capabilities
            or last is None
            or last.shot_id is None
        ):
            return None
        held = self._stored_detail
        if held is not None and held.shot_id != last.shot_id:
            held = None
        if held is not None and held.values.get("rating") == (last.rating or 0):
            return held
        try:
            return await self.api.async_last_shot()
        except Exception:
            return held

    async def _async_fetch_stats(self, snapshot: DeviceSnapshot) -> ShotStats | None:
        """Prefer the snapshot aggregate; fall back to one bounded page read."""
        if snapshot.stats is not None:
            return snapshot.stats
        if "stored_shots_v1" not in snapshot.capabilities:
            return None
        try:
            page = await self.api.async_shots_page()
        except Exception:
            return None
        stats = page.get("stats") if isinstance(page, dict) else None
        try:
            return None if stats is None else ShotStats.from_dict(stats)
        except ProtocolError:
            return None

    def expect_test(self, correlation_id: str) -> asyncio.Future[None]:
        """Create the waiter before requesting a test callback."""
        future = self.hass.loop.create_future()
        self._test_waiters[correlation_id] = future
        return future

    def cancel_test(self, correlation_id: str) -> None:
        """Remove a test waiter after timeout or rollback."""
        if future := self._test_waiters.pop(correlation_id, None):
            future.cancel()

    async def async_confirmed_command(
        self, command: Callable[[], Awaitable[None]], *, restarting: bool = False
    ) -> None:
        """Serialize a command, retain confirmed state, and reconcile once."""
        async with self.command_lock:
            try:
                await command()
            except (CannotConnect, ProtocolError, TimeoutError) as err:
                self._transport_failed(err)
                raise
            except AuthRequired as err:
                self.async_set_update_error(UpdateFailed(str(err)))
                if self.config_entry is not None:
                    self.config_entry.async_start_reauth(self.hass)
                raise
            if restarting:
                self._transport_failed(UpdateFailed("controller is restarting"))
                return
            await self.async_request_refresh()
            if not self.last_update_success:
                error = CannotConnect("confirmation refresh failed")
                self._start_recovery()
                raise error
            self._cancel_recovery()

    async def async_set_quick_setting(self, field: str, value: bool | str) -> None:
        """Join the pending Quick Settings patch and await its confirmation.

        Changes requested together (a scene, or one action on several switches)
        travel as one patch: one request, one confirmation, one refresh.
        """
        self._quick_changes[field] = value
        if self._quick_batch is None:
            self._quick_batch = self.hass.async_create_task(
                self._async_send_quick_settings(), f"{DOMAIN} quick settings"
            )
        await asyncio.shield(self._quick_batch)

    async def _async_send_quick_settings(self) -> None:
        await asyncio.sleep(QUICK_SETTINGS_COALESCE_S)
        changes, self._quick_changes, self._quick_batch = self._quick_changes, {}, None
        # The revision is read under the command lock, after earlier commands.
        await self.async_confirmed_command(
            lambda: self.api.async_set_quick_settings(
                changes, self.data.snapshot.quick_settings.revision
            )
        )

    def _transport_failed(self, error: Exception) -> None:
        self.async_set_update_error(UpdateFailed(str(error)))
        self._start_recovery()

    def _start_recovery(self) -> None:
        if self._recovery_task is None or self._recovery_task.done():
            self._recovery_task = self.hass.async_create_task(
                self._async_recover(), f"{DOMAIN} recovery"
            )

    async def _async_recover(self) -> None:
        for delay in RECOVERY_DELAYS:
            await asyncio.sleep(delay)
            if self._reconciliation_succeeded():
                return
            await self.async_refresh()
            if self._reconciliation_succeeded():
                self._required_boot_id = None
                return

    def _schedule_explicit_refresh(
        self, name: str, *, required_boot_id: int | None = None
    ) -> None:
        if required_boot_id is not None:
            self._required_boot_id = max(self._required_boot_id or 0, required_boot_id)
        if self._refresh_task is None or self._refresh_task.done():
            self._refresh_task = self.hass.async_create_task(
                self._async_explicit_refresh(), name
            )
        else:
            self._refresh_pending = True

    async def _async_explicit_refresh(self) -> None:
        while True:
            self._refresh_pending = False
            await self.async_request_refresh()
            if self._reconciliation_succeeded():
                self._required_boot_id = None
                self._cancel_recovery()
            else:
                if self.last_update_success:
                    self.async_set_update_error(
                        UpdateFailed("controller boot reconciliation pending")
                    )
                self._start_recovery()
            if not self._refresh_pending:
                return

    def _schedule_presets_refresh(self) -> None:
        if self._presets_task is None or self._presets_task.done():
            self._presets_task = self.hass.async_create_task(
                self._async_refresh_presets(), f"{DOMAIN} preset rules"
            )

    async def _async_refresh_presets(self) -> None:
        """Read the preset rules a presets_changed webhook does not carry."""
        try:
            presets = await self.api.async_presets()
        except Exception:
            return  # the next full refresh brings them
        data = self.data
        if self.last_update_success and presets.revision >= data.presets.revision:
            self.async_set_updated_data(replace(data, presets=presets))

    def _reconciliation_succeeded(self) -> bool:
        return bool(
            self.last_update_success
            and self.data is not None
            and (
                self._required_boot_id is None
                or self.data.snapshot.boot_id >= self._required_boot_id
            )
        )

    def _cancel_recovery(self) -> None:
        if (
            self._recovery_task is not None
            and self._recovery_task is not asyncio.current_task()
            and not self._recovery_task.done()
        ):
            self._recovery_task.cancel()

    async def async_shutdown(self) -> None:
        """Cancel entry-owned finite recovery work."""
        tasks = [
            task
            for task in (self._recovery_task, self._refresh_task, self._presets_task)
            if task is not None
        ]
        for task in tasks:
            if not task.done():
                task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        await super().async_shutdown()

    async def async_process_webhook(self, event: WebhookEvent) -> None:
        """Apply one valid, ordered controller event."""
        if event.device_id != self.device_id:
            raise PermissionError
        key = event.deduplication_key
        if key in self._seen:
            return
        latest = self._last_uptime_by_boot.get(event.boot_id, -1)
        if event.uptime_ms < latest:
            return
        if event.event == "test":
            correlation = event.data.get("correlationId")
            if (
                isinstance(correlation, str)
                and (future := self._test_waiters.pop(correlation, None))
                and not future.done()
            ):
                future.set_result(None)
            self._accept_event(key, event)
            return
        if self.data is None:
            return
        if event.boot_id < self.data.snapshot.boot_id:
            return
        if (
            event.boot_id > self.data.snapshot.boot_id
            and event.event != "controller_started"
        ):
            self._schedule_explicit_refresh(
                f"{DOMAIN} newer-boot reconciliation",
                required_boot_id=event.boot_id,
            )
            return
        preserve_failure = not self.last_update_success
        if preserve_failure:
            self._start_recovery()
        data = self.data
        if event.event == "brew_state":
            state = event.data.get("state")
            if state not in ("idle", "brewing"):
                raise ProtocolError("state is invalid")
            self._accept_event(key, event)
            self.async_set_updated_data(
                replace(data, snapshot=replace(data.snapshot, shot_state=state))
            )
            if preserve_failure:
                self.async_set_update_error(UpdateFailed("reconciliation pending"))
            return
        if event.event == "end":
            self._accept_event(key, event)
            self._schedule_explicit_refresh(f"{DOMAIN} last-good-shot reconciliation")
            return
        if event.event == "integration_history_end":
            activation = LastActivation.from_dict(event.data)
            self._accept_event(key, event)
            self._stored_activation = activation
            self._store.async_delay_save(self._storage_data, 1)
            self.async_set_updated_data(replace(data, last_activation=activation))
            if preserve_failure:
                self.async_set_update_error(UpdateFailed("reconciliation pending"))
            return
        if event.event == "presets_changed":
            payload = {**event.data, "apiVersion": 1}
            presets = PresetState.from_dict(payload)
            if presets.revision <= data.presets.revision:
                return
            self._accept_event(key, event)
            if presets.revision > data.presets.revision + 1:
                self._schedule_explicit_refresh(f"{DOMAIN} preset reconciliation")
            elif "preset_rules_v1" in data.snapshot.capabilities:
                self._schedule_presets_refresh()
            # The webhook carries no rules: keep the known ones until the read.
            rules = {item.id: item.rule for item in data.presets.items}
            presets = replace(
                presets,
                items=tuple(replace(p, rule=rules.get(p.id)) for p in presets.items),
                cut_ramp_s=data.presets.cut_ramp_s,
            )
            snapshot = replace(
                data.snapshot,
                active_preset_id=presets.active_id,
                preset_revision=presets.revision,
            )
            self.async_set_updated_data(
                replace(data, snapshot=snapshot, presets=presets)
            )
            if preserve_failure:
                self.async_set_update_error(UpdateFailed("reconciliation pending"))
            return
        if event.event == "quick_settings_changed":
            quick = QuickSettings.from_dict(
                {
                    key: event.data[key]
                    for key in (
                        "revision",
                        "activePresetId",
                        "brewByWeight",
                        "noScaleBbwMode",
                        "autoToManualGuardEnabled",
                        "slowExtractionGuardEnabled",
                        "fastExtractionGuardEnabled",
                        "avoidAccidentalTouchEnabled",
                        "cupProtectionEnabled",
                    )
                }
            )
            current = data.snapshot.quick_settings
            if quick.revision <= current.revision:
                return
            self._accept_event(key, event)
            if quick.revision > current.revision + 1:
                self._schedule_explicit_refresh(f"{DOMAIN} settings reconciliation")
            self.async_set_updated_data(
                replace(
                    data,
                    snapshot=replace(
                        data.snapshot,
                        active_preset_id=quick.active_preset_id,
                        preset_revision=quick.revision,
                        quick_settings=quick,
                    ),
                )
            )
            if preserve_failure:
                self.async_set_update_error(UpdateFailed("reconciliation pending"))
            return
        if event.event == "ip_changed":
            address = event.data.get("ip")
            if not isinstance(address, str) or not address:
                raise ProtocolError("ip is invalid")
            self._accept_event(key, event)
            self.async_set_updated_data(
                replace(data, snapshot=replace(data.snapshot, ip=address))
            )
            if preserve_failure:
                self.async_set_update_error(UpdateFailed("reconciliation pending"))
            return
        if event.event == "controller_started":
            revision = event.data.get("revision")
            if isinstance(revision, bool) or not isinstance(revision, int):
                raise ProtocolError("revision is invalid")
            if event.boot_id <= data.snapshot.boot_id or (
                self._required_boot_id is not None
                and event.boot_id <= self._required_boot_id
            ):
                return
            self._schedule_explicit_refresh(
                f"{DOMAIN} controller-started reconciliation",
                required_boot_id=event.boot_id,
            )

    def _accept_event(
        self, key: tuple[str, int, int, str, int], event: WebhookEvent
    ) -> None:
        if len(self._seen_order) == self._seen_order.maxlen:
            self._seen.discard(self._seen_order[0])
        self._seen_order.append(key)
        self._seen.add(key)
        self._last_uptime_by_boot[event.boot_id] = event.uptime_ms

    def _storage_data(self) -> dict[str, Any]:
        return {
            "last_shot": None
            if self._stored_last is None
            else self._stored_last.to_dict(),
            "last_activation": None
            if self._stored_activation is None
            else self._stored_activation.to_dict(),
            "shot_detail": None
            if self._stored_detail is None
            else self._stored_detail.to_dict(),
        }
