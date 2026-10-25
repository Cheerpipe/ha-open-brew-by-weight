// Screenshots of the cards for the docs, taken from a real Home Assistant.
//
// Needs a Home Assistant with the integration set up against
// scripts/fake_controller.py, a storage dashboard holding the documented
// examples (see CONTRIBUTING.md), and a login that needs no password
// (trusted_networks with allow_bypass_login). Usage:
//   node scripts/screenshots.mjs [http://localhost:8124] [obbw-cards/cards]
// Set CHROMIUM to a Chromium or headless-shell binary if Playwright's own
// is not installed.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:8124";
const dashboard = process.argv[3] ?? "obbw-cards/cards";
const out = path.join(import.meta.dirname, "..", "..", "docs", "images", "cards");
fs.mkdirSync(out, { recursive: true });

// The dashboard's cards, in order, and the file each one becomes.
const shots = [
  ["open-brew-by-weight-preset-card", 0, "preset"],
  ["open-brew-by-weight-preset-card", 1, "preset-pinned"],
  ["open-brew-by-weight-shot-chart-card", 0, "shot-chart-preset"],
  ["open-brew-by-weight-shot-chart-card", 1, "shot-chart-weight-flow"],
  ["open-brew-by-weight-shot-chart-card", 2, "shot-chart-flow"],
  ["open-brew-by-weight-shot-card", 0, "shot-details"],
  ["open-brew-by-weight-shot-card", 1, "shot-details-compact"],
  ["open-brew-by-weight-preset-card", 2, "styling-colors"],
  ["open-brew-by-weight-preset-card", 3, "styling-no-legend"],
  ["open-brew-by-weight-shot-chart-card", 3, "styling-brand-colors"],
  ["open-brew-by-weight-shot-card", 2, "styling-tiles"],
];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
async function capture(colorScheme, list) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2, colorScheme });
  await page.goto(`${base}/${dashboard}`);
  await page.waitForSelector("open-brew-by-weight-shot-card", { timeout: 60000 });
  // Let every card subscribe, measure, and draw.
  await page.waitForTimeout(4000);
  for (const [tag, index, name] of list) {
    const card = page.locator(tag).nth(index);
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await card.screenshot({ path: path.join(out, `${name}.png`), animations: "disabled" });
    console.log(`${name}.png`);
  }
  await page.close();
}

await capture("light", shots);
await capture("dark", [
  ["open-brew-by-weight-preset-card", 0, "preset-dark"],
  ["open-brew-by-weight-shot-chart-card", 1, "shot-chart-weight-flow-dark"],
]);
await browser.close();
