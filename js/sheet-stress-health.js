/* js/sheet-stress-health.js - Estresse, Ferimentos, Surtos e Pecados */

import { el, state, saveCurrentCharacter } from "./state.js";
import { SIN_MARKS } from "./cain-data.js";
import { t } from "./i18n.js";
import { renderMissionsSurvived } from "./sheet-hooks-notes.js";

export function renderStressHealthSheet() {
  const char = state.currentCharacter;
  if (!char) return;

  if (el.stressTrackerSheet) {
    const img = el.stressTrackerSheet.querySelector(".stress-tracker-bg");
    el.stressTrackerSheet.innerHTML = "";
    if (img) el.stressTrackerSheet.appendChild(img);
    const maxStress = Math.max(0, (char.stressMax || 6) - (char.injuries || 0));
    const current = Math.min(char.stressCurrent, maxStress);
    const total = char.stressMax || 6;
    const rotations = [11, 6, 4, 8, -6, -11];
    for (let i = 1; i <= total; i++) {
      const line = document.createElement("div");
      const isLocked = i > maxStress;
      line.className = `stress-line ${i <= current ? 'filled' : ''} ${isLocked ? 'locked' : ''}`;
      line.style.top = `${90 - ((i - 1) / Math.max(total - 1, 1)) * 59}%`;
      line.style.setProperty('--rotate', `${rotations[(i - 1) % rotations.length]}deg`);
      el.stressTrackerSheet.appendChild(line);
    }
  }

  const stressCurrentEl = document.getElementById("stress-current-sheet");
  if (stressCurrentEl) {
    stressCurrentEl.textContent = char.stressCurrent || 0;
  }

  renderInjuryCheckboxes();
  renderPsycheBursts();
  renderSinTracker();
  renderMissionsSurvived();

  if (el.afflictionsListSheet) {
    const list = char.afflictions || [];
    el.afflictionsListSheet.innerHTML = list.map((a, idx) => {
      const name = a.name || a;
      return `<span class="cain-affliction-tag btn-remove-affliction" data-index="${idx}" style="cursor: pointer;" title="${a.desc || 'Sem descrição (Clique para remover)'}">${name} <span style="margin-left: 4px; font-weight: bold; opacity: 0.7;">×</span></span>`;
    }).join("") || `<span class="cain-empty">${t("common.none")}</span>`;

    el.afflictionsListSheet.querySelectorAll(".btn-remove-affliction").forEach(tag => {
      tag.onclick = () => {
        const idx = parseInt(tag.getAttribute("data-index"));
        char.afflictions.splice(idx, 1);
        saveCurrentCharacter();
        renderStressHealthSheet();
      };
    });
  }
}

export function renderInjuryCheckboxes() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("injury-checkbox-group");
  if (!group) return;
  const injuries = char.injuries || 0;
  const maxInjuries = char.injuriesMax !== undefined ? char.injuriesMax : 3;
  group.style.gridTemplateColumns = `repeat(${maxInjuries}, 1fr)`;
  group.innerHTML = "";
  for (let i = 0; i < maxInjuries; i++) {
    const label = document.createElement("label");
    label.className = "injury-x";
    const checked = i < injuries;
    label.innerHTML = `<input type="checkbox" ${checked ? 'checked' : ''}><span>X</span>`;
    label.querySelector("input").addEventListener("change", (e) => {
      const char = state.currentCharacter;
      if (!char) return;
      let count = 0;
      group.querySelectorAll("input").forEach(cb => {
        if (cb.checked) count++;
      });
      char.injuries = count;
      const currentMax = Math.max(0, (char.stressMax || 6) - char.injuries);
      if (char.stressCurrent > currentMax) {
        char.stressCurrent = currentMax;
      }
      saveCurrentCharacter();
      renderStressHealthSheet();
    });
    group.appendChild(label);
  }
  const skull = document.getElementById("injury-death-skull");
  if (skull) {
    if (injuries >= 3) {
      skull.classList.remove("hidden");
    } else {
      skull.classList.add("hidden");
    }
  }
}

export function renderHealthSheet() { }

export function renderPsycheBursts() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("psyche-checkbox-group");
  if (!group) return;
  const psycheMax = char.psycheMax !== undefined ? char.psycheMax : 3;

  const current = char.psycheBursts !== undefined ? char.psycheBursts : 0;
  group.innerHTML = "";
  for (let i = 1; i <= psycheMax; i++) {
    const label = document.createElement("label");
    const checked = i <= current;
    label.className = `psyche-checkbox ${checked ? 'checked' : ''}`;
    label.innerHTML = `
      <input type="checkbox" ${checked ? 'checked' : ''}>
      <img src="./assets/burst.webp" class="psyche-burst-icon" alt="Burst">
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      const char = state.currentCharacter;
      if (!char) return;
      let count = 0;
      group.querySelectorAll("input").forEach(cb => {
        if (cb.checked) count++;
      });
      char.psycheBursts = count;
      saveCurrentCharacter();
      import("./cain-roller.js").then(({ renderCainRollPanel }) => renderCainRollPanel());
      renderPsycheBursts();
    });
    group.appendChild(label);
  }
}

export function renderSinTracker() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("sin-checkbox-group");
  if (!group) return;

  const sinCurrent = char.sinCurrent || 0;
  const sinMarksCount = char.sinMarks?.length || 0;
  const extraBlasphemies = char.blasphemies?.length > 1 ? char.blasphemies.length - 1 : 0;

  // Alienação modifier check
  const hasAliena = char.agendaSkill === "Alienação" || char.agendaSkill === "Alienação (Alienação)";

  const sinMax = char.sinMax !== undefined ? char.sinMax : 10;
  let sinLimit = sinMax - 2 * sinMarksCount - 1 * extraBlasphemies;
  if (hasAliena) {
    sinLimit += 2;
  }
  sinLimit = Math.max(0, Math.min(sinMax, sinLimit));

  group.innerHTML = "";
  for (let i = 1; i <= sinMax; i++) {
    const box = document.createElement("div");
    const isLocked = i > sinLimit;
    const isChecked = i <= sinCurrent && !isLocked;

    box.className = `sin-box ${isChecked ? 'checked' : ''} ${isLocked ? 'locked' : ''}`;
    box.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
      <div class="sin-sphere"></div>
    `;

    if (!isLocked) {
      box.addEventListener("click", () => {
        const char = state.currentCharacter;
        if (!char) return;

        if (char.sinCurrent === i) {
          char.sinCurrent = i - 1;
        } else {
          char.sinCurrent = i;
        }

        saveCurrentCharacter();
        renderSinTracker();
      });
    }
    group.appendChild(box);
  }

  const warningEl = document.getElementById("sin-overflow-warning");
  if (warningEl) {
    warningEl.style.display = sinCurrent >= sinLimit && sinLimit > 0 ? "block" : "none";
  }
}
