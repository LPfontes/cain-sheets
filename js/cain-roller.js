import { el, state, saveCurrentCharacter } from "./state.js";
import { CAIN_SKILLS, ALL_SKILLS } from "./cain-data.js";
import { logger } from "./logger.js";
import { t } from "./i18n.js";

export function renderCainRollPanel() {
  const container = document.getElementById("cain-roll-panel");
  if (!container) return;

  const char = state.currentCharacter;
  if (!char) {
    container.innerHTML = `<p class="cain-empty">${t("roller.noExorcist")}</p>`;
    return;
  }

  const psycheAvailable = char.psycheBursts || 0;
  const piedadeAvailable = char.piedadeCurrent || 0;
  const divineAgonyUsed = char.divineAgonyUsed || false;
  
  const rs = state.cainRollState || { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
  const selectedSkillKey = rs.skill || "";
  const skillVal = selectedSkillKey ? (char.skills[selectedSkillKey] || 0) : 0;
  const advantages = rs.advantages || 0;
  const isDifficult = rs.isDifficult || false;
  
  const usePsyche = rs.usePsyche && psycheAvailable > 0;
  const useDivineAgony = rs.useDivineAgony && piedadeAvailable > 0;
  
  const poolSize = selectedSkillKey ? skillVal + advantages + (usePsyche ? 1 : 0) + (useDivineAgony ? piedadeAvailable : 0) : 0;

  let skillOptionsHtml = "";
  for (const group of Object.values(CAIN_SKILLS)) {
    const opts = Object.entries(group.skills).map(([key, info]) => {
      const val = char.skills[key] || 0;
      const selected = key === selectedSkillKey ? "selected" : "";
      return `<option value="${key}" ${selected}>${info.name} (${val})</option>`;
    }).join("");
    skillOptionsHtml += `<optgroup label="${group.label}">${opts}</optgroup>`;
  }

  container.innerHTML = `
    <div class="cain-roll-panel-inner">
    <div class="cain-roll-field-row">
      <div class="cain-roll-field">
        <label for="cain-roll-skill">${t("roller.skill")}</label>
        <select id="cain-roll-skill" class="cain-roll-select">
          <option value="">${t("roller.selectPlaceholder")}</option>
          ${skillOptionsHtml}
        </select>
      </div>

      <!-- VANTAGENS -->
      <div class="cain-roll-field">
        <label>${t("roller.advantages")}</label>
        <div class="cain-advantages-ctrl">
          <button id="btn-cain-adv-dec" class="btn btn-sm">-</button>
          <span class="cain-adv-val">${advantages}</span>
          <button id="btn-cain-adv-inc" class="btn btn-sm">+</button>
        </div>
      </div>
    </div>
      <!-- DIFICULDADE -->
      <div class="cain-roll-field">
        <label>${t("roller.difficulty")}</label>
        <div class="cain-diff-toggle-group">
          <label class="cain-diff-opt">
            <input type="radio" name="cain-difficulty" value="normal" style="width:20px; height:20px;" ${!isDifficult ? 'checked' : ''}> ${t("roller.diffNormal")} (4+)
          </label>
          <label class="cain-diff-opt">
            <input type="radio" name="cain-difficulty" value="hard" style="width:20px; height:20px;" ${isDifficult ? 'checked' : ''}> ${t("roller.diffHard")} (6)
          </label>
        </div>
      </div>

      <div class="cain-roll-info-row">
        <span class="cain-pool-display">${t("roller.pool")}: <strong id="cain-pool-size">${poolSize}</strong>d6 ${poolSize === 0 && selectedSkillKey ? `<span class="cain-zero-pool-warning">${t("roller.zeroPoolWarning")}</span>` : ''}</span>
        <label class="cain-psyche-toggle ${psycheAvailable <= 0 ? 'disabled' : ''}">
          <input type="checkbox" id="cain-use-psyche" style="width:20px; height:20px;" ${usePsyche && psycheAvailable > 0 ? 'checked' : ''} ${psycheAvailable <= 0 ? 'disabled' : ''}>
          Psyche Burst <span class="cain-psyche-badge">${psycheAvailable}</span>
        </label>
        <div class="cain-divine-agony-wrapper" style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px;">
          <label class="cain-divine-agony-toggle">
            <input type="checkbox" id="cain-use-divine-agony" style="width:20px; height:20px;" ${useDivineAgony ? 'checked' : ''}>
            ${t("roller.divineAgony")}
          </label>
          <div class="piedade-checkbox-group" id="cain-roller-piedade-checkbox-group" style="display: flex; gap: 4px; align-items: center;"></div>
        </div>
      </div>
      <button id="btn-cain-roll" class="btn btn-primary" ${!selectedSkillKey ? 'disabled' : ''}>
        🎲 ${t("roller.rollBtn")} ${selectedSkillKey ? (poolSize > 0 ? `(${poolSize}d6)` : t("roller.zeroPoolLowest")) : ""}
      </button>
      <div id="cain-roll-results" class="cain-roll-results"></div>
    </div>
  `;

  const rollerGroup = document.getElementById("cain-roller-piedade-checkbox-group");
  if (rollerGroup) {
    const piedadeMax = char.piedadeMax !== undefined ? char.piedadeMax : 3;
    const piedadeCurrent = char.piedadeCurrent || 0;
    rollerGroup.innerHTML = "";
    for (let i = 1; i <= piedadeMax; i++) {
      const checked = i <= piedadeCurrent;
      const label = document.createElement("label");
      label.className = `piedade-checkbox ${checked ? 'checked' : ''}`;
      label.style.margin = "0 -2px";
      label.innerHTML = `
        <input type="checkbox" id="cain-roller-piedade-check-${i}" ${checked ? 'checked' : ''}>
        <img src="./assets/agonia.webp" class="piedade-icon" alt="Agonia" style="width:40px; height:20px;">
      `;
      label.querySelector("input").addEventListener("change", () => {
        let count = 0;
        rollerGroup.querySelectorAll("input").forEach(cb => {
          if (cb.checked) count++;
        });
        char.piedadeCurrent = count;
        saveCurrentCharacter();
        if (typeof window.updatePiedadeDisplay === 'function') {
          window.updatePiedadeDisplay();
        }
        renderCainRollPanel();
      });
      rollerGroup.appendChild(label);
    }
  }

  document.getElementById("cain-roll-skill")?.addEventListener("change", (e) => {
    if (!state.cainRollState) state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
    state.cainRollState.skill = e.target.value;
    renderCainRollPanel();
  });

  document.getElementById("btn-cain-adv-dec")?.addEventListener("click", () => {
    if (!state.cainRollState) state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
    state.cainRollState.advantages = Math.max(0, (state.cainRollState.advantages || 0) - 1);
    renderCainRollPanel();
  });

  document.getElementById("btn-cain-adv-inc")?.addEventListener("click", () => {
    if (!state.cainRollState) state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
    state.cainRollState.advantages = Math.min(3, (state.cainRollState.advantages || 0) + 1);
    renderCainRollPanel();
  });

  document.getElementsByName("cain-difficulty").forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (!state.cainRollState) state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
      state.cainRollState.isDifficult = e.target.value === "hard";
      renderCainRollPanel();
    });
  });

  document.getElementById("cain-use-psyche")?.addEventListener("change", (e) => {
    if (!state.cainRollState) state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
    state.cainRollState.usePsyche = e.target.checked;
    renderCainRollPanel();
  });

  document.getElementById("cain-use-divine-agony")?.addEventListener("change", (e) => {
    if (!state.cainRollState) state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
    state.cainRollState.useDivineAgony = e.target.checked;
    renderCainRollPanel();
  });

  document.getElementById("btn-cain-roll")?.addEventListener("click", executeCainRoll);
}

