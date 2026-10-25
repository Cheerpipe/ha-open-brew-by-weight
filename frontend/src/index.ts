// Open Brew by Weight dashboard cards. The integration serves this module to
// every dashboard, so each element is defined only once.
import { localizer } from "./localize";
import { OpenBrewByWeightPresetCard } from "./preset-card";
import { OpenBrewByWeightPresetCardEditor } from "./preset-card-editor";
import { OpenBrewByWeightShotCard } from "./shot-card";
import { OpenBrewByWeightShotCardEditor } from "./shot-card-editor";
import { OpenBrewByWeightShotChartCard } from "./shot-chart-card";
import { OpenBrewByWeightShotChartCardEditor } from "./shot-chart-card-editor";

const elements: [string, CustomElementConstructor][] = [
  ["open-brew-by-weight-preset-card", OpenBrewByWeightPresetCard],
  ["open-brew-by-weight-preset-card-editor", OpenBrewByWeightPresetCardEditor],
  ["open-brew-by-weight-shot-chart-card", OpenBrewByWeightShotChartCard],
  ["open-brew-by-weight-shot-chart-card-editor", OpenBrewByWeightShotChartCardEditor],
  ["open-brew-by-weight-shot-card", OpenBrewByWeightShotCard],
  ["open-brew-by-weight-shot-card-editor", OpenBrewByWeightShotCardEditor],
];
for (const [name, element] of elements) if (!customElements.get(name)) customElements.define(name, element);

const t = localizer(navigator.language);
const registry = ((window as unknown as { customCards?: { type: string }[] }).customCards ??= []);
const docs = "https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/cards.md";
for (const [type, card] of [
  ["open-brew-by-weight-preset-card", "preset"],
  ["open-brew-by-weight-shot-chart-card", "shot"],
  ["open-brew-by-weight-shot-card", "details"],
] as const)
  if (!registry.some((entry) => entry.type === type))
    registry.push({
      type,
      name: t(`card.${card}.name`),
      description: t(`card.${card}.description`),
      preview: true,
      documentationURL: docs,
    } as { type: string });
