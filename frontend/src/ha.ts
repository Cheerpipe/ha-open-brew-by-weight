// The slice of Home Assistant's frontend objects the cards use.

export interface HassEntity {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
}

export interface HassConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: Record<string, unknown>,
  ): Promise<() => Promise<void>>;
}

export interface HomeAssistant {
  connection: HassConnection;
  language: string;
  locale?: { language: string };
  entities: Record<string, HassEntity>;
  states: Record<string, { state: string } | undefined>;
  themes?: { darkMode?: boolean };
  callService(domain: string, service: string, data: Record<string, unknown>): Promise<unknown>;
}

export const DOMAIN = "open_brew_by_weight";

/** The device's preset selector, which changes the active preset. */
export const presetSelectEntity = (hass: HomeAssistant, deviceId: string) =>
  Object.values(hass.entities).find(
    (e) => e.device_id === deviceId && e.platform === DOMAIN && e.entity_id.startsWith("select."),
  )?.entity_id;

/** The first Open Brew by Weight device, for a new card's default. */
export const firstDevice = (hass: HomeAssistant) =>
  Object.values(hass.entities).find((e) => e.platform === DOMAIN && e.device_id)?.device_id ?? undefined;
