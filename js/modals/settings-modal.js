import { el, state, saveCurrentCharacter } from "../state.js";
import { logger } from "../logger.js";
import { renderAptitudesSheet, renderStressHealthSheet } from "../sheet.js";
import { applyTranslations, t } from "../i18n.js";

export function openSettingsModal() {
  logger.info("Modal: Abrindo modal de configurações.");
  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.closest(".modal-content");
  if (modalContent) {
    modalContent.style.maxWidth = "";
  }

  const disable3D = localStorage.getItem("cain_disable_3d") === "true" || localStorage.getItem("assimilação_disable_3d") === "true";
  const char = state.currentCharacter;
  const currentMaxBubbles = (char && char.maxValueBubbles) || parseInt(localStorage.getItem("cain_max_value_bubbles")) || parseInt(localStorage.getItem("assimilação_max_value_bubbles")) || 5;

  el.modalBody.innerHTML = `
    <div class="settings-modal-content">
    <h3 class="modal-title" data-i18n="settings.title">Configurações</h3>
    <div class="settings-modal-content" style="margin-top: 16px;">
      <div class="setting-row">
        <div class="setting-info">
          <div class="setting-label" data-i18n="settings.dice3d.title">Desativar Dados 3D</div>
          <div class="setting-desc" data-i18n="settings.dice3d.desc">Substitui a animação física dos dados por rolagens matemáticas instantâneas no chat.</div>
        </div>
        <div class="setting-control">
          <label class="theme-switch">
            <input type="checkbox" id="settings-disable-3d" ${disable3D ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="setting-row -with-divider">
        <div class="setting-info">
          <div class="setting-label" data-i18n="settings.clearStorage.title">Apagar Fichas (Local Storage)</div>
          <div class="setting-desc" data-i18n="settings.clearStorage.desc">Remove todos os personagens e dados locais criados neste navegador.</div>
        </div>
        <div class="setting-control">
          <button id="btn-clear-local-storage" class="btn btn-danger btn-sm" style="white-space: nowrap;" data-i18n="settings.clearStorage.btn">Apagar Dados</button>
        </div>
      </div>

      <div class="setting-row -with-divider">
        <div class="setting-info">
          <div class="setting-label" data-i18n="settings.clearPwa.title">Forçar Recarregamento (PWA Cache)</div>
          <div class="setting-desc" data-i18n="settings.clearPwa.desc">Limpa o cache offline e força o download da versão mais recente dos arquivos.</div>
        </div>
        <div class="setting-control">
          <button id="btn-clear-pwa-cache" class="btn btn-danger btn-sm" style="white-space: nowrap;" data-i18n="settings.clearPwa.btn">Forçar Recarga</button>
        </div>
      </div>
      
      <div class="setting-row -with-divider">
        <div class="setting-info">
          <div class="setting-label" data-i18n="settings.storageManager.title">Gerenciador de Armazenamento</div>
          <div class="setting-desc" data-i18n="settings.storageManager.desc">Gerencie, delete ou exporte individualmente fichas de personagens, refúgios, regiões, conflitos, locais e pacotes de Homebrew.</div>
        </div>
        <div class="setting-control">
          <button id="btn-open-storage-manager" class="btn btn-md btn-outline -cyan" style="white-space: nowrap;" data-i18n="settings.storageManager.btn">Gerenciar Dados</button>
        </div>
      </div>
      
      <div class="modal-footer" style="margin-top: 24px;">
        <button id="btn-save-settings" class="btn btn-md" data-i18n="settings.close">Fechar</button>
      </div>
    </div>
  </div>
  `;

  applyTranslations();

  const checkbox = document.getElementById("settings-disable-3d");
  checkbox.addEventListener("change", (e) => {
    localStorage.setItem("cain_disable_3d", e.target.checked ? "true" : "false");
    localStorage.removeItem("assimilação_disable_3d");
    logger.info(`Configurações: cain_disable_3d alterada para ${e.target.checked}`);
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
    setTimeout(async () => {
      const { openStorageManagerModal } = await import("./storage-manager.js");
      openStorageManagerModal();
    }, 150);
  });

  document.getElementById("btn-save-settings").addEventListener("click", () => {
    el.modalContainer.classList.add("hidden");
  });
}

