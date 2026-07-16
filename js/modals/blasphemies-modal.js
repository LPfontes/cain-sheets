import { el, state, saveCurrentCharacter, getCustomBlasphemies } from "../state.js";
import { logger } from "../logger.js";
import { renderBlasphemiesSheet } from "../sheet.js";
import { BLASPHEMIES } from "../cain-data.js";
import { openCreateBlasphemyModal } from "./create-blasphemy-modal.js";

function getAllBlasphemies() {
  return [...BLASPHEMIES, ...getCustomBlasphemies()];
}

export function openBlasphemiesModal() {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info("Modal: Abrindo modal de gerenciamento de Blasfêmias.");

  let allBlasphemies = getAllBlasphemies();
  let tempBlasphemies = [...(char.blasphemies || [])];
  let tempPowers = [...(char.blasphemyPowers || [])];
  let activeBlasphemyId = tempBlasphemies[0] || allBlasphemies[0].id;

  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.parentElement;
  modalContent.classList.add("wide-modal");

  // Make modal draggable on mobile via header
  let dragState = null;
  const onDragMove = (clientX, clientY) => {
    if (!dragState) return;
    modalContent.style.setProperty("position", "fixed", "important");
    modalContent.style.left = (dragState.origLeft + clientX - dragState.startX) + "px";
    modalContent.style.top = (dragState.origTop + clientY - dragState.startY) + "px";
    modalContent.style.right = "auto";
    modalContent.style.bottom = "auto";
  };
  const onDragEnd = () => {
    if (!dragState) return;
    dragState = null;
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("touchend", onDragEnd);
  };
  const onDragStart = (clientX, clientY) => {
    const rect = modalContent.getBoundingClientRect();
    dragState = { startX: clientX, startY: clientY, origLeft: rect.left, origTop: rect.top };
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  };
  modalContent.addEventListener("mousedown", (e) => {
    const title = e.target.closest(".modal-title");
    if (!title || e.target.closest("button")) return;
    e.preventDefault();
    onDragStart(e.clientX, e.clientY);
  });
  modalContent.addEventListener("touchstart", (e) => {
    const title = e.target.closest(".modal-title");
    if (!title || e.target.closest("button")) return;
    onDragStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  // Reset position when modal closes
  const observer = new MutationObserver(() => {
    if (el.modalContainer.classList.contains("hidden")) {
      dragState = null;
      modalContent.style.position = "";
      modalContent.style.left = "";
      modalContent.style.top = "";
      modalContent.style.right = "";
      modalContent.style.bottom = "";
      observer.disconnect();
    }
  });
  observer.observe(el.modalContainer, { attributes: true, attributeFilter: ["class"] });

  const renderModalContent = () => {
    allBlasphemies = getAllBlasphemies();
    const activeB = allBlasphemies.find(b => b.id === activeBlasphemyId) || allBlasphemies[0];
    const isOwned = tempBlasphemies.includes(activeB.id);

    el.modalBody.innerHTML = `
      <div class="wide-modal-header">
      <h3 class="modal-title blasphemy-modal-title">Gerenciar Blasfêmias</h3>
      </div>
      <div class="modal-split-layout">
        
        <!-- Coluna Esquerda: Grid das 12 Blasfêmias -->
        <div class="modal-grid-col">
          ${allBlasphemies.map(b => {
      const owned = tempBlasphemies.includes(b.id);
      const active = b.id === activeBlasphemyId;
      return `
              <div class="blasphemy-grid-card ${active ? 'active' : ''} ${owned ? 'owned' : ''} ${b.id.startsWith('custom_') ? 'custom-blasphemy' : ''}" data-id="${b.id}">
                <div class="blasphemy-card-img-wrapper">
                  ${b.img ? `<img src="${b.img}" alt="${b.name}">` : ''}
                </div>
                <div class="blasphemy-card-info">
                  <span class="blasphemy-card-name">${b.name}</span>
                  ${b.id.startsWith('custom_') ? `<span class="blasphemy-card-custom-badge">CUSTOM</span>` : ''}
                </div>

              </div>
            `;
    }).join("")}
        </div>

        <!-- Coluna Direita: Detalhes da Blasfêmia Selecionada -->
        <div class="modal-detail-panel">
          
          <div class="modal-detail-header">
            <div class="modal-detail-img-wrapper" style="height: 430px; width: 200px;">
              ${activeB.img ? `<img src="${activeB.img}" alt="${activeB.name}">` : `<strong></b>`}
            </div>
            <div class="blasphemy-details">
              <h4 class="blasphemy-color-${activeB.id} modal-detail-title" style="font-family: 'Cuasigothic';">${activeB.name}</h4>
              <div class="modal-detail-desc">
                ${activeB.desc}
              </div>
           
          ${activeB.fato ? `<div class="blasphemy-details-fato"><strong>Fato:</strong> ${activeB.fato}</div>` : ''}
          <!-- Passiva -->
          ${activeB.passive ? `
            <div class="blasphemy-details-passive">
              <button class="btn btn-sm btn-passive-detail" style="font-weight: bold; background: rgba(248, 113, 113, 0.1); border: 1px solid var(--stamp-red); color: var(--stamp-red);">Ver Passiva</button>
            </div>
          ` : ''}

          <!-- Adquirir Checkbox / Status -->
          <label class="trait-wiz-item ${isOwned ? 'active owned' : ''} blasphemy-details-status" style="cursor: pointer;">
            <input type="checkbox" id="blasphemy-toggle-owned" class="trait-wiz-check" ${isOwned ? 'checked' : ''}>
            <div class="trait-wiz-content">
              <div class="trait-name" style="font-size: var(--font-size-lg);">Possuir esta Blasfêmia</div>
              <div class="desc" style="font-size: var(--font-size-lg); color: var(--text-secondary);">Adquira esta blasfêmia para liberar e escolher seus poderes ativos.</div>
            </div>
          </label>

          <!-- Escolha de Poderes Ativos se Possuída -->
          ${isOwned ? `
            <div class="section-divider" style="margin-top: auto;">
              <button id="btn-manage-blasphemy-powers" class="btn btn-md" style="width: 50%; font-weight: bold; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); margin-bottom: 6px;">
                Gerenciar Poderes Ativos (${(activeB.powers || []).filter(p => tempPowers.includes(p.name)).length})
              </button>
            </div>
          ` : ''}

        </div>

      </div>
             </div>
          </div>
      <!-- Footer Buttons -->
      <div class="modal-action-footer">
        <button id="btn-create-blasphemy" class="btn btn-md btn-secondary">+ Criar Blasfêmia</button>
        <button id="btn-blasphemies-modal-cancel" class="btn btn-md btn-secondary">Cancelar</button>
        <button id="btn-blasphemies-modal-save" class="btn btn-md btn-blasphemy-save">Salvar Alterações</button>
      </div>
    `;

    // Restore grid scroll position
    const gridCol = el.modalBody.querySelector(".modal-grid-col");
    if (gridCol && window._blasphemyGridScroll != null) {
      gridCol.scrollTop = window._blasphemyGridScroll;
    }

    // Event: Click on Blasphemy card in grid
    el.modalBody.querySelectorAll(".blasphemy-grid-card").forEach(card => {
      card.addEventListener("click", () => {
        const grid = el.modalBody.querySelector(".modal-grid-col");
        window._blasphemyGridScroll = grid ? grid.scrollTop : 0;
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
          const activeBObj = allBlasphemies.find(b => b.id === activeBlasphemyId);
          if (activeBObj && activeBObj.powers) {
            const powerNames = activeBObj.powers.map(p => p.name);
            tempPowers = tempPowers.filter(p => !powerNames.includes(p));
          }
        }
        renderModalContent();
      });
    }

    // Event: Open Passive Popup
    const btnPassiveDetail = document.querySelector(".btn-passive-detail");
    if (btnPassiveDetail) {
      btnPassiveDetail.addEventListener("click", () => {
        showPassivePopup(activeB);
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

    // Event: Open Create Blasphemy Modal
    document.getElementById("btn-create-blasphemy").onclick = () => {
      openCreateBlasphemyModal(() => {
        renderModalContent();
      });
    };

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
  // Remove any existing panel for this blasphemy
  const existingPanel = document.querySelector(`.blasphemy-powers-panel[data-blasphemy="${blasphemy.id}"]`);
  if (existingPanel) { existingPanel.remove(); return; }

  const panel = document.createElement("div");
  panel.className = "blasphemy-powers-panel card-glass";
  panel.setAttribute("data-blasphemy", blasphemy.id);
  panel.style.cssText = `
    position: fixed; z-index: 1100;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 420px; max-height: 85vh;
    display: flex; flex-direction: column;
    border: 2px solid var(--border-color-dark);
    border-radius: var(--radius-md);
    box-shadow: 6px 6px 20px rgba(0,0,0,0.5);
    backdrop-filter: none; -webkit-backdrop-filter: none;
    overflow: hidden;
  `;

  let selectedPowers = [...currentPowers];

  const showPowerDetailPopup = (power) => {
    const existing = document.querySelector(`.power-detail-popup[data-power="${power.name}"]`);
    if (existing) return;

    const popup = document.createElement("div");
    popup.className = "power-detail-popup card-glass";
    popup.setAttribute("data-power", power.name);
    popup.style.cssText = `
      max-width:500px;padding:20px;display:flex;flex-direction:column;gap:12px;
      position:fixed;z-index:1310;top:50%;left:50%;transform:translate(-50%,-50%);
      border:2px solid var(--border-color-dark);
      backdrop-filter:none;-webkit-backdrop-filter:none;
      border-radius:var(--radius-md);box-shadow:4px 4px 15px rgba(0,0,0,0.4)
    `;
    popup.innerHTML = `
      <button class="modal-close">&times;</button>
      <h3 class="modal-title" style="margin:0;text-transform:uppercase;cursor:move;user-select:none">${power.name}</h3>
      <div style="font-size:14px;line-height:1.5;color:var(--text-secondary);max-height:50vh;overflow-y:auto;padding-right:4px">
        ${power.desc}
      </div>
      <div class="modal-footer" style="margin-top:10px">
        <button class="btn btn-secondary btn-popup-ok">Fechar</button>
      </div>
    `;

    popup.querySelector(".modal-close").onclick = () => popup.remove();
    popup.querySelector(".btn-popup-ok").onclick = () => popup.remove();

    popup.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-toolbox]");
      if (trigger) {
        const termKey = trigger.getAttribute("data-toolbox");
        import("../toolbox.js").then(({ openToolbox }) => {
          openToolbox(termKey);
        });
      }
    });

    const header = popup.querySelector(".modal-title");
    let isDragging = false, startX, startY, initialLeft, initialTop;
    const onMove = (clientX, clientY) => {
      if (!isDragging) return;
      popup.style.left = `${initialLeft + clientX - startX}px`;
      popup.style.top = `${initialTop + clientY - startY}px`;
    };
    const onMouseMove = (e) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (!isDragging) return;
      onMove(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    };
    const onEnd = () => {
      isDragging = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
    const onStart = (clientX, clientY) => {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      const rect = popup.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      // Clear centering transform before dragging
      popup.style.transform = "none";
      popup.style.left = `${initialLeft}px`;
      popup.style.top = `${initialTop}px`;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    };
    header.addEventListener("mousedown", (e) => {
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    });
    header.addEventListener("touchstart", (e) => {
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.body.appendChild(popup);
  };

  const renderContent = () => {
    panel.innerHTML = `
      <div class="blasphemy-powers-panel-header" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border-color-dark);cursor:move;user-select:none;background:rgba(0,0,0,0.1);">
        <span class="modal-title" style="font-size:var(--font-size-md);margin:0;border:none;padding:0;">${blasphemy.name} — Poderes Ativos</span>
        <button class="modal-close" id="btn-panel-close" style="position:static;font-size:18px;">×</button>
      </div>
      <div style="padding:16px;overflow-y:auto;flex:1;">
        <div class="blasphemy-details-content">

          <div class="blasphemy-powers-section">
            <h4>Poderes da Blasfêmia</h4>
            <p>Escolha 2 poderes:</p>
            <div class="traits-wizard-list" id="wiz-modal-powers-list">
              ${(blasphemy.powers || []).map(p => {
      const hasPower = selectedPowers.includes(p.name);
      return `
                  <div class="trait-wiz-item ${hasPower ? 'active' : ''}">
                    <input type="checkbox" class="trait-wiz-check submodal-power-check" data-name="${p.name}" ${hasPower ? 'checked' : ''}>
                    <div class="trait-wiz-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                      <div class="trait-name" style="font-family: var(--font-heading); text-transform: uppercase; font-size: var(--font-size-md);">${p.name}</div>
                      <button type="button" class="btn btn-sm btn-detail-power btn-tiny" data-name="${p.name}">Detalhes</button>
                    </div>
                  </div>
                `;
    }).join("")}
            </div>
          </div>
        </div>

        <div class="modal-actions" style="margin-top: 16px;">
          <button class="btn" id="btn-submodal-cancel">Cancelar</button>
          <button class="btn btn-primary" id="btn-submodal-save" ${selectedPowers.length !== 2 ? 'disabled' : ''}>Selecionar</button>
        </div>
      </div>
    `;

    panel.querySelector("#btn-panel-close").onclick = () => panel.remove();
    panel.querySelector("#btn-submodal-cancel").onclick = () => panel.remove();

    panel.querySelector("#btn-submodal-save").onclick = () => {
      onSave(selectedPowers);
      panel.remove();
    };

    panel.querySelectorAll(".btn-detail-power").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const pName = btn.getAttribute("data-name");
        const power = (blasphemy.powers || []).find(p => p.name === pName);
        if (power) {
          showPowerDetailPopup(power);
        }
      });
    });

    panel.querySelectorAll(".submodal-power-check").forEach(cb => {
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

  // Make panel draggable via header
  let isDragging = false, startX, startY, initialLeft, initialTop;
  const onMove = (clientX, clientY) => {
    if (!isDragging) return;
    panel.style.left = `${initialLeft + clientX - startX}px`;
    panel.style.top = `${initialTop + clientY - startY}px`;
    panel.style.right = "auto";
  };
  const onMouseMove = (e) => onMove(e.clientX, e.clientY);
  const onTouchMove = (e) => {
    if (!isDragging) return;
    onMove(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
  };
  const onEnd = () => {
    isDragging = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onEnd);
  };
  const onStart = (clientX, clientY) => {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    const rect = panel.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    // Clear centering transform before dragging
    panel.style.transform = "none";
    panel.style.left = `${initialLeft}px`;
    panel.style.top = `${initialTop}px`;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  };
  panel.addEventListener("mousedown", (e) => {
    const header = e.target.closest(".blasphemy-powers-panel-header");
    if (!header || e.target.closest("button")) return;
    e.preventDefault();
    onStart(e.clientX, e.clientY);
  });
  panel.addEventListener("touchstart", (e) => {
    const header = e.target.closest(".blasphemy-powers-panel-header");
    if (!header || e.target.closest("button")) return;
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  renderContent();
  document.body.appendChild(panel);
}

function showPassivePopup(blasphemy) {
  const existing = document.querySelector(`.passive-popup[data-blasphemy="${blasphemy.id}"]`);
  if (existing) { existing.remove(); return; }

  const popup = document.createElement("div");
  popup.className = "passive-popup card-glass";
  popup.setAttribute("data-blasphemy", blasphemy.id);
  popup.style.cssText = `
    max-width: 600px; padding: 20px; display: flex; flex-direction: column; gap: 12px;
    position: fixed; z-index: 1310; top: 25%; left: 50%; transform: translateX(-50%);
    border: 2px solid var(--border-color-dark);
    backdrop-filter: none; -webkit-backdrop-filter: none;
    border-radius: var(--radius-md); box-shadow: 4px 4px 15px rgba(0,0,0,0.4);
    max-height: 70vh;
  `;

  const passiveHtml = blasphemy.passive || "";

  popup.innerHTML = `
    <button class="modal-close">&times;</button>
    <h3 class="modal-title" style="margin: 0; text-transform: uppercase; cursor: move; user-select: none;">${blasphemy.name} — Passiva</h3>
    <div style="font-size: 14px; line-height: 1.6; color: var(--text-secondary); overflow-y: auto; padding-right: 4px;">
      ${passiveHtml}
    </div>
    <div class="modal-footer" style="margin-top: 10px;">
      <button class="btn btn-secondary btn-popup-ok">Fechar</button>
    </div>
  `;

  popup.querySelector(".modal-close").onclick = () => popup.remove();
  popup.querySelector(".btn-popup-ok").onclick = () => popup.remove();

  popup.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-toolbox]");
    if (trigger) {
      const termKey = trigger.getAttribute("data-toolbox");
      import("../toolbox.js").then(({ openToolbox }) => {
        openToolbox(termKey);
      });
    }
  });

  const header = popup.querySelector(".modal-title");
  let isDragging = false, startX, startY, initialLeft, initialTop;
  const onMove = (clientX, clientY) => {
    if (!isDragging) return;
    popup.style.left = `${initialLeft + clientX - startX}px`;
    popup.style.top = `${initialTop + clientY - startY}px`;
    popup.style.transform = "none";
  };
  const onMouseMove = (e) => onMove(e.clientX, e.clientY);
  const onTouchMove = (e) => {
    if (!isDragging) return;
    onMove(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
  };
  const onEnd = () => {
    isDragging = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onEnd);
  };
  const onStart = (clientX, clientY) => {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    const rect = popup.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);
  };
  header.addEventListener("mousedown", (e) => {
    e.preventDefault();
    onStart(e.clientX, e.clientY);
  });
  header.addEventListener("touchstart", (e) => {
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  document.body.appendChild(popup);
}

