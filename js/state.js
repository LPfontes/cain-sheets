import { renderSkillsSheet, renderStressHealthSheet, renderAgendaSheet, renderBlasphemiesSheet, renderSinMarksSheet, renderEquipmentSheet, renderSavedMacrosSheet, renderStaticHooks } from "./sheet.js";
import { renderCainRollPanel } from "./cain-roller.js";
import { resetDiceDrawerSelections } from "./roller.js";
import { logger } from "./logger.js";

// ==========================================
// SELETORES DOM
// ==========================================
export const el = {
  // Telas e Modais
  wizardScreen: document.getElementById("wizard-screen"),
  sheetScreen: document.getElementById("sheet-screen"),
  modalContainer: document.getElementById("modal-container"),
  modalBody: document.getElementById("modal-body"),
  
  // Header Controls
  btnNewChar: document.getElementById("btn-new-char"),
  btnExportJson: document.getElementById("btn-export-json"),
  btnImportJson: document.getElementById("btn-import-json"),
  fileImport: document.getElementById("file-import"),
  btnDeleteChar: document.getElementById("btn-delete-char"),
  btnOpenRoller: document.getElementById("btn-open-roller"),
  btnSettings: document.getElementById("btn-settings"),
  btnManageItems: document.getElementById("btn-manage-items"),
  btnCloudSync: document.getElementById("btn-cloud-sync"),
  btnMobileMenu: document.getElementById("btn-mobile-menu"),
  headerControls: document.querySelector(".header-controls"),
  
  // Wizard Navigation
  btnWizCancel: document.getElementById("btn-wiz-cancel"),
  btnWizPrev: document.getElementById("btn-wiz-prev"),
  btnWizNext: document.getElementById("btn-wiz-next"),
  btnWizFinish: document.getElementById("btn-wiz-finish"),
  
  // Ficha Inputs
  charName: document.getElementById("char-name"),
  charXid: document.getElementById("char-xid"),
  charCatImg: document.getElementById("char-cat-img"),
  charCatLabel: document.getElementById("char-cat-label"),
  catSelector: document.getElementById("cat-selector"),
  charNotes: document.getElementById("char-notes"),
  // Novos campos do ID card
  charAgenda:   document.getElementById("char-agenda"),
  charBlasfemia: document.getElementById("char-blasfemia"),
  charSexo:     document.getElementById("char-sexo"),
  charCabelo:   document.getElementById("char-cabelo"),
  charOlhos:    document.getElementById("char-olhos"),
  charAltura:   document.getElementById("char-altura"),
  charPeso:     document.getElementById("char-peso"),
  charCid:      document.getElementById("char-cid"),
  sheetXpValue: document.getElementById("sheet-xp-value"),
  sheetXpBar: document.getElementById("sheet-xp-bar-fill"),
  
  // Retrato/Avatar
  portraitImg: document.getElementById("char-portrait-img"),
  portraitInput: document.getElementById("char-portrait-input"),
  portraitFrame: document.getElementById("portrait-frame"),
  
  // Ficha Lists
  skillsListSheet: document.getElementById("skills-list-sheet"),
  stressTrackerSheet: document.getElementById("stress-tracker-sheet"),
  injuriesListSheet: document.getElementById("injuries-list-sheet"),
  afflictionsListSheet: document.getElementById("afflictions-list-sheet"),
  agendaListSheet: document.getElementById("agenda-list-sheet"),
  blasphemiesListSheet: document.getElementById("blasphemies-list-sheet"),
  sinMarksListSheet: document.getElementById("sin-marks-list-sheet"),
  equipmentListSheet: document.getElementById("equipment-list-sheet"),
  hooksListSheet: document.getElementById("hooks-list-sheet"),
  
  btnStressInc: document.getElementById("btn-stress-inc"),
  btnStressDec: document.getElementById("btn-stress-dec"),
  btnInjuryAdd: document.getElementById("btn-injury-add"),
  btnInjuryRemove: document.getElementById("btn-injury-remove"),
  btnPsycheBurst: document.getElementById("btn-psyche-burst"),
  
  btnAddBlasphemy: document.getElementById("btn-add-blasphemy"),
  btnAddSinMark: document.getElementById("btn-add-sin-mark"),
  btnAddHook: document.getElementById("btn-add-hook"),
  
  btnDecXp: document.getElementById("btn-dec-xp"),
  btnIncXp: document.getElementById("btn-inc-xp"),
  
  // Dice Drawer Controls
  diceDrawer: document.getElementById("dice-drawer"),
  btnToggleDrawer: document.getElementById("btn-toggle-drawer"),
  diceQtyD6: document.getElementById("dice-qty-d6"),
  diceQtyD10: document.getElementById("dice-qty-d10"),
  diceQtyD12: document.getElementById("dice-qty-d12"),
  currentRollLabel: document.getElementById("current-roll-label"),
  modEmpenho: document.getElementById("mod-empenho"),
  modOrigemOcupacao: document.getElementById("mod-origem-ocupacao"),
  modOrigemEvento: document.getElementById("mod-origem-evento"),
  modEmpenhoAss: document.getElementById("mod-empenho-ass"),
  modOrigemOcupacaoAss: document.getElementById("mod-origem-ocupacao-ass"),
  modOrigemEventoAss: document.getElementById("mod-origem-evento-ass"),
  modBonusKeep: document.getElementById("mod-bonus-keep"),
  modBonusKeepAss: document.getElementById("mod-bonus-keep-ass"),
  btnAgirInstinto: document.getElementById("btn-agir-instinto"),
  btnRollAction: document.getElementById("btn-roll-action"),
  btnRollCustom: document.getElementById("btn-roll-custom"),
  diceCustomFormula: document.getElementById("dice-custom-formula"),
  
  rollSelectInstinto: document.getElementById("roll-select-instinto"),
  rollSelectSkill: document.getElementById("roll-select-skill"),
  diceOverlay: document.getElementById("dice-overlay"),
  rollChatMessages: document.getElementById("roll-chat-messages"),
  customRollsListSheet: document.getElementById("custom-rolls-list-sheet"),
  btnAddCustomRoll: document.getElementById("btn-add-custom-roll")
};

