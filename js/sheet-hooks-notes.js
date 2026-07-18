import { el, state, saveCurrentCharacter } from "./state.js";
import { t } from "./i18n.js";

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
      { name: "", checks: [false, false, false], max: 3 },
      { name: "", checks: [false, false, false], max: 3 },
      { name: "", checks: [false, false, false], max: 3 }
    ];
  }

  const container = document.querySelector(".hooks-columns");
  if (!container) return;

  container.innerHTML = "";

  char.staticHooks.forEach((hookData, index) => {
    if (!hookData.checks) hookData.checks = [false, false, false];
    const max = hookData.max || 3;
    const currentChecks = hookData.checks.filter(c => c).length;

    // Cria a coluna do gancho
    const col = document.createElement("div");
    col.className = "hook-track-col";
    
    // Escolhe uma das 3 imagens de talismãs em um loop rotativo
    const talismanImgIndex = (index % 3) + 5; // CAIN_1.4-0505-p081.png até CAIN_1.4-0507-p081.png
    const talismanImgName = `CAIN_1.4-050${talismanImgIndex}-p081.png`;

    col.innerHTML = `
      <div class="hook-track-header" style="display:flex; flex-direction:column; align-items:center; gap:4px; position:relative; width:100%;">
        <button type="button" class="btn-remove-hook-col" title="${t("sheet.hooks.remove")}" style="position:absolute; top:-4px; right:4px; background:none; border:none; color:rgba(255,255,255,0.4); font-size:16px; cursor:pointer; font-weight:bold; padding:2px; transition:color 0.2s ease;">&times;</button>
        <input type="text" class="hook-name-input" placeholder="${t("sheet.hooks.talisman")} ${index + 1}" value="${hookData.name || ''}" style="font-family:'Cuasigothic', var(--font-heading); font-size:14px; text-transform:uppercase; color:white; text-align:center; background:none; border:none; border-bottom:1.5px dashed rgba(255,255,255,0.25); width:130px; letter-spacing:0.5px; margin-top:2px; outline:none;">
        <div class="hook-max-buttons">
          <button class="btn-hook-max ${max === 1 ? 'active' : ''}" data-max="1">1</button>
          <button class="btn-hook-max ${max === 2 ? 'active' : ''}" data-max="2">2</button>
          <button class="btn-hook-max ${max === 3 ? 'active' : ''}" data-max="3">3</button>
          <button class="btn-hook-max ${max === 4 ? 'active' : ''}" data-max="4">4</button>
          <button class="btn-hook-max ${max === 5 ? 'active' : ''}" data-max="5">5</button>
        </div>
      </div>
      <div class="hook-visual-strip" style="background-image: url('../cain-talisman-board/reference/talismans/${talismanImgName}');">
        ${Array.from({ length: max }).map((_, j) => {
          const topPercent = Math.round(((j + 1) / (max + 1)) * 100);
          const isSlashed = (j + 1) <= currentChecks;
          return `<div class="diagonal-line line-${j + 1} ${isSlashed ? 'slashed' : ''}" style="top: ${topPercent}%;"></div>`;
        }).join("")}
      </div>
    `;

    // Aplica a classe fully-slashed se todos estiverem marcados
    const strip = col.querySelector(".hook-visual-strip");
    if (strip && currentChecks === max) {
      strip.classList.add("fully-slashed");
    }

    // Ouvintes de evento dinâmicos:
    // 1. Alteração do nome
    const nameInput = col.querySelector(".hook-name-input");
    nameInput.oninput = () => {
      hookData.name = nameInput.value;
      saveCurrentCharacter();
    };

    // 2. Botões de máximo (Max)
    col.querySelectorAll(".btn-hook-max").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const newMax = parseInt(btn.getAttribute("data-max"));
        hookData.max = newMax;
        
        const currentChecksCount = hookData.checks.filter(c => c).length;
        const clampedChecks = Math.min(currentChecksCount, newMax);
        hookData.checks = [];
        for (let j = 0; j < newMax; j++) {
          hookData.checks.push(j < clampedChecks);
        }

        saveCurrentCharacter();
        renderStaticHooks();
      };
    });

    // 3. Clique para cortar (Slash)
    strip.onclick = () => {
      const nextChecks = (currentChecks + 1) % (max + 1);
      hookData.checks = [];
      for (let j = 0; j < max; j++) {
        hookData.checks.push(j < nextChecks);
      }
      saveCurrentCharacter();
      renderStaticHooks();
    };

    // 4. Clique para apagar gancho
    const removeBtn = col.querySelector(".btn-remove-hook-col");
    removeBtn.onclick = () => {
      char.staticHooks.splice(index, 1); // Remove completamente do array
      saveCurrentCharacter();
      renderStaticHooks();
    };

    container.appendChild(col);
  });
}

export function initStaticHooksListeners() {
  const btnAdd = document.getElementById("btn-add-hook");
  btnAdd?.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita a abertura do pop-up de ajuda (Toolbox)
    const char = state.currentCharacter;
    if (!char) return;
    if (!char.staticHooks) {
      char.staticHooks = [];
    }
    char.staticHooks.push({ name: "", checks: [false, false, false], max: 3 });
    saveCurrentCharacter();
    renderStaticHooks();
  });
}
