import type { PresetRender } from "./preset-chart";
import { DOMAIN, type HomeAssistant } from "./ha";

/** What the integration's open_brew_by_weight/subscribe command sends. */
export interface CardData {
  available: boolean;
  shotState: "idle" | "brewing";
  activePresetId: number;
  cutRampS: number | null;
  presets: PresetRender[];
  lastShot: Record<string, unknown> | null;
}

export type CardDataState =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "ready"; data: CardData };

const RESUBSCRIBE_MS = 2000;

/**
 * Follow one device's card data. The integration sends it at once and after
 * every change; a reloaded entry asks for a new subscription. Returns a stop
 * function.
 */
export function followCardData(
  hass: HomeAssistant,
  deviceId: string,
  onState: (state: CardDataState) => void,
): () => void {
  let stopped = false,
    unsubscribe: (() => Promise<void>) | undefined,
    retry: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    retry = undefined;
    hass.connection
      .subscribeMessage<CardData | { unloaded: true }>(
        (message) => {
          if ("unloaded" in message) {
            void unsubscribe?.();
            unsubscribe = undefined;
            onState({ status: "loading" });
            if (!stopped) retry = setTimeout(start, RESUBSCRIBE_MS);
          } else onState({ status: "ready", data: message });
        },
        { type: `${DOMAIN}/subscribe`, device_id: deviceId },
      )
      .then(
        (stop) => {
          if (stopped) void stop();
          else unsubscribe = stop;
        },
        () => {
          // Not loaded yet, or not one of ours: say so, and look again later.
          onState({ status: "not_found" });
          if (!stopped) retry = setTimeout(start, RESUBSCRIBE_MS * 5);
        },
      );
  };
  start();
  return () => {
    stopped = true;
    clearTimeout(retry);
    void unsubscribe?.();
  };
}
