import { el, state, loadCharacter, loadCharactersFromStorage, updateCharSelector, loadSinsFromStorage } from "./state.js";
import { startWizard } from "./wizard.js";
import { ICONS } from "../icons.js";
import { logger } from "./logger.js";
import { t } from "./i18n.js";
import { esc } from "./screen-utils.js";

const landingScreen = document.getElementById("landing-screen");
const charactersList = document.getElementById("characters-list");
const emptyState = document.getElementById("empty-state");
const btnCreateFirstChar = document.getElementById("btn-create-first-char");
const btnImportLanding = document.getElementById("btn-import-landing");
const fileImportLanding = document.getElementById("file-import-landing");

let openDropdownId = null;
let activeTab = "exorcistas";

export function initLandingScreen() {
  btnCreateFirstChar?.addEventListener("click", () => {
    startWizard();
  });

  btnImportLanding?.addEventListener("click", () => {
    fileImportLanding.click();
  });

  fileImportLanding?.addEventListener("change", (e) => {
    importCharacterFromFile(e);
    fileImportLanding.value = "";
  });

  // Tab Switchers
  const tabExorcistas = document.getElementById("tab-exorcistas");
  const tabPecados = document.getElementById("tab-pecados");
  const secExorcistas = document.getElementById("exorcistas-section");
  const secPecados = document.getElementById("pecados-section");

  if (tabExorcistas && tabPecados) {
    tabExorcistas.addEventListener("click", () => {
      activeTab = "exorcistas";
      tabExorcistas.classList.add("active");
      tabPecados.classList.remove("active");
      tabExorcistas.style.color = "var(--text-primary)";
      tabExorcistas.style.opacity = "1";
      tabPecados.style.color = "var(--text-muted)";
      tabPecados.style.opacity = "0.6";

      secExorcistas.classList.remove("hidden");
      secPecados.classList.add("hidden");
      renderCharactersList();
    });

    tabPecados.addEventListener("click", () => {
      activeTab = "pecados";
      tabPecados.classList.add("active");
      tabExorcistas.classList.remove("active");
      tabPecados.style.color = "var(--text-primary)";
      tabPecados.style.opacity = "1";
      tabExorcistas.style.color = "var(--text-muted)";
      tabExorcistas.style.opacity = "0.6";

      secPecados.classList.remove("hidden");
      secExorcistas.classList.add("hidden");
      renderSinsList();
    });
  }

  // Pecado footer buttons
  const btnCreateSin = document.getElementById("btn-create-sin");
  const btnImportSin = document.getElementById("btn-import-sin");
  const fileImportSin = document.getElementById("file-import-sin");

  btnCreateSin?.addEventListener("click", showCreateSinModal);
  btnImportSin?.addEventListener("click", () => fileImportSin.click());
  fileImportSin?.addEventListener("change", e => {
    importSinFromFile(e);
    fileImportSin.value = "";
  });

  document.addEventListener("click", (e) => {
    if (openDropdownId && !e.target.closest(".char-actions")) {
      closeDropdown();
    }
  });

  document.addEventListener("start-wizard", () => {
    showLandingScreen(false);
  });

  document.addEventListener("characters-updated", () => {
    renderCharactersList();
  });
}

export function showLandingScreen(restore = true) {
  landingScreen.classList.remove("hidden");
  el.wizardScreen.classList.add("hidden");
  el.sheetScreen.classList.add("hidden");
  document.getElementById("pecado-screen")?.classList.add("hidden");
  if (restore) {
    if (activeTab === "exorcistas") {
      renderCharactersList();
    } else {
      renderSinsList();
    }
  }
}