export function executeCainRoll() {
  const char = state.currentCharacter;
  if (!char) return;

  const skillKey = state.cainRollState?.skill;
  if (!skillKey) { alert("Selecione uma perícia!"); return; }

  const skillVal = char.skills[skillKey] || 0;
  const advantages = state.cainRollState?.advantages || 0;
  const usePsyche = state.cainRollState?.usePsyche || false;
  if (usePsyche && (char.psycheBursts || 0) <= 0) {
    alert("Nenhum Psyche Burst disponível!");
    state.cainRollState.usePsyche = false;
    renderCainRollPanel();
    return;
  }

  const useDivineAgony = state.cainRollState?.useDivineAgony || false;
  const piedade = char.piedadeCurrent || 0;

  const isDifficult = state.cainRollState?.isDifficult || false;

  let poolSize = skillVal + advantages;
  if (usePsyche) {
    poolSize++;
    char.psycheBursts = (char.psycheBursts || 0) - 1;
  }
  if (useDivineAgony) {
    poolSize += piedade;
    char.divineAgonyUsed = true;
    char.piedadeCurrent = 0;
    if (typeof window.updatePiedadeDisplay === 'function') {
      window.updatePiedadeDisplay();
    }
  }

  // Try 3D dice engine, fall back to math roll
  const box = state.diceBox || window.diceBox;
  const disable3D = localStorage.getItem("cain_disable_3d") === "true" || localStorage.getItem("assimilação_disable_3d") === "true";

  if (box && !disable3D) {
    perform3DCainRoll(box, poolSize, skillKey, skillVal, usePsyche, isDifficult);
  } else {
    performMathCainRoll(poolSize, skillKey, skillVal, usePsyche, isDifficult);
  }
}

