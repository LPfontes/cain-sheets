import { el, state, saveCurrentCharacter } from "../state.js";
import { SIN_MARKS } from "../cain-data.js";
import { renderSinMarksSheet } from "../sheet.js";

// Categories definition according to the book
const CATEGORIES = [
  { value: 1, name: "OLHOS", prefix: "olhos_", appearance: "Esclera preta ou alterada, íris branca, pupilas divididas, cortadas ou duplicadas." },
  { value: 2, name: "MANDIBULA", prefix: "mandibula_", appearance: "Mandíbula dividida ou estendida, mandíbula faríngea, presas, língua preta, saliva viscosa." },
  { value: 3, name: "COSTAS OU PEITO", prefix: "costas_peito_", appearance: "Espinhos, lesões, descoloração ou deformação na pele, regeneração rápida, pele ou escamas endurecidas ou soltas, asas vestigiais, costelas extras." },
  { value: 4, name: "MÃOS OU BRAÇOS", prefix: "maos_bracos_", appearance: "Garras, mão dividida, braço extra, pele ou músculos distorcidos, descoloração dos membros, dedos extras." },
  { value: 5, name: "PELE, CABELO OU PERNAS", prefix: "pele_cabelo_pernas_", appearance: "Grande descoloração ou branqueamento, pele transparente, deformação digitiforme ou múltiplas pernas, mudança na cor de cabelo." }
];