export function renderCharactersList() {
  loadCharactersFromStorage();

  if (emptyState) emptyState.classList.add("hidden");

  const counter = document.getElementById("char-counter");
  if (counter) {
    const count = state.characters.length;
    counter.textContent = count > 0 ? `${count} ${t("landing.counter")}` : "";
  }

  const allItems = [...state.characters].sort((a, b) => {
    const tsA = _extractTimestamp(a.id);
    const tsB = _extractTimestamp(b.id);
    return tsB - tsA;
  });

  let cardsHtml = allItems.map(item => {
    const name = item.name || t("common.noName");
    const subInfo = item.ocupacao || "";
    const portrait = item.portrait || "";
    const avatarContent = portrait
      ? `<img src="${esc(portrait)}" alt="" class="char-card-avatar-img">`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="char-card-avatar-svg"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;

    const actionsHtml = `
      <div class="char-actions">
        <button class="btn-char-action" title="Mais ações" data-action="menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        <div class="char-actions-dropdown" data-dropdown="${esc(item.id)}">
          <button data-action="export" data-id="${esc(item.id)}">${ICONS.export} ${t("landing.card.export")}</button>
          <div class="dropdown-divider"></div>
          <button data-action="duplicate" data-id="${esc(item.id)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            ${t("landing.card.duplicate")}
          </button>
          <div class="dropdown-divider"></div>
          <button data-action="delete" data-id="${esc(item.id)}" class="btn-danger-dropdown">${ICONS.trash} ${t("landing.card.delete")}</button>
        </div>
      </div>
    `;

    return `
      <article class="character-card square-card" data-char-id="${esc(item.id)}" data-sheet-type="exorcista">
        <div class="char-card-avatar">${avatarContent}</div>
        <div class="char-card-name">${esc(name)}</div>
        <div class="char-card-sub-info">
          <span class="sheet-type-badge badge-infectado">${t("modal.sheet.type.exorcista")}</span>
          ${subInfo ? `<div class="char-card-sub-info">${esc(subInfo)}</div>` : ""}
        </div>
        ${actionsHtml}
      </article>
    `;
  }).join("");

  cardsHtml += `
    <article class="character-card square-card create-card" id="btn-create-card">
      <div class="char-card-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="char-card-plus-svg">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <div class="char-card-name">Nova Ficha</div>
    </article>
  `;

  if (emptyState) emptyState.classList.toggle("hidden", allItems.length > 0);
  charactersList.innerHTML = cardsHtml;
  attachCardListeners();
}

function _extractTimestamp(id) {
  if (!id) return 0;
  const parts = id.split("_");
  const ts = parseInt(parts[parts.length - 1]);
  return isNaN(ts) ? 0 : ts;
}

function attachCardListeners() {
  document.querySelectorAll("[data-char-id]").forEach(card => {
    card.addEventListener("click", async (e) => {
      if (e.target.closest(".char-actions") || card.classList.contains("create-card")) return;
      const id = card.dataset.charId;
      if (!id) return;
      handleLoadCharacter(id);
    });
  });

  const createCard = document.getElementById("btn-create-card");
  if (createCard) createCard.addEventListener("click", startWizard);

  document.querySelectorAll("[data-action='menu']").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card = e.target.closest(".character-card");
      if (card?.dataset.charId) toggleDropdown(card.dataset.charId);
    });
  });
  document.querySelectorAll("[data-action='export']").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); handleExportCharacter(btn.dataset.id); closeDropdown(); });
  });
  document.querySelectorAll("[data-action='duplicate']").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); handleDuplicateCharacter(btn.dataset.id); closeDropdown(); });
  });
  document.querySelectorAll("[data-action='delete']").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); handleDeleteCharacter(btn.dataset.id); closeDropdown(); });
  });
}

function toggleDropdown(charId) {
  if (openDropdownId === charId) { closeDropdown(); return; }
  closeDropdown();
  openDropdownId = charId;
  const dropdown = document.querySelector(`[data-dropdown="${CSS.escape(charId)}"]`);
  if (dropdown) dropdown.classList.add("open");
}

function closeDropdown() {
  if (openDropdownId) {
    const oldChar = document.querySelector(`[data-dropdown="${CSS.escape(openDropdownId)}"]`);
    if (oldChar) oldChar.classList.remove("open");
    const oldSin = document.querySelector(`[data-sin-dropdown="${CSS.escape(openDropdownId)}"]`);
    if (oldSin) oldSin.classList.remove("open");
    openDropdownId = null;
  }
}

