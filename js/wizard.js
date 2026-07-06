import { el, state, saveCurrentCharacter } from "./state.js";
import { CAIN_SKILLS, ALL_SKILLS, AGENDAS, BLASPHEMIES } from "./cain-data.js";
import { logger } from "./logger.js";
import { t } from "./i18n.js";

const QUESTIONS = [
  "Como você manifestou seus poderes pela primeira vez?",
  "Sua semente profana está no seu cérebro ou no seu coração?",
  "O que você esconde nas partes mais profundas de si?",
  "Sua mão é realmente sua mão?",
  "Você se lembra do rosto da sua mãe?"
];

export function startWizard() {
  logger.info("Iniciando criação de Exorcista (CAIN).");
  state.wizardData = {
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
  };

  document.getElementById("wiz-name").value = "";
  document.getElementById("wiz-xid").value = "";
  document.getElementById("wiz-appearance").value = "";
  for (let i = 0; i < 5; i++) {
    document.getElementById(`wiz-q${i + 1}`).value = "";
  }

  document.getElementById("landing-screen")?.classList.add("hidden");
  el.wizardScreen.classList.remove("hidden");
  el.sheetScreen.classList.add("hidden");

  showWizardStep(1);
}

export function showWizardStep(step) {
  logger.info(`Wizard CAIN: Passo ${step}.`);
  state.wizardData.step = step;

  document.querySelectorAll(".step-indicator").forEach(indicator => {
    const s = parseInt(indicator.getAttribute("data-step"));
    indicator.className = "step-indicator";
    if (s === step) indicator.classList.add("active");
    else if (s < step) indicator.classList.add("complete");
  });

  document.querySelectorAll(".wizard-step").forEach(stepEl => {
    stepEl.classList.remove("active");
    if (parseInt(stepEl.getAttribute("data-step")) === step) {
      stepEl.classList.add("active");
    }
  });

  if (step === 3) renderWizardSkills();
  if (step === 4) renderWizardAgenda();
  if (step === 5) renderWizardBlasphemies();

  el.btnWizPrev.disabled = (step === 1);
  if (step === 5) {
    el.btnWizNext.classList.add("hidden");
    el.btnWizFinish.classList.remove("hidden");
  } else {
    el.btnWizNext.classList.remove("hidden");
    el.btnWizFinish.classList.add("hidden");
  }
}

export function wizardNextStep() {
  if (validateWizardStep(state.wizardData.step)) {
    showWizardStep(state.wizardData.step + 1);
  }
}

export function wizardPrevStep() {
  if (state.wizardData.step > 1) {
    showWizardStep(state.wizardData.step - 1);
  }
}

export function validateWizardStep(step) {
  if (step === 1) {
    for (let i = 0; i < 5; i++) {
      state.wizardData.questions[i] = document.getElementById(`wiz-q${i + 1}`).value.trim();
    }
  }

  if (step === 2) {
    const name = document.getElementById("wiz-name").value.trim();
    if (!name) {
      alert(t("wizard.validation.name"));
      return false;
    }
    state.wizardData.name = name;
    state.wizardData.xid = document.getElementById("wiz-xid").value.trim();
    state.wizardData.appearance = document.getElementById("wiz-appearance").value.trim();
  }

  if (step === 3) {
    const total = Object.values(state.wizardData.skills).reduce((a, b) => a + b, 0);
    if (total !== 9) {
      alert(t("wizard.validation.skills").replace("{total}", total));
      return false;
    }
    const count2 = Object.values(state.wizardData.skills).filter(v => v === 2).length;
    const count0 = Object.values(state.wizardData.skills).filter(v => v === 0).length;
    if (count2 !== 2) {
      alert(t("wizard.validation.skills.increase").replace("{count2}", count2));
      return false;
    }
    if (count0 !== 3) {
      alert(t("wizard.validation.skills.decrease").replace("{count0}", count0));
      return false;
    }
  }

  if (step === 4) {
    if (!state.wizardData.agendaType) {
      alert(t("wizard.validation.agenda"));
      return false;
    }
    if (!state.wizardData.agendaSkill) {
      alert(t("wizard.validation.agenda.skill"));
      return false;
    }
  }

  if (step === 5) {
    if (!state.wizardData.blasphemy) {
      alert(t("wizard.validation.blasphemy"));
      return false;
    }
    if (state.wizardData.blasphemyPowers.length !== 2) {
      alert(t("wizard.validation.blasphemy.powers"));
      return false;
    }
  }

  logger.info(`Wizard CAIN: Passo ${step} validado.`);
  return true;
}

