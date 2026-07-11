import { el, state, saveCurrentCharacter } from "./state.js";
import { CAIN_SKILLS, ALL_SKILLS } from "./cain-data.js";
import { logger } from "./logger.js";

export function renderCainRollPanel() {
  const container = document.getElementById("cain-roll-panel");
  if (!container) return;

  const char = state.currentCharacter;
  if (!char) {
    container.innerHTML = '<p class="cain-empty">Nenhum Exorcista carregado.</p>';
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
  const useDivineAgony = rs.useDivineAgony && !divineAgonyUsed && piedadeAvailable > 0;
  
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
      <div class="cain-roll-field">
        <label for="cain-roll-skill">Perícia:</label>
        <select id="cain-roll-skill" class="cain-roll-select">
          <option value="">-- Selecione --</option>
          ${skillOptionsHtml}
        </select>
      </div>

      <!-- VANTAGENS -->
      <div class="cain-roll-field">
        <label>Vantagens (+D):</label>
        <div class="cain-advantages-ctrl">
          <button id="btn-cain-adv-dec" class="btn btn-sm">-</button>
          <span class="cain-adv-val">${advantages}</span>
          <button id="btn-cain-adv-inc" class="btn btn-sm">+</button>
        </div>
      </div>

      <!-- DIFICULDADE -->
      <div class="cain-roll-field">
        <label>Dificuldade:</label>
        <div class="cain-diff-toggle-group">
          <label class="cain-diff-opt">
            <input type="radio" name="cain-difficulty" value="normal" ${!isDifficult ? 'checked' : ''}> Normal (4+)
          </label>
          <label class="cain-diff-opt">
            <input type="radio" name="cain-difficulty" value="hard" ${isDifficult ? 'checked' : ''}> Difícil (6)
          </label>
        </div>
      </div>

      <div class="cain-roll-info-row">
        <span class="cain-pool-display">Pool: <strong id="cain-pool-size">${poolSize}</strong>d6 ${poolSize === 0 && selectedSkillKey ? '<span class="cain-zero-pool-warning">(Rola 2d6, pega o menor)</span>' : ''}</span>
        <label class="cain-psyche-toggle ${psycheAvailable <= 0 ? 'disabled' : ''}">
          <input type="checkbox" id="cain-use-psyche" ${usePsyche && psycheAvailable > 0 ? 'checked' : ''} ${psycheAvailable <= 0 ? 'disabled' : ''}>
          Psyche Burst <span class="cain-psyche-badge">${psycheAvailable}</span>
        </label>
        <label class="cain-divine-agony-toggle">
          <input type="checkbox" id="cain-use-divine-agony" ${useDivineAgony ? 'checked' : ''}>
          Agonia Divina <span class="cain-piedade-badge">${piedadeAvailable}</span>
        </label>
      </div>
      <button id="btn-cain-roll" class="btn btn-primary" ${!selectedSkillKey ? 'disabled' : ''}>
        🎲 Rolar ${selectedSkillKey ? (poolSize > 0 ? `(${poolSize}d6)` : "(2d6 menor)") : ""}
      </button>
      <div id="cain-roll-results" class="cain-roll-results"></div>
      <div id="cain-roll-history" class="cain-roll-history"></div>
    </div>
  `;

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
  const disable3D = localStorage.getItem("assimilação_disable_3d") === "true";

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

  const riskDie = results[0];
  let successes = 0;
  const threshold = isDifficult ? 6 : 4;
  
  if (isZeroPool) {
    const activeDie = Math.min(results[0], results[1]);
    successes = activeDie >= threshold ? 1 : 0;
  } else {
    successes = results.filter(r => r >= threshold).length;
  }

  let stressGained = 0;
  let psycheGained = 0;
  let riskEffect = "";

  if (riskDie === 1) {
    stressGained = 1;
    char.stressCurrent = (char.stressCurrent || 0) + 1;
    riskEffect = "💥 Stress +1";

    if (char.stressCurrent >= 6) {
      char.stressCurrent = 0;
      const maxInj = char.injuriesMax !== undefined ? char.injuriesMax : 3;
      char.injuries = Math.min((char.injuries || 0) + 1, maxInj);
      riskEffect = "💥 FERIDA! Stress reset.";
    }
  } else if (riskDie === 6) {
    psycheGained = 1;
    char.psycheBursts = (char.psycheBursts || 0) + 1;
    riskEffect = "✨ Psyche Burst +1!";
  }

  saveCurrentCharacter();

  getSkillName(skillKey).then(skillName => {
    renderCainResult(results, riskDie, successes, riskEffect, skillName, skillVal, poolSize, usedPsyche, isZeroPool, isDifficult);
    appendToHistory(results, successes, riskEffect, skillName, isZeroPool, isDifficult);
  });

  import("./sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
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
    el.diceOverlay.classList.add("hidden");

    if (!notationResult.result || notationResult.result.length === 0 || notationResult.result[0] < 0) {
      alert("Erro na simulação 3D. Usando rolagem matemática.");
      performMathCainRoll(poolSize, skillKey, skillVal, usedPsyche, isDifficult);
      return;
    }

    const results = notationResult.result.slice(0, diceToRoll);
    const riskDie = results[0];
    let successes = 0;
    const threshold = isDifficult ? 6 : 4;
    
    if (isZeroPool) {
      const activeDie = Math.min(results[0], results[1]);
      successes = activeDie >= threshold ? 1 : 0;
    } else {
      successes = results.filter(r => r >= threshold).length;
    }

    const char = state.currentCharacter;
    if (!char) return;

    let riskEffect = "";
    if (riskDie === 1) {
      char.stressCurrent = (char.stressCurrent || 0) + 1;
      riskEffect = "💥 Stress +1";
      if (char.stressCurrent >= 6) {
        char.stressCurrent = 0;
        const maxInj = char.injuriesMax !== undefined ? char.injuriesMax : 3;
        char.injuries = Math.min((char.injuries || 0) + 1, maxInj);
        riskEffect = "💥 FERIDA! Stress reset.";
      }
    } else if (riskDie === 6) {
      char.psycheBursts = (char.psycheBursts || 0) + 1;
      riskEffect = "✨ Psyche Burst +1!";
    }

    saveCurrentCharacter();

    getSkillName(skillKey).then(skillName => {
      renderCainResult(results, riskDie, successes, riskEffect, skillName, skillVal, poolSize, usedPsyche, isZeroPool, isDifficult);
      appendToHistory(results, successes, riskEffect, skillName, isZeroPool, isDifficult);
    });

    import("./sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    renderCainRollPanel();
  });
}

async function getSkillName(key) {
  for (const group of Object.values(CAIN_SKILLS)) {
    if (group.skills[key]) return group.skills[key].name;
  }
  return key;
}

function renderCainResult(results, riskDie, successes, riskEffect, skillName, skillVal, poolSize, usedPsyche, isZeroPool, isDifficult) {
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
        <span class="cain-roll-die ${i === 0 ? 'cain-risk-die' : ''} ${statusClass}" title="${isMin ? 'Dado Escolhido (Menor)' : 'Dado Ignorado'}">
          ${val}
        </span>
      `;
    }).join("");
  } else {
    diceHtml = results.map((val, i) => `
      <span class="cain-roll-die ${i === 0 ? 'cain-risk-die' : ''} ${val >= threshold ? 'success' : 'fail'}">
        ${val}
      </span>
    `).join("");
  }

  el.innerHTML = `
    <div class="cain-roll-result-card card-glass">
      <div class="cain-roll-header">${skillName} ${isDifficult ? '<span class="cain-diff-badge-hard">Difícil</span>' : ''}</div>
      <div class="cain-roll-dice-row">
        ${diceHtml}
      </div>
      <div class="cain-roll-summary">
        <span class="cain-roll-successes">${successes > 0 ? 'Sucesso!' : 'Falha'} (${successes} sucesso${successes !== 1 ? 's' : ''})</span>
        ${riskEffect ? `<span class="cain-roll-risk-effect">${riskEffect}</span>` : '<span class="cain-roll-risk-effect safe">Sem efeito</span>'}
      </div>
      <div class="cain-roll-stats">
        <small>Pool: ${poolSize}d6 ${usedPsyche ? '(com Psyche Burst)' : ''} ${isZeroPool ? '(Reserva 0, pegou menor)' : ''}</small>
      </div>
    </div>
  `;
}

function appendToHistory(results, successes, riskEffect, skillName, isZeroPool, isDifficult) {
  if (!state.cainRollHistory) state.cainRollHistory = [];

  state.cainRollHistory.unshift({
    skillName,
    results: [...results],
    successes,
    riskEffect,
    isZeroPool,
    isDifficult,
    timestamp: Date.now()
  });

  if (state.cainRollHistory.length > 20) state.cainRollHistory.length = 20;

  const historyEl = document.getElementById("cain-roll-history");
  if (!historyEl) return;

  historyEl.innerHTML = state.cainRollHistory.map(entry => `
    <div class="cain-history-item">
      <span class="cain-history-skill">${entry.skillName} ${entry.isDifficult ? '(Difícil)' : ''}</span>
      <span class="cain-history-dice">[${entry.results.join(",")}] ${entry.isZeroPool ? '(Reserva 0)' : ''}</span>
      <span class="cain-history-successes">${entry.successes}s</span>
      ${entry.riskEffect ? `<span class="cain-history-risk">${entry.riskEffect}</span>` : ""}
    </div>
  `).join("");
}
