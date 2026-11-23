"""Repairs support for Open Brew by Weight."""

from typing import Any

from homeassistant.components.repairs import ConfirmRepairFlow, RepairsFlow
from homeassistant.components.repairs.models import RepairsFlowResult
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from .const import DOMAIN


def async_create_webhook_repair(hass: HomeAssistant, entry_id: str) -> None:
    """Report the rare state where remote webhook rollback also failed."""
    ir.async_create_issue(
        hass,
        DOMAIN,
        f"webhook_rollback_{entry_id}",
        is_fixable=False,
        severity=ir.IssueSeverity.ERROR,
        translation_key="webhook_rollback_failed",
    )


class TrustCompanionFlow(ConfirmRepairFlow):
    """Trust the companion's new certificate authority once the user confirms."""

    def __init__(self, entry_id: str) -> None:
        self._entry_id = entry_id

    async def async_step_confirm(self, user_input: dict[str, str] | None = None) -> RepairsFlowResult:
        if user_input is not None:
            entry = self.hass.config_entries.async_get_entry(self._entry_id)
            if entry is not None and hasattr(entry, "runtime_data"):
                entry.runtime_data.coordinator.async_trust_companion_again()
        return await super().async_step_confirm(user_input)


async def async_create_fix_flow(
    hass: HomeAssistant, issue_id: str, data: dict[str, Any] | None
) -> RepairsFlow:
    """The fix for a companion whose certificate changed."""
    return TrustCompanionFlow(str((data or {}).get("entry_id", "")))
