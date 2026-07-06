import { el, state, loadCharactersFromStorage, saveCurrentCharacter, loadCharacter, deleteActiveCharacter, importCharacterFile, getCustomTraits, getCustomMutations, updateCloudSyncBadge, saveCurrentCharacterImmediate } from "./js/state.js";
import { startWizard, wizardPrevStep, wizardNextStep, wizardFinish } from "./js/wizard.js";
import { openSettingsModal, openExportModal } from "./js/modals.js";
import { ICONS } from "./icons.js";
import { logger } from "./js/logger.js";
import { initLandingScreen, showLandingScreen } from "./js/landing.js";
import { initPlayer } from "./js/player.js";
import { worldState, loadAllWorldData } from "./js/world-state.js";
import { initMesaUI, minimizeMesa } from "./js/mesa-ui.js";
import { applyTranslations, toggleLanguage, getLang } from "./js/i18n.js";
import { initToolbox } from "./js/toolbox.js";

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  logger.info("Aplicação carregada. Inicializando components...");
  renderIcons();
  loadCharactersFromStorage();
  updateCloudSyncBadge();

  // Carrega todos os novos tipos de ficha do mundo
  loadAllWorldData();
  // Expõe para uso em landing.js (acesso síncrono sem import dinâmico)
  window._worldState = worldState;

  initDiceBox();
  setupEventListeners();
  setupRoomTabs();
  
  // Inicializa a tela de entrada (Landing)
  initLandingScreen();
  initMesaUI();
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
});

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
  
  // Language toggle
  const btnLanguage = document.getElementById("btn-language");
  if (btnLanguage) {
    btnLanguage.addEventListener("click", () => {
      toggleLanguage();
      updateLanguageButton();
    });
  }
  if (el.btnManageItems) {
    el.btnManageItems.addEventListener("click", () => {});
  }
  if (el.btnCloudSync) {
    el.btnCloudSync.addEventListener("click", () => {});
  }
  
  // Logo home button - volta para landing screen (minimiza a mesa se estiver ativa)
  const btnHome = document.getElementById("btn-home");
  if (btnHome) {
    btnHome.addEventListener("click", () => {
      minimizeMesa(); // no-op se a mesa não estiver ativa
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
  const autoSaveInputs = [el.charName, el.charNotes, document.getElementById("char-xid")].filter(Boolean);
  autoSaveInputs.forEach(input => {
    input.addEventListener("input", () => {
      if (state.currentCharacter) {
        state.currentCharacter.name = el.charName.value || "Sem Nome";
        state.currentCharacter.notes = el.charNotes?.value || "";
        if (document.getElementById("char-xid")) state.currentCharacter.xid = document.getElementById("char-xid").value;
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

  // Enviar resultado para a Mesa
  document.getElementById("btn-send-normal-to-mesa")?.addEventListener("click", () => {
    import("./js/roller.js").then(({ sendRollToMesa }) => sendRollToMesa(false));
  });
  document.getElementById("btn-send-instinto-to-mesa")?.addEventListener("click", () => {
    import("./js/roller.js").then(({ sendRollToMesa }) => sendRollToMesa(true));
  });

  const btnClearChat = document.getElementById("btn-clear-chat");
  if (btnClearChat) {
    btnClearChat.addEventListener("click", () => {
      import("./js/chat.js").then(({ clearChatHistory }) => clearChatHistory());
    });
  }

  // Roteamento de eventos customizados
  document.addEventListener("start-wizard", startWizard);
  document.addEventListener("load-new-character", (e) => {
    loadCharacter(e.detail);
  });
  document.addEventListener("render-chat-history", () => {
    import("./js/chat.js").then(({ renderChatHistory }) => renderChatHistory());
  });

  // Ouvintes para gerenciamento de rolagens personalizadas (macros)
  if (el.btnAddCustomRoll) {
    el.btnAddCustomRoll.addEventListener("click", () => {
      import("./js/modals.js").then(({ openCustomRollModal }) => openCustomRollModal());
    });
  }

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

  // Injury Max Inc/Dec (add and remove boxes)
  document.getElementById("btn-injury-max-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const maxInjuries = char.injuriesMax !== undefined ? char.injuriesMax : 3;
    if (maxInjuries > 0) {
      char.injuriesMax = maxInjuries - 1;
      if ((char.injuries || 0) > char.injuriesMax) {
        char.injuries = char.injuriesMax;
      }
      const currentMax = Math.max(0, (char.stressMax || 6) - (char.injuries || 0));
      if (char.stressCurrent > currentMax) {
        char.stressCurrent = currentMax;
      }
      saveCurrentCharacter();
      import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    }
  });
  document.getElementById("btn-injury-max-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    const maxInjuries = char.injuriesMax !== undefined ? char.injuriesMax : 3;
    char.injuriesMax = maxInjuries + 1;
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
  });

  // Psyche Inc/Dec
  document.getElementById("btn-psyche-dec")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.psycheBursts = Math.max(0, (char.psycheBursts !== undefined ? char.psycheBursts : 3) - 1);
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderStressHealthSheet }) => renderStressHealthSheet());
    import("./js/cain-roller.js").then(({ renderCainRollPanel }) => renderCainRollPanel());
  });
  document.getElementById("btn-psyche-inc")?.addEventListener("click", () => {
    const char = state.currentCharacter;
    if (!char) return;
    char.psycheBursts = Math.min(3, (char.psycheBursts !== undefined ? char.psycheBursts : 3) + 1);
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
    char.sinCurrent = Math.min(10, (char.sinCurrent || 0) + 1);
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
    char.piedadeCurrent = Math.min(3, (char.piedadeCurrent || 0) + 1);
    saveCurrentCharacter();
    updatePiedadeDisplay();
  });

  // Piedade Checkboxes
  [1, 2, 3].forEach(n => {
    document.getElementById(`piedade-check-${n}`)?.addEventListener("change", () => {
      const char = state.currentCharacter;
      if (!char) return;
      let count = 0;
      [1, 2, 3].forEach(i => {
        if (document.getElementById(`piedade-check-${i}`)?.checked) count++;
      });
      char.piedadeCurrent = count;
      saveCurrentCharacter();
      updatePiedadeDisplay();
    });
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
    const names = ["olho_do_pecado", "toque_necrosado", "lingua_do_abismo", "sede_de_sangue", "marca_da_condenacao"];
    const input = prompt(`Adicionar Marca do Pecado (ID):\nDisponíveis: ${names.join(", ")}`);
    if (!input) return;
    const char = state.currentCharacter;
    if (!char) return;
    if (!char.sinMarks) char.sinMarks = [];
    char.sinMarks.push(input.trim());
    saveCurrentCharacter();
    import("./js/sheet.js").then(({ renderSinMarksSheet }) => renderSinMarksSheet());
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

function setupRoomTabs() {
  const tabs = document.querySelectorAll(".room-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.roomTab;
      document.querySelectorAll(".room-tab-content").forEach(c => c.classList.add("hidden"));
      const content = document.getElementById("room-tab-" + target);
      if (content) content.classList.remove("hidden");
    });
  });
  const joinStep = document.getElementById("room-step-join");
  if (joinStep) {
    document.querySelector("[data-room-tab='entrar']")?.addEventListener("click", () => {
      document.getElementById("room-step-join")?.classList.remove("hidden");
    });
  }
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
  
  const piedade = char.piedadeCurrent || 0;
  let remaining = piedade;
  [1, 2, 3].forEach(n => {
    const cb = document.getElementById(`piedade-check-${n}`);
    if (cb) {
      const isChecked = remaining > 0;
      cb.checked = isChecked;
      const label = cb.closest(".piedade-checkbox");
      if (label) {
        if (isChecked) label.classList.add("checked");
        else label.classList.remove("checked");
      }
      if (remaining > 0) remaining--;
    }
  });
  
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
