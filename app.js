import { el, state, loadCharactersFromStorage, saveCurrentCharacter, loadCharacter, deleteActiveCharacter, importCharacterFile, getCustomTraits, getCustomMutations, updateCloudSyncBadge, saveCurrentCharacterImmediate, loadSinsFromStorage, loadMissionsFromStorage } from "./js/state.js";
import { startWizard, wizardPrevStep, wizardNextStep, wizardFinish } from "./js/wizard.js";
import { openSettingsModal, openExportModal, openStressSettingsModal } from "./js/modals.js";
import { ICONS } from "./icons.js";
import { logger } from "./js/logger.js";
import { initLandingScreen, showLandingScreen } from "./js/landing.js";
import { initPlayer } from "./js/player.js";
import { applyTranslations, toggleLanguage, getLang } from "./js/i18n.js";
import { initToolbox } from "./js/toolbox.js";

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
function initializeApp() {
  logger.info("Aplicação carregada. Inicializando components...");
  renderIcons();
  loadCharactersFromStorage();
  loadSinsFromStorage();
  loadMissionsFromStorage();
  // Centraliza e inicializa o tamanho dos controles de estresse
  const savedStressSize = localStorage.getItem("stress_input_size");
  if (savedStressSize) {
    document.documentElement.style.setProperty("--stress-input-size", `${savedStressSize}px`);
  }
  updateCloudSyncBadge();

  initDiceBox();
  setupEventListeners();
  // Inicializa a tela de entrada (Landing)
  initLandingScreen();
  showLandingScreen();

  initPlayer();
  initToolbox();

  // Initialize i18n
  applyTranslations();
  updateLanguageButton();

  // Initialize static hooks listeners
  import("./js/sheet.js").then(({ initStaticHooksListeners }) => {
    initStaticHooksListeners();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}


// Renderização dos ícones SVG inline baseados em data-icon
function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach(node => {
    const iconName = node.getAttribute("data-icon");
    if (ICONS[iconName]) {
      node.innerHTML = ICONS[iconName];
    }
  });
}

// Inicializa a biblioteca DiceBox local
function initDiceBox() {
  logger.info("Inicializando o motor DiceBox 3D...");
  const container = document.getElementById("dice-box-3d");
  const diceEngine = (typeof DICE !== "undefined") ? DICE : null;
  if (diceEngine && diceEngine.dice_box && container) {
    try {
      state.diceBox = new diceEngine.dice_box(container);
      window.diceBox = state.diceBox;
      logger.info("3D Dice Box local inicializado com sucesso.");
    } catch (e) {
      logger.error("Erro ao instanciar DICE.dice_box:", e);
    }
  } else {
    logger.error("DICE.dice_box ou container #dice-box-3d não encontrado no DOM.");
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  logger.info("Configurando ouvintes de eventos da interface...");
  // Header controls
  el.btnNewChar.addEventListener("click", startWizard);
  el.btnDeleteChar.addEventListener("click", deleteActiveCharacter);
  if (el.btnSettings) {
    el.btnSettings.addEventListener("click", openSettingsModal);
  }
    document.getElementById("btn-stress-settings")?.addEventListener("click", openStressSettingsModal);
  // Language toggle
  const btnLanguage = document.getElementById("btn-language");
  if (btnLanguage) {
    btnLanguage.addEventListener("click", () => {
      toggleLanguage();
      updateLanguageButton();
    });
  }
  if (el.btnManageItems) {
    el.btnManageItems.addEventListener("click", () => {
      import("./js/modals/create-agenda-modal.js").then(({ openCreateAgendaModal }) => {
        import("./js/modals/create-blasphemy-modal.js").then(({ openCreateBlasphemyModal }) => {
          el.modalContainer.classList.remove("hidden");
          el.modalBody.innerHTML = `
            <h3 class="modal-title">Gerenciar Itens</h3>
            <div style="padding: 20px 0; display: flex; flex-direction: column; gap: 12px;">
              <button id="btn-quick-create-agenda" class="btn btn-md btn-secondary" style="padding: 14px; font-size: var(--font-size-md);">
                + Criar Agenda
              </button>
              <button id="btn-quick-create-blasphemy" class="btn btn-md btn-secondary" style="padding: 14px; font-size: var(--font-size-md);">
                + Criar Blasfêmia
              </button>
            </div>
            <div class="modal-footer" style="justify-content: flex-end;">
              <button id="btn-items-modal-close" class="btn btn-md">Fechar</button>
            </div>
          `;
          document.getElementById("btn-quick-create-agenda").onclick = () => {
            el.modalContainer.classList.add("hidden");
            openCreateAgendaModal();
          };
          document.getElementById("btn-quick-create-blasphemy").onclick = () => {
            el.modalContainer.classList.add("hidden");
            openCreateBlasphemyModal();
          };
          document.getElementById("btn-items-modal-close").onclick = () => {
            el.modalContainer.classList.add("hidden");
          };
        });
      });
    });
  }
  if (el.btnCloudSync) {
    el.btnCloudSync.addEventListener("click", () => {
      import("./js/modals/storage-manager.js").then(({ openCloudSyncModal }) => {
        openCloudSyncModal();
      });
    });
  }
  
  // Logo home button - volta para landing screen (minimiza a mesa se estiver ativa)
  const btnHome = document.getElementById("btn-home");
  if (btnHome) {
    btnHome.addEventListener("click", () => {
      goToLanding();
    });
  }

  // Export/Import JSON
  el.btnExportJson.addEventListener("click", openExportModal);
  el.btnImportJson.addEventListener("click", () => el.fileImport.click());
  el.fileImport.addEventListener("change", importCharacterFile);

  // Mobile Menu Toggling
  if (el.btnMobileMenu && el.headerControls) {
    el.btnMobileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      el.btnMobileMenu.classList.toggle("active");
      el.headerControls.classList.toggle("active");
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", (e) => {
      if (el.headerControls.classList.contains("active")) {
        if (!el.headerControls.contains(e.target) && !el.btnMobileMenu.contains(e.target)) {
          el.btnMobileMenu.classList.remove("active");
          el.headerControls.classList.remove("active");
        }
      }
    });

    // Close sidebar when a control inside it is clicked (e.g. character selector or button)
    el.headerControls.addEventListener("click", (e) => {
      if (e.target.closest("button") || (e.target.closest("select") && e.type === "change")) {
        el.btnMobileMenu.classList.remove("active");
        el.headerControls.classList.remove("active");
      }
    });


  }

  // Voltar button in mobile sidebar
  const btnVoltar = document.getElementById("btn-voltar-landing");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", goToLanding);
  }

  document.querySelectorAll(".btn-lock-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".aptitude-column-card");
      if (card) {
        const isLocked = card.classList.toggle("locked");
        card.classList.toggle("card-glass", isLocked);
        const iconSpan = btn.querySelector("[data-icon]");
        if (iconSpan) {
          iconSpan.setAttribute("data-icon", isLocked ? "lock" : "unlock");
          // Re-render icon
          const iconName = iconSpan.getAttribute("data-icon");
          if (ICONS[iconName]) {
            iconSpan.innerHTML = ICONS[iconName];
          }
        }
      }
    });
  });

  // Wizard Navigation
  if (el.btnWizCancel) {
    el.btnWizCancel.addEventListener("click", () => {
      if (confirm("Deseja cancelar a criação do personagem? Todo o progresso será perdido.")) {
        goToLanding();
      }
    });
  }
  el.btnWizPrev.addEventListener("click", wizardPrevStep);
  el.btnWizNext.addEventListener("click", wizardNextStep);
  el.btnWizFinish.addEventListener("click", wizardFinish);
  
  // Ficha Auto-save inputs
  const autoSaveInputs = [el.charName, document.getElementById("char-xid")].filter(Boolean);
  autoSaveInputs.forEach(input => {
    input.addEventListener("input", () => {
      if (state.currentCharacter) {
        state.currentCharacter.name = el.charName.value || "Sem Nome";
        if (document.getElementById("char-xid")) state.currentCharacter.xid = document.getElementById("char-xid").value;
        saveCurrentCharacter();
      }
    });
  });

  // Notes auto-save
  const notesFields = [
    { el: el.charNotesMission, key: "mission" },
    { el: el.charNotesContacts, key: "contacts" },
    { el: el.charNotesSecrets, key: "secrets" },
    { el: el.charNotesJournal, key: "journal" },
    { el: el.charNotesPersonalQ1, key: "personalQ1" },
    { el: el.charNotesPersonalQ2, key: "personalQ2" },
    { el: el.charNotesPersonalQ3, key: "personalQ3" },
    { el: el.charNotesPersonalQ4, key: "personalQ4" },
    { el: el.charNotesPersonalQ5, key: "personalQ5" }
  ];
  notesFields.forEach(({ el: input, key }) => {
    if (!input) return;
    input.addEventListener("input", () => {
      if (state.currentCharacter) {
        state.currentCharacter.notes[key] = input.value;
        saveCurrentCharacter();
      }
    });
  });

  // Modal Generic Close
  el.modalContainer.addEventListener("click", (e) => {
    if (e.target === el.modalContainer || e.target.classList.contains("modal-close")) {
      el.modalContainer.classList.add("hidden");
      el.modalBody.parentElement.classList.remove("wide-modal");
    }
  });

  // Torna os modais arrastáveis
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;
  let currentDragTarget = null;

  document.addEventListener("mousedown", (e) => {
    const modalContent = e.target.closest(".modal-content, .conflito-modal-content");
    if (!modalContent) return;

    // Não arrasta se clicar em botões, campos de entrada, selects, links ou no botão de fechar
    const tag = e.target.tagName.toLowerCase();
    if (
      tag === "input" || 
      tag === "button" || 
      tag === "select" || 
      tag === "textarea" || 
      tag === "a" || 
      e.target.closest(".btn") || 
      e.target.classList.contains("modal-close") ||
      e.target.closest(".dice-skills-selection") || 
      e.target.closest(".results-dice-grid") ||
      e.target.closest(".library-items-grid") ||
      e.target.closest("#modal-body") ||
      e.target.closest(".conflito-modal-body")
    ) {
      return;
    }
    
    isDragging = true;
    currentDragTarget = modalContent;
    currentDragTarget.style.cursor = "grabbing";
    
    const rect = currentDragTarget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    
    startX = e.clientX;
    startY = e.clientY;
    
    currentDragTarget.style.position = "absolute";
    currentDragTarget.style.margin = "0";
    currentDragTarget.style.left = `${initialLeft}px`;
    currentDragTarget.style.top = `${initialTop}px`;
    currentDragTarget.style.transform = "none";
    currentDragTarget.style.animation = "none";
    
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !currentDragTarget) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    currentDragTarget.style.left = `${initialLeft + dx}px`;
    currentDragTarget.style.top = `${initialTop + dy}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging && currentDragTarget) {
      isDragging = false;
      currentDragTarget.style.cursor = "grab";
      currentDragTarget = null;
    }
  });

  // Aplica o cursor grab inicial
  document.querySelectorAll(".modal-content, .conflito-modal-content").forEach(m => m.style.cursor = "grab");

  // Observer para recentralizar os modais quando os containers forem escondidos
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const targetContainer = mutation.target;
        if (targetContainer.classList.contains("hidden")) {
          // Reseta todos os modais dentro deste container
          const modalsInside = targetContainer.querySelectorAll(".modal-content, .conflito-modal-content");
          modalsInside.forEach(m => {
            m.style.position = "";
            m.style.left = "";
            m.style.top = "";
            m.style.transform = "";
            m.style.margin = "";
            m.style.animation = "";
            m.style.cursor = "grab";
          });
        }
      }
    });
  });
  
  if (el.modalContainer) observer.observe(el.modalContainer, { attributes: true, attributeFilter: ["class"] });
  const diceDrawer = document.getElementById("dice-drawer");
  if (diceDrawer) observer.observe(diceDrawer, { attributes: true, attributeFilter: ["class"] });

  // Cabo de Guerra Adjustments (CAIN placeholder)
  if (el.btnDecDet) el.btnDecDet.addEventListener("click", () => {});
  if (el.btnIncDet) el.btnIncDet.addEventListener("click", () => {});
  if (el.btnDecAss) el.btnDecAss.addEventListener("click", () => {});
  if (el.btnIncAss) el.btnIncAss.addEventListener("click", () => {});
  if (el.btnAvancoAssimilacao) el.btnAvancoAssimilacao.style.display = "none";

  // Dice Drawer Trigger
 // --- SUBSTITUA O BLOCO ANTIGO DE "Dice Drawer Trigger" E "Header Open Roller Trigger" POR ESTE: ---

  // Botão "Lançar Dados" no cabeçalho abre o modal do rolador
  if (el.btnOpenRoller) {
    el.btnOpenRoller.addEventListener("click", () => {
      if (el.diceDrawer) el.diceDrawer.classList.remove("hidden");
    });
  }

  // Novo botão de fechar (X) dentro do modal do rolador
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener("click", () => {
      if (el.diceDrawer) el.diceDrawer.classList.add("hidden");
    });
  }

  // Botões inferiores "FECHAR PAINEL"
  document.querySelectorAll(".btn-close-roller-panel").forEach(btn => {
    btn.addEventListener("click", () => {
      if (el.diceDrawer) el.diceDrawer.classList.add("hidden");
    });
  });

  // Fechar o modal ao clicar na área escura (overlay) de fundo
  if (el.diceDrawer) {
    el.diceDrawer.addEventListener("click", (e) => {
      if (e.target === el.diceDrawer) {
        el.diceDrawer.classList.add("hidden");
      }
    });
  }



  // Navegação de Abas da Ficha
  const tabButtons = document.querySelectorAll(".sheet-tab-btn");
  const tabPanels = document.querySelectorAll(".sheet-tab-panel");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      tabPanels.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  // Navegação de Abas das Anotações
  const notesTabBtns = document.querySelectorAll(".notes-tab-btn");
  const notesTabPanels = document.querySelectorAll(".notes-tab-panel");
  notesTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-notes-tab");
      notesTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      notesTabPanels.forEach(p => {
        if (p.id === target) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });
    });
  });

  // Navegação de Abas do Assistente de Criação (XP Inicial / Passo 8)
  const xpTabButtons = document.querySelectorAll(".xp-tab-btn");
  const xpTabContents = document.querySelectorAll(".xp-tab-content");
  xpTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      xpTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      xpTabContents.forEach(panel => {
        if (panel.id === targetTab) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  // Clique na moldura do retrato para abrir selecionador de arquivo
  if (el.portraitFrame && el.portraitInput) {
    el.portraitFrame.addEventListener("click", () => {
      el.portraitInput.click();
    });

    el.portraitInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 1.5 * 1024 * 1024) {
        alert("A imagem selecionada é muito grande! Por favor, escolha uma imagem menor que 1.5MB.");
        return;
      }

      logger.info(`Iniciando upload e otimização de imagem de retrato: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      const reader = new FileReader();
      reader.onload = function(evt) {
        const tempImg = new Image();
        tempImg.onload = function() {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = tempImg.width;
          let height = tempImg.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(tempImg, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          logger.info(`Retrato comprimido com sucesso. Novo tamanho Base64 aproximado: ${Math.round(compressedDataUrl.length / 1024)} KB`);

          if (state.currentCharacter) {
            state.currentCharacter.portrait = compressedDataUrl;
            if (el.portraitImg) {
              el.portraitImg.src = compressedDataUrl;
            }
            saveCurrentCharacter();
          }
        };
        tempImg.onerror = function() {
          logger.error("Erro ao carregar a imagem temporária para redimensionamento.");
          alert("Erro ao processar a imagem. Certifique-se de que é um formato válido.");
        };
        tempImg.src = evt.target.result;
      };
      reader.onerror = function(err) {
        logger.error("Erro ao ler o arquivo selecionado:", err);
      };
      reader.readAsDataURL(file);
    });
  }
    // Abrir o modal pelo botão "Lançar Dados" do cabeçalho
  document.getElementById("btn-open-roller").addEventListener("click", () => {
    document.getElementById("dice-drawer").classList.remove("hidden");
  });

  // Fechar o modal pelo botão de fechar X incorporado
  document.getElementById("btn-close-drawer").addEventListener("click", () => {
    document.getElementById("dice-drawer").classList.add("hidden");
  });

  // Fechar ao clicar na área escura de fora do modal
  document.getElementById("dice-drawer").addEventListener("click", (e) => {
    if (e.target.id === "dice-drawer") {
      document.getElementById("dice-drawer").classList.add("hidden");
    }
  });

  document.addEventListener("start-wizard", startWizard);
  document.addEventListener("load-new-character", (e) => {
    loadCharacter(e.detail);
  });
  document.getElementById("btn-clear-chat")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (char) {
      char.rollHistory = [];
      saveCurrentCharacter();
      import("./js/cain-roller.js").then(({ renderCainRollHistory }) => renderCainRollHistory());
    }
  });

  // ==========================================
  // CAIN SHEET CONTROLS
  // ==========================================

  // Stress Inc/Dec
  document.getElementById("btn-stress-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const currentMax = Math.max(0, (char.stressMax || 6) - (char.injuries || 0));
    if (char.stressCurrent < currentMax) {
      char.stressCurrent++;
      saveCurrentCharacter();
      import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    } else {
      // Overflow: limpa stress, ganha ferida
      char.stressCurrent = 0;
      const maxInj = char.injuriesMax !== undefined ? char.injuriesMax : 3;
      char.injuries = Math.min((char.injuries || 0) + 1, maxInj);
      saveCurrentCharacter();
      import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    }
  });

  document.getElementById("btn-stress-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char || char.stressCurrent <= 0) return;
    char.stressCurrent--;
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
  });

  // Injury Inc/Dec (mark and unmark)
  document.getElementById("btn-injury-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.injuries = Math.max(0, (char.injuries || 0) - 1);
    const currentMax = Math.max(0, (char.stressMax || 6) - char.injuries);
    if (char.stressCurrent > currentMax) {
      char.stressCurrent = currentMax;
    }
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
  });
  document.getElementById("btn-injury-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const maxInjuries = char.injuriesMax !== undefined ? char.injuriesMax : 3;
    char.injuries = Math.min(maxInjuries, (char.injuries || 0) + 1);
    const currentMax = Math.max(0, (char.stressMax || 6) - char.injuries);
    if (char.stressCurrent > currentMax) {
      char.stressCurrent = currentMax;
    }
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
  });

  

  // Psyche Inc/Dec
  document.getElementById("btn-psyche-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.psycheBursts = Math.max(0, (char.psycheBursts !== undefined ? char.psycheBursts : 0) - 1);
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    import("./js/cain-roller.js").then(({ renderCainRollPanel }) => renderCainRollPanel());
  });
  document.getElementById("btn-psyche-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const maxPsyche = char.psycheMax !== undefined ? char.psycheMax : 3;
    char.psycheBursts = Math.min(maxPsyche, (char.psycheBursts !== undefined ? char.psycheBursts : 0) + 1);
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    import("./js/cain-roller.js").then(({ renderCainRollPanel }) => renderCainRollPanel());
  });

  // Sin Inc/Dec
  document.getElementById("btn-sin-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.sinCurrent = Math.max(0, (char.sinCurrent || 0) - 1);
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
  });
  document.getElementById("btn-sin-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const maxSin = char.sinMax !== undefined ? char.sinMax : 10;
    char.sinCurrent = Math.min(maxSin, (char.sinCurrent || 0) + 1);
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
  });

  // Piedade Inc/Dec
  document.getElementById("btn-piedade-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.piedadeCurrent = Math.max(0, (char.piedadeCurrent || 0) - 1);
    saveCurrentCharacter();
    updatePiedadeDisplay();
  });
  document.getElementById("btn-piedade-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const maxPiedade = char.piedadeMax !== undefined ? char.piedadeMax : 3;
    char.piedadeCurrent = Math.min(maxPiedade, (char.piedadeCurrent || 0) + 1);
    saveCurrentCharacter();
    updatePiedadeDisplay();
  });


  // Agonia Divina
  document.getElementById("btn-divine-agony")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    if (char.divineAgonyUsed) {
      alert("Agonia Divina já foi usada nesta sessão!");
      return;
    }
    const piedade = char.piedadeCurrent || 0;
    if (piedade <= 0) {
      alert("Você precisa de pelo menos 1 ponto de Piedade para usar Agonia Divina!");
      return;
    }
    if (!confirm(`Queimar ${piedade} Piedade para ganhar +${piedade}D nesta rolagem?`)) return;
    
    char.divineAgonyUsed = true;
    char.piedadeCurrent = 0;
    saveCurrentCharacter();
    updatePiedadeDisplay();
    alert(`Agonia Divina ativada! +${piedade}D nesta rolagem. Piedade zerada.`);
  });

  // XP Controls
  document.getElementById("btn-dec-xp")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char || (char.xp || 0) <= 0) return;
    char.xp--;
    saveCurrentCharacter();
    updateXpDisplay();
  });

  document.getElementById("btn-inc-xp")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.xp = (char.xp || 0) + 1;
    char.xpBar = (char.xpBar || 0) + 1;
    if (char.xpBar >= 4) {
      char.xpBar = 0;
      alert("Você ganhou um Advance! Gaste para evoluir perícias ou adquirir novas habilidades.");
    }
    saveCurrentCharacter();
    updateXpDisplay();
  });

  // Add Sin Mark
  document.getElementById("btn-add-sin-mark")?.addEventListener("click", () => {
    import("./js/modals/sinmarks-modal.js").then(({ openSinMarksModal }) => {
      openSinMarksModal();
    });
  });

  // Add Hook
  document.getElementById("btn-add-hook")?.addEventListener("click", () => {
    const name = prompt("Nome do Hook:");
    if (!name) return;
    const char = state.currentCharacter;
    if (!char) return;
    if (!char.hooks) char.hooks = [];
    char.hooks.push({ name, current: 0, max: 3 });
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderEquipmentSheet }) => renderEquipmentSheet());
  });

}
// Add Affliction
  document.getElementById("btn-add-affliction")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    const nameEl = document.getElementById("input-affliction-name");
    const descEl = document.getElementById("input-affliction-desc");
    if (!nameEl || !descEl) return;
    const name = nameEl.value.trim();
    const desc = descEl.value.trim();
    if (name) {
      if (!char.afflictions) char.afflictions = [];
       char.afflictions.push({ name, desc });
      saveCurrentCharacter();
       // Clear inputs
      nameEl.value = "";
      descEl.value = "";
      import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    }else {
      alert("Por favor, digite pelo menos o nome da aflição.");
    }
  });
