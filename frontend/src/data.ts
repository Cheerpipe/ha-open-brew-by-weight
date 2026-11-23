import type { PresetRender } from "./preset-chart";
import { DOMAIN, type HomeAssistant } from "./ha";
import type { StatsChart } from "./stats-chart";

/** What the integration's open_brew_by_weight/subscribe command sends. */
export interface CardData {
  available: boolean;
  shotState: "idle" | "brewing";
  activePresetId: number;
  presets: PresetRender[];
  lastShot: Record<string, unknown> | null;
}

/** What the integration's open_brew_by_weight/stats/subscribe command sends. */
export interface StatsData {
  available: boolean;
  /** False before the controller firmware serves the Stats charts. */
  supported: boolean;
  /** Null until the integration has read this window and preset. */
  chart: StatsChart | null;
}

export type FollowState<T> = { status: "loading" } | { status: "not_found" } | { status: "ready"; data: T };
export type CardDataState = FollowState<CardData>;

const RESUBSCRIBE_MS = 2000;

/** Follow one device's card data: its presets and last shot. */
export const followCardData = (hass: HomeAssistant, deviceId: string, onState: (state: CardDataState) => void) =>
  follow<CardData>(hass, { type: `${DOMAIN}/subscribe`, device_id: deviceId }, onState);

/** Follow one window and chart preset of a device's Stats charts. */
export const followStats = (
  hass: HomeAssistant,
  deviceId: string,
  window: number,
  preset: number,
  onState: (state: FollowState<StatsData>) => void,
) => follow<StatsData>(hass, { type: `${DOMAIN}/stats/subscribe`, device_id: deviceId, window, preset }, onState);

/**
 * Follow one integration subscription. The integration sends its data at once
 * and after every change; a reloaded entry asks for a new subscription.
 * Returns a stop function.
 */
function follow<T>(
  hass: HomeAssistant,
  message: Record<string, unknown>,
  onState: (state: FollowState<T>) => void,
): () => void {
  let stopped = false,
    unsubscribe: (() => Promise<void>) | undefined,
    retry: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    retry = undefined;
    hass.connection
      .subscribeMessage<T | { unloaded: true }>(
        (event) => {
          if (typeof event === "object" && event !== null && "unloaded" in event) {
            void unsubscribe?.();
            unsubscribe = undefined;
            onState({ status: "loading" });
            if (!stopped) retry = setTimeout(start, RESUBSCRIBE_MS);
          } else onState({ status: "ready", data: event as T });
        },
        message,
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