function renderWizardSkills() {
  const container = document.getElementById("wiz-skills-list");
  container.innerHTML = "";

  const groups = [
    { labelKey: "skills.physical", keys: ["Force", "Conditioning", "Coordination"] },
    { labelKey: "skills.investigation", keys: ["Covert", "Interfacing", "Investigation", "Surveillance"] },
    { labelKey: "skills.social", keys: ["Negotiation", "Authority", "Connection"] }
  ];

  groups.forEach(group => {
    const block = document.createElement("div");
    block.className = "skills-block-wiz";
    block.innerHTML = `<h4>${t(group.labelKey)}</h4>`;
    const grid = document.createElement("div");
    grid.className = "skills-grid";

    group.keys.forEach(key => {
      const row = document.createElement("div");
      row.className = "skill-control-row";
      const val = state.wizardData.skills[key];
      const displayVal = val === 0 ? "0" : val.toString();
      row.innerHTML = `
        <span class="name">${t("skills." + key)}</span>
        <div class="number-input">
          <button class="wiz-skill-minus" data-key="${key}">-</button>
          <input type="number" value="${displayVal}" min="0" max="2" readonly>
          <button class="wiz-skill-plus" data-key="${key}">+</button>
        </div>
      `;
      row.querySelector(".wiz-skill-minus").addEventListener("click", () => {
        if (state.wizardData.skills[key] > 0) {
          state.wizardData.skills[key]--;
          renderWizardSkills();
        }
      });
      row.querySelector(".wiz-skill-plus").addEventListener("click", () => {
        if (state.wizardData.skills[key] < 2) {
          state.wizardData.skills[key]++;
          renderWizardSkills();
        }
      });
      grid.appendChild(row);
    });

    block.appendChild(grid);
    container.appendChild(block);
  });

  const total = Object.values(state.wizardData.skills).reduce((a, b) => a + b, 0);
  const el = document.getElementById("wiz-skill-points");
  if (el) el.textContent = total;
}

function renderWizardAgenda() {
  const container = document.getElementById("wiz-agenda-list");
  container.innerHTML = "";

  Object.entries(AGENDAS).forEach(([id, agenda]) => {
    const card = document.createElement("div");
    card.className = `package-wiz-card ${state.wizardData.agendaType === id ? 'active' : ''}`;
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
      openWizardAgendaModal(id);
    });
    container.appendChild(card);
  });
}

function openWizardAgendaModal(agendaId) {
  const agenda = AGENDAS[agendaId];
  if (!agenda || !agenda.habilidades.length) return;

  let tempSelectedSkillName = state.wizardData.agendaType === agendaId ? state.wizardData.agendaSkill : "";

  el.modalContainer.classList.remove("hidden");

  const renderModalContent = () => {
    el.modalBody.innerHTML = `
      <h3 class="modal-title">Habilidades de ${agenda.name}</h3>
      <p class="step-help" style="margin-bottom: 16px; color: var(--text-secondary);">Escolha sua Habilidade Ativa inicial.<br>Ela definirá seu papel.</p>
      <div class="traits-wizard-list" id="wiz-modal-skills-list">
        ${agenda.habilidades.map(hab => {
          const isSelected = tempSelectedSkillName === hab.name;
          return `
            <label class="trait-wiz-item ${isSelected ? 'active' : ''}" style="cursor: pointer;">
              <input type="checkbox" class="trait-wiz-check" ${isSelected ? 'checked' : ''}>
              <div class="trait-wiz-content">
                <div class="trait-name" style="font-weight: bold;">${hab.name}</div>
                <div class="desc">${hab.desc}</div>
              </div>
            </label>
          `;
        }).join("")}
      </div>
      <div class="modal-actions" style="margin-top: 24px; display: flex; gap: 8px;">
        <button class="btn btn-success" id="btn-wiz-modal-confirm">Confirmar</button>
        <button class="btn" id="btn-wiz-modal-cancel">Cancelar</button>
      </div>
    `;

    const items = el.modalBody.querySelectorAll(".trait-wiz-item");
    items.forEach((item, index) => {
      const hab = agenda.habilidades[index];
      const cb = item.querySelector(".trait-wiz-check");

      item.onclick = (e) => {
        if (e.target !== cb) {
          tempSelectedSkillName = hab.name;
          renderModalContent();
        }
      };

      cb.onchange = (e) => {
        if (e.target.checked) {
          tempSelectedSkillName = hab.name;
        } else {
          tempSelectedSkillName = "";
        }
        renderModalContent();
      };
    });

    document.getElementById("btn-wiz-modal-cancel").addEventListener("click", () => {
      el.modalContainer.classList.add("hidden");
    });

    document.getElementById("btn-wiz-modal-confirm").addEventListener("click", () => {
      state.wizardData.agendaType = agendaId;
      state.wizardData.agendaSkill = tempSelectedSkillName;
      el.modalContainer.classList.add("hidden");
      renderWizardAgenda();
    });
  };

  renderModalContent();
}

