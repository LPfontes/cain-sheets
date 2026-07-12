import { el, state, saveCurrentCharacter } from "../state.js";
import { logger } from "../logger.js";
import { renderAgendaSheet } from "../sheet.js";
import { AGENDAS } from "../cain-data.js";

export function openAgendaModal() {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info("Modal: Abrindo modal de seleção de Agenda.");

  el.modalContainer.classList.remove("hidden");
  el.modalBody.parentElement.classList.add("wide-modal");

  let currentAgendaId = null;
  for (const key in AGENDAS) {
    if (AGENDAS[key].normal.every(n => char.agendaNormal?.includes(n))) {
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
    const agenda = selectedAgendaId ? AGENDAS[selectedAgendaId] : null;

    el.modalBody.innerHTML = `
      <h3 class="modal-title">Escolher Agenda</h3>
      <p class="text-secondary-md" style="margin-bottom: 6px;">Escolha uma agenda e uma habilidade ativa dessa agenda.</p>
      <p class="text-secondary-md" style="margin-bottom: 6px;">Alterar a agenda redefinirá as marcações de progresso normais da agenda atual.</p>

      <div class="blasphemies-modal-layout">
        <div class="blasphemies-grid-col" id="modal-agenda-list">
          ${Object.entries(AGENDAS).map(([id, a]) => {
            const active = id === selectedAgendaId;
            return `
              <div class="blasphemy-grid-card ${active ? 'active' : ''}" data-id="${id}">
                <div class="blasphemy-card-img-wrapper">
                  <img src="${a.icon}" alt="${a.name}">
                </div>
                <div class="blasphemy-card-info">
                  <span class="blasphemy-card-name">${a.name}</span>
                </div>
                ${active ? '<span class="blasphemy-card-check">✓</span>' : ''}
              </div>
            `;
          }).join("")}
        </div>

        <div class="blasphemy-details-col" id="modal-agenda-details">
          ${agenda ? `
            <div class="blasphemy-details-header">
              <div class="blasphemy-details-img-wrapper">
                <img src="${agenda.icon}" alt="${agenda.name}" class="char-portrait-img">
              </div>
              <div>
                <h4 class="blasphemy-details-title">${agenda.name}</h4>
                ${agenda.desc ? `<p class="blasphemy-details-desc">${agenda.desc}</p>` : ''}
                <div class="agenda-triggers">
                  <div class="agenda-trigger"><strong>Normal:</strong> ${agenda.normal.join(", ")}</div>
                  <div class="agenda-trigger"><strong>Bold:</strong> ${agenda.bold.join(", ")}</div>
                </div>
              </div>
            </div>
            <h5 class="agenda-skills-title">Habilidades</h5>
            <div class="traits-wizard-list" id="modal-agenda-skills-list">
              ${agenda.habilidades.map(hab => {
                const isSelected = selectedSkillName === hab.name;
                return `
                  <div class="trait-wiz-item ${isSelected ? 'active' : ''}" data-skill="${hab.name}">
                    <input type="checkbox" class="trait-wiz-check" ${isSelected ? 'checked' : ''}>
                    <div class="trait-wiz-content">
                      <div class="trait-name" style="font-weight: bold;">${hab.name}</div>
                      <div class="desc">${hab.desc}</div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `<p style="color: var(--text-muted); padding: 20px; text-align: center;">Selecione uma agenda para ver seus detalhes.</p>`}
        </div>
      </div>

      <div class="blasphemy-modal-footer">
        <button id="btn-agenda-modal-cancel" class="btn btn-md btn-secondary">Cancelar</button>
        <button id="btn-agenda-modal-save" class="btn btn-md btn-blasphemy-save">Salvar</button>
      </div>
    `;

    const gridCol = el.modalBody.querySelector(".blasphemies-grid-col");
    if (gridCol && window._agendaGridScroll != null) {
      gridCol.scrollTop = window._agendaGridScroll;
    }

    el.modalBody.querySelectorAll(".blasphemy-grid-card").forEach(card => {
      card.addEventListener("click", () => {
        const grid = el.modalBody.querySelector(".blasphemies-grid-col");
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

    document.getElementById("btn-agenda-modal-cancel").onclick = closeModal;
    document.getElementById("btn-agenda-modal-save").onclick = () => {
      if (selectedAgendaId) {
        const agendaObj = AGENDAS[selectedAgendaId];
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