export function openSinMarksModal() {
  const char = state.currentCharacter;
  if (!char) return;

  el.modalContainer.classList.remove("hidden");
  if (el.modalBody && el.modalBody.parentElement) {
    el.modalBody.parentElement.className = "modal-content card-glass";
  }

  let rollingState = {
    mode: "roll", // "roll" or "choose"
    categoryRoll: null,
    selectedCategory: null,
    optionRoll: null,
    selectedOption: null,
    isEvolution: false,
    rollingLog: [],
    chooseTab: 0
  };

  const renderModal = () => {
    const sinMarksCount = char.sinMarks?.length || 0;
    const currentResistBonus = sinMarksCount;
    const currentTransgressionReduction = sinMarksCount * 2;

    el.modalBody.innerHTML = `
      <h3 class="modal-title"> Adquirir Marca do Pecado</h3>
      
      <!-- Stats Reminder Banner -->
      <div class="sinmarks-stats-banner">
        <span class="sinmarks-stat-cyan"><strong>Bônus de Resistência:</strong> +${currentResistBonus}</span>
        <span class="sinmarks-stat-purple"><strong>Redução de Transgressão:</strong> -${currentTransgressionReduction}</span>
      </div>

      <!-- Tab Navigation -->
      <div class="sinmarks-tab-bar">
        <button id="btn-tab-roll" class="btn sinmarks-tab-btn ${rollingState.mode === 'roll' ? 'btn-primary' : 'btn-secondary'}">Rolar Marca</button>
        <button id="btn-tab-choose" class="btn sinmarks-tab-btn ${rollingState.mode === 'choose' ? 'btn-primary' : 'btn-secondary'}">Escolha Manual</button>
      </div>

      <div class="modal-scroll-content sinmarks-scroll-area">
        ${rollingState.mode === "roll" ? renderRollMode() : renderChooseMode()}
      </div>

      <div class="sinmarks-footer">
        <button id="btn-close-sinmarks-modal" class="btn btn-secondary">Fechar</button>
      </div>
    `;

    // Tab switcher events
    document.getElementById("btn-tab-roll").onclick = () => {
      rollingState.mode = "roll";
      renderModal();
    };
    document.getElementById("btn-tab-choose").onclick = () => {
      rollingState.mode = "choose";
      renderModal();
    };
    document.getElementById("btn-close-sinmarks-modal").onclick = () => {
      el.modalContainer.classList.add("hidden");
    };

    // Bind inner contents events
    if (rollingState.mode === "roll") {
      bindRollEvents();
    } else {
      bindChooseEvents();
    }
  };

  const renderRollMode = () => {
    let logHtml = rollingState.rollingLog.map(log => `
      <div class="sinmarks-log-item">${log}</div>
    `).join("");

    return `
      <div class="sinmarks-roll-mode">
        
        <!-- Step 1: Roll Category -->
        <div class="sinmarks-step-card">
          <div class="sinmarks-step-title">Passo 1: Categoria da Marca (1d6)</div>
          
          ${rollingState.categoryRoll === null ? `
            <button id="btn-roll-category" class="btn btn-primary sinmarks-btn-full">Rolar Categoria (1d6)</button>
          ` : `
            <div class="sinmarks-result-row">
              <span>Resultado do Dado: <strong>d6 = ${rollingState.categoryRoll}</strong></span>
              <span class="sinmarks-result-value">${rollingState.selectedCategory.name}</span>
            </div>
            <div class="sinmarks-appearance-text">
              <strong>Aparência típica:</strong> ${rollingState.selectedCategory.appearance}
            </div>
            ${rollingState.isEvolution ? `
              <div class="sinmarks-evolution-badge">
                Marca já possuída! A marca irá evoluir (concedendo nova habilidade).
              </div>
            ` : ''}
          `}

          <!-- If rolled a 6: Category Choice -->
          ${rollingState.categoryRoll === 6 && !rollingState.selectedCategory ? `
            <div class="sinmarks-choice-section">
              <div class="sinmarks-choice-label">Você rolou um 6! Escolha qualquer uma das categorias abaixo:</div>
              <div class="sinmarks-choice-buttons">
                ${CATEGORIES.map(cat => `
                  <button class="btn btn-sm btn-select-category-choice sinmarks-select-btn" data-val="${cat.value}">
                    ${cat.value}. ${cat.name}
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Step 2: Roll Ability -->
        ${rollingState.selectedCategory ? `
          <div class="sinmarks-step-card">
            <div class="sinmarks-step-title">Passo 2: Habilidade da Marca (1d6)</div>
            
            ${rollingState.optionRoll === null ? `
              <button id="btn-roll-option" class="btn btn-primary sinmarks-btn-full">Rolar Habilidade (1d6)</button>
            ` : `
              <div class="sinmarks-result-row">
                <span>Resultado do Dado: <strong>d6 = ${rollingState.optionRoll}</strong></span>
                <span class="sinmarks-result-value">${rollingState.selectedOption.name}</span>
              </div>
              
              <div class="sinmarks-benefit-box">
                <div class="sinmarks-benefit-desc">${rollingState.selectedOption.desc}</div>
                <div class="sinmarks-benefit-text">✦ ${rollingState.selectedOption.benefit}</div>
              </div>

              <button id="btn-confirm-rolled-mark" class="btn btn-success sinmarks-confirm-btn">Confirmar e Adicionar ao Personagem</button>
            `}
          </div>
        ` : ''}

        <!-- Rolling Log -->
        ${rollingState.rollingLog.length > 0 ? `
          <div class="sinmarks-log-box">
            <div class="sinmarks-log-header">Histórico de Rolagem</div>
            <div class="sinmarks-log-scroll">
              ${logHtml}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  };

  const renderChooseMode = () => {
    const selectedTab = rollingState.chooseTab || 0;
    const currentCat = CATEGORIES[selectedTab];
    const options = SIN_MARKS.filter(sm => sm.id.startsWith(currentCat.prefix));

    return `
      <div class="sinmarks-choose-mode">
        <!-- Category Tabs -->
        <div class="sinmarks-category-tabs">
          ${CATEGORIES.map((cat, i) => `
            <button class="btn btn-sm sinmarks-cat-tab ${i === selectedTab ? 'btn-primary' : 'btn-secondary'}" data-tab="${i}">
              ${cat.name}
            </button>
          `).join("")}
        </div>

        <div class="sinmarks-category-block">
          <div class="sinmarks-category-header">
            <div>
              <strong>${currentCat.name}</strong>
              <div class="sinmarks-category-sub">${currentCat.appearance}</div>
            </div>
          </div>
          <div class="sinmarks-options-list">
            ${options.map((opt, i) => {
      const alreadyHas = (char.sinMarks || []).includes(opt.id);
      return `
                <div class="sinmarks-option-row ${alreadyHas ? 'owned' : ''}">
                  <div class="sinmarks-option-info">
                    <span class="sinmarks-option-name">${i + 1}. ${opt.name}</span>
                    <div class="sinmarks-option-desc">${opt.desc}</div>
                    <div class="sinmarks-option-benefit">✦ ${opt.benefit}</div>
                  </div>
                  <div>
                    ${alreadyHas ? `
                      <span class="sinmarks-owned-label">Adquirido</span>
                    ` : `
                      <button class="btn btn-xs btn-add-manual-sm sinmarks-add-btn" data-id="${opt.id}">Adicionar</button>
                    `}
                  </div>
                </div>
              `;
    }).join("")}
          </div>
        </div>
      </div>
    `;
  };

  const bindRollEvents = () => {
    // Roll Category button
    const btnRollCat = document.getElementById("btn-roll-category");
    if (btnRollCat) {
      btnRollCat.onclick = () => {
        const box = state.diceBox || window.diceBox;
        if (box) {
          el.diceOverlay.classList.remove("hidden");
          setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
          box.setDice("1d6");
          box.start_throw(null, (notation) => {
            el.diceOverlay.classList.add("hidden");
            handleCategoryResult(notation.result[0]);
          });
        } else {
          handleCategoryResult(Math.floor(Math.random() * 6) + 1);
        }
      };
    }

    const handleCategoryResult = (roll) => {
      rollingState.categoryRoll = roll;
      rollingState.rollingLog.push(`Rolou d6 = ${roll} para Categoria.`);

      if (roll <= 5) {
        const cat = CATEGORIES[roll - 1];
        rollingState.selectedCategory = cat;
        rollingState.rollingLog.push(`Categoria selecionada: <strong>${cat.name}</strong>`);

        const ownedInCat = (char.sinMarks || []).filter(id => id.startsWith(cat.prefix));
        if (ownedInCat.length > 0) {
          rollingState.isEvolution = true;
          rollingState.rollingLog.push(`A marca ${cat.name} evolui!`);
        } else {
          rollingState.isEvolution = false;
        }
      } else {
        rollingState.rollingLog.push(`Rolou um 6! Escolha livre de categoria.`);
      }
      renderModal();
    };

    // Category selection if rolled a 6
    el.modalBody.querySelectorAll(".btn-select-category-choice").forEach(btn => {
      btn.onclick = () => {
        const val = parseInt(btn.getAttribute("data-val"));
        const cat = CATEGORIES[val - 1];
        rollingState.selectedCategory = cat;
        rollingState.rollingLog.push(`Categoria escolhida: <strong>${cat.name}</strong>`);

        // Check for evolution
        const ownedInCat = (char.sinMarks || []).filter(id => id.startsWith(cat.prefix));
        if (ownedInCat.length > 0) {
          rollingState.isEvolution = true;
          rollingState.rollingLog.push(`A marca ${cat.name} evolui!`);
        } else {
          rollingState.isEvolution = false;
        }
        renderModal();
      };
    });

    // Roll Option/Ability button
    const btnRollOption = document.getElementById("btn-roll-option");
    if (btnRollOption) {
      btnRollOption.onclick = () => {
        const cat = rollingState.selectedCategory;
        const availableOptions = SIN_MARKS.filter(o => o.id.startsWith(cat.prefix) && !(char.sinMarks || []).includes(o.id));

        if (availableOptions.length === 0) {
          alert("Você já possui todas as habilidades desta categoria!");
          return;
        }

        const box = state.diceBox || window.diceBox;
        if (box) {
          el.diceOverlay.classList.remove("hidden");
          setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
          box.setDice("1d6");
          box.start_throw(null, (notation) => {
            el.diceOverlay.classList.add("hidden");
            handleOptionResult(cat, notation.result[0]);
          });
        } else {
          handleOptionResult(cat, Math.floor(Math.random() * 6) + 1);
        }
      };
    }

    const handleOptionResult = (cat, roll) => {
      let finalRoll = roll;
      let optionId = `${cat.prefix}${finalRoll}`;
      rollingState.rollingLog.push(`Rolou d6 = ${finalRoll} para Habilidade.`);

      let rerolls = 0;
      while ((char.sinMarks || []).includes(optionId) && rerolls < 100) {
        finalRoll = Math.floor(Math.random() * 6) + 1;
        optionId = `${cat.prefix}${finalRoll}`;
        rerolls++;
      }

      if (rerolls > 0) {
        rollingState.rollingLog.push(`Rolar novamente para evitar duplicados. Novo d6 = ${finalRoll} após reroll(s).`);
      }

      const opt = SIN_MARKS.find(o => o.id === optionId);
      rollingState.optionRoll = finalRoll;
      rollingState.selectedOption = opt;
      rollingState.rollingLog.push(`Habilidade selecionada: <strong>${opt.name}</strong>`);

      renderModal();
    };

    // Confirm rolled mark
    const btnConfirm = document.getElementById("btn-confirm-rolled-mark");
    if (btnConfirm) {
      btnConfirm.onclick = () => {
        if (!char.sinMarks) char.sinMarks = [];
        char.sinMarks.push(rollingState.selectedOption.id);
        saveCurrentCharacter();
        renderSinMarksSheet();
        el.modalContainer.classList.add("hidden");
      };
    }
  };

  const bindChooseEvents = () => {
    el.modalBody.querySelectorAll(".btn-add-manual-sm").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (!char.sinMarks) char.sinMarks = [];
        if (!char.sinMarks.includes(id)) {
          char.sinMarks.push(id);
          saveCurrentCharacter();
          renderSinMarksSheet();
        }
        renderModal();
      };
    });

    el.modalBody.querySelectorAll(".sinmarks-cat-tab").forEach(btn => {
      btn.onclick = () => {
        rollingState.chooseTab = parseInt(btn.getAttribute("data-tab"));
        renderModal();
      };
    });
  };

  renderModal();
}
