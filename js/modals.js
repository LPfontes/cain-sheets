
import { el, state, saveCurrentCharacter, loadCharacter, updateCloudSyncBadge, updateCharSelector } from "./state.js";
import { worldState, saveItemToDb } from "./world-state.js";
import { getFirebaseConfig } from "./config.js";
import { renderSavedMacrosSheet } from "./sheet.js";
import { ICONS } from "../icons.js";
import { getDieSymbolsHtml, getDieFaceImgSrc } from "./chat.js";
import { DICE_MAP } from "./roller.js";
import { logger } from "./logger.js";
import { esc } from "./screen-utils.js";
import { AGENDAS, BLASPHEMIES } from "./cain-data.js";
import { renderAgendaSheet, renderBlasphemiesSheet } from "./sheet.js";


export function openSettingsModal() {
  logger.info("Modal: Abrindo modal de configurações.");
  el.modalContainer.classList.remove("hidden");

  const disable3D = localStorage.getItem("assimilação_disable_3d") === "true";
  const char = state.currentCharacter;
  const currentMaxBubbles = (char && char.maxValueBubbles) || parseInt(localStorage.getItem("assimilação_max_value_bubbles")) || 5;

  el.modalBody.innerHTML = `
    <div class="settings-modal-content">
    <h3 class="modal-title">Configurações</h3>
    <div class="settings-modal-content" style="margin-top: 16px;">
      <div class="setting-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <div class="setting-info" style="flex: 1; padding-right: 16px;">
          <div class="setting-label" style="font-weight: 600; font-size: var(--font-size-md); color: var(--text-primary);">Desativar Dados 3D</div>
          <div class="setting-desc" style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: 4px;">Substitui a animação física dos dados por rolagens matemáticas instantâneas no chat.</div>
        </div>
        <div class="setting-control">
          <label class="theme-switch">
            <input type="checkbox" id="settings-disable-3d" ${disable3D ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="setting-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px;">
        <div class="setting-info" style="flex: 1; padding-right: 16px;">
          <div class="setting-label" style="font-weight: 600; font-size: var(--font-size-md); color: var(--text-primary);">Máximo de Bolhas de Valor (Aptidões)</div>
          <div class="setting-desc" style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: 4px;">Define a quantidade máxima de bolhas para Instintos, Conhecimentos e Práticas (Mínimo: 5).</div>
        </div>
        <div class="setting-control" style="display: flex; align-items: center; gap: 8px;">
          <button id="btn-bubbles-dec" class="btn btn-sm" style="padding: 2px 8px;">-</button>
          <strong id="val-bubbles-max" style="font-size: 14px; min-width: 20px; text-align: center;">${currentMaxBubbles}</strong>
          <button id="btn-bubbles-inc" class="btn btn-sm" style="padding: 2px 8px;">+</button>
        </div>
      </div>

      <div class="setting-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px;">
        <div class="setting-info" style="flex: 1; padding-right: 16px;">
          <div class="setting-label" style="font-weight: 600; font-size: var(--font-size-md); color: var(--text-primary);">Apagar Fichas (Local Storage)</div>
          <div class="setting-desc" style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: 4px;">Remove todos os personagens e dados locais criados neste navegador.</div>
        </div>
        <div class="setting-control">
          <button id="btn-clear-local-storage" class="btn btn-danger btn-sm" style="white-space: nowrap;">Apagar Dados</button>
        </div>
      </div>

      <div class="setting-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px;">
        <div class="setting-info" style="flex: 1; padding-right: 16px;">
          <div class="setting-label" style="font-weight: 600; font-size: var(--font-size-md); color: var(--text-primary);">Forçar Recarregamento (PWA Cache)</div>
          <div class="setting-desc" style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: 4px;">Limpa o cache offline e força o download da versão mais recente dos arquivos.</div>
        </div>
        <div class="setting-control">
          <button id="btn-clear-pwa-cache" class="btn btn-danger btn-sm" style="white-space: nowrap;">Forçar Recarga</button>
        </div>
      </div>
      
      <div class="setting-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px;">
        <div class="setting-info" style="flex: 1; padding-right: 16px;">
          <div class="setting-label" style="font-weight: 600; font-size: var(--font-size-md); color: var(--text-primary);">Gerenciador de Armazenamento</div>
          <div class="setting-desc" style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: 4px;">Gerencie, delete ou exporte individualmente fichas de personagens, refúgios, regiões, conflitos, locais e pacotes de Homebrew.</div>
        </div>
        <div class="setting-control">
          <button id="btn-open-storage-manager" class="btn btn-md" style="white-space: nowrap; border-color: var(--border-color); color: var(--border-color); background: rgba(0,162,255,0.05);">Gerenciar Dados</button>
        </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
        <button id="btn-save-settings" class="btn btn-md">Fechar</button>
      </div>
    </div>
  </div>
  `;

  const checkbox = document.getElementById("settings-disable-3d");
  checkbox.addEventListener("change", (e) => {
    localStorage.setItem("assimilação_disable_3d", e.target.checked ? "true" : "false");
    logger.info(`Configurações: assimilação_disable_3d alterada para ${e.target.checked}`);
  });

  const updateBubblesMax = (newVal) => {
    newVal = Math.max(5, newVal);
    document.getElementById("val-bubbles-max").textContent = newVal;
    localStorage.setItem("assimilação_max_value_bubbles", newVal.toString());
    if (char) {
      char.maxValueBubbles = newVal;
      saveCurrentCharacter();
      renderAptitudesSheet();
    }
  };

  document.getElementById("btn-bubbles-dec").addEventListener("click", () => {
    const curVal = (char && char.maxValueBubbles) || parseInt(localStorage.getItem("assimilação_max_value_bubbles")) || 5;
    updateBubblesMax(curVal - 1);
  });

  document.getElementById("btn-bubbles-inc").addEventListener("click", () => {
    const curVal = (char && char.maxValueBubbles) || parseInt(localStorage.getItem("assimilação_max_value_bubbles")) || 5;
    updateBubblesMax(curVal + 1);
  });

  const clearStorageBtn = document.getElementById("btn-clear-local-storage");
  clearStorageBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todos os personagens salvos localmente? Essa ação não pode ser desfeita.")) {
      logger.info("Configurações: Apagando localStorage e sessionStorage.");
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  });

  const clearCacheBtn = document.getElementById("btn-clear-pwa-cache");
  clearCacheBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja limpar o cache do aplicativo e forçar o recarregamento? Os personagens salvos localmente serão preservados.")) {
      logger.info("Configurações: Limpando Cache Storage e desregistrando Service Workers.");

      const unregisterPromises = [];
      if ('serviceWorker' in navigator) {
        unregisterPromises.push(
          navigator.serviceWorker.getRegistrations().then(registrations => {
            return Promise.all(registrations.map(reg => reg.unregister()));
          })
        );
      }

      if ('caches' in window) {
        unregisterPromises.push(
          caches.keys().then(keys => {
            return Promise.all(keys.map(key => caches.delete(key)));
          })
        );
      }

      Promise.all(unregisterPromises).finally(() => {
        window.location.reload(true);
      });
    }
  });

  document.getElementById("btn-open-storage-manager").addEventListener("click", () => {
    el.modalContainer.classList.add("hidden");
    setTimeout(() => {
      openStorageManagerModal();
    }, 150);
  });

  document.getElementById("btn-save-settings").addEventListener("click", () => {
    el.modalContainer.classList.add("hidden");
  });
}

// ==========================================