// ==========================================
// RENDERIZAÇÃO E LOGICA DOS PECADOS
// ==========================================
export function renderSinsList() {
  loadSinsFromStorage();

  const sinsEmptyState = document.getElementById("sins-empty-state");
  if (sinsEmptyState) sinsEmptyState.classList.add("hidden");

  const counter = document.getElementById("sin-counter");
  if (counter) {
    const count = state.sins.length;
    counter.textContent = count > 0 ? `${count} Pecado(s)` : "";
  }

  const allItems = [...state.sins].sort((a, b) => {
    const tsA = _extractTimestamp(a.id);
    const tsB = _extractTimestamp(b.id);
    return tsB - tsA;
  });

  const sinsList = document.getElementById("sins-list");
  if (!sinsList) return;

  let cardsHtml = allItems.map(item => {
    const name = item.name || "Sem Nome";
    const subInfo = [item.hostName, item.type?.toUpperCase(), `CAT ${item.cat}`].filter(Boolean).join(" · ");
    const portrait = item.portrait || "";
    const avatarContent = portrait
      ? `<img src="${esc(portrait)}" alt="" class="char-card-avatar-img">`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="char-card-avatar-svg" style="color: var(--color-conflito);"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;

    const actionsHtml = `
      <div class="char-actions">
        <button class="btn-char-action" title="Mais ações" data-action="sin-menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
        <div class="char-actions-dropdown" data-sin-dropdown="${esc(item.id)}">
          <button data-action="sin-export" data-id="${esc(item.id)}">${ICONS.export} Exportar</button>
          <div class="dropdown-divider"></div>
          <button data-action="sin-duplicate" data-id="${esc(item.id)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Duplicar
          </button>
          <div class="dropdown-divider"></div>
          <button data-action="sin-delete" data-id="${esc(item.id)}" class="btn-danger-dropdown">${ICONS.trash} Excluir</button>
        </div>
      </div>
    `;

    return `
      <article class="character-card square-card" data-sin-id="${esc(item.id)}" data-sheet-type="conflito">
        <div class="char-card-avatar">${avatarContent}</div>
        <div class="char-card-name">${esc(name)}</div>
        <div class="char-card-sub-info">
          <span class="sheet-type-badge badge-conflito">Pecado</span>
          ${subInfo ? `<div class="char-card-sub-info" style="font-size:11px; margin-top:2px; opacity:0.8;">${esc(subInfo)}</div>` : ""}
        </div>
        ${actionsHtml}
      </article>
    `;
  }).join("");

  cardsHtml += `
    <article class="character-card square-card create-card" id="btn-create-sin-card">
      <div class="char-card-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="char-card-plus-svg">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <div class="char-card-name">Novo Pecado</div>
    </article>
  `;

  sinsList.innerHTML = cardsHtml;

  if (state.sins.length === 0) {
    if (sinsEmptyState) sinsEmptyState.classList.remove("hidden");
  }

  attachSinCardListeners();
}

function attachSinCardListeners() {
  document.querySelectorAll("[data-sin-id]").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".char-actions") || card.classList.contains("create-card")) return;
      const id = card.dataset.sinId;
      if (!id) return;
      handleLoadSin(id);
    });
  });

  const createCard = document.getElementById("btn-create-sin-card");
  if (createCard) createCard.addEventListener("click", showCreateSinModal);

  document.querySelectorAll("[data-action='sin-menu']").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card = e.target.closest(".character-card");
      if (card?.dataset.sinId) toggleSinDropdown(card.dataset.sinId);
    });
  });
  document.querySelectorAll("[data-action='sin-export']").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); handleExportSin(btn.dataset.id); closeDropdown(); });
  });
  document.querySelectorAll("[data-action='sin-duplicate']").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); handleDuplicateSin(btn.dataset.id); closeDropdown(); });
  });
  document.querySelectorAll("[data-action='sin-delete']").forEach(btn => {
    btn.addEventListener("click", e => { e.stopPropagation(); handleDeleteSin(btn.dataset.id); closeDropdown(); });
  });
}

function toggleSinDropdown(sinId) {
  if (openDropdownId === sinId) { closeDropdown(); return; }
  closeDropdown();
  openDropdownId = sinId;
  const dropdown = document.querySelector(`[data-sin-dropdown="${CSS.escape(sinId)}"]`);
  if (dropdown) dropdown.classList.add("open");
}

