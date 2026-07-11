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
    cat: 1,
    cid: "",
    agendaText: "",
    blasfemiaText: "",
    sexo: "",
    cabelo: "",
    olhos: "",
    idade: "",
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
  document.getElementById("wiz-cat").value = "1";
  document.getElementById("wiz-cid").value = "";
  document.getElementById("wiz-agenda").value = "";
  document.getElementById("wiz-blasfemia").value = "";
  document.getElementById("wiz-sexo").value = "";
  document.getElementById("wiz-cabelo").value = "";
  document.getElementById("wiz-olhos").value = "";
  document.getElementById("wiz-idade").value = "";
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
    state.wizardData.cat = parseInt(document.getElementById("wiz-cat").value) || 1;
    state.wizardData.cid = document.getElementById("wiz-cid").value.trim();
    state.wizardData.agendaText = document.getElementById("wiz-agenda").value.trim();
    state.wizardData.blasfemiaText = document.getElementById("wiz-blasfemia").value.trim();
    state.wizardData.sexo = document.getElementById("wiz-sexo").value.trim();
    state.wizardData.cabelo = document.getElementById("wiz-cabelo").value.trim();
    state.wizardData.olhos = document.getElementById("wiz-olhos").value.trim();
    state.wizardData.idade = document.getElementById("wiz-idade").value.trim();
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
 container.className = "blasphemy-wiz-grid";
  BLASPHEMIES.forEach(blasphemy => {
    const isSelected = state.wizardData.blasphemy === blasphemy.id;
    const card = document.createElement("div");
    card.className = `blasphemy-wiz-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <img src="${blasphemy.img}" alt="${blasphemy.name}" />
      ${isSelected ? `<div class="selected-badge">Selecionada</div>` : ''}
      <span class="blasphemy-wiz-name">${blasphemy.name}</span>
    `;

    
    card.addEventListener("click", () => {
      openWizardBlasphemyPowersModal(blasphemy.id);
    });

    container.appendChild(card);
  });
}