export function openCustomRollModal(macroToEdit = null) {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info(`Modal: Abrindo modal de rolagem personalizada (${macroToEdit ? 'Editar' : 'Criar'}).`);

  const defaultMacro = {
    name: "",
    assimilada: false,
    instinto: "",
    instinto2: "",
    instintoBonus: 0,
    skill: "",
    skillBonus: 0,
    bonusSuccesses: 0,
    bonusPressures: 0,
    bonusAdaptations: 0,
    maxKeep: 1,
    d12Bonus: 0
  };

  const macro = macroToEdit ? { ...defaultMacro, ...macroToEdit } : { ...defaultMacro };

  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <h3 class="modal-title">${macroToEdit ? "Editar Rolagem" : "Nova Rolagem Personalizada"}</h3>
    <form id="form-custom-roll" style="display:flex; flex-direction:column; gap:12px; margin-top:12px;">
      <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
        <label for="macro-name" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Nome da Rolagem:</label>
        <input type="text" id="macro-name" value="${esc(macro.name)}" placeholder="Ex: Ataque Rápido, Furtividade Sutil" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" required />
      </div>

      <div class="form-group" style="display:flex; align-items:center; justify-content:space-between; background: rgba(0, 162, 255, 0.08); border: 1px dashed rgba(0, 162, 255, 0.3); padding: 8px; border-radius: 4px;">
        <span style="font-weight:bold; font-size:12px; color:var(--text-secondary); user-select:none;">Rolagem Assimilada (Consome 1 Assimilação / 2 Determinação e rola d12)</span>
        <label class="theme-switch">
          <input type="checkbox" id="macro-assimilada" ${macro.assimilada ? "checked" : ""}>
          <span class="slider"></span>
        </label>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label id="label-instinto-1" for="macro-instinto" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Instinto (d6):</label>
          <select id="macro-instinto" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;">
            <option value="">-- Nenhum --</option>
            <option value="Influência" ${macro.instinto === "Influência" ? "selected" : ""}>Influência</option>
            <option value="Percepção" ${macro.instinto === "Percepção" ? "selected" : ""}>Percepção</option>
            <option value="Potência" ${macro.instinto === "Potência" ? "selected" : ""}>Potência</option>
            <option value="Reação" ${macro.instinto === "Reação" ? "selected" : ""}>Reação</option>
            <option value="Resolução" ${macro.instinto === "Resolução" ? "selected" : ""}>Resolução</option>
            <option value="Sagacidade" ${macro.instinto === "Sagacidade" ? "selected" : ""}>Sagacidade</option>
          </select>
        </div>
        <div class="form-group" id="group-instinto-bonus" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-instinto-bonus" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Bônus Dados Instinto (d6):</label>
          <input type="number" id="macro-instinto-bonus" value="${macro.instintoBonus}" min="-5" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" />
        </div>
        <div class="form-group" id="group-instinto-2" style="display:none; flex-direction:column; gap:4px;">
          <label for="macro-instinto-2" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Instinto 2 (d12):</label>
          <select id="macro-instinto-2" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;">
            <option value="">-- Nenhum --</option>
            <option value="Influência" ${macro.instinto2 === "Influência" ? "selected" : ""}>Influência</option>
            <option value="Percepção" ${macro.instinto2 === "Percepção" ? "selected" : ""}>Percepção</option>
            <option value="Potência" ${macro.instinto2 === "Potência" ? "selected" : ""}>Potência</option>
            <option value="Reação" ${macro.instinto2 === "Reação" ? "selected" : ""}>Reação</option>
            <option value="Resolução" ${macro.instinto2 === "Resolução" ? "selected" : ""}>Resolução</option>
            <option value="Sagacidade" ${macro.instinto2 === "Sagacidade" ? "selected" : ""}>Sagacidade</option>
          </select>
        </div>
      </div>

      <div id="group-skill-container" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-skill" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Conhecimento / Prática (d10):</label>
          <select id="macro-skill" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;">
            <option value="">-- Nenhum --</option>
            <optgroup label="Conhecimentos">
              <option value="Biologia" ${macro.skill === "Biologia" ? "selected" : ""}>Biologia</option>
              <option value="Erudição" ${macro.skill === "Erudição" ? "selected" : ""}>Erudição</option>
              <option value="Engenharia" ${macro.skill === "Engenharia" ? "selected" : ""}>Engenharia</option>
              <option value="Geografia" ${macro.skill === "Geografia" ? "selected" : ""}>Geografia</option>
              <option value="Medicina" ${macro.skill === "Medicina" ? "selected" : ""}>Medicina</option>
              <option value="Segurança" ${macro.skill === "Segurança" ? "selected" : ""}>Segurança</option>
            </optgroup>
            <optgroup label="Práticas">
              <option value="Armas" ${macro.skill === "Armas" ? "selected" : ""}>Armas</option>
              <option value="Atletismo" ${macro.skill === "Atletismo" ? "selected" : ""}>Atletismo</option>
              <option value="Expressão" ${macro.skill === "Expressão" ? "selected" : ""}>Expressão</option>
              <option value="Furtividade" ${macro.skill === "Furtividade" ? "selected" : ""}>Furtividade</option>
              <option value="Manufaturas" ${macro.skill === "Manufaturas" ? "selected" : ""}>Manufaturas</option>
              <option value="Sobrevivência" ${macro.skill === "Sobrevivência" ? "selected" : ""}>Sobrevivência</option>
            </optgroup>
          </select>
        </div>
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-skill-bonus" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Bônus Dados Skill (d10):</label>
          <input type="number" id="macro-skill-bonus" value="${macro.skillBonus}" min="-5" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-bonus-successes" style="font-weight:bold; font-size:11px; color:var(--text-secondary);">Sucessos Extras:</label>
          <input type="number" id="macro-bonus-successes" value="${macro.bonusSuccesses}" min="-5" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" />
        </div>
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-bonus-pressures" style="font-weight:bold; font-size:11px; color:var(--text-secondary);">Pressões Extras:</label>
          <input type="number" id="macro-bonus-pressures" value="${macro.bonusPressures}" min="-5" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" />
        </div>
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-bonus-adaptations" style="font-weight:bold; font-size:11px; color:var(--text-secondary);">Adaptações Extras:</label>
          <input type="number" id="macro-bonus-adaptations" value="${macro.bonusAdaptations}" min="-5" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-max-keep" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Dados a Manter:</label>
          <input type="number" id="macro-max-keep" value="${macro.maxKeep}" min="1" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" required />
        </div>
        <div class="form-group" style="display:flex; flex-direction:column; gap:4px;">
          <label for="macro-d12-bonus" style="font-weight:bold; font-size:12px; color:var(--text-secondary);">Bônus Dados d12:</label>
          <input type="number" id="macro-d12-bonus" value="${macro.d12Bonus || 0}" min="0" max="10" style="width:100%; padding:8px; font-size:14px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:var(--text-primary); border-radius:4px;" />
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
        <button type="button" class="btn btn-close-macro" style="border-color:var(--text-muted); color:var(--text-muted);">Cancelar</button>
        <button type="submit" class="btn btn-success">Salvar Rolagem</button>
      </div>
    </form>
  `;

  const closeForm = () => {
    el.modalContainer.classList.add("hidden");
  };

  el.modalBody.querySelector(".btn-close-macro").addEventListener("click", closeForm);

  const checkboxAss = el.modalBody.querySelector("#macro-assimilada");
  const labelInst1 = el.modalBody.querySelector("#label-instinto-1");
  const groupInstBonus = el.modalBody.querySelector("#group-instinto-bonus");
  const groupInst2 = el.modalBody.querySelector("#group-instinto-2");
  const groupSkill = el.modalBody.querySelector("#group-skill-container");
  const inputMaxKeep = el.modalBody.querySelector("#macro-max-keep");

  const updateFormFields = () => {
    const isAss = checkboxAss.checked;
    if (isAss) {
      labelInst1.textContent = "Instinto 1 (d12):";
      groupInstBonus.style.display = "none";
      groupInst2.style.display = "flex";
      groupSkill.style.display = "none";
      if (parseInt(inputMaxKeep.value) === 1 && !macroToEdit) {
        inputMaxKeep.value = 2;
      }
    } else {
      labelInst1.textContent = "Instinto (d6):";
      groupInstBonus.style.display = "flex";
      groupInst2.style.display = "none";
      groupSkill.style.display = "grid";
      if (parseInt(inputMaxKeep.value) === 2 && !macroToEdit) {
        inputMaxKeep.value = 1;
      }
    }
  };

  checkboxAss.addEventListener("change", updateFormFields);
  updateFormFields();

  const form = el.modalBody.querySelector("#form-custom-roll");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("macro-name").value.trim();
    const assimilada = checkboxAss.checked;
    const instinto = document.getElementById("macro-instinto").value;
    const instinto2 = assimilada ? document.getElementById("macro-instinto-2").value : "";
    const instintoBonus = assimilada ? 0 : (parseInt(document.getElementById("macro-instinto-bonus").value) || 0);
    const skill = assimilada ? "" : document.getElementById("macro-skill").value;
    const skillBonus = assimilada ? 0 : (parseInt(document.getElementById("macro-skill-bonus").value) || 0);
    const bonusSuccesses = parseInt(document.getElementById("macro-bonus-successes").value) || 0;
    const bonusPressures = parseInt(document.getElementById("macro-bonus-pressures").value) || 0;
    const bonusAdaptations = parseInt(document.getElementById("macro-bonus-adaptations").value) || 0;
    const maxKeep = parseInt(document.getElementById("macro-max-keep").value) || 1;
    const d12Bonus = parseInt(document.getElementById("macro-d12-bonus").value) || 0;

    if (!char.savedRolls) char.savedRolls = [];

    const savedMacro = {
      id: macro.id || "macro_" + Date.now(),
      name,
      assimilada,
      instinto,
      instinto2,
      instintoBonus,
      skill,
      skillBonus,
      bonusSuccesses,
      bonusPressures,
      bonusAdaptations,
      maxKeep,
      d12Bonus
    };

    if (macro.id) {
      const idx = char.savedRolls.findIndex(m => m.id === macro.id);
      if (idx !== -1) char.savedRolls[idx] = savedMacro;
    } else {
      char.savedRolls.push(savedMacro);
    }

    saveCurrentCharacter();
    renderSavedMacrosSheet();
    closeForm();
  });
}

// ============================================================================
// SISTEMA DE SINCRONIZAÇÃO EM NUVEM E LIMITAÇÃO DE ESPAÇO (SIMULADO / FIREBASE)
// ============================================================================

const MOCK_CLOUD_DB_KEY = "assimilação_mock_cloud_db";
let cloudCharactersCache = [];

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

async function initRealFirebase() {
  if (firebaseApp) return { auth: firebaseAuth, db: firebaseDb };

  const config = await getFirebaseConfig();
  if (!config) return null;

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    firebaseApp = initializeApp(config);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);

    return { auth: firebaseAuth, db: firebaseDb };
  } catch (e) {
    console.error("Falha ao inicializar o Firebase Real:", e);
    return null;
  }
}

export function getCloudStorageInfo() {
  const sheets = state.useRealFirebase ? cloudCharactersCache : (getMockCloudDB()[state.currentUser?.uid] || []);
  const count = sheets.length;
  const jsonStr = JSON.stringify(sheets);
  const sizeBytes = new Blob([jsonStr]).size; // tamanho em bytes
  const sizeKB = (sizeBytes / 1024);

  return {
    count,
    maxCount: 10,
    sizeKB: sizeKB,
    maxSizeKB: 10240
  };
}

function getMockCloudDB() {
  return JSON.parse(localStorage.getItem(MOCK_CLOUD_DB_KEY)) || {};
}

function saveMockCloudDB(db) {
  localStorage.setItem(MOCK_CLOUD_DB_KEY, JSON.stringify(db));
}

export async function openCloudSyncModal() {
  openStorageManagerModal("nuvem");
}

// Ouvinte do evento beforeunload para alertar antes de fechar a aba
window.addEventListener("beforeunload", (e) => {
  if (state.currentUser && state.hasUnsavedCloudChanges) {
    e.preventDefault();
    e.returnValue = "Você possui alterações na ficha que não foram salvas na nuvem. Sincronize antes de sair!";
    return e.returnValue;
  }
});

// Modal para gerenciar todo o conteúdo armazenado localmente
export async function openStorageManagerModal(defaultTab = "fichas") {
  logger.info("Modal: Abrindo gerenciador de armazenamento.");
  el.modalContainer.classList.remove("hidden");

  // Importar o worldState e helpers dinamicamente
  const { worldState, deleteRefugio, deleteRegiao, deleteConflito, deleteLocal, loadAllWorldData } = await import("./world-state.js");

  // Garantir que todos os dados do mundo estejam carregados na memória
  loadAllWorldData();

  let activeTab = defaultTab; // "fichas" | "mundo" | "homebrew" | "nuvem" | "backup"

  // Detectar se há configurações no .env / config para o Firebase
  const config = await getFirebaseConfig();
  state.useRealFirebase = !!config;

  // Carregar cache real se logado
  if (state.useRealFirebase && state.currentUser && cloudCharactersCache.length === 0) {
    try {
      const firebase = await initRealFirebase();
      if (firebase) {
        const { getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
        const snap = await getDocs(q);
        const cloudSheets = [];
        snap.forEach(d => cloudSheets.push(d.data()));
        cloudCharactersCache = cloudSheets;
      }
    } catch (e) {
      console.warn("Erro ao carregar dados do Firebase no cache:", e);
    }
  }

  // Função utilitária compartilhada para fazer o upload de qualquer ficha
  async function pushCharacterToCloud(char) {
    const stats = getCloudStorageInfo();
    const characterId = char.id;

    if (state.useRealFirebase) {
      try {
        const firebase = await initRealFirebase();
        if (!firebase) return;

        const { doc, setDoc, getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

        // Buscar fichas atuais do Firestore para validação de limites
        const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
        const snap = await getDocs(q);
        const cloudSheets = [];
        snap.forEach(d => cloudSheets.push(d.data()));

        const exists = cloudSheets.some(c => c.id === characterId);

        // Validação de limite de quantidade (máximo 5)
        if (!exists && cloudSheets.length >= stats.maxCount) {
          alert(`Erro de Limite: Você atingiu o limite de ${stats.maxCount} fichas salvas na nuvem. Apague uma ficha no Firestore antes de adicionar outra.`);
          renderContent();
          return;
        }

        // Validação de limite de espaço (máximo 100 KB)
        const updatedSheets = [...cloudSheets.filter(c => c.id !== characterId), char];
        const newSizeBytes = new Blob([JSON.stringify(updatedSheets)]).size;
        const newSizeKB = newSizeBytes / 1024;
        if (newSizeKB > stats.maxSizeKB) {
          alert(`Erro de Espaço: Limite de armazenamento de ${stats.maxSizeKB} KB excedido (tamanho necessário: ${newSizeKB.toFixed(2)} KB). Reduza o tamanho de anotações ou remova outras fichas.`);
          renderContent();
          return;
        }

        // Gravação no Firestore
        const docData = {
          ...char,
          userId: state.currentUser.uid,
          lastUpdated: Date.now()
        };
        await setDoc(doc(firebase.db, "characters", characterId), docData);

        // Atualiza cache e UI
        cloudCharactersCache = updatedSheets;
        if (state.currentCharacter && state.currentCharacter.id === characterId) {
          state.hasUnsavedCloudChanges = false;
          localStorage.setItem("assimilação_has_unsaved_changes", "false");
        }
        logger.info(`Sincronização Firestore: Ficha de "${char.name}" salva com sucesso.`);

        alert(`Ficha de "${char.name}" salva no Firestore com sucesso!`);
        renderContent();
        updateCloudSyncBadge();
      } catch (err) {
        logger.error("Erro ao salvar no Firestore:", err);
        alert("Erro ao gravar dados na nuvem real. Verifique sua conexão e regras do Firestore.");
        renderContent();
      }
    } else {
      // Modo simulado
      const db = getMockCloudDB();
      const uid = state.currentUser.uid;
      const userSheets = db[uid] || [];

      const existsIndex = userSheets.findIndex(c => c.id === characterId);

      const pendingSheets = [...userSheets];
      if (existsIndex !== -1) {
        pendingSheets[existsIndex] = char;
      } else {
        pendingSheets.push(char);
      }

      // Valida limite de quantidade
      if (existsIndex === -1 && userSheets.length >= stats.maxCount) {
        alert(`Erro de Limite: Você atingiu o limite de ${stats.maxCount} fichas salvas na nuvem. Apague uma ficha no banco antes de adicionar outra.`);
        renderContent();
        return;
      }

      // Valida limite de espaço (100 KB)
      const newSizeBytes = new Blob([JSON.stringify(pendingSheets)]).size;
      const newSizeKB = newSizeBytes / 1024;
      if (newSizeKB > stats.maxSizeKB) {
        alert(`Erro de Espaço: Limite de armazenamento de ${stats.maxSizeKB} KB excedido (tamanho necessário: ${newSizeKB.toFixed(2)} KB). Reduza o tamanho de anotações ou remova outras fichas.`);
        renderContent();
        return;
      }

      // Salva
      db[uid] = pendingSheets;
      saveMockCloudDB(db);

      if (state.currentCharacter && state.currentCharacter.id === characterId) {
        state.hasUnsavedCloudChanges = false;
        localStorage.setItem("assimilação_has_unsaved_changes", "false");
      }
      logger.info(`Sincronização: Ficha de "${char.name}" sincronizada com a nuvem.`);

      alert(`Ficha de "${char.name}" enviada com sucesso!`);
      renderContent();
      updateCloudSyncBadge();
    }
  }

  const renderContent = () => {
    let html = "";

    if (activeTab === "fichas") {
      html = `
        <h4 style="font-family:var(--font-heading); margin-bottom:12px; color:var(--text-primary);">Personagens Salvos (${state.characters.length})</h4>
        ${state.characters.length === 0 ? `
          <p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhum personagem salvo.</p>
        ` : `
          <div style="display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto; padding-right:4px;">
            ${state.characters.map(char => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:10px; border-radius:4px; border:1px solid rgba(255,255,255,0.05);">
                <div>
                  <div style="font-weight:600; color:var(--text-primary); font-size:var(--font-size-sm);">${char.name}</div>
                  <div style="font-size:var(--font-size-xs); color:var(--text-secondary);">${char.ocupacao || "Sem Ocupação"}</div>
                </div>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-sm btn-export-char" data-id="${char.id}" style="padding:4px 8px;">📥 Exportar</button>
                  <button class="btn btn-sm btn-danger btn-delete-char" data-id="${char.id}" style="padding:4px 8px;">❌ Excluir</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;
    } else if (activeTab === "mundo") {
      html = `
        <!-- Refúgios -->
        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--border-color); font-size:var(--font-size-sm);">Refúgios (${worldState.refugios.length})</h4>
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; max-height:120px; overflow-y:auto; padding-right:4px;">
          ${worldState.refugios.length === 0 ? `<p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhum refúgio salvo.</p>` :
          worldState.refugios.map(r => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                <span style="font-size:var(--font-size-xs); color:var(--text-primary);">${r.nome}</span>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-xs btn-export-refugio" data-id="${r.id}" style="padding:2px 6px; font-size:10px;">📥 Exportar</button>
                  <button class="btn btn-xs btn-danger btn-delete-refugio" data-id="${r.id}" style="padding:2px 6px; font-size:10px;">❌ Excluir</button>
                </div>
              </div>
            `).join('')
        }
        </div>

        <!-- Regiões -->
        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--color-conhecimentos); font-size:var(--font-size-sm);">Regiões (${worldState.regioes.length})</h4>
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; max-height:120px; overflow-y:auto; padding-right:4px;">
          ${worldState.regioes.length === 0 ? `<p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhuma região salva.</p>` :
          worldState.regioes.map(r => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                <span style="font-size:var(--font-size-xs); color:var(--text-primary);">${r.nome}</span>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-xs btn-export-regiao" data-id="${r.id}" style="padding:2px 6px; font-size:10px;">📥 Exportar</button>
                  <button class="btn btn-xs btn-danger btn-delete-regiao" data-id="${r.id}" style="padding:2px 6px; font-size:10px;">❌ Excluir</button>
                </div>
              </div>
            `).join('')
        }
        </div>

        <!-- Conflitos -->
        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--color-danger); font-size:var(--font-size-sm);">Conflitos (${worldState.conflitos.length})</h4>
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; max-height:120px; overflow-y:auto; padding-right:4px;">
          ${worldState.conflitos.length === 0 ? `<p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhum conflito salvo.</p>` :
          worldState.conflitos.map(c => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                <span style="font-size:var(--font-size-xs); color:var(--text-primary);">${c.nome}</span>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-xs btn-export-conflito" data-id="${c.id}" style="padding:2px 6px; font-size:10px;">📥 Exportar</button>
                  <button class="btn btn-xs btn-danger btn-delete-conflito" data-id="${c.id}" style="padding:2px 6px; font-size:10px;">❌ Excluir</button>
                </div>
              </div>
            `).join('')
        }
        </div>

        <!-- Locais -->
        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--color-praticas); font-size:var(--font-size-sm);">Locais (${worldState.locais.length})</h4>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:120px; overflow-y:auto; padding-right:4px;">
          ${worldState.locais.length === 0 ? `<p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhum local salvo.</p>` :
          worldState.locais.map(l => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                <span style="font-size:var(--font-size-xs); color:var(--text-primary);">${l.nome}</span>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-xs btn-export-local" data-id="${l.id}" style="padding:2px 6px; font-size:10px;">📥 Exportar</button>
                  <button class="btn btn-xs btn-danger btn-delete-local" data-id="${l.id}" style="padding:2px 6px; font-size:10px;">❌ Excluir</button>
                </div>
              </div>
            `).join('')
        }
        </div>
      `;
    } else if (activeTab === "homebrew") {
      const customTraits = getCustomTraits();
      const customMutations = getCustomMutations();

      html = `
        <!-- Características Homebrew -->
        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--text-primary); font-size:var(--font-size-sm);">Características Customizadas (${customTraits.length})</h4>
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; max-height:150px; overflow-y:auto; padding-right:4px;">
          ${customTraits.length === 0 ? `<p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhuma característica criada.</p>` :
          customTraits.map((t, idx) => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                <div>
                  <span style="font-size:var(--font-size-xs); font-weight:600; color:var(--text-primary);">${t.nome}</span>
                  <small style="font-size:10px; color:var(--text-secondary); margin-left:6px;">(Custo: ${t.custo} XP)</small>
                </div>
                <button class="btn btn-xs btn-danger btn-delete-custom-trait" data-idx="${idx}" style="padding:2px 6px; font-size:10px;">❌ Excluir</button>
              </div>
            `).join('')
        }
        </div>

        <!-- Mutações Homebrew -->
        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--text-primary); font-size:var(--font-size-sm);">Mutações Customizadas (${customMutations.length})</h4>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:150px; overflow-y:auto; padding-right:4px;">
          ${customMutations.length === 0 ? `<p style="font-size:var(--font-size-xs); color:var(--text-secondary);">Nenhuma mutação criada.</p>` :
          customMutations.map((m, idx) => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                <div>
                  <span style="font-size:var(--font-size-xs); font-weight:600; color:var(--text-primary);">${m.name}</span>
                  <small style="font-size:10px; color:var(--text-secondary); margin-left:6px;">(${m.suit.toUpperCase()})</small>
                </div>
                <button class="btn btn-xs btn-danger btn-delete-custom-mutation" data-idx="${idx}" style="padding:2px 6px; font-size:10px;">❌ Excluir</button>
              </div>
            `).join('')
        }
        </div>
      `;
    } else if (activeTab === "nuvem") {
      if (!state.currentUser) {
        html = `
          <h4 style="font-family:var(--font-heading); margin-bottom:12px; color:var(--text-primary);">Sincronização em Nuvem</h4>
          <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 40px; margin-bottom: 16px; color: var(--border-color);">☁️</div>
            <p style="font-size: var(--font-size-sm); color: var(--text-primary); margin-bottom: 8px;">Salve suas fichas na nuvem de forma segura.</p>
            <p style="font-size: var(--font-size-xs); color: var(--text-secondary); margin-bottom: 20px; max-width: 320px; margin-left: auto; margin-right: auto; line-height: 1.4;">
              Conecte-se com sua conta Google para enviar suas fichas locais e acessá-las em qualquer outro navegador ou dispositivo móvel.
            </p>
            
            <button id="btn-google-sign-in" class="btn" style="background: #fff; color: #1f1f1f; border-color: #fff; padding: 10px 20px; font-weight: bold; border-radius: 4px; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.56 2.69-3.86 2.69-6.57zm-8.64 6.8c1.89 0 3.48-.63(4.64)-1.7l-2.9-2.24c-.8.54-1.84.86-2.9.86-2.23 0-4.12-1.51-4.8-3.53H.07v2.32C1.23 14 5.02 16 9 16zm-4.8-7.93c-.17-.5-.26-1.03-.26-1.57s.09-1.07.26-1.57V2.63H.07C-.48 3.74-.8 4.97-.8 6.28s.32 2.54.87 3.65l3.27-2.53zm4.8-4.87c1.03 0 1.95.35 2.68 1.05l2.01-2.01C11.53.86 9.89.5 9 .5 5.02.5 1.23 2.5.07 6.28l3.27 2.53c.68-2.02 2.57-3.53 4.8-3.53z" fill="#4285F4"/>
              </svg>
              Entrar com o Google
            </button>
          </div>
        `;
      } else {
        const stats = getCloudStorageInfo();
        const sizePercent = Math.min(100, (stats.sizeKB / stats.maxSizeKB) * 100);
        const countPercent = Math.min(100, (stats.count / stats.maxCount) * 100);

        // Listar outros personagens locais para enviar
        const otherCharacters = state.characters.filter(c => !state.currentCharacter || c.id !== state.currentCharacter.id);
        let otherCharactersHtml = "";
        if (otherCharacters.length > 0) {
          otherCharactersHtml = `
            <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; text-align: left;">
              <h5 style="font-size: 11px; margin-bottom: 8px; color: var(--text-primary); text-transform: uppercase; font-family:var(--font-heading);">Enviar Outras Fichas</h5>
              <div style="display:flex; flex-direction:column; gap:6px;">
                ${otherCharacters.map(char => `
                  <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                    <span style="font-size:11px; color:var(--text-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:160px;">${char.name}</span>
                    <button class="btn btn-xs btn-cloud-push-other" data-char-id="${char.id}" style="padding:2px 6px; font-size:10px; border-color:var(--border-color); color:var(--border-color); background:rgba(0,162,255,0.04); cursor:pointer;">
                      📤 Enviar
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        let cloudCharactersHtml = "";
        if (cloudCharactersCache && cloudCharactersCache.length > 0) {
          cloudCharactersHtml = `
              <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; text-align: left;">
                <h5 style="font-size: 11px; margin-bottom: 8px; color: var(--text-primary); text-transform: uppercase; font-family:var(--font-heading);">Fichas na Nuvem</h5>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${cloudCharactersCache.map(char => `
                    <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:6px; border-radius:4px; border:1px solid rgba(255,255,255,0.04);">
                      <span style="font-size:11px; color:var(--text-primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:160px;">${char.name}</span>
                      <button class="btn btn-xs btn-cloud-delete-char" data-char-id="${char.id}" style="padding:2px 6px; font-size:10px; border-color:var(--color-danger); color:var(--color-danger); background:rgba(239,68,68,0.04); cursor:pointer;">
                        🗑️ Apagar
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
        }

        html = `
          <!-- Perfil do Usuário -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px; background:rgba(255,255,255,0.04); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--border-color); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:16px; color:#fff;">
              ${state.currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <div style="flex:1; text-align:left;">
              <div style="font-weight:600; color:var(--text-primary); font-size:var(--font-size-sm);">${state.currentUser.displayName}</div>
              <div style="font-size:10px; color:var(--text-secondary);">${state.currentUser.email}</div>
            </div>
            <button id="btn-google-sign-out" class="btn btn-xs btn-danger" style="padding: 4px 8px;">Sair</button>
          </div>

          <!-- Status de Sincronização -->
          ${state.hasUnsavedCloudChanges ? `
            <div style="background:rgba(255, 102, 0, 0.08); border:1px solid var(--color-orange); color:var(--color-orange); padding:8px; border-radius:4px; font-size:11px; margin-bottom:16px; display:flex; align-items:center; gap:6px;">
              <span>⚠️</span>
              <span>Modificações pendentes de envio!</span>
            </div>
          ` : `
            <div style="background:rgba(0, 255, 102, 0.05); border:1px solid var(--color-praticas); color:var(--color-praticas); padding:8px; border-radius:4px; font-size:11px; margin-bottom:16px; display:flex; align-items:center; gap:6px;">
              <span>✔️</span>
              <span>Sincronizado com o Firebase</span>
            </div>
          `}

          <!-- Limites de Armazenamento -->
          <div style="margin-bottom:10px; text-align:left;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); margin-bottom:2px;">
              <span>Espaço:</span>
              <strong>${stats.sizeKB.toFixed(2)} KB / ${stats.maxSizeKB} KB</strong>
            </div>
            <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
              <div style="width:${sizePercent}%; height:100%; background:var(--border-color);"></div>
            </div>
          </div>

          <div style="margin-bottom:16px; text-align:left;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); margin-bottom:2px;">
              <span>Fichas na Nuvem:</span>
              <strong>${stats.count} / ${stats.maxCount}</strong>
            </div>
            <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
              <div style="width:${countPercent}%; height:100%; background:var(--border-color);"></div>
            </div>
          </div>

          <!-- Ações principais -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <button id="btn-cloud-push" class="btn" style="border-color: var(--border-color); color: var(--border-color); font-weight: bold; background: rgba(0,162,255,0.05); padding: 8px; font-size:11px; cursor:pointer;">
              📤 Enviar Atual
            </button>
            <button id="btn-cloud-pull" class="btn" style="border-color: var(--color-praticas); color: var(--color-praticas); font-weight: bold; background: rgba(0,255,102,0.05); padding: 8px; font-size:11px; cursor:pointer;">
              📥 Puxar Nuvem
            </button>
          </div>

          <!-- Listagem da Nuvem -->
          ${cloudCharactersHtml}

          <!-- Outras Fichas -->
          ${otherCharactersHtml}
        `;
      }
    } else if (activeTab === "backup") {
      html = `
        <h4 style="font-family:var(--font-heading); margin-bottom:12px; color:var(--text-primary);">Backup e Importação Completa</h4>
        <p style="font-size:var(--font-size-xs); color:var(--text-secondary); margin-bottom:20px; line-height:1.4;">
          Exporte absolutamente tudo do seu jogo (todas as fichas de personagens, refúgios, regiões, conflitos, locais e customizações de homebrew) em um único arquivo de backup completo, ou restaure um backup existente.
        </p>

        <!-- Botões de Ação de Backup -->
        <div style="display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:24px;">
          <button id="btn-export-all-backup" class="btn btn-block" style="border-color:var(--border-color); color:var(--border-color); background:rgba(0,162,255,0.05); padding:10px; font-weight:bold;">
            📤 Exportar Backup Completo (.JSON)
          </button>
          
          <button id="btn-trigger-import-backup" class="btn btn-block" style="border-color:var(--color-praticas); color:var(--color-praticas); background:rgba(0,255,102,0.05); padding:10px; font-weight:bold;">
            📥 Importar Backup Completo (.JSON)
          </button>
          <input type="file" id="file-import-all-backup" accept=".json" style="display:none;">
        </div>

        <h4 style="font-family:var(--font-heading); margin-bottom:8px; color:var(--color-danger); font-size:var(--font-size-sm);">Zona de Risco</h4>
        <div style="background:rgba(239,68,68,0.08); border:1px solid var(--color-danger); padding:12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
          <div style="flex:1; padding-right:12px;">
            <div style="font-size:var(--font-size-xs); font-weight:bold; color:#fff; margin-bottom:2px;">Apagar Tudo do Navegador</div>
            <div style="font-size:10px; color:var(--text-secondary);">Isso limpará absolutamente todas as fichas locais, dados do mundo, e homebrews permanentemente.</div>
          </div>
          <button id="btn-wipe-everything" class="btn btn-danger btn-sm" style="white-space:nowrap;">Limpar Tudo</button>
        </div>
      `;
    }

    el.modalBody.innerHTML = `
      <h3 class="modal-title">Gerenciador de Armazenamento</h3>
      
      <!-- Tab Bar -->
      <div class="lib-tab-bar" style="margin-top:16px; margin-bottom:16px;">
        <button class="lib-tab ${activeTab === 'fichas' ? 'active' : ''}" data-tab="fichas">👤 Fichas</button>
        <button class="lib-tab ${activeTab === 'mundo' ? 'active' : ''}" data-tab="mundo">🌍 Mundo</button>
        <button class="lib-tab ${activeTab === 'homebrew' ? 'active' : ''}" data-tab="homebrew">🧪 Custom</button>
        <button class="lib-tab ${activeTab === 'nuvem' ? 'active' : ''}" data-tab="nuvem">☁️ Nuvem</button>
        <button class="lib-tab ${activeTab === 'backup' ? 'active' : ''}" data-tab="backup">💾 Backup</button>
      </div>

      <!-- Tab Content Area -->
      <div class="storage-tab-content-container" style="min-height:280px; margin-bottom:20px;">
        ${html}
      </div>

      <!-- Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:16px;">
        <button id="btn-back-to-settings" class="btn btn-md btn-secondary">Voltar</button>
        <button id="btn-close-storage-manager" class="btn btn-md">Fechar</button>
      </div>
    `;

    // Reassociar eventos de Abas
    el.modalBody.querySelectorAll(".lib-tab").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        activeTab = tabBtn.getAttribute("data-tab");
        renderContent();
      });
    });

    // Eventos do rodapé
    document.getElementById("btn-back-to-settings").addEventListener("click", () => {
      openSettingsModal();
    });
    document.getElementById("btn-close-storage-manager").addEventListener("click", () => {
      el.modalContainer.classList.add("hidden");
    });

    // Eventos da aba Fichas
    if (activeTab === "fichas") {
      el.modalBody.querySelectorAll(".btn-export-char").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const char = state.characters.find(c => c.id === id);
          if (!char) return;
          const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${char.name.toLowerCase().replace(/\s+/g, "_")}_ficha.json`;
          a.click();
        });
      });

      el.modalBody.querySelectorAll(".btn-delete-char").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const char = state.characters.find(c => c.id === id);
          if (!char) return;
          if (confirm(`Tem certeza de que deseja excluir a ficha de ${char.name}? Esta ação não pode ser desfeita.`)) {
            const index = state.characters.findIndex(c => c.id === id);
            if (index !== -1) {
              state.characters.splice(index, 1);
              localStorage.setItem("assimilação_rpg_characters", JSON.stringify(state.characters));

              if (state.currentCharacter && state.currentCharacter.id === id) {
                if (state.characters.length > 0) {
                  import("./state.js").then(({ loadCharacter }) => loadCharacter(state.characters[0].id));
                } else {
                  state.currentCharacter = null;
                  window.location.reload(); // Recarrega para voltar à tela inicial limpa
                  return;
                }
              }
              import("./state.js").then(({ updateCharSelector }) => updateCharSelector());
              renderContent();
            }
          }
        });
      });
    }

    // Eventos da aba Mundo
    if (activeTab === "mundo") {
      const setupWorldEvents = (selectorExport, selectorDelete, arrayProp, deleteFn, filenamePrefix) => {
        el.modalBody.querySelectorAll(selectorExport).forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const item = worldState[arrayProp].find(i => i.id === id);
            if (!item) return;
            const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${filenamePrefix}_${item.nome.toLowerCase().replace(/\s+/g, "_")}.json`;
            a.click();
          });
        });

        el.modalBody.querySelectorAll(selectorDelete).forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const item = worldState[arrayProp].find(i => i.id === id);
            if (!item) return;
            if (confirm(`Tem certeza de que deseja deletar "${item.nome}"? Esta ação não pode ser desfeita.`)) {
              deleteFn(id);
              renderContent();
            }
          });
        });
      };

      setupWorldEvents(".btn-export-refugio", ".btn-delete-refugio", "refugios", deleteRefugio, "refugio");
      setupWorldEvents(".btn-export-regiao", ".btn-delete-regiao", "regioes", deleteRegiao, "regiao");
      setupWorldEvents(".btn-export-conflito", ".btn-delete-conflito", "conflitos", deleteConflito, "conflito");
      setupWorldEvents(".btn-export-local", ".btn-delete-local", "locais", deleteLocal, "local");
    }

    // Eventos da aba Homebrew
    if (activeTab === "homebrew") {
      el.modalBody.querySelectorAll(".btn-delete-custom-trait").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          const traits = getCustomTraits();
          const name = traits[idx]?.nome;
          if (confirm(`Tem certeza de que deseja excluir a característica customizada "${name}"?`)) {
            traits.splice(idx, 1);
            localStorage.setItem("assimilação_homebrew_traits", JSON.stringify(traits));
            import("./sheet.js").then(({ renderHomebrewSheet }) => renderHomebrewSheet());
            renderContent();
          }
        });
      });

      el.modalBody.querySelectorAll(".btn-delete-custom-mutation").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          const mutations = getCustomMutations();
          const name = mutations[idx]?.name;
          if (confirm(`Tem certeza de que deseja excluir a mutação customizada "${name}"?`)) {
            mutations.splice(idx, 1);
            localStorage.setItem("assimilação_homebrew_mutations", JSON.stringify(mutations));
            import("./sheet.js").then(({ renderHomebrewSheet }) => renderHomebrewSheet());
            renderContent();
          }
        });
      });
    }

    // Eventos da aba Nuvem
    if (activeTab === "nuvem") {
      const btnSignIn = document.getElementById("btn-google-sign-in");
      if (btnSignIn) {
        btnSignIn.addEventListener("click", async () => {
          if (state.useRealFirebase) {
            try {
              const firebase = await initRealFirebase();
              if (firebase) {
                const { signInWithPopup, GoogleAuthProvider } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(firebase.auth, provider);

                state.currentUser = {
                  uid: result.user.uid,
                  displayName: result.user.displayName,
                  email: result.user.email
                };
                localStorage.setItem("assimilação_mock_user", JSON.stringify(state.currentUser));
                logger.info(`Autenticação: Logado via Google (Real) - ${state.currentUser.displayName}`);

                // Recarregar cache
                const { getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
                const snap = await getDocs(q);
                const cloudSheets = [];
                snap.forEach(d => cloudSheets.push(d.data()));
                cloudCharactersCache = cloudSheets;

                renderContent();
                updateCloudSyncBadge();
              }
            } catch (error) {
              logger.error("Erro no login real do Google:", error);
              alert("Falha no login com Google. Verifique seu arquivo .env.");
            }
          } else {
            const name = prompt("Digite seu nome para simular o login do Google:", "Jogador Assimilado");
            if (name === null) return;
            const email = prompt("Digite seu e-mail do Google:", "jogador@gmail.com");
            if (!email) return;

            const mockUser = {
              uid: "google_user_" + Math.random().toString(36).substr(2, 9),
              displayName: name,
              email: email
            };

            state.currentUser = mockUser;
            localStorage.setItem("assimilação_mock_user", JSON.stringify(mockUser));
            logger.info("Autenticação: Login efetuado com sucesso via conta Google (Simulado).");
            renderContent();
            updateCloudSyncBadge();
          }
        });
      }

      el.modalBody.querySelectorAll(".btn-cloud-delete-char").forEach(btn => {
        btn.addEventListener("click", async () => {
          const charId = btn.getAttribute("data-char-id");
          const char = cloudCharactersCache.find(c => c.id === charId);
          if (!char) return;

          if (!confirm(`Tem certeza que deseja apagar a ficha de "${char.name}" da NUVEM? Esta ação é irreversível e NÃO afetará a sua ficha local.`)) {
            return;
          }

          btn.disabled = true;
          btn.textContent = "Apagando...";

          try {
            if (state.useRealFirebase) {
              const firebase = await initRealFirebase();
              if (firebase) {
                const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await deleteDoc(doc(firebase.db, "characters", charId));
              }
            } else {
              const db = getMockCloudDB();
              const uid = state.currentUser.uid;
              if (db[uid]) {
                db[uid] = db[uid].filter(c => c.id !== charId);
                saveMockCloudDB(db);
              }
            }

            // Atualiza o cache local
            cloudCharactersCache = cloudCharactersCache.filter(c => c.id !== charId);
            renderContent();
            updateCloudSyncBadge();
          } catch (e) {
            logger.error("Erro ao apagar ficha da nuvem", e);
            alert("Erro ao apagar a ficha. Tente novamente.");
            btn.disabled = false;
            btn.textContent = "🗑️ Apagar";
          }
        });
      });

      const btnSignOut = document.getElementById("btn-google-sign-out");
      if (btnSignOut) {
        btnSignOut.addEventListener("click", async () => {
          if (confirm("Tem certeza que deseja sair de sua conta Google? Suas fichas locais permanecerão salvas no navegador.")) {
            if (state.useRealFirebase) {
              try {
                const firebase = await initRealFirebase();
                if (firebase) {
                  const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
                  await signOut(firebase.auth);
                }
              } catch (e) {
                console.error("Erro ao deslogar do Firebase:", e);
              }
            }
            state.currentUser = null;
            state.hasUnsavedCloudChanges = false;
            cloudCharactersCache = [];
            localStorage.removeItem("assimilação_mock_user");
            localStorage.removeItem("assimilação_has_unsaved_changes");
            logger.info("Autenticação: Desconexão efetuada.");
            renderContent();
            updateCloudSyncBadge();
          }
        });
      }

      const btnPush = document.getElementById("btn-cloud-push");
      if (btnPush) {
        btnPush.addEventListener("click", async () => {
          if (!state.currentCharacter) {
            alert("Crie ou selecione um personagem primeiro!");
            return;
          }
          btnPush.disabled = true;
          btnPush.textContent = "⌛ Enviando...";
          await pushCharacterToCloud(state.currentCharacter);
        });
      }

      const btnPull = document.getElementById("btn-cloud-pull");
      if (btnPull) {
        btnPull.addEventListener("click", async () => {
          let cloudSheets = [];
          btnPull.disabled = true;
          btnPull.textContent = "⌛ Carregando...";

          if (state.useRealFirebase) {
            try {
              const firebase = await initRealFirebase();
              if (!firebase) { btnPull.disabled = false; btnPull.textContent = "📥 Puxar da Nuvem"; return; }

              const { getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
              const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
              const snap = await getDocs(q);
              snap.forEach(d => cloudSheets.push(d.data()));
              cloudCharactersCache = cloudSheets;
            } catch (err) {
              logger.error("Erro ao puxar dados do Firestore:", err);
              alert("Não foi possível conectar ao Firestore. Verifique seu arquivo .env.");
              btnPull.disabled = false;
              btnPull.textContent = "📥 Puxar da Nuvem";
              return;
            }
          } else {
            const db = getMockCloudDB();
            const uid = state.currentUser.uid;
            cloudSheets = db[uid] || [];
          }

          if (cloudSheets.length === 0) {
            alert("Nenhuma ficha encontrada na nuvem para esta conta.");
            btnPull.disabled = false;
            btnPull.textContent = "📥 Puxar da Nuvem";
            return;
          }

          if (confirm(`Encontramos ${cloudSheets.length} fichas na nuvem. Deseja importá-las? Fichas locais com o mesmo ID serão substituídas.`)) {
            cloudSheets.forEach(cloudChar => {
              const localIndex = state.characters.findIndex(c => c.id === cloudChar.id);
              if (localIndex !== -1) {
                state.characters[localIndex] = cloudChar;
              } else {
                state.characters.push(cloudChar);
              }
            });

            localStorage.setItem("assimilação_rpg_characters", JSON.stringify(state.characters));
            import("./state.js").then(({ updateCharSelector, loadCharacter }) => {
              updateCharSelector();
              if (state.currentCharacter) {
                const reloadedChar = state.characters.find(c => c.id === state.currentCharacter.id);
                if (reloadedChar) loadCharacter(reloadedChar.id);
              } else if (state.characters.length > 0) {
                loadCharacter(state.characters[0].id);
              }
            });

            state.hasUnsavedCloudChanges = false;
            localStorage.setItem("assimilação_has_unsaved_changes", "false");
            logger.info("Sincronização: Fichas carregadas da nuvem.");
            alert("Fichas importadas da nuvem com sucesso!");
            renderContent();
            updateCloudSyncBadge();
          } else {
            btnPull.disabled = false;
            btnPull.textContent = "📥 Puxar da Nuvem";
          }
        });
      }

      // Eventos para botões das outras fichas locais
      document.querySelectorAll(".btn-cloud-push-other").forEach(btn => {
        btn.addEventListener("click", async () => {
          const charId = btn.getAttribute("data-char-id");
          const char = state.characters.find(c => c.id === charId);
          if (!char) return;

          btn.disabled = true;
          btn.textContent = "⌛ Enviando...";
          await pushCharacterToCloud(char);
        });
      });
    }

    // Eventos da aba Backup
    if (activeTab === "backup") {
      document.getElementById("btn-export-all-backup").addEventListener("click", () => {
        const backup = {
          format: "assimilacao_full_backup",
          version: 1,
          timestamp: Date.now(),
          characters: state.characters,
          refugios: worldState.refugios,
          regioes: worldState.regioes,
          conflitos: worldState.conflitos,
          locais: worldState.locais,
          traits: getCustomTraits(),
          mutations: getCustomMutations()
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `backup_completo_assimilacao_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      });

      const fileInput = document.getElementById("file-import-all-backup");
      document.getElementById("btn-trigger-import-backup").addEventListener("click", () => {
        fileInput.click();
      });

      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            if (data.format !== "assimilacao_full_backup") {
              alert("Formato de arquivo inválido! Por favor, selecione um arquivo de backup do Assimilação RPG.");
              return;
            }

            if (confirm("Esta importação irá mesclar os dados importados com os seus dados locais existentes. Deseja prosseguir?")) {
              // Mesclar Personagens
              if (data.characters && Array.isArray(data.characters)) {
                data.characters.forEach(char => {
                  const existingIdx = state.characters.findIndex(c => c.id === char.id);
                  if (existingIdx !== -1) {
                    state.characters[existingIdx] = char;
                  } else {
                    state.characters.push(char);
                  }
                });
                localStorage.setItem("assimilação_rpg_characters", JSON.stringify(state.characters));
              }

              // Mesclar Mundo (Refúgios, Regiões, Conflitos, Locais)
              const mergeWorld = (importList, localList, storageKey) => {
                if (importList && Array.isArray(importList)) {
                  importList.forEach(item => {
                    const existingIdx = localList.findIndex(i => i.id === item.id);
                    if (existingIdx !== -1) {
                      localList[existingIdx] = item;
                    } else {
                      localList.push(item);
                    }
                  });
                  localStorage.setItem(storageKey, JSON.stringify(localList));
                }
              };

              mergeWorld(data.refugios, worldState.refugios, "assimilação_rpg_refugios");
              mergeWorld(data.regioes, worldState.regioes, "assimilação_rpg_regioes");
              mergeWorld(data.conflitos, worldState.conflitos, "assimilação_rpg_conflitos");
              mergeWorld(data.locais, worldState.locais, "assimilação_rpg_locais");

              // Mesclar Homebrew
              if (data.traits && Array.isArray(data.traits)) {
                const existing = getCustomTraits();
                const merged = [...existing, ...data.traits.filter(t => !existing.some(et => et.id === t.id))];
                localStorage.setItem("assimilação_homebrew_traits", JSON.stringify(merged));
              }
              if (data.mutations && Array.isArray(data.mutations)) {
                const existing = getCustomMutations();
                const merged = [...existing, ...data.mutations.filter(m => !existing.some(em => em.id === m.id))];
                localStorage.setItem("assimilação_homebrew_mutations", JSON.stringify(merged));
              }

              alert("Backup importado e mesclado com sucesso! O aplicativo será recarregado.");
              window.location.reload();
            }
          } catch (err) {
            alert("Erro ao ler o arquivo de backup: " + err.message);
          }
        };
        reader.readAsText(file);
      });

      document.getElementById("btn-wipe-everything").addEventListener("click", () => {
        if (confirm("⚠️ ATENÇÃO EXTREMA: Você está prestes a deletar ABSOLUTAMENTE TUDO (personagens, fichas, mundos, refúgios, homebrew). Esta ação é permanente e NÃO PODE ser desfeita. Tem certeza absoluta?")) {
          localStorage.clear();
          sessionStorage.clear();
          alert("Todos os dados foram apagados com sucesso.");
          window.location.reload();
        }
      });
    }
  };

  renderContent();
}