// ==========================================
// ESTADO COMPARTILHADO DA APLICAÇÃO
// ==========================================
export const state = {
  characters: [],
  currentCharacter: null,
  diceBox: null,
  cainRollState: { skill: "", usePsyche: false },
  cainRollHistory: [],
  currentUser: JSON.parse(localStorage.getItem("cain_mock_user")) || null,
  hasUnsavedCloudChanges: localStorage.getItem("cain_has_unsaved_changes") === "true",
  selectedRoll: {
    skill: "",
    d6: 0,
    d10: 0,
    d12: 0
  },
  activeRollResults: [],
  keptDiceIndexes: [],
  mesa: {
    roomId: null,
    isHost: false,
    players: [],
    mapImage: null,
    rolls: []
  },
  wizardData: {
    step: 1,
    name: "",
    xid: "",
    appearance: "",
    questions: ["", "", "", "", ""],
    skills: {
      Force: 1, Conditioning: 1, Coordination: 1,
      Covert: 1, Interfacing: 1, Investigation: 1, Surveillance: 1,
      Negotiation: 1, Authority: 1, Connection: 1
    },
    agendaType: "",
    agendaSkill: "",
    blasphemy: "",
    blasphemyPowers: [],
    equipment: [],
    notes: ""
  }
};

// ==========================================
// GERENCIADOR DE ESTADO & ARMAZENAMENTO
// ==========================================
let saveTimeout = null;

export function loadCharactersFromStorage() {
  logger.info("Carregando fichas de Exorcistas do LocalStorage...");
  const data = localStorage.getItem("cain_exorcists");
  if (data) {
    try {
      state.characters = JSON.parse(data);
      state.characters.forEach(c => {
        if (c.psycheBursts === undefined) c.psycheBursts = 0;
      });
      logger.info(`${state.characters.length} ficha(s) de Exorcista(s) carregada(s).`);
    } catch (e) {
      logger.error("Erro ao ler dados do LocalStorage:", e);
      state.characters = [];
    }
  } else {
    logger.warn("Nenhum Exorcista encontrado no LocalStorage.");
  }
  
  if (!state.characters || state.characters.length === 0) {
  }
  
  updateCharSelector();
}

export function createTestCharacter() {
  logger.info("Criando Exorcista de teste padrão.");
  const testChar = {
    id: "char_teste",
    name: "Alex Corvis",
    xid: "CX-4471",
    cat: 2,
    portrait: "",
    skills: {
      Force: 1, Conditioning: 1, Coordination: 0,
      Covert: 0, Interfacing: 1, Investigation: 1, Surveillance: 0,
      Negotiation: 0, Authority: 1, Connection: 0
    },
    stressCurrent: 6,
    stressMax: 6,
    injuries: 0,
    afflictions: [],
    psycheBursts: 0,
    sinCurrent: 0,
    agendaNormal: ["Proteger um civil inocente", "Coletar informações sobre um Pecado"],
    agendaBold: ["Destruir um Pecado maior sozinho"],
    blasphemies: ["olho_do_julgamento", "escudo_da_fe"],
    sinMarks: [],
    kitPoints: 5,
    scrip: 0,
    equipment: [
      { name: "Pistola de Serviço", kpCost: 2 },
      { name: "Lanterna", kpCost: 0 },
      { name: "Kit de Primeiros Socorros", kpCost: 1 }
    ],
    hooks: [],
    xp: 0,
    xpBar: 0,
    notes: "Exorcista de teste para demonstração do sistema CAIN."
  };
  state.characters = [testChar];
  try {
    localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
    logger.info("Exorcista de teste persistido.");
  } catch (e) {
    logger.error("Erro ao persistir Exorcista de teste:", e);
  }
}