function performMathCainRoll(poolSize, skillKey, skillVal, usedPsyche, isDifficult) {
  const char = state.currentCharacter;
  if (!char) return;

  const isZeroPool = poolSize === 0;
  const diceToRoll = isZeroPool ? 2 : poolSize;

  const results = [];
  for (let i = 0; i < diceToRoll; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }

  let successes = 0;
  const threshold = isDifficult ? 6 : 4;

  if (isZeroPool) {
    const activeDie = Math.min(results[0], results[1]);
    successes = activeDie >= threshold ? 1 : 0;
  } else {
    successes = results.filter(r => r >= threshold).length;
  }

  getSkillName(skillKey).then(skillName => {
    renderCainResult(results, successes, skillName, skillVal, poolSize, usedPsyche, isZeroPool, isDifficult);
    appendToHistory(results, successes, skillName, isZeroPool, isDifficult);
  });

  renderCainRollPanel();
}

function perform3DCainRoll(box, poolSize, skillKey, skillVal, usedPsyche, isDifficult) {
  const isZeroPool = poolSize === 0;
  const diceToRoll = isZeroPool ? 2 : poolSize;
  const notation = `${diceToRoll}d6`;
  el.diceOverlay.classList.remove("hidden");

  setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 50);

  box.setDice(notation);
  box.start_throw(null, (notationResult) => {
    setTimeout(() => { el.diceOverlay.classList.add("hidden"); }, 4000);

    if (!notationResult.result || notationResult.result.length === 0 || notationResult.result[0] < 0) {
      alert("Erro na simulação 3D. Usando rolagem matemática.");
      performMathCainRoll(poolSize, skillKey, skillVal, usedPsyche, isDifficult);
      return;
    }

    const results = notationResult.result.slice(0, diceToRoll);
    let successes = 0;
    const threshold = isDifficult ? 6 : 4;

    if (isZeroPool) {
      const activeDie = Math.min(results[0], results[1]);
      successes = activeDie >= threshold ? 1 : 0;
    } else {
      successes = results.filter(r => r >= threshold).length;
    }

    getSkillName(skillKey).then(skillName => {
      renderCainResult(results, successes, skillName, skillVal, poolSize, usedPsyche, isZeroPool, isDifficult);
      appendToHistory(results, successes, skillName, isZeroPool, isDifficult);
    });

    renderCainRollPanel();
  });
}

