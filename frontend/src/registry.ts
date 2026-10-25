import { localizer } from "./localize";

// The card picker's entries. Home Assistant may set its language after this
// module loads, so the names are written again once a card knows it.
const CARDS = [
  ["open-brew-by-weight-preset-card", "preset"],
  ["open-brew-by-weight-shot-chart-card", "shot"],
  ["open-brew-by-weight-shot-card", "details"],
] as const;
const DOCS = "https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/cards.md";
let named: string | undefined;

export function nameCards(language: string | undefined) {
  if (!language || language === named) return;
  named = language;
  const t = localizer(language),
    registry = ((window as unknown as { customCards?: Record<string, unknown>[] }).customCards ??= []);
  for (const [type, card] of CARDS) {
    const entry = registry.find((e) => e.type === type) ?? registry[registry.push({ type }) - 1];
    Object.assign(entry, {
      name: t(`card.${card}.name`),
      description: t(`card.${card}.description`),
      preview: true,
      documentationURL: DOCS,
    });
  }
}