// Ouvinte do evento beforeunload para alertar antes de fechar a aba
window.addEventListener("beforeunload", (e) => {
  if (state.currentUser && state.hasUnsavedCloudChanges) {
    e.preventDefault();
    e.returnValue = "Você possui alterações na ficha que não foram salvas na nuvem. Sincronize antes de sair!";
    return e.returnValue;
  }
});

// ==========================================
// MODAL: EXPORTAR FICHA
// ==========================================
export function openExportModal() {
  if (!el.modalContainer || !el.modalBody) return;
  el.modalContainer.classList.remove("hidden");

  const chars = state.characters || [];
  const listHtml = chars.length === 0
    ? `<div class="world-list-empty" style="padding:20px;text-align:center;color:var(--text-muted);">Nenhuma ficha salva.</div>`
    : chars.map(char => `
      <div class="world-list-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;margin-bottom:6px;">
        <span style="font-weight:600;font-size:var(--font-size-md);">${esc(char.name)}</span>
        <button class="btn btn-sm btn-blue btn-export-char-modal" data-id="${char.id}" style="white-space:nowrap;">Exportar</button>
      </div>
    `).join("");

  el.modalBody.innerHTML = `
    <div class="settings-modal-content">
      <h3 class="modal-title">Exportar Ficha</h3>
      <div style="margin-top:12px;font-size:var(--font-size-sm);color:var(--text-secondary);margin-bottom:12px;">
        Selecione a ficha que deseja exportar como arquivo JSON.
      </div>
      <div style="max-height:400px;overflow-y:auto;">
        ${listHtml}
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <button id="btn-close-export-modal" class="btn btn-md">Fechar</button>
      </div>
    </div>
  `;

  el.modalBody.querySelectorAll(".btn-export-char-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${char.name.toLowerCase().replace(/\s+/g, "_")}_ficha.json`;
      a.click();
    });
  });

  const closeBtn = el.modalContainer.querySelector(".modal-close");
  if (closeBtn) closeBtn.onclick = () => el.modalContainer.classList.add("hidden");
  document.getElementById("btn-close-export-modal").onclick = () => el.modalContainer.classList.add("hidden");
  el.modalContainer.onclick = (e) => { if (e.target === el.modalContainer) el.modalContainer.classList.add("hidden"); };
}

