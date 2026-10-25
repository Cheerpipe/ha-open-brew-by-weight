// Home Assistant defines <ha-form> lazily, when one of its own card editors
// loads. A custom editor opened first would render an empty form, so ask
// Home Assistant to load a built-in editor before ours draws.

interface CardHelpers {
  createCardElement(config: object): Promise<{ constructor: { getConfigElement?(): Promise<unknown> } }>;
}

let loading: Promise<void> | undefined;

export function loadHaForm(): Promise<void> {
  if (customElements.get("ha-form")) return Promise.resolve();
  loading ??= (async () => {
    const helpers = await (window as unknown as { loadCardHelpers?(): Promise<CardHelpers> }).loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor.getConfigElement?.();
  })().catch(() => {
    // Outside Home Assistant there is nothing to load; the next editor tries again.
    loading = undefined;
  });
  return loading;
}