async function getSkillName(key) {
  for (const group of Object.values(CAIN_SKILLS)) {
    if (group.skills[key]) return group.skills[key].name;
  }
  return key;
}

function renderCainResult(results, successes, skillName, skillVal, poolSize, usedPsyche, isZeroPool, isDifficult) {
  const el = document.getElementById("cain-roll-results");
  if (!el) return;

  const threshold = isDifficult ? 6 : 4;
  let diceHtml = "";

  if (isZeroPool) {
    const minVal = Math.min(results[0], results[1]);
    let minOccurenceUsed = false;
    diceHtml = results.map((val, i) => {
      const isMin = val === minVal && !minOccurenceUsed;
      if (isMin) minOccurenceUsed = true;
      const statusClass = isMin ? (val >= threshold ? 'success' : 'fail') : 'ignored';
      return `
        <span class="cain-roll-die ${statusClass}" title="${isMin ? 'Dado Escolhido (Menor)' : 'Dado Ignorado'}">
          ${val}
        </span>
      `;
    }).join("");
  } else {
    diceHtml = results.map((val, i) => `
      <span class="cain-roll-die ${val >= threshold ? 'success' : 'fail'}">
        ${val}
      </span>
    `).join("");
  }

  el.innerHTML = `
    <div class="cain-roll-result-card card-glass">
      <div class="cain-roll-header">${skillName} ${isDifficult ? `<span class="cain-diff-badge-hard">${t("roller.diffHardBadge")}</span>` : ''}</div>
      <div class="cain-roll-dice-row">
        ${diceHtml}
      </div>
      <div class="cain-roll-summary">
        <span class="cain-roll-successes">${successes > 0 ? t("roller.success") : t("roller.failure")} (${(successes === 1 ? t("roller.successCount") : t("roller.successesCount")).replace("{count}", successes)})</span>
      </div>
      <div class="cain-roll-stats">
        <small>${t("roller.pool")}: ${poolSize}d6 ${usedPsyche ? t("roller.withPsyche") : ''} ${isZeroPool ? t("roller.zeroPoolHistory") : ''}</small>
      </div>
    </div>
  `;
}

export function renderCainRollHistory() {
  const historyEl = document.getElementById("cain-roll-history");
  if (!historyEl) return;

  const char = state.currentCharacter;
  const history = char?.rollHistory || [];
  if (history.length === 0) {
    historyEl.innerHTML = '<div class="chat-placeholder">Nenhuma rolagem.</div>';
    return;
  }

  historyEl.innerHTML = history.map(entry => {
    return `
      <div class="cain-history-item">
        <div style="display:flex; flex-direction:column; gap:2px; flex:1;">
          <span class="cain-history-skill"><strong>${entry.skillName}</strong> ${entry.isDifficult ? '(Difícil)' : ''}</span>
          <span class="cain-history-dice">[${entry.results.join(", ")}] ${entry.isZeroPool ? '(Reserva 0)' : ''}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="cain-history-successes">${entry.successes} S</span>
        </div>
      </div>
    `;
  }).join("");
}

function appendToHistory(results, successes, skillName, isZeroPool, isDifficult) {
  const char = state.currentCharacter;
  if (!char) return;
  if (!char.rollHistory) char.rollHistory = [];

  char.rollHistory.unshift({
    skillName,
    results: [...results],
    successes,
    isZeroPool,
    isDifficult,
    timestamp: Date.now()
  });

  if (char.rollHistory.length > 20) char.rollHistory.length = 20;

  import("./state.js").then(({ saveCurrentCharacter }) => saveCurrentCharacter());

  renderCainRollHistory();
}

export function openCainRollForSkill(skillKey) {
  if (!state.cainRollState) {
    state.cainRollState = { skill: "", advantages: 0, isDifficult: false, usePsyche: false, useDivineAgony: false };
  }
  state.cainRollState.skill = skillKey;
  if (el.diceDrawer) el.diceDrawer.classList.remove("hidden");
  renderCainRollPanel();
}