export function openStressSettingsModal() {
  const char = state.currentCharacter;
  if (!char) return;
  const stressMax = char.stressMax !== undefined ? char.stressMax : 6;
  const sinMax = char.sinMax !== undefined ? char.sinMax : 10;
  const psycheMax = char.psycheMax !== undefined ? char.psycheMax : 3;
  const piedadeMax = char.piedadeMax !== undefined ? char.piedadeMax : 3;
  const injuriesMax = char.injuriesMax !== undefined ? char.injuriesMax : 3;
  el.modalContainer.classList.remove("hidden");

  const modalContent = el.modalBody.closest(".modal-content");
  if (modalContent) {
    modalContent.style.maxWidth = "450px"; // Define a largura personalizada
  }

  el.modalBody.innerHTML = `
    <h3 class="modal-title" data-i18n="settings.stress.title">Limites de Status</h3>
    <p style="margin-bottom: 16px; color: var(--text-secondary);" data-i18n="settings.stress.desc">Defina a quantidade máxima permitida de cada recurso e limite de Feridas.</p>
    <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px; text-align: left;">
      
      ${[
        { key: "settings.stress.stressmax", id: "stressmax", val: stressMax },
        { key: "settings.stress.sinmax", id: "sinmax", val: sinMax },
        { key: "settings.stress.psychemax", id: "psychemax", val: psycheMax },
        { key: "settings.stress.piedademax", id: "piedademax", val: piedadeMax },
        { key: "settings.stress.injuriesmax", id: "injuriesmax", val: injuriesMax }
      ].map(item => `
        <div class="status-adjust-row">
          <span class="status-adjust-label" data-i18n="${item.key}">${t(item.key)}</span>
          <div class="status-adjust-controls">
            <button class="btn btn-sm" id="btn-modal-${item.id}-dec" style="padding: 2px 8px;">-</button>
            <span class="status-adjust-value" id="lbl-modal-${item.id}">${item.val}</span>
            <button class="btn btn-sm" id="btn-modal-${item.id}-inc" style="padding: 2px 8px;">+</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="modal-footer" style="margin-top: 24px;">
      <button class="btn btn-primary" id="btn-stress-settings-close">Ok</button>
    </div>
  `;

  applyTranslations();

  // Local state for edits
  let currentStressMax = stressMax;
  let currentSinMax = sinMax;
  let currentPsycheMax = psycheMax;
  let currentPiedadeMax = piedadeMax;
  let currentInjuriesMax = injuriesMax;

  const refreshSheet = () => {
    renderStressHealthSheet();
    if (typeof window.updatePiedadeDisplay === 'function') {
      window.updatePiedadeDisplay();
    }
  };

  const closeModal = () => {
    el.modalContainer.classList.add("hidden");
    if (modalContent) {
      modalContent.style.maxWidth = ""; // Reseta a largura para o padrão
    }
  };

  // Bind increment/decrement buttons
  const bindControl = (decId, incId, lblId, min, max, getValue, setValue) => {
    document.getElementById(decId).onclick = () => {
      const val = Math.max(min, getValue() - 1);
      setValue(val);
      document.getElementById(lblId).textContent = val;
      // Live save
      char.stressMax = currentStressMax;
      char.sinMax = currentSinMax;
      char.psycheMax = currentPsycheMax;
      char.piedadeMax = currentPiedadeMax;
      char.injuriesMax = currentInjuriesMax;
      saveCurrentCharacter();
      refreshSheet();
    };
    document.getElementById(incId).onclick = () => {
      const val = Math.min(max, getValue() + 1);
      setValue(val);
      document.getElementById(lblId).textContent = val;
      // Live save
      char.stressMax = currentStressMax;
      char.sinMax = currentSinMax;
      char.psycheMax = currentPsycheMax;
      char.piedadeMax = currentPiedadeMax;
      char.injuriesMax = currentInjuriesMax;
      saveCurrentCharacter();
      refreshSheet();
    };
  };

  bindControl("btn-modal-stressmax-dec", "btn-modal-stressmax-inc", "lbl-modal-stressmax", 1, 12, () => currentStressMax, (v) => currentStressMax = v);
  bindControl("btn-modal-sinmax-dec", "btn-modal-sinmax-inc", "lbl-modal-sinmax", 1, 15, () => currentSinMax, (v) => currentSinMax = v);
  bindControl("btn-modal-psychemax-dec", "btn-modal-psychemax-inc", "lbl-modal-psychemax", 1, 6, () => currentPsycheMax, (v) => currentPsycheMax = v);
  bindControl("btn-modal-piedademax-dec", "btn-modal-piedademax-inc", "lbl-modal-piedademax", 1, 6, () => currentPiedadeMax, (v) => currentPiedadeMax = v);
  bindControl("btn-modal-injuriesmax-dec", "btn-modal-injuriesmax-inc", "lbl-modal-injuriesmax", 1, 6, () => currentInjuriesMax, (v) => currentInjuriesMax = v);

  document.getElementById("btn-stress-settings-close").onclick = closeModal;

  const genericCloseBtn = el.modalContainer.querySelector(".modal-close");
  if (genericCloseBtn) {
    genericCloseBtn.onclick = closeModal;
  }
  el.modalContainer.onclick = (e) => {
    if (e.target === el.modalContainer) {
      closeModal();
    }
  };
}
