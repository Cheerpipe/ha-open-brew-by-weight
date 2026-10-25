// Open Brew by Weight dashboard cards. The integration serves this module to
// every dashboard, so each element is defined only once.
import { nameCards } from "./registry";
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
const define = () => {
  for (const [name, element] of elements)
    if (!customElements.get(name))
      try {
        customElements.define(name, element);
      } catch {
        // Defined meanwhile under the same name: nothing to do.
      }
};
define();
// The integration loads this module early. Home Assistant may then swap in a
// scoped custom element registry (a polyfill where browsers lack it), which
// no longer knows the cards: define them again there while the page settles.
let checks = 0;
const settle = setInterval(() => {
  define();
  if (++checks >= 60) clearInterval(settle);
}, 500);

// Home Assistant sets the page's language to its own; until it does, the browser's.
nameCards(document.documentElement.lang || navigator.language);
