"""Serve the dashboard cards bundled with the integration."""

from __future__ import annotations

import hashlib
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN

CARDS_FILE = Path(__file__).parent / "frontend" / "open-brew-by-weight-cards.js"
CARDS_URL = f"/{DOMAIN}/open-brew-by-weight-cards.js"


async def async_register_cards(hass: HomeAssistant) -> None:
    """Serve the card module and load it on every dashboard.

    The query carries the file's hash, so browsers keep it cached until an
    update changes it and no dashboard resource needs adding by hand. Without
    the frontend (a headless setup) there is nothing to serve.
    """
    if hass.http is None or "frontend" not in hass.config.components:
        return
    digest = await hass.async_add_executor_job(
        lambda: hashlib.sha256(CARDS_FILE.read_bytes()).hexdigest()[:12]
    )
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARDS_URL, str(CARDS_FILE), True)]
    )
    add_extra_js_url(hass, f"{CARDS_URL}?v={digest}")
