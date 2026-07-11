import { el, state, saveCurrentCharacter } from "../state.js";
import { logger } from "../logger.js";
import { renderAgendaSheet } from "../sheet.js";
import { AGENDAS } from "../cain-data.js";

export function openAgendaModal() {
  const char = state.currentCharacter;
  if (!char) return;

  el.modalContainer.classList.remove("hidden");

  let currentAgendaId = null;
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
      <p class="text-secondary-xs" style="margin-bottom: 16px;">Escolha uma agenda e uma habilidade ativa dessa agenda. Alterar a agenda redefinirá as marcações de progresso normais da agenda atual.</p>
      <div class="packages-grid" id="modal-agenda-list"></div>
      <div id="modal-agenda-habilidades" style="margin-top: 16px; display: none;">
        <h4 class="section-title">Habilidades de <span id="modal-agenda-name"></span></h4>
        <div class="traits-wizard-list" id="modal-agenda-skills-list"></div>
      </div>
    </div>
    <div class="modal-actions">
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
          selectedSkillName = "";
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
