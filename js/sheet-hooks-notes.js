/* js/sheet-hooks-notes.js - Anotações, Ganchos Estáticos, Macros e Sobrevivência */

import { el, state, saveCurrentCharacter } from "./state.js";

export function renderSavedMacrosSheet() { }

export function renderHomebrewSheet() { }

export function renderCaboGuerraSheet() { }

export function renderCharacteristicsSheet() { }

export function renderMissionsSurvived() {
  const char = state.currentCharacter;
  if (!char) return;
  if (!char.missionsChecked) {
    char.missionsChecked = [false, false, false, false, false, false, false];
  }
  for (let i = 1; i <= 7; i++) {
    const cb = document.getElementById(`mission-check-${i}`);
    if (cb) {
      cb.checked = char.missionsChecked[i - 1] || false;
      cb.onchange = (e) => {
        char.missionsChecked[i - 1] = e.target.checked;
        saveCurrentCharacter();
      };
    }
  }
}

export function renderStaticHooks() {
  const char = state.currentCharacter;
  if (!char) return;

  if (!char.staticHooks) {
    char.staticHooks = [
      { name: "", checks: [false, false, false] },
      { name: "", checks: [false, false, false] },
      { name: "", checks: [false, false, false] }
    ];
  }

  for (let i = 1; i <= 3; i++) {
    const hookData = char.staticHooks[i - 1] || { name: "", checks: [false, false, false] };
    const nameInput = document.getElementById(`hook-name-${i}`);
    if (nameInput) nameInput.value = hookData.name || "";

    for (let j = 1; j <= 3; j++) {
      const checkbox = document.getElementById(`hook-check-${i}-${j}`);
      if (checkbox) checkbox.checked = !!hookData.checks[j - 1];
    }
  }
}

export function initStaticHooksListeners() {
  for (let i = 1; i <= 3; i++) {
    const nameInput = document.getElementById(`hook-name-${i}`);
    nameInput?.addEventListener("input", () => {
      const char = state.currentCharacter;
      if (!char) return;
      if (!char.staticHooks) {
        char.staticHooks = [
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] }
        ];
      }
      char.staticHooks[i - 1].name = nameInput.value;
      saveCurrentCharacter();
    });

    for (let j = 1; j <= 3; j++) {
      const checkbox = document.getElementById(`hook-check-${i}-${j}`);
      checkbox?.addEventListener("change", () => {
        const char = state.currentCharacter;
        if (!char) return;
        if (!char.staticHooks) {
          char.staticHooks = [
            { name: "", checks: [false, false, false] },
            { name: "", checks: [false, false, false] },
            { name: "", checks: [false, false, false] }
          ];
        }
        char.staticHooks[i - 1].checks[j - 1] = checkbox.checked;
        saveCurrentCharacter();
      });
    }
  }

  document.querySelectorAll(".hook-track-col").forEach((col, index) => {
    const removeBtn = col.querySelector(".hook-remove-button");
    removeBtn?.addEventListener("click", () => {
      const char = state.currentCharacter;
      if (!char) return;
      if (!char.staticHooks) {
        char.staticHooks = [
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] }
        ];
      }

      char.staticHooks[index] = { name: "", checks: [false, false, false] };
      saveCurrentCharacter();

      const nameInput = document.getElementById(`hook-name-${index + 1}`);
      if (nameInput) nameInput.value = "";

      for (let j = 1; j <= 3; j++) {
        const checkbox = document.getElementById(`hook-check-${index + 1}-${j}`);
        if (checkbox) checkbox.checked = false;
      }
    });
  });
}
