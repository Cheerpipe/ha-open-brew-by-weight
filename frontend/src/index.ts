// Open Brew by Weight dashboard cards. The integration serves this module to
// every dashboard, so each element is defined only once.
import { localizer } from "./localize";
import { OpenBrewByWeightPresetCard } from "./preset-card";
import { OpenBrewByWeightPresetCardEditor } from "./preset-card-editor";

const elements: [string, CustomElementConstructor][] = [
  ["open-brew-by-weight-preset-card", OpenBrewByWeightPresetCard],
  ["open-brew-by-weight-preset-card-editor", OpenBrewByWeightPresetCardEditor],
];
for (const [name, element] of elements) if (!customElements.get(name)) customElements.define(name, element);

const t = localizer(navigator.language);
const registry = ((window as unknown as { customCards?: object[] }).customCards ??= []);
if (!registry.some((card) => (card as { type: string }).type === "open-brew-by-weight-preset-card"))
  registry.push({
    type: "open-brew-by-weight-preset-card",
    name: t("card.preset.name"),
    description: t("card.preset.description"),
    preview: true,
    documentationURL: "https://github.com/Cheerpipe/ha-open-brew-by-weight/blob/main/docs/cards.md",
  });