function updateLanguageButton() {
  const btnLanguage = document.getElementById("btn-language");
  if (btnLanguage) {
    const lang = getLang();
    btnLanguage.textContent = lang === "pt" ? "🌐 EN" : "🌐 PT";
    btnLanguage.title = lang === "pt" ? "Mudar para Inglês" : "Mudar para Português";
  }
}

function goToLanding() {
  import("./js/landing.js").then(({ showLandingScreen }) => {
    showLandingScreen();
  });
}



function updateXpDisplay() {
  const char = state.currentCharacter;
  if (!char) return;
  // Contador de XP geral (header)
  const xpEl = document.getElementById("xp-value");
  if (xpEl) xpEl.textContent = char.xp;
  // Contador de XP na aba da ficha
  const sheetXpEl = document.getElementById("sheet-xp-value");
  if (sheetXpEl) sheetXpEl.textContent = char.xp;
}

function updatePiedadeDisplay() {
  const char = state.currentCharacter;
  if (!char) return;
  
  const group = document.getElementById("piedade-checkbox-group");
  if (group) {
    const piedadeMax = char.piedadeMax !== undefined ? char.piedadeMax : 3;
    const piedadeCurrent = char.piedadeCurrent || 0;
    group.innerHTML = "";
    for (let i = 1; i <= piedadeMax; i++) {
      const checked = i <= piedadeCurrent;
      const label = document.createElement("label");
      label.className = `piedade-checkbox ${checked ? 'checked' : ''}`;
      label.innerHTML = `
        <input type="checkbox" id="piedade-check-${i}" ${checked ? 'checked' : ''}>
        <img src="./assets/agonia.webp" class="piedade-icon" alt="Agonia">
      `;
      label.querySelector("input").addEventListener("change", () => {
        const char = state.currentCharacter;
        if (!char) return;
        let count = 0;
        group.querySelectorAll("input").forEach(cb => {
          if (cb.checked) count++;
        });
        char.piedadeCurrent = count;
        saveCurrentCharacter();
        updatePiedadeDisplay();
      });
      group.appendChild(label);
    }
  }
  const piedade = char.piedadeCurrent || 0;
  const divineBtn = document.getElementById("btn-divine-agony");
  if (divineBtn) {
    divineBtn.disabled = char.divineAgonyUsed || piedade <= 0;
  }
  
  const infoEl = document.getElementById("divine-agony-info");
  const bonusEl = document.getElementById("divine-agony-bonus");
  if (infoEl && bonusEl) {
    if (char.divineAgonyUsed) {
      infoEl.style.display = "block";
      bonusEl.textContent = "0";
      infoEl.innerHTML = '<span style="color:#9ca3af;">Usado nesta sessão</span>';
    } else {
      infoEl.style.display = "none";
    }
  }
}

// Expose for state.js
window.updatePiedadeDisplay = updatePiedadeDisplay;
