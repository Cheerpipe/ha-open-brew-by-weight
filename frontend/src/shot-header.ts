import { html, nothing } from "lit";
import type { Localize } from "./localize";

/**
 * The last shot's header, shared by the shot cards: the title, when the shot
 * ended and its preset, and a chip with how it ended.
 */
export function shotHeader(
  t: Localize,
  row: Record<string, unknown> | null,
  title: string | undefined,
  language: string | undefined,
) {
  const type = String(row?.shotType ?? ""),
    verdict = ["fast", "slow"].includes(String(row?.verdict)) ? String(row!.verdict) : "on_recipe",
    chip = !row
      ? null
      : type === "manual"
        ? { cls: "manual", text: t("shot.manual") }
        : type === "timer_only"
          ? { cls: "manual", text: t("shot.timer_only") }
          : { cls: verdict, text: t(`verdict.${verdict}` as "verdict.fast") },
    ended =
      row && row.hasWallTime && typeof row.endedAtUnixSec === "number"
        ? new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(
            new Date(row.endedAtUnixSec * 1000),
          )
        : null,
    details = [ended, row?.presetName].filter(Boolean).join(" · ");
  return html`<div class="header" part="header">
    <div class="titles">
      <div class="title" part="title">${title || t("shot.title")}</div>
      ${details ? html`<div class="subtitle" part="subtitle">${details}</div>` : nothing}
    </div>
    ${chip ? html`<span class="chip ${chip.cls}" part="chip">${chip.text}</span>` : nothing}
  </div>`;
}