function openWizardBlasphemyPowersModal(blasphemyId) {
  const blasphemy = BLASPHEMIES.find(b => b.id === blasphemyId);
  if (!blasphemy) return;

  const isSelected = state.wizardData.blasphemy === blasphemyId;
  
  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <div class="blasphemy-details-layout">
      <div class="blasphemy-details-content">
        <div class="blasphemy-details-header">
          
            <img src="${blasphemy.img}" alt="${blasphemy.name}" />
            ${isSelected ? `
              <div>
                <span class="selected-tag">SELECIONADA</span>
              </div>
            ` : ''}
              <div class="desc">
                <h3 class="modal-title">${blasphemy.name}</h3>
                ${blasphemy.desc}
              </div>

        </div>
          ${blasphemy.passive ? `
            <div class="passive">
              <strong style="color: var(--stamp-red);">Passiva:</strong> ${blasphemy.passive}
            </div>
          ` : ''}
        
          <div class="blasphemy-powers-section">
            <h4>Poderes da Blasfêmia</h4>
            <p>Escolha 2 poderes:</p>
            <div class="traits-wizard-list" id="wiz-modal-powers-list"></div>
          </div>
    </div>
    
    <div class="modal-actions">
      <button class="btn" id="btn-wiz-powers-cancel">Cancelar</button>
      ${isSelected ? `<button class="btn btn-danger" id="btn-wiz-powers-remove">Remover</button>` : ''}
      <button class="btn btn-primary" id="btn-wiz-powers-save" disabled>${isSelected ? 'Salvar' : 'Selecionar'}</button>
    </div>
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
function openPowerDetailsModal(power) {
    // Check if details popup for this specific power is already open
    const existing = document.querySelector(`.power-detail-popup[data-power="${power.name}"]`);
    if (existing) {
      // Bring it to front
      let maxZ = 1200;
      document.querySelectorAll(".power-detail-popup").forEach(el => {
        const z = parseInt(el.style.zIndex) || 1200;
        if (z > maxZ) maxZ = z;
      });
      existing.style.zIndex = (maxZ + 1).toString();
      return;
    }
    const popup = document.createElement("div");
    popup.className = "power-detail-popup card-glass";
    popup.setAttribute("data-power", power.name);
    
    // Offset based on open detail windows
    const count = document.querySelectorAll(".power-detail-popup").length;
    const offset = count * 25;
    
    popup.style.position = "fixed";
    popup.style.top = `calc(25% + ${offset}px)`;
    popup.style.left = `calc(40% + ${offset}px)`;
    popup.style.width = "600px";
    popup.style.maxHeight = "50vh";
    popup.style.overflowY = "auto";
    popup.style.padding = "16px";
    popup.style.zIndex = "1200";
    popup.style.border = "2px solid var(--border-color-dark)";
    popup.style.backgroundColor = "var(--bg-card)";
    popup.style.boxShadow = "4px 4px 15px rgba(0, 0, 0, 0.4)";
    popup.style.pointerEvents = "auto";
    popup.style.borderRadius = "var(--radius-md)";
    popup.style.textAlign = "left";
    popup.style.backdropFilter = "none";
    popup.style.webkitBackdropFilter = "none";
    popup.innerHTML = `
      <button class="modal-close" style="top: 8px; right: 8px; font-size: 20px; border: none; background: none; cursor: pointer; color: var(--ink-faded);">×</button>
      <h4 class="modal-title" style="margin-bottom: 12px; text-transform: uppercase; font-size: var(--font-size-md); border-bottom: 1.5px solid var(--ink-dark); padding-bottom: 4px; cursor: move; user-select: none;">${power.name}</h4>
      <div class="desc" style="font-size: var(--font-size-sm); color: var(--ink-dark); line-height: 1.4;">
        ${power.desc}
      </div>
    `;
   document.body.appendChild(popup);
    // Make it clickable to bring to front
    const bringToFront = () => {
      // Find highest z-index among details popups
      let maxZ = 1200;
      document.querySelectorAll(".power-detail-popup").forEach(el => {
        const z = parseInt(el.style.zIndex) || 1200;
        if (z > maxZ) maxZ = z;
      });
      popup.style.zIndex = (maxZ + 1).toString();
    };
     // Make it clickable to bring to front
    popup.addEventListener("mousedown", bringToFront);
    // Drag functionality on title header
    const header = popup.querySelector(".modal-title");
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      popup.style.left = `${initialLeft + dx}px`;
      popup.style.top = `${initialTop + dy}px`;
    };
    const onMouseUp = () => {
      isDragging = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = popup.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      e.preventDefault(); // Prevent text selection
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
    popup.querySelector(".modal-close").onclick = () => popup.remove();
  }

  function renderModalPowers() {
    list.innerHTML = "";
    powers.forEach(poder => {
      const isOwned = selectedPowers.includes(poder.name);
      const item = document.createElement("div");
      item.className = `trait-wiz-item ${isOwned ? 'active' : ''}`;
      item.innerHTML = `
        <input type="checkbox" class="trait-wiz-check" ${isOwned ? 'checked' : ''}>
        <div class="trait-wiz-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div class="trait-name" style="font-weight: bold; font-family: var(--font-heading); text-transform: uppercase; font-size: var(--font-size-md);">${poder.name}</div>
          <button class="btn btn-sm btn-detail-power" style="font-size: 11px; padding: 3px 8px;">Detalhes</button>
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
      const btnDetail = item.querySelector(".btn-detail-power");
      btnDetail.addEventListener("click", (e) => {
        e.stopPropagation();
        openPowerDetailsModal(poder);
      });
      list.appendChild(item);
    });

    document.getElementById("btn-wiz-powers-save").disabled = selectedPowers.length !== 2;
  }

  renderModalPowers();

  document.getElementById("btn-wiz-powers-cancel").onclick = () => {
    el.modalContainer.classList.add("hidden");
  };

    if (isSelected) {
    document.getElementById("btn-wiz-powers-remove").onclick = () => {
      state.wizardData.blasphemy = "";
      state.wizardData.blasphemyPowers = [];
      el.modalContainer.classList.add("hidden");
      renderWizardBlasphemies();
    };
  }

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
    cat: d.cat || 1,
    portrait: "",
    skills: { ...d.skills },
    stressCurrent: 0,
    stressMax: 6,
    injuries: 0,
    afflictions: [],
    psycheBursts: 0,
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
     agendaText: d.agendaText || "",
    blasfemiaText: d.blasfemiaText || "",
    sexo: d.sexo || "",
    cabelo: d.cabelo || "",
    olhos: d.olhos || "",
    idade: d.idade || "",
    cid: d.cid || "",
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
