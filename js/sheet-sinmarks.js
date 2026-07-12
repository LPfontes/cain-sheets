/* js/sheet-sinmarks.js - Marcas do Pecado */

import { el, state } from "./state.js";
import { SIN_MARKS } from "./cain-data.js";
import { t } from "./i18n.js";

export function renderSinMarksSheet() {
  const char = state.currentCharacter;
  if (!char || !el.sinMarksListSheet) return;

  const marks = char.sinMarks || [];
  el.sinMarksListSheet.innerHTML = marks.length
    ? marks.map(sm => {
      const m = typeof sm === "string" ? SIN_MARKS.find(s => s.id === sm) : sm;
      const name = m?.name || sm?.name || sm;
      const desc = m?.desc || sm?.desc || "";
      const penalty = m?.penalty || sm?.penalty || "";
      const benefit = m?.benefit || sm?.benefit || "";
      return `<div class="cain-sinmark-card card-glass">
          <div class="cain-sinmark-name">${name}</div>
          ${desc ? `<div class="cain-sinmark-desc">${desc}</div>` : ""}
          ${penalty ? `<div class="cain-sinmark-penalty">⚠ ${penalty}</div>` : ""}
          ${benefit ? `<div class="cain-sinmark-benefit">✦ ${benefit}</div>` : ""}
        </div>`;
    }).join("")
    : `<span class="cain-empty">${t("sheet.sinmarks.none")}</span>`;
}