export function updateCloudSyncBadge() {
  const badge = document.getElementById("cloud-sync-badge");
  if (badge) {
    if (state.currentUser && state.hasUnsavedCloudChanges) {
      badge.style.display = "block";
      localStorage.setItem("cain_has_unsaved_changes", "true");
    } else {
      badge.style.display = "none";
      localStorage.setItem("cain_has_unsaved_changes", "false");
    }
  }
}

export function saveCurrentCharacter() {
  if (!state.currentCharacter) return;
  const index = state.characters.findIndex(c => c.id === state.currentCharacter.id);
  if (index !== -1) {
    state.characters[index] = state.currentCharacter;
  } else {
    state.characters.push(state.currentCharacter);
  }

  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
      logger.info(`[DEBOUNCED SAVE] Ficha de "${state.currentCharacter.name}" salva.`);
      if (state.currentUser) {
        state.hasUnsavedCloudChanges = true;
        updateCloudSyncBadge();
      }
    } catch (e) {
      logger.error("Erro ao salvar Exorcista no LocalStorage:", e);
    }
  }, 500);
  window.dispatchEvent(new CustomEvent("character-saved", { detail: { id: state.currentCharacter.id } }));
}

export function saveCurrentCharacterImmediate() {
  if (!state.currentCharacter) return;
  if (saveTimeout) clearTimeout(saveTimeout);
  try {
    localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
    logger.info(`[IMMEDIATE SAVE] Ficha de "${state.currentCharacter.name}" persistida.`);
    if (state.currentUser) {
      state.hasUnsavedCloudChanges = true;
      updateCloudSyncBadge();
    }
  } catch (e) {
    logger.error("Erro ao salvar Exorcista imediatamente:", e);
  }
}

export function updateCharSelector() {
}

export function loadCharacter(charId) {
  const char = state.characters.find(c => c.id === charId);
  if (!char) {
    logger.error(`Exorcista não encontrado: ${charId}`);
    return;
  }
  state.currentCharacter = char;
  if (state.currentCharacter.psycheBursts === undefined) {
    state.currentCharacter.psycheBursts = 0;
  }
  logger.info(`Carregando Exorcista: "${char.name}" (${charId})`);
  updateCharSelector();
  
  document.getElementById("landing-screen")?.classList.add("hidden");
  el.wizardScreen.classList.add("hidden");
  el.sheetScreen.classList.remove("hidden");
  
  el.charName.value = char.name;
  if (el.charXid)      el.charXid.value      = char.xid       || "";
  setCharCat(char.cat || 1);
  if (el.charNotes)    el.charNotes.value    = char.notes     || "";
  // Novos campos do ID card
  if (el.charAgenda)   el.charAgenda.value   = char.agendaText   || "";
  if (el.charBlasfemia) el.charBlasfemia.value = char.blasfemiaText || "";
  if (el.charSexo)     el.charSexo.value     = char.sexo      || "";
  if (el.charCabelo)   el.charCabelo.value   = char.cabelo    || "";
    if (el.charIdade)    el.charIdade.value    = char.idade     || "";
  if (el.charOlhos)    el.charOlhos.value    = char.olhos     || "";
  if (el.charAltura)   el.charAltura.value   = char.altura    || "";
  if (el.charPeso)     el.charPeso.value     = char.peso      || "";
  if (el.charCid)      el.charCid.value      = char.cid       || "";
  el.sheetXpValue.textContent = char.xp;
  updateXpBar();
  
  if (el.portraitImg) {
    el.portraitImg.src = char.portrait || "";
  }
  
  renderSkillsSheet();
  renderStressHealthSheet();
  renderAgendaSheet();
  renderBlasphemiesSheet();
  renderSinMarksSheet();
  renderEquipmentSheet();
  renderSavedMacrosSheet();
  renderStaticHooks();

  renderCainRollPanel();

  resetDiceDrawerSelections();
  
  // Update piedade display
  if (typeof window.updatePiedadeDisplay === 'function') {
    window.updatePiedadeDisplay();
  }
}

function updateXpBar() {
  const char = state.currentCharacter;
  if (!char || !el.sheetXpBar) return;
  const pct = Math.min(100, (char.xpBar || 0) / 4 * 100);
  el.sheetXpBar.style.width = `${pct}%`;
}

