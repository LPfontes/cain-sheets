import { el, state, saveCurrentCharacter, getCustomAgendas } from "../state.js";
import { logger } from "../logger.js";
import { renderAgendaSheet } from "../sheet.js";
import { AGENDAS } from "../cain-data.js";
import { openCreateAgendaModal } from "./create-agenda-modal.js";
import { t } from "../i18n.js";

function getAllAgendas() {
  const custom = getCustomAgendas();
  const result = { ...AGENDAS };
  custom.forEach(a => {
    result[a.id] = a;
  });
  return result;
}

export function openAgendaModal() {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info("Modal: Abrindo modal de seleção de Agenda.");

  el.modalContainer.classList.remove("hidden");
  el.modalBody.parentElement.classList.add("wide-modal");

  let allAgendas = getAllAgendas();

  let currentAgendaId = null;
  for (const key in allAgendas) {
    const normList = allAgendas[key]?.normal || allAgendas[key]?.items?.normal || [];
    if (Array.isArray(normList) && normList.length > 0 && normList.every(n => char.agendaNormal?.includes(n))) {
      currentAgendaId = key;
      break;
    }
  }

  let selectedAgendaId = currentAgendaId;
  let selectedSkillName = char.agendaSkill || "";

  const closeModal = () => {
    el.modalContainer.classList.add("hidden");
    el.modalBody.parentElement.classList.remove("wide-modal");
  };

  const renderModalContent = () => {
    allAgendas = getAllAgendas();
    const agenda = selectedAgendaId ? allAgendas[selectedAgendaId] : null;

    const normalItems = agenda?.normal || agenda?.items?.normal || [];
    const normalStr = Array.isArray(normalItems) ? normalItems.join(", ") : (normalItems || "");
    const boldItems = agenda?.bold || agenda?.bolded || agenda?.items?.bolded || [];
    const boldStr = Array.isArray(boldItems) ? boldItems.join(", ") : (boldItems || "");
    const habilidades = agenda?.habilidades || agenda?.abilities || [];

    el.modalBody.innerHTML = `
      <div class="wide-modal-header">
        <h3 class="modal-title">Escolher Agenda</h3>
        <p class="text-secondary-md" style="margin-top: 6px;">Escolha uma agenda e uma habilidade ativa dessa agenda. Alterar a agenda redefinirá as marcações de progresso normais da agenda atual.</p>
      </div>

      <div class="modal-split-layout">
        <div class="modal-grid-col" id="modal-agenda-list">
          ${Object.entries(allAgendas).map(([id, a]) => {
            const active = id === selectedAgendaId;
            return `
              <div class="blasphemy-grid-card ${active ? 'active' : ''} ${id.startsWith('custom_') ? 'custom-blasphemy' : ''}" data-id="${id}">
                <div class="blasphemy-card-img-wrapper">
                  <img src="${a.icon || 'assets/avatar.png'}" alt="${a.name}">
                </div>
                <div class="blasphemy-card-info">
                  <span class="blasphemy-card-name">${a.name}</span>
                  ${id.startsWith('custom_') ? `<span class="blasphemy-card-custom-badge">CUSTOM</span>` : ''}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="modal-detail-panel" id="modal-agenda-details">
          ${agenda ? `
            <div class="modal-detail-header">
              <div class="modal-detail-img-wrapper" style="height: 180px;">
                <img src="${agenda.icon || 'assets/avatar.png'}" alt="${agenda.name}" class="char-portrait-img">
              </div>
              <div class="modal-detail-header-text">
                <h4 class="modal-detail-title" style="font-family: 'Odachi'; justify-content: flex-start;">${agenda.name}</h4>
                ${(agenda.desc || agenda.description) ? `<p class="modal-detail-desc">${agenda.desc || agenda.description}</p>` : ''}
                <div class="agenda-triggers">
                  <div class="agenda-trigger"><strong>Normal:</strong> ${normalStr}</div>
                  <div class="agenda-trigger agenda-trigger--bold"><strong>Bold:</strong> ${boldStr}</div>
                </div>
              </div>
            </div>
            <h5 class="agenda-skills-title">${t("agenda.modal.abilities")}</h5>
            <div class="traits-wizard-list" id="modal-agenda-skills-list">
              ${habilidades.map(hab => {
                const isSelected = selectedSkillName === hab.name;
                return `
                  <div class="trait-wiz-item ${isSelected ? 'active' : ''}" data-skill="${hab.name}">
                    <input type="checkbox" class="trait-wiz-check" ${isSelected ? 'checked' : ''}>
                    <div class="trait-wiz-content">
                      <div class="trait-name" style="font-weight: bold;">${hab.name}</div>
                      <div class="desc">${hab.desc || hab.description || ""}</div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `<div style="display:flex; align-items:center; justify-content:center; height:100%;"><p style="color: var(--text-muted); text-align: center;">← Selecione uma agenda para ver seus detalhes.</p></div>`}
        </div>
      </div>

      <div class="modal-action-footer">
        <button id="btn-create-agenda" class="btn btn-md btn-secondary btn-black">${t("agenda.modal.create")}</button>
        <button id="btn-agenda-modal-cancel" class="btn btn-md btn-secondary btn-black">${t("common.cancel")}</button>
        <button id="btn-agenda-modal-save" class="btn btn-md btn-blasphemy-save btn-black">${t("common.save")}</button>
      </div>
    `;

    const gridCol = el.modalBody.querySelector(".modal-grid-col");
    if (gridCol && window._agendaGridScroll != null) {
      gridCol.scrollTop = window._agendaGridScroll;
    }

    el.modalBody.querySelectorAll(".blasphemy-grid-card").forEach(card => {
      card.addEventListener("click", () => {
        const grid = el.modalBody.querySelector(".modal-grid-col");
        window._agendaGridScroll = grid ? grid.scrollTop : 0;
        const id = card.getAttribute("data-id");
        if (selectedAgendaId !== id) {
          selectedAgendaId = id;
          selectedSkillName = "";
        }
        renderModalContent();
      });
    });

    el.modalBody.querySelectorAll(".trait-wiz-item[data-skill]").forEach(item => {
      item.addEventListener("click", () => {
        selectedSkillName = item.getAttribute("data-skill");
        renderModalContent();
      });
    });

    document.getElementById("btn-create-agenda").onclick = () => {
      openCreateAgendaModal(() => {
        renderModalContent();
      });
    };

    document.getElementById("btn-agenda-modal-cancel").onclick = closeModal;
    document.getElementById("btn-agenda-modal-save").onclick = () => {
      if (selectedAgendaId) {
        const agendaObj = allAgendas[selectedAgendaId];
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
  };

  renderModalContent();
}