function renderWizardBlasphemies() {
  const container = document.getElementById("wiz-blasphemies-list");
  if (!container) return;
  container.innerHTML = "";

  BLASPHEMIES.forEach(blasphemy => {
    const isSelected = state.wizardData.blasphemy === blasphemy.id;
    const card = document.createElement("div");
    card.className = `trait-wiz-item column ${isSelected ? 'owned' : ''}`;
    card.innerHTML = `
      <div class="info">
        <div class="imgBlasphemy">
          <img src="${blasphemy.img}" alt="${blasphemy.name}" style="height: 150px;" />
        </div>
      </div>
      <div class="content">
        <div class="name-row">
            <span class="name">${blasphemy.name}</span>
            ${isSelected ? `<span style="font-size:12px; font-weight:bold;">Selecionada (${state.wizardData.blasphemyPowers.join(", ")})</span>` : ''}
        </div>
        <div class="desc">${blasphemy.desc}</div>
          ${blasphemy.passive ? `<div class="passive" style="margin-top: 8px; opacity: 0.9; padding: 4px 6px; border-left: 2px solid var(--stamp-red); background: rgba(141,36,40,0.05); border-radius: 4px; line-height: 1.4;"><strong>Passiva:</strong> ${blasphemy.passive}</div>` : ''}
          <div class="action" style="display: flex; gap: 8px;">
            ${isSelected ? `<button class="btn btn-sm btn-danger wiz-remove-blasphemy">Remover</button>` : ''}
            <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-success'} wiz-select-blasphemy">
              ${isSelected ? 'Editar Poderes' : 'Selecionar'}
            </button>
          </div>
        </div>
      </div>
    `;

    card.querySelector(".wiz-select-blasphemy").addEventListener("click", (e) => {
      e.stopPropagation();
      openWizardBlasphemyPowersModal(blasphemy.id);
    });

    if (isSelected) {
      card.querySelector(".wiz-remove-blasphemy").addEventListener("click", (e) => {
        e.stopPropagation();
        state.wizardData.blasphemy = "";
        state.wizardData.blasphemyPowers = [];
        renderWizardBlasphemies();
      });
    }

    // Clicking the card itself also opens the modal (or edits)
    card.addEventListener("click", () => {
      openWizardBlasphemyPowersModal(blasphemy.id);
    });

    container.appendChild(card);
  });
}