// ==========================================
// MODAL: GERENCIAR BANCO DE ITENS
// ==========================================

export function openSelectReferencesModal(title, stateKey, currentIds, callback, isSingle = false) {
  if (!el.modalContainer || !el.modalBody) return;
  el.modalContainer.classList.remove("hidden");

  const items = stateKey === "characters"
    ? (window._worldStateCharacters || [])
    : (worldState[stateKey] || []);

  // Ensure currentIds is an array
  let selectedSet = new Set(Array.isArray(currentIds) ? currentIds : (currentIds ? [currentIds] : []));

  function renderList(filterText = "") {
    const listContainer = el.modalBody.querySelector(".ref-modal-list");
    if (!listContainer) return;

    const filtered = items.filter(item => {
      const name = (item.name || item.nome || item.titulo || "").toLowerCase();
      return name.includes(filterText.toLowerCase());
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center; color:var(--text-secondary); padding:16px;">Nenhum item encontrado.</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(item => {
      const name = item.name || item.nome || item.titulo || item.id;
      const isSelected = selectedSet.has(item.id);
      return `
        <label style="display:flex; align-items:center; gap:10px; padding:10px; background:rgba(255,255,255,0.02); border:1px solid ${isSelected ? 'var(--border-color, #3b82f6)' : 'rgba(255,255,255,0.05)'}; border-radius:6px; cursor:pointer; user-select:none; transition: all 0.2s;">
          <input type="${isSingle ? 'radio' : 'checkbox'}" name="ref-item" value="${item.id}" ${isSelected ? 'checked' : ''} style="cursor:pointer;">
          <span style="font-size:14px; color:#fff;">${esc(name)}</span>
        </label>
      `;
    }).join("");

    // Add change listeners to inputs
    listContainer.querySelectorAll('input[name="ref-item"]').forEach(input => {
      input.addEventListener("change", (e) => {
        const val = e.target.value;
        if (isSingle) {
          selectedSet.clear();
          if (e.target.checked) {
            selectedSet.add(val);
          }
        } else {
          if (e.target.checked) {
            selectedSet.add(val);
          } else {
            selectedSet.delete(val);
          }
        }
        // Rerender to show borders correctly
        renderList(document.getElementById("ref-modal-search").value);
      });
    });
  }

  el.modalBody.innerHTML = `
    <h3 class="modal-title" style="margin-bottom: 16px;">${esc(title)}</h3>
    <div style="margin-bottom: 12px;">
      <input type="text" id="ref-modal-search" class="ws-input" placeholder="Buscar..." style="width:100%; background:#222; border:1px solid rgba(255,255,255,0.1); color:#fff; padding:8px; border-radius:4px;">
    </div>
    <div class="ref-modal-list" style="max-height: 45vh; overflow-y: auto; margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px;">
    </div>
    <div style="display: flex; gap: 8px; justify-content: flex-end;">
      <button id="btn-ref-modal-cancel" class="btn btn-secondary">Cancelar</button>
      <button id="btn-ref-modal-confirm" class="btn btn-success">Confirmar</button>
    </div>
  `;

  renderList();

  const searchInput = document.getElementById("ref-modal-search");
  searchInput.addEventListener("input", (e) => {
    renderList(e.target.value);
  });

  const closeModal = () => el.modalContainer.classList.add("hidden");

  const closeBtn = el.modalContainer.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }
  document.getElementById("btn-ref-modal-cancel").onclick = closeModal;

  document.getElementById("btn-ref-modal-confirm").onclick = () => {
    callback(Array.from(selectedSet));
    closeModal();
  };
}