function showCreateSinModal() {
  const modalContainer = el.modalContainer;
  const modalBody = el.modalBody;
  modalBody.innerHTML = `
    <div class="landing-actions-menu">
      <h3 class="menu-title">Novo Registro de Pecado</h3>
      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px; text-align:left;">
        <div>
          <label class="ws-label" style="font-weight:bold; color:var(--text-secondary);">Nome do Pecado</label>
          <input type="text" id="create-sin-name" class="conflito-form-input" style="width:100%; box-sizing:border-box;" placeholder="Ex: Ogro do Pântano" value="Novo Pecado">
        </div>
        <div>
          <label class="ws-label" style="font-weight:bold; color:var(--text-secondary);">Hospedeiro</label>
          <input type="text" id="create-sin-host" class="conflito-form-input" style="width:100%; box-sizing:border-box;" placeholder="Nome do Hospedeiro (opcional)">
        </div>
        <div>
          <label class="ws-label" style="font-weight:bold; color:var(--text-secondary);">Tipo de Pecado</label>
          <select id="create-sin-type" class="conflito-form-input" style="width:100%; box-sizing:border-box;">
            <option value="ogro">Ogro (Desespero)</option>
            <option value="idolo">Ídolo (Desejo)</option>
            <option value="cao">Cão (Vingança)</option>
            <option value="centopeia">Centopeia (Ódio)</option>
            <option value="sapo">Sapo (Indulgência)</option>
            <option value="lorde">Lorde (Medo)</option>
            <option value="outro">Customizado (Outro)</option>
          </select>
        </div>
      </div>
      <div style="display:flex; gap:8px; justify-content:flex-end;">
        <button id="btn-cancel-create-sin" class="btn" style="padding:10px 20px;">Cancelar</button>
        <button id="btn-confirm-create-sin" class="btn btn-landing-primary" style="padding:10px 20px;">Criar Pecado</button>
      </div>
    </div>
  `;
  modalContainer.classList.remove("hidden");

  const cleanup = () => {
    modalContainer.classList.add("hidden");
  };

  document.getElementById("btn-cancel-create-sin").addEventListener("click", cleanup, { once: true });
  document.getElementById("btn-confirm-create-sin").addEventListener("click", () => {
    const name = document.getElementById("create-sin-name").value || "Novo Pecado";
    const host = document.getElementById("create-sin-host").value || "";
    const type = document.getElementById("create-sin-type").value || "ogro";
    
    cleanup();
    import("./pecado.js").then(({ startNewPecado }) => {
      startNewPecado(name, host, type);
    });
  }, { once: true });

  const closeBtn = modalContainer.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", cleanup, { once: true });
}

function handleLoadSin(sinId) {
  landingScreen.classList.add("hidden");
  import("./state.js").then(({ loadSin }) => loadSin(sinId));
}