function openWizardBlasphemyPowersModal(blasphemyId) {
  const blasphemy = BLASPHEMIES.find(b => b.id === blasphemyId);
  if (!blasphemy) return;

  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <h3 class="modal-title">Poderes de ${blasphemy.name}</h3>
    <p class="step-help" style="margin-bottom: 16px; color: var(--text-secondary);">Escolha exatamente 2 poderes desta blasfêmia.</p>
    <div class="traits-wizard-list" id="wiz-modal-powers-list"></div>
    <div class="modal-actions" style="margin-top: 24px;">
      <button class="btn" id="btn-wiz-powers-cancel">Cancelar</button>
      <button class="btn btn-primary" id="btn-wiz-powers-save" disabled>Salvar</button>
    </div>
  `;

  const list = document.getElementById("wiz-modal-powers-list");
  let selectedPowers = state.wizardData.blasphemy === blasphemyId ? [...state.wizardData.blasphemyPowers] : [];

  const powers = blasphemy.powers && blasphemy.powers.length
    ? blasphemy.powers
    : [
        { name: "Canalizar", desc: `Canalize o poder da ${blasphemy.name} para infligir dano ou criar um efeito imediato.` },
        { name: "Aprimorar", desc: `Aprimore uma ação existente usando o poder da ${blasphemy.name}.` },
        { name: "Invocar", desc: `Invoque um efeito duradouro da ${blasphemy.name} que persiste por uma cena.` }
      ];

  function renderModalPowers() {
    list.innerHTML = "";
    powers.forEach(poder => {
      const isOwned = selectedPowers.includes(poder.name);
      const item = document.createElement("div");
      item.className = `trait-wiz-item ${isOwned ? 'active' : ''}`;
      item.innerHTML = `
        <div class="trait-wiz-check">${isOwned ? '☑' : '☐'}</div>
        <div class="trait-wiz-content">
          <div class="trait-name" style="font-weight: bold;">${poder.name}</div>
          <div class="desc">${poder.desc}</div>
        </div>
      `;
      item.addEventListener("click", () => {
        if (isOwned) {
          selectedPowers = selectedPowers.filter(n => n !== poder.name);
        } else {
          if (selectedPowers.length < 2) {
            selectedPowers.push(poder.name);
          } else {
            alert("Você só pode escolher exatamente 2 poderes.");
          }
        }
        renderModalPowers();
      });
      list.appendChild(item);
    });

    document.getElementById("btn-wiz-powers-save").disabled = selectedPowers.length !== 2;
  }

  renderModalPowers();

  document.getElementById("btn-wiz-powers-cancel").onclick = () => {
    el.modalContainer.classList.add("hidden");
  };

  document.getElementById("btn-wiz-powers-save").onclick = () => {
    state.wizardData.blasphemy = blasphemyId;
    state.wizardData.blasphemyPowers = selectedPowers;
    el.modalContainer.classList.add("hidden");
    renderWizardBlasphemies();
  };
}

export function wizardFinish() {
  const d = state.wizardData;

  const questionText = QUESTIONS.map((q, i) => `**${q}**\n${d.questions[i] || "(sem resposta)"}`).join("\n\n");

  const newChar = {
    id: "char_" + Date.now(),
    name: d.name,
    xid: d.xid || `CX-${Math.floor(1000 + Math.random() * 9000)}`,
    cat: 4,
    portrait: "",
    skills: { ...d.skills },
    stressCurrent: 0,
    stressMax: 6,
    injuries: 0,
    afflictions: [],
    psycheBursts: 3,
    sinCurrent: 0,
    piedadeCurrent: 0,
    piedadeMax: 3,
    divineAgonyUsed: false,
    agendaType: d.agendaType,
    agendaNormal: AGENDAS[d.agendaType]?.normal || [],
    agendaBold: AGENDAS[d.agendaType]?.bold || [],
    agendaSkill: d.agendaSkill,
    blasphemies: d.blasphemy ? [d.blasphemy] : [],
    blasphemyPowers: [...d.blasphemyPowers],
    sinMarks: [],
    kitPoints: 5,
    scrip: 0,
    equipment: [],
    hooks: [],
    xp: 0,
    xpBar: 0,
    appearance: d.appearance || "",
    notes: questionText
  };

  logger.info(`Wizard CAIN: Finalizando criação de "${newChar.name}".`);

  state.characters.push(newChar);
  localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));

  const event = new CustomEvent("load-new-character", { detail: newChar.id });
  document.dispatchEvent(event);

  alert(t("wizard.success").replace("{name}", newChar.name).replace("{xid}", newChar.xid));
}

window.addEventListener("languageChanged", () => {
  if (state.wizardData && state.wizardData.step && !el.wizardScreen.classList.contains("hidden")) {
    showWizardStep(state.wizardData.step);
  }
});