export function openAgendaModal() {
  const char = state.currentCharacter;
  if (!char) return;

  el.modalContainer.classList.remove("hidden");

  let currentAgendaId = null;
  // Try to figure out current agenda id by looking at the name
  for (const key in AGENDAS) {
    if (AGENDAS[key].normal.every(n => char.agendaNormal?.includes(n))) {
      currentAgendaId = key;
      break;
    }
  }

  let selectedAgendaId = currentAgendaId;
  let selectedSkillName = char.agendaSkill || "";

  el.modalBody.innerHTML = `
    <h3 class="modal-title">Escolher Agenda</h3>
    <div class="modal-section" style="margin-top: 16px;">
      <p class="step-help" style="margin-bottom: 16px; color: var(--text-secondary);">Escolha uma agenda e uma habilidade ativa dessa agenda. Alterar a agenda redefinirá as marcações de progresso normais da agenda atual.</p>
      <div class="packages-grid" id="modal-agenda-list"></div>
      <div id="modal-agenda-habilidades" style="margin-top: 16px; display: none;">
        <h4 class="section-title">Habilidades de <span id="modal-agenda-name"></span></h4>
        <div class="traits-wizard-list" id="modal-agenda-skills-list"></div>
      </div>
    </div>
    <div class="modal-actions" style="margin-top: 24px;">
      <button class="btn" id="btn-agenda-modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="btn-agenda-modal-save">Salvar</button>
    </div>
  `;

  const agendaListEl = document.getElementById("modal-agenda-list");
  const habContainer = document.getElementById("modal-agenda-habilidades");
  const skillsListEl = document.getElementById("modal-agenda-skills-list");
  const agendaNameEl = document.getElementById("modal-agenda-name");

  function renderAgendas() {
    agendaListEl.innerHTML = "";
    Object.entries(AGENDAS).forEach(([id, agenda]) => {
      const card = document.createElement("div");
      card.className = `package-wiz-card ${selectedAgendaId === id ? 'active' : ''}`;
      card.innerHTML = `
      <div class="package-wiz-card-header">
        <div class="agenda-icon">
          <img src="${agenda.icon}" alt="${agenda.name}" style="width:150px; height:auto;" />
        </div>
        <div class="agenda-info">
          <h4>${agenda.name}</h4>
          <p class="step-help">${agenda.desc || ''}</p>
          <div class="items"><strong>Habilidades:</strong> ${agenda.habilidades.map(h => h.name).join(", ")}</div>
        </div>
      </div>
      `;
      card.addEventListener("click", () => {
        if (selectedAgendaId !== id) {
          selectedAgendaId = id;
          selectedSkillName = ""; // Reset skill when agenda changes
        }
        renderAgendas();
        renderSkills();
      });
      agendaListEl.appendChild(card);
    });
  }

  function renderSkills() {
    if (!selectedAgendaId) {
      habContainer.style.display = "none";
      return;
    }
    habContainer.style.display = "block";
    const agenda = AGENDAS[selectedAgendaId];
    agendaNameEl.textContent = agenda.name;
    skillsListEl.innerHTML = "";

    agenda.habilidades.forEach(hab => {
      const item = document.createElement("div");
      item.className = `trait-wiz-item ${selectedSkillName === hab.name ? 'active' : ''}`;
      item.innerHTML = `
        <div class="trait-wiz-check">${selectedSkillName === hab.name ? '☑' : '☐'}</div>
        <div class="trait-wiz-content">
          <div class="trait-name" style="font-weight: bold;">${hab.name}</div>
          <div class="desc">${hab.desc}</div>
        </div>
      `;
      item.addEventListener("click", () => {
        selectedSkillName = hab.name;
        renderSkills();
      });
      skillsListEl.appendChild(item);
    });
  }

  renderAgendas();
  renderSkills();

  const closeModal = () => el.modalContainer.classList.add("hidden");

  document.getElementById("btn-agenda-modal-cancel").onclick = closeModal;
  document.getElementById("btn-agenda-modal-save").onclick = () => {
    if (selectedAgendaId) {
      const agendaObj = AGENDAS[selectedAgendaId];
      // Se trocou de agenda ou se a lista atual não corresponde, redefine
      if (currentAgendaId !== selectedAgendaId) {
        char.agendaNormal = [...agendaObj.normal];
        char.agendaBold = [...agendaObj.bold];
      }
      char.agendaSkill = selectedSkillName;
      saveCurrentCharacter();
      renderAgendaSheet();
    }
    closeModal();
  };
}