function handleExportSin(sinId) {
  const sin = state.sins.find(s => s.id === sinId);
  if (!sin) return;
  const blob = new Blob([JSON.stringify(sin, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sin.name.toLowerCase().replace(/\s+/g, "_")}_pecado.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleDuplicateSin(sinId) {
  const sin = state.sins.find(s => s.id === sinId);
  if (!sin) return;
  const duplicate = JSON.parse(JSON.stringify(sin));
  duplicate.id = "sin_" + Date.now();
  duplicate.name = sin.name + " (Cópia)";
  state.sins.push(duplicate);
  try {
    localStorage.setItem("cain_sins", JSON.stringify(state.sins));
  } catch (e) {
    logger.error("Erro ao salvar após duplicação de pecado:", e);
  }
  renderSinsList();
}

function handleDeleteSin(sinId) {
  const sin = state.sins.find(s => s.id === sinId);
  if (!sin) return;
  if (confirm(`Tem certeza que deseja apagar permanentemente a ficha de pecado de "${sin.name}"?`)) {
    const index = state.sins.findIndex(s => s.id === sinId);
    if (index !== -1) {
      state.sins.splice(index, 1);
      try { localStorage.setItem("cain_sins", JSON.stringify(state.sins)); } catch (e) { }
      if (state.currentSin?.id === sinId) state.currentSin = null;
      renderSinsList();
    }
  }
}

function importSinFromFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const sinObj = JSON.parse(evt.target.result);
      if (!sinObj.id || !sinObj.name || sinObj.type === undefined) { alert("Ficha de Pecado inválida!"); return; }
      sinObj.id = "sin_" + Date.now();
      state.sins.push(sinObj);
      localStorage.setItem("cain_sins", JSON.stringify(state.sins));
      import("./state.js").then(({ loadSinsFromStorage }) => {
        loadSinsFromStorage();
        renderSinsList();
      });
    } catch (err) {
      alert("Erro ao ler o arquivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

function handleLoadCharacter(charId) {
  landingScreen.classList.add("hidden");
  loadCharacter(charId);
}

function handleExportCharacter(charId) {
  const char = state.characters.find(c => c.id === charId);
  if (!char) return;
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${char.name.toLowerCase().replace(/\s+/g, "_")}_ficha.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleDuplicateCharacter(charId) {
  const char = state.characters.find(c => c.id === charId);
  if (!char) return;
  const duplicate = JSON.parse(JSON.stringify(char));
  duplicate.id = "char_" + Date.now();
  duplicate.name = char.name + " (Cópia)";
  state.characters.push(duplicate);
  try {
    localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
  } catch (e) {
    logger.error("Erro ao salvar após duplicação:", e);
  }
  renderCharactersList();
}

function handleDeleteCharacter(charId) {
  const char = state.characters.find(c => c.id === charId);
  if (!char) return;
  showDeleteConfirmModal(char);
}

function showDeleteConfirmModal(char) {
  const modalContainer = el.modalContainer;
  const modalBody = el.modalBody;
  modalBody.innerHTML = `
    <div class="landing-actions-menu">
      <h3 class="menu-title">Excluir Exorcista</h3>
      <p style="color:var(--text-secondary);font-size:var(--font-size-sm);margin-bottom:12px;line-height:1.5;">
        Tem certeza que deseja apagar permanentemente a ficha de <strong>${esc(char.name)}</strong>?<br>Esta ação não pode ser desfeita.
      </p>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button id="btn-cancel-delete" class="btn" style="padding:10px 20px;">Cancelar</button>
        <button id="btn-confirm-delete" class="btn btn-danger" style="padding:10px 20px;">${ICONS.trash} Sim, Excluir</button>
      </div>
    </div>
  `;
  modalContainer.classList.remove("hidden");
  document.getElementById("btn-cancel-delete").addEventListener("click", () => modalContainer.classList.add("hidden"), { once: true });
  document.getElementById("btn-confirm-delete").addEventListener("click", () => {
    performDelete(char);
    modalContainer.classList.add("hidden");
  }, { once: true });
  const closeBtn = modalContainer.querySelector(".modal-close");
  if (closeBtn) closeBtn.addEventListener("click", () => modalContainer.classList.add("hidden"), { once: true });
  modalContainer.addEventListener("click", e => {
    if (e.target === modalContainer) modalContainer.classList.add("hidden");
  }, { once: true });
}

function performDelete(char) {
  const index = state.characters.findIndex(c => c.id === char.id);
  if (index !== -1) {
    state.characters.splice(index, 1);
    try { localStorage.setItem("cain_exorcists", JSON.stringify(state.characters)); } catch (e) { }
    if (state.currentCharacter?.id === char.id) state.currentCharacter = null;
    loadCharactersFromStorage();
    updateCharSelector();
    renderCharactersList();
  }
}

function importCharacterFromFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const charObj = JSON.parse(evt.target.result);
      if (!charObj.id || !charObj.name) { alert("Ficha inválida!"); return; }
      charObj.id = "char_" + Date.now();
      state.characters.push(charObj);
      localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
      loadCharactersFromStorage();
      updateCharSelector();
      renderCharactersList();
    } catch (err) {
      alert("Erro ao ler o arquivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

window.addEventListener("languageChanged", () => {
  const landingScreen = document.getElementById("landing-screen");
  if (landingScreen && !landingScreen.classList.contains("hidden")) {
    if (activeTab === "exorcistas") {
      renderCharactersList();
    } else {
      renderSinsList();
    }
  }
});