export function deleteActiveCharacter() {
  if (!state.currentCharacter) return;
  const name = state.currentCharacter.name;
  if (confirm(`Tem certeza que deseja apagar a ficha de ${name}?`)) {
    logger.warn(`Deletando Exorcista: "${name}"`);
    const index = state.characters.findIndex(c => c.id === state.currentCharacter.id);
    if (index !== -1) {
      state.characters.splice(index, 1);
      try {
        localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
        logger.info(`Ficha de "${name}" removida.`);
      } catch (e) {
        logger.error("Erro ao salvar após deleção:", e);
      }
      loadCharactersFromStorage();
      if (state.characters.length > 0) {
        loadCharacter(state.characters[0].id);
        import("./chat.js").then(({ renderChatHistory }) => renderChatHistory());
      } else {
        state.currentCharacter = null;
        el.sheetScreen.classList.add("hidden");
        el.wizardScreen.classList.add("hidden");
        const landingScreen = document.getElementById("landing-screen");
        if (landingScreen) {
          landingScreen.classList.remove("hidden");
          import("./landing.js").then(({ renderCharactersList }) => renderCharactersList());
        }
      }
    }
  }
}

export function exportActiveCharacter() {
  if (!state.currentCharacter) return;
  logger.info(`Exportando Exorcista "${state.currentCharacter.name}" para JSON.`);
  const jsonString = JSON.stringify(state.currentCharacter, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${state.currentCharacter.name.toLowerCase().replace(/\s+/g, "_")}_exorcista.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCharacterFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  logger.info(`Importando ficha: ${file.name}`);
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const charObj = JSON.parse(evt.target.result);
      if (!charObj.id || !charObj.name) {
        logger.error("JSON inválido ou fora do padrão CAIN.");
        alert("Ficha inválida! JSON corrompido ou fora do padrão CAIN.");
        return;
      }
      
      charObj.id = "char_" + Date.now();
      state.characters.push(charObj);
      localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
      logger.info(`Ficha de "${charObj.name}" importada.`);
      loadCharactersFromStorage();
      loadCharacter(charObj.id);
      import("./chat.js").then(({ renderChatHistory }) => renderChatHistory());
      alert(`Ficha de ${charObj.name} importada com sucesso!`);
    } catch (err) {
      logger.error("Erro ao ler JSON:", err);
      alert("Erro ao ler o arquivo JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// HOME BREW — DADOS PERSONALIZADOS
// ==========================================
export function getCustomTraits() {
  try { return JSON.parse(localStorage.getItem("cain_homebrew_traits") || "[]"); }
  catch { return []; }
}
export function saveCustomTraits(traits) {
  localStorage.setItem("cain_homebrew_traits", JSON.stringify(traits));
}
export function getCustomMutations() {
  try { return JSON.parse(localStorage.getItem("cain_homebrew_mutations") || "[]"); }
  catch { return []; }
}
export function saveCustomMutations(mutations) {
  localStorage.setItem("cain_homebrew_mutations", JSON.stringify(mutations));
}

window.addEventListener("beforeunload", () => {
  saveCurrentCharacterImmediate();
});

// ==========================================
// LISTENERS DOS CAMPOS DO ID CARD
// Registrado após o DOM carregar
// ==========================================
function bindIdCardFields() {
  const fieldMap = [
    { el: el.charName,     key: "name" },
    { el: el.charXid,      key: "xid" },
    { el: el.charAgenda,   key: "agendaText" },
    { el: el.charBlasfemia,key: "blasfemiaText" },
    { el: el.charSexo,     key: "sexo" },
    { el: el.charCabelo,   key: "cabelo" },
    { el: el.charOlhos,    key: "olhos" },
    { el: el.charIdade,    key: "idade" },
    { el: el.charAltura,   key: "altura" },
    { el: el.charPeso,     key: "peso" },
    { el: el.charCid,      key: "cid" },
  ];
  fieldMap.forEach(({ el: input, key }) => {
    if (!input) return;
    input.addEventListener("input", () => {
      if (!state.currentCharacter) return;
      state.currentCharacter[key] = input.value;
      saveCurrentCharacter();
    });
  });
}

export function setCharCat(newCat) {
  const cat = Math.max(1, Math.min(7, newCat));
  state.currentCharacter.cat = cat;
  if (el.charCatImg) el.charCatImg.src = `./assets/cat${cat}.png`;
  if (el.charCatImg) el.charCatImg.alt = `CAT ${cat}`;
  if (el.charCatLabel) el.charCatLabel.textContent = `CAT ${cat}`;
  saveCurrentCharacter();
}

function initializeState() {
  bindIdCardFields();

  el.catSelector?.addEventListener("click", (e) => {
    if (e.target.closest(".cat-prev")) {
      setCharCat((state.currentCharacter?.cat || 1) + 1);
    } else if (e.target.closest(".cat-next")) {
      setCharCat((state.currentCharacter?.cat || 1) - 1);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeState);
} else {
  initializeState();
}