export function openBlasphemiesModal() {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info("Modal: Abrindo modal de gerenciamento de Blasfêmias.");

  let tempBlasphemies = [...(char.blasphemies || [])];
  let tempPowers = [...(char.blasphemyPowers || [])];
  let activeBlasphemyId = tempBlasphemies[0] || BLASPHEMIES[0].id;

  el.modalContainer.classList.remove("hidden");
  el.modalBody.parentElement.classList.add("wide-modal");

  const renderModalContent = () => {
    const activeB = BLASPHEMIES.find(b => b.id === activeBlasphemyId) || BLASPHEMIES[0];
    const isOwned = tempBlasphemies.includes(activeB.id);

    el.modalBody.innerHTML = `
      <h3 class="modal-title blasphemy-modal-title">Gerenciar Blasfêmias</h3>
      <div class="blasphemies-modal-layout">
        
        <!-- Coluna Esquerda: Grid das 12 Blasfêmias -->
        <div class="blasphemies-grid-col">
          ${BLASPHEMIES.map(b => {
      const owned = tempBlasphemies.includes(b.id);
      const active = b.id === activeBlasphemyId;
      return `
              <div class="blasphemy-grid-card ${active ? 'active' : ''} ${owned ? 'owned' : ''}" data-id="${b.id}">
                <div class="blasphemy-card-img-wrapper">
                  ${b.img ? `<img src="${b.img}" alt="${b.name}">` : ''}
                </div>
                <div class="blasphemy-card-info">
                  <span class="blasphemy-card-name">${b.name}</span>
                </div>
                ${owned ? `<span class="blasphemy-card-check">✓</span>` : ''}
              </div>
            `;
    }).join("")}
        </div>

        <!-- Coluna Direita: Detalhes da Blasfêmia Selecionada -->
        <div class="blasphemy-details-col">
          
          <div class="blasphemy-details-header">
            <div class="blasphemy-details-img-wrapper">
              ${activeB.img ? `<img src="${activeB.img}" alt="${activeB.name}">` : `<strong></b>`}
            </div>
            <div>
              <h4 class="blasphemy-details-title">${activeB.name}</h4>
              <!-- Descrição / Lore -->
              <div class="blasphemy-details-desc">
                ${activeB.desc}
              </div>
            </div>
          </div>

          <!-- Passiva -->
          ${activeB.passive ? `
            <div class="blasphemy-details-passive">
              ${activeB.passive}
            </div>
          ` : ''}

          <!-- Adquirir Checkbox / Status -->
          <label class="trait-wiz-item ${isOwned ? 'active owned' : ''} blasphemy-details-status" style="cursor: pointer;">
            <input type="checkbox" id="blasphemy-toggle-owned" class="trait-wiz-check" ${isOwned ? 'checked' : ''}>
            <div class="trait-wiz-content">
              <div class="trait-name" style="font-weight: bold; font-size: var(--font-size-lg);">Possuir esta Blasfêmia</div>
              <div class="desc" style="font-size: var(--font-size-lg); color: var(--text-secondary);">Adquira esta blasfêmia para liberar e escolher seus poderes ativos.</div>
            </div>
          </label>

          <!-- Escolha de Poderes Ativos se Possuída -->
          ${isOwned ? `
            <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
              <button id="btn-manage-blasphemy-powers" class="btn btn-md" style="width: 100%; font-weight: bold; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color);">
                Gerenciar Poderes Ativos (${(activeB.powers || []).filter(p => tempPowers.includes(p.name)).length})
              </button>
            </div>
          ` : ''}

        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="blasphemy-modal-footer">
        <button id="btn-blasphemies-modal-cancel" class="btn btn-md btn-secondary">Cancelar</button>
        <button id="btn-blasphemies-modal-save" class="btn btn-md btn-blasphemy-save">Salvar Alterações</button>
      </div>
    `;

    // Event: Click on Blasphemy card in grid
    el.modalBody.querySelectorAll(".blasphemy-grid-card").forEach(card => {
      card.addEventListener("click", () => {
        activeBlasphemyId = card.getAttribute("data-id");
        renderModalContent();
      });
    });

    // Event: Toggle owned checkbox
    const toggleOwned = document.getElementById("blasphemy-toggle-owned");
    if (toggleOwned) {
      toggleOwned.addEventListener("change", (e) => {
        if (e.target.checked) {
          if (!tempBlasphemies.includes(activeBlasphemyId)) {
            tempBlasphemies.push(activeBlasphemyId);
          }
        } else {
          tempBlasphemies = tempBlasphemies.filter(id => id !== activeBlasphemyId);
          // Also remove any active powers associated with this blasphemy
          const activeBObj = BLASPHEMIES.find(b => b.id === activeBlasphemyId);
          if (activeBObj && activeBObj.powers) {
            const powerNames = activeBObj.powers.map(p => p.name);
            tempPowers = tempPowers.filter(p => !powerNames.includes(p));
          }
        }
        renderModalContent();
      });
    }

    // Event: Open Manage Powers Modal
    const btnManagePowers = document.getElementById("btn-manage-blasphemy-powers");
    if (btnManagePowers) {
      btnManagePowers.addEventListener("click", () => {
        openBlasphemyPowersModal(activeB, tempPowers, (updatedPowers) => {
          tempPowers = updatedPowers;
          renderModalContent();
        });
      });
    }

    // Save/Cancel buttons
    document.getElementById("btn-blasphemies-modal-cancel").onclick = () => {
      el.modalContainer.classList.add("hidden");
      el.modalBody.parentElement.classList.remove("wide-modal");
    };

    document.getElementById("btn-blasphemies-modal-save").onclick = () => {
      char.blasphemies = tempBlasphemies;
      char.blasphemyPowers = tempPowers;
      saveCurrentCharacter();
      renderBlasphemiesSheet();
      el.modalContainer.classList.add("hidden");
      el.modalBody.parentElement.classList.remove("wide-modal");
    };
  };

  renderModalContent();
}

