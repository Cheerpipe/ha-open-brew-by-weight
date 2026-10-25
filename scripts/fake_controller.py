"""A stand-in Open Brew by Weight controller for trying the integration.

It serves the integration API with realistic presets and a realistic last shot,
answers the webhook test, and can push a new shot, so the integration sets up
and the dashboard cards show real data without a machine. Development only.

    uv run --no-sync python scripts/fake_controller.py --port 8099 \
        --callback-host localhost:8124

Add the integration with host ``<this machine>:8099``. ``--callback-host``
rewrites the webhook address Home Assistant gives, for a Home Assistant in a
container whose own address this machine cannot reach.
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import json
import math
import random
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit, urlunsplit

from aiohttp import ClientSession, web

FIXTURES = Path(__file__).resolve().parent.parent / "tests" / "fixtures"
DEVICE_ID = "AA:BB:CC:DD:EE:FF"
BOOT_ID = 30


def preset(pid: int, name: str, goal: float, dose: float, arrivals: list[float], **rule: Any) -> dict[str, Any]:
    """One preset as the firmware's preset_rules_v1 render."""
    item = {
        "id": pid,
        "name": name,
        "isFactory": pid < 100 or pid == 255,
        "brewByWeight": True,
        "doseG": dose,
        "goalWeightG": goal,
        "fastBeforeS": 27.0,
        "slowAfterS": 36.0,
        "fastMarginG": 6.0,
        "slowMarginG": 3.0,
        "operationalWallMs": 50000,
        "bbwProtectionMs": 12000,
        "fastExtractionGuardEnabled": True,
        "slowExtractionGuardEnabled": True,
        "grindHintsEnabled": True,
        "lineaMicraBrewTargetC": 93.5,
        "shotStats": {
            "n": len(arrivals),
            "total": len(arrivals),
            "minS": min(arrivals, default=0.0),
            "maxS": max(arrivals, default=0.0),
            "medianS": sorted(arrivals)[len(arrivals) // 2] if arrivals else 0.0,
        },
        "firstDropS": 6.1,
        "firstDropN": len(arrivals),
        "arrivalsS": arrivals,
        "grindHint": None,
    }
    item.update(rule)
    return item


PRESETS = [
    preset(1, "Double · Adaptive", 36.0, 18.0, [28.4, 29.6, 30.2, 31.1, 32.0, 33.5, 24.8]),
    preset(2, "Single · Adaptive", 18.0, 9.0, [27.9, 30.5, 31.4], fastMarginG=3.0, slowMarginG=1.5),
    preset(3, "Ristretto", 27.0, 18.0, [22.1, 23.0], fastBeforeS=20.0, slowAfterS=28.0, operationalWallMs=40000),
    preset(255, "Manual", 36.0, 18.0, [], brewByWeight=False),
]


def shot_curve(cut_g: float = 34.3, drip_s: float = 2.0) -> tuple[list[tuple[int, int]], dict[str, Any]]:
    """A double espresso: pre-infusion, first drop at 6.2 s, steady flow, a cut by
    weight at ``cut_g``, then the drips settling the yield near 36 g."""
    rng = random.Random(7)
    points: list[tuple[int, int]] = []
    weight, t_ms, drop_s, stop_s = 0.0, 0, 6.2, None
    while stop_s is None or t_ms <= (stop_s + drip_s) * 1000:
        t = t_ms / 1000
        if stop_s is None and weight >= cut_g:
            stop_s = round(t, 1)
        if t < drop_s:
            flow = 0.0
        elif stop_s is None:
            # Ramps up after the first drop, peaks near 2 g/s, then eases off.
            flow = 1.95 * (1 - math.exp(-(t - drop_s) / 2.8)) * (1 - 0.012 * max(0.0, t - 16))
        else:
            # After the stop, the cup collects the last drips.
            flow = 2.9 * math.exp(-(t - stop_s) / 0.6)
        weight += flow * 0.12
        noise = rng.uniform(-0.04, 0.04) if t >= drop_s else 0.0
        points.append((t_ms, round((weight + noise) * 100)))
        t_ms += rng.choice((110, 120, 120, 130))
    return points, {"dropS": drop_s, "dropCg": 20, "endS": stop_s, "endCg": points[-1][1]}


def encode(points: list[tuple[int, int]]) -> str:
    """The curve's base64 delta stream (INTEGRATION_API.md)."""
    out, t0, w0 = bytearray(), 0, 0
    for t, w in points:
        dt, dw = t - t0, w - w0
        out += bytes([dt]) if dt < 255 else bytes([255]) + t.to_bytes(2, "little")
        out += bytes([dw & 0xFF]) if -127 <= dw <= 127 else bytes([128]) + (w & 0xFFFF).to_bytes(2, "little", signed=False)
        t0, w0 = t, w
    return base64.b64encode(bytes(out)).decode()


class Controller:
    """Mutable controller state behind the routes."""

    def __init__(self, callback_host: str | None) -> None:
        self.callback_host = callback_host
        self.revision = 19
        self.active = 1
        self.request_id = 0
        self.shot_id = 1042
        self.webhook: dict[str, Any] = {
            "enabled": False, "url": "", "brewState": False, "firstDrop": False,
            "end": False, "presetChanges": False, "deferDuringShot": False,
        }
        self.cols = json.loads((FIXTURES / "integration_last_shot.json").read_text())["cols"]
        self.ended = int(time.time()) - 600

    def last_row(self) -> list[Any]:
        points, marks = shot_curve()
        actual = marks["endCg"] / 100
        p = next(x for x in PRESETS if x["id"] == 1)
        values = {
            "id": self.shot_id, "bootId": BOOT_ID, "endedAtMs": 930100, "hasWallTime": True,
            "endedAtLocalSec": self.ended - 3 * 3600, "endedAtUnixSec": self.ended,
            "timezoneOffsetMinutesAtCommit": -180, "durationS": marks["endS"], "presetId": 1,
            "presetName": p["name"], "scaleName": "BOOKOO_SC 715097", "goalG": 36.0, "actualG": actual,
            "offsetG": 1.8, "bbwAlgorithm": "corridor", "bbwAlgorithmVersion": 2, "bbwAlpha": 0.35,
            "bbwLearningApplied": True, "avgFlowGS": round(actual / (marks["endS"] - marks["dropS"]), 2),
            "targetTempDeciC": 935, "doseG": 18.0, "ratio": round(actual / 18, 2), "firstDropS": marks["dropS"],
            "tareS": None, "shotType": "auto", "cutType": "auto", "extractionGuardEnabled": True,
            "extractionExtended": False, "slowExtractionGuardEnabled": True, "slowExtractionExtended": False,
            "stopDetail": "normal_target", "cutLineG": 36.0, "arrivalS": 28.2, "verdict": "on_recipe",
            "channeling": False, "scaleLossSource": None, "estimatedG": None, "blind": False,
            "fastBeforeS": 27.0, "slowAfterS": 36.0, "fastMarginG": 6.0, "slowMarginG": 3.0,
            "delayS": 12.0, "wallS": 50.0, "cutRampS": 3.0, "dripDelayS": 2.0,
            "actualWeightSource": "post_drip", "rating": 4,
        }
        curve = {
            "wD": encode(points), "wBreakBefore": [], "wHeld": [], "wTruncated": False,
            "dropS": marks["dropS"], "dropCg": marks["dropCg"], "extendedS": None, "extCg": None,
            "atmS": None, "atmCg": None, "atmClearedS": None, "endS": marks["endS"], "endCg": marks["endCg"],
        }
        return [values[c] for c in self.cols.split(",")] + [curve]

    def last_shot(self) -> dict[str, Any]:
        row = dict(zip(self.cols.split(","), self.last_row(), strict=False))
        return {
            "cycleId": 42, "shotId": self.shot_id, "uptimeMs": 930100,
            "durationMs": int(row["durationS"] * 1000), "targetWeightG": 36.0, "presetId": 1,
            "presetName": row["presetName"], "shotType": "auto", "stopDetail": "normal_target",
            "savePending": False, "endedAtUnixSec": self.ended, "endedAtLocalSec": self.ended - 3 * 3600,
            "rating": 4, "firstDropMs": 6200, "weightG": row["actualG"], "averageFlowGps": row["avgFlowGS"],
        }

    def snapshot(self) -> dict[str, Any]:
        base = json.loads((FIXTURES / "integration_snapshot.json").read_text())
        base.update(
            apiVersion=2, minimumClientApiVersion=2, firmwareVersion="1.0.0", bootId=BOOT_ID,
            activePresetId=self.active, presetRevision=self.revision, lastShot=self.last_shot(),
            ip="127.0.0.1", mdnsHost="obbw-demo",
        )
        base.pop("lastGoodShot", None)
        base["quickSettings"].update(revision=self.revision, activePresetId=self.active)
        return base

    def presets(self) -> dict[str, Any]:
        return {"apiVersion": 1, "revision": self.revision, "activeId": self.active, "cutRampS": 3.0, "items": PRESETS}

    def accept(self) -> dict[str, Any]:
        self.request_id += 1
        return {"apiVersion": 1, "requestId": self.request_id}

    def callback(self) -> str:
        url = urlsplit(self.webhook["url"])
        return urlunsplit(url._replace(netloc=self.callback_host)) if self.callback_host else self.webhook["url"]

    async def send(self, event: str, **data: Any) -> None:
        body = {
            "schemaVersion": 1, "event": event, "deviceId": DEVICE_ID, "bootId": BOOT_ID,
            "cycleId": 0, "uptimeMs": int(time.monotonic() * 1000), "timestamp": int(time.time()),
            "sentAtUptimeMs": int(time.monotonic() * 1000), **data,
        }
        async with ClientSession() as session, session.post(self.callback(), json=body) as response:
            print(f"webhook {event} -> {response.status}")


def app(controller: Controller) -> web.Application:
    def json_response(payload: Any, status: int = 200) -> web.Response:
        return web.json_response(payload, status=status)

    async def snapshot(_: web.Request) -> web.Response:
        return json_response(controller.snapshot())

    async def info(_: web.Request) -> web.Response:
        return json_response({"apiVersion": 1, "authRequired": False})

    async def presets(_: web.Request) -> web.Response:
        return json_response(controller.presets())

    async def last(_: web.Request) -> web.Response:
        return json_response({"apiVersion": 1, "cols": controller.cols, "shot": controller.last_row()})

    async def request_state(_: web.Request) -> web.Response:
        return json_response({"apiVersion": 1, "requestId": controller.request_id, "state": "PERSISTED"})

    async def get_webhook(_: web.Request) -> web.Response:
        return json_response({**controller.webhook, "apiVersion": 1, "delivery": "ok"})

    async def put_webhook(request: web.Request) -> web.Response:
        controller.webhook.update(await request.json())
        return json_response(controller.accept(), 202)

    async def test_webhook(request: web.Request) -> web.Response:
        correlation = (await request.json())["correlationId"]
        asyncio.get_running_loop().create_task(controller.send("test", correlationId=correlation))
        return json_response({"apiVersion": 1}, 202)

    async def active(request: web.Request) -> web.Response:
        controller.active = int((await request.json())["id"])
        controller.revision += 1
        return json_response(controller.accept(), 202)

    async def quick(request: web.Request) -> web.Response:
        controller.revision += 1
        return json_response(controller.accept(), 202)

    async def new_shot(_: web.Request) -> web.Response:
        """Not part of the API: pretend a shot just ended."""
        controller.shot_id += 1
        controller.ended = int(time.time())
        await controller.send("end", **controller.last_shot())
        return json_response({"shotId": controller.shot_id})

    application = web.Application()
    base = "/api/v1/integration"
    application.add_routes(
        [
            web.get(base, snapshot),
            web.get(base + "/info", info),
            web.get(base + "/presets", presets),
            web.get(base + "/shots/last", last),
            web.get(base + "/request", request_state),
            web.get(base + "/webhook", get_webhook),
            web.put(base + "/webhook", put_webhook),
            web.post(base + "/webhook/test", test_webhook),
            web.put(base + "/presets/active", active),
            web.put(base + "/quick-settings", quick),
            web.post("/demo/shot", new_shot),
        ]
    )
    return application


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--port", type=int, default=8099)
    parser.add_argument("--callback-host", help="host:port that reaches Home Assistant from here")
    args = parser.parse_args()
    web.run_app(app(Controller(args.callback_host)), port=args.port)