export function openBlasphemyPowersModal(blasphemy, currentPowers, onSave) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.style.zIndex = "1100";
  overlay.style.pointerEvents = "auto";
  overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  let selectedPowers = [...currentPowers];

  const renderContent = () => {
    overlay.innerHTML = `
      <div class="modal-content card-glass" style="max-width: 800px; max-height: 100vh; display: flex; flex-direction: column; padding: 16px;">
        <button class="modal-close" id="btn-submodal-close">×</button>
        <h3 class="modal-title" style="margin-bottom: 6px;">Poderes de ${blasphemy.name}</h3>
        <p class="step-help" style="margin-bottom: 6px; color: var(--text-secondary); font-size: var(--font-size-md);">Escolha os poderes ativos desta Blasfêmia.</p>
        
        <div class="traits-wizard-list" style="flex: 1; overflow-y: auto; padding-right: 4px;">
          ${(blasphemy.powers || []).map(p => {
            const hasPower = selectedPowers.includes(p.name);
            return `
              <label class="trait-wiz-item ${hasPower ? 'active owned' : ''} blasphemy-power-label" style="cursor: pointer; margin-bottom: 8px;">
                <input type="checkbox" class="submodal-power-check trait-wiz-check" data-name="${p.name}" ${hasPower ? 'checked' : ''} style="margin-right: 6px; cursor: pointer;">
                <div class="trait-wiz-content">
                  <div class="trait-name" style="font-weight: bold; font-size: var(--font-size-lg);">${p.name}</div>
                  <div class="desc" style="font-size: var(--font-size-lg); color: var(--text-secondary);">${p.desc}</div>
                </div>
              </label>
            `;
          }).join("")}
        </div>
        
        <div class="modal-actions" style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary" id="btn-submodal-cancel">Cancelar</button>
          <button class="btn" id="btn-submodal-save" style="background: var(--color-rust-glow); color: white; border: none; font-weight: bold;">Salvar</button>
        </div>
      </div>
    `;

    overlay.querySelector("#btn-submodal-close").onclick = () => overlay.remove();
    overlay.querySelector("#btn-submodal-cancel").onclick = () => overlay.remove();
    
    overlay.querySelector("#btn-submodal-save").onclick = () => {
      onSave(selectedPowers);
      overlay.remove();
    };

    overlay.querySelectorAll(".submodal-power-check").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const pName = cb.getAttribute("data-name");
        if (e.target.checked) {
          if (!selectedPowers.includes(pName)) {
            selectedPowers.push(pName);
          }
        } else {
          selectedPowers = selectedPowers.filter(p => p !== pName);
        }
        renderContent();
      });
    });
  };

  renderContent();
  document.body.appendChild(overlay);
}
