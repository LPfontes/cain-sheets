import { el, state, saveCurrentCharacter } from "./state.js";
import { BLASPHEMIES, SIN_MARKS, AGENDAS, CAIN_SKILLS } from "./cain-data.js";
import { openAgendaModal, openBlasphemiesModal } from "./modals.js";
import { openCainRollForSkill } from "./cain-roller.js";
import { logger } from "./logger.js";
import { t } from "./i18n.js";

// ==========================================
// RENDERS DA FICHA CAIN
// ==========================================

export function renderSkillsSheet() {
  const char = state.currentCharacter;
  if (!char || !el.skillsListSheet) return;

  el.skillsListSheet.innerHTML = "";

  const groups = [
    { labelKey: "skills.physical", keys: ["Force", "Conditioning", "Coordination"] },
    { labelKey: "skills.investigation", keys: ["Covert", "Interfacing", "Investigation", "Surveillance"] },
    { labelKey: "skills.social", keys: ["Negotiation", "Authority", "Connection"] }
  ];

  groups.forEach(group => {
    const section = document.createElement("div");
    section.className = "cain-skill-group";
    section.innerHTML = `<span class="cain-skill-group-label">${t(group.labelKey)}</span>`;

    group.keys.forEach(key => {
      const val = char.skills[key] || 0;
      const item = document.createElement("div");
      item.className = "cain-skill-row";
      item.innerHTML = `
        <div class="cain-skill-left">
          <span class="cain-skill-name">${t("skills." + key)}</span>
          <button class="cain-skill-roll-btn" data-skill="${key}" title="Rolar ${t("skills." + key)}">🎲</button>
        </div>
        <div class="cain-skill-dots">
          ${Array.from({ length: 3 }, (_, i) =>
        `<span class="cain-skill-dot ${i < val ? 'filled' : ''}" data-skill="${key}" data-level="${i + 1}"></span>`
      ).join("")}
        </div>
      `;
      item.querySelector(".cain-skill-roll-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        openCainRollForSkill(key);
      });
      item.querySelectorAll(".cain-skill-dot").forEach(dot => {
        dot.addEventListener("click", () => {
          const newLevel = parseInt(dot.dataset.level);
          char.skills[key] = char.skills[key] === newLevel ? newLevel - 1 : newLevel;
          saveCurrentCharacter();
          renderSkillsSheet();
        });
      });
      section.appendChild(item);
    });

    el.skillsListSheet.appendChild(section);
  });

  const psiqueSection = document.createElement("div");
  psiqueSection.className = "cain-skill-group";
  const psiqueVal = Math.ceil((char.cat || 1) / 2);
  psiqueSection.innerHTML = `
    <span class="cain-skill-group-label">${t("skills.psychic")}</span>
    <div class="cain-skill-row">
      <div class="cain-skill-left">
        <span class="cain-skill-name">${t("skills.Psique")}</span>
        <button class="cain-skill-roll-btn" data-skill="Psique" title="Rolar ${t("skills.Psique")}">🎲</button>
      </div>
      <div class="cain-skill-dots">
        ${Array.from({ length: 3 }, (_, i) =>
    `<span class="cain-skill-dot ${i < psiqueVal ? 'filled' : ''}"></span>`
  ).join("")}
      </div>
    </div>
  `;
  el.skillsListSheet.appendChild(psiqueSection);
  psiqueSection.querySelector(".cain-skill-roll-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openCainRollForSkill("Psique");
  });
}

export function renderStressHealthSheet() {
  const char = state.currentCharacter;
  if (!char) return;

  if (el.stressTrackerSheet) {
    const img = el.stressTrackerSheet.querySelector(".stress-tracker-bg");
    el.stressTrackerSheet.innerHTML = "";
    if (img) el.stressTrackerSheet.appendChild(img);
    const maxStress = Math.max(0, (char.stressMax || 6) - (char.injuries || 0));
    const current = Math.min(char.stressCurrent, maxStress);
    const total = char.stressMax || 6;
    const rotations = [11, 6, 4, 8, -6, -11];
    for (let i = 1; i <= total; i++) {
      const line = document.createElement("div");
      const isLocked = i > maxStress;
      line.className = `stress-line ${i <= current ? 'filled' : ''} ${isLocked ? 'locked' : ''}`;
      line.style.top = `${90 - ((i - 1) / Math.max(total - 1, 1)) * 59}%`;
      line.style.setProperty('--rotate', `${rotations[(i - 1) % rotations.length]}deg`);
      el.stressTrackerSheet.appendChild(line);
    }
  }

  const stressCurrentEl = document.getElementById("stress-current-sheet");
  if (stressCurrentEl) {
    stressCurrentEl.textContent = char.stressCurrent || 0;
  }

  renderInjuryCheckboxes();
  renderPsycheBursts();
  renderSinTracker();
  renderMissionsSurvived();

  if (el.afflictionsListSheet) {
    const list = char.afflictions || [];
    el.afflictionsListSheet.innerHTML = list.map((a, idx) => {
      const name = a.name || a;
      return `<span class="cain-affliction-tag btn-remove-affliction" data-index="${idx}" style="cursor: pointer;" title="${a.desc || 'Sem descrição (Clique para remover)'}">${name} <span style="margin-left: 4px; font-weight: bold; opacity: 0.7;">×</span></span>`;
    }).join("") || `<span class="cain-empty">${t("common.none")}</span>`;

    el.afflictionsListSheet.querySelectorAll(".btn-remove-affliction").forEach(tag => {
      tag.onclick = () => {
        const idx = parseInt(tag.getAttribute("data-index"));
        char.afflictions.splice(idx, 1);
        saveCurrentCharacter();
        renderStressHealthSheet();
      };
    });
  }
}

export function renderInjuryCheckboxes() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("injury-checkbox-group");
  if (!group) return;
  const injuries = char.injuries || 0;
  const maxInjuries = char.injuriesMax !== undefined ? char.injuriesMax : 3;
  group.style.gridTemplateColumns = `repeat(${maxInjuries}, 1fr)`;
  group.innerHTML = "";
  for (let i = 0; i < maxInjuries; i++) {
    const label = document.createElement("label");
    label.className = "injury-x";
    const checked = i < injuries;
    label.innerHTML = `<input type="checkbox" ${checked ? 'checked' : ''}><span>X</span>`;
    label.querySelector("input").addEventListener("change", (e) => {
      const char = state.currentCharacter;
      if (!char) return;
      let count = 0;
      group.querySelectorAll("input").forEach(cb => {
        if (cb.checked) count++;
      });
      char.injuries = count;
      const currentMax = Math.max(0, (char.stressMax || 6) - char.injuries);
      if (char.stressCurrent > currentMax) {
        char.stressCurrent = currentMax;
      }
      saveCurrentCharacter();
      renderStressHealthSheet();
    });
    group.appendChild(label);
  }
  const skull = document.getElementById("injury-death-skull");
  if (skull) {
    if (injuries >= 3) {
      skull.classList.remove("hidden");
    } else {
      skull.classList.add("hidden");
    }
  }
}

export function renderAgendaSheet() {
  const char = state.currentCharacter;
  if (!char || !el.agendaListSheet) return;

  const normal = char.agendaNormal || [];
  const bold = char.agendaBold || [];
  const skillName = char.agendaSkill || "";
  let skillDesc = "";

  if (skillName) {
    for (const agendaKey in AGENDAS) {
      const hab = AGENDAS[agendaKey].habilidades?.find(h => h.name === skillName);
      if (hab) {
        skillDesc = hab.desc;
        break;
      }
    }
  }

  const normalChecked = char.agendaNormalChecked || {};
  const boldChecked = char.agendaBoldChecked || {};

  el.agendaListSheet.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h4 class="cain-agenda-subtitle" style="margin: 0;">${t("sheet.agenda.activeSkill")}</h4>
      <button id="btn-edit-agenda" class="btn">Editar Agenda</button>
    </div>
    <div class="cain-agenda-section">
        ${skillName ? `
          <div class="cain-agenda-item b" style="display:flex; flex-direction:column; gap:4px; padding: 10px; border-left: 3px solid var(--color-rust-glow); background: rgba(59, 130, 246, 0.03);">
            <strong style="font-size: 1.1em;">${skillName}</strong>
            ${skillDesc ? `<span style="font-size:var(--font-size-xm); line-height: 1.4;">${skillDesc}</span>` : ''}
          </div>
        ` : `<span class="cain-empty">${t("sheet.agenda.noActiveSkill")}</span>`}
      </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
      <div class="cain-agenda-section">
        <h4 class="cain-agenda-subtitle">${t("sheet.agenda.normalItems")}</h4>
        ${normal.length ? normal.map((item, i) => {
    const isChecked = normalChecked[i] ? 'checked' : '';
    return `<label class="cain-agenda-item"><input type="checkbox" class="cain-agenda-check" data-type="normal" data-index="${i}" ${isChecked}> ${item}</label>`;
  }).join("") : `<span class="cain-empty">${t("sheet.agenda.noNormalItems")}</span>`}
      </div>
      <div class="cain-agenda-section">
        <h4 class="cain-agenda-subtitle">${t("sheet.agenda.boldItems")}</h4>
        ${bold.length ? bold.map((item, i) => {
    const isChecked = boldChecked[i] ? 'checked' : '';
    return `<label class="cain-agenda-item b"><input type="checkbox" class="cain-agenda-check" data-type="bold" data-index="${i}" ${isChecked}> ${item}</label>`;
  }).join("") : `<span class="cain-empty">${t("sheet.agenda.noBoldItems")}</span>`}
      </div>
    </div>
  `;

  el.agendaListSheet.querySelectorAll(".cain-agenda-check").forEach(cb => {
    cb.addEventListener("change", () => {
      const type = cb.getAttribute("data-type");
      const idx = cb.getAttribute("data-index");
      if (type === "normal") {
        if (!char.agendaNormalChecked) char.agendaNormalChecked = {};
        char.agendaNormalChecked[idx] = cb.checked;
      } else if (type === "bold") {
        if (!char.agendaBoldChecked) char.agendaBoldChecked = {};
        char.agendaBoldChecked[idx] = cb.checked;
      }
      saveCurrentCharacter();
    });
  });

  const btnEditAgenda = document.getElementById("btn-edit-agenda");
  if (btnEditAgenda) {
    btnEditAgenda.addEventListener("click", () => {
      openAgendaModal();
    });
  }
}

export function showPowerDetailPopup(power) {
  const existing = document.querySelector(`.power-detail-popup[data-power="${power.name}"]`);
  if (existing) return;

  const popup = document.createElement("div");
  popup.className = "power-detail-popup card-glass";
  popup.setAttribute("data-power", power.name);
  popup.style.cssText = `
    max-width:650px;padding:20px;display:flex;flex-direction:column;gap:12px;
    position:fixed;z-index:1310;top:30%;left:40%;
    border:2px solid var(--border-color-dark);
    backdrop-filter:none;-webkit-backdrop-filter:none;
    border-radius:var(--radius-md);box-shadow:4px 4px 15px rgba(0,0,0,0.4)
  `;
  popup.innerHTML = `
    <button class="modal-close">&times;</button>
    <h3 class="modal-title" style="margin:0;text-transform:uppercase;cursor:move;user-select:none">${power.name}</h3>
    <div style="font-size:14px;line-height:1.5;color:var(--text-secondary);text-align:left;max-height:50vh;overflow-y:auto;padding-right:4px">
      ${power.desc}
    </div>
    <div style="display:flex;justify-content:flex-end;margin-top:10px">
      <button class="btn btn-secondary btn-popup-ok">Fechar</button>
    </div>
  `;

  popup.querySelector(".modal-close").onclick = () => popup.remove();
  popup.querySelector(".btn-popup-ok").onclick = () => popup.remove();

  popup.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-toolbox]");
    if (trigger) {
      const termKey = trigger.getAttribute("data-toolbox");
      import("./toolbox.js").then(({ openToolbox }) => {
        openToolbox(termKey);
      });
    }
  });

  const header = popup.querySelector(".modal-title");
  let isDragging = false, startX, startY, initialLeft, initialTop;
  const onMouseMove = (e) => {
    if (!isDragging) return;
    popup.style.left = `${initialLeft + e.clientX - startX}px`;
    popup.style.top = `${initialTop + e.clientY - startY}px`;
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
    e.preventDefault();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  document.body.appendChild(popup);
}

export function renderBlasphemiesSheet() {
  const char = state.currentCharacter;
  if (!char || !el.blasphemiesListSheet) return;

  if (el.btnAddBlasphemy) {
    el.btnAddBlasphemy.onclick = () => {
      openBlasphemiesModal();
    };
  }

  const owned = char.blasphemies || [];
  el.blasphemiesListSheet.innerHTML = owned.length
    ? owned.map(id => {
      const b = BLASPHEMIES.find(bb => bb.id === id);
      if (!b) {
        return `<div class="cain-blasphemy-card card-glass">
              <div class="cain-blasphemy-name">${id}</div>
            </div>`;
      }

      const activePowers = (b.powers || []).filter(p => (char.blasphemyPowers || []).includes(p.name));

      return `<div class="cain-blasphemy-card card-glass cain-blasphemy-accordion-card">
              <button class="cain-blasphemy-card-trigger">
                <span class="cain-blasphemy-name">${b.name}</span>
                <span class="card-arrow">▼</span>
              </button>
              <div class="cain-blasphemy-card-content">
                <div class="cain-blasphemy-desc">${b.desc}</div>
                ${b.passive ? `<div class="cain-blasphemy-passive"><strong>Passiva:</strong> ${b.passive}</div>` : ''}
                ${activePowers.length ? `
                  <div class="cain-blasphemy-powers" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
                    <strong class="cain-blasphemy-powers-title">Poderes Selecionados:</strong>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                      ${activePowers.map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; padding: 6px 10px;">
                          <span style="font-weight: bold; font-family: var(--font-heading); text-transform: uppercase; font-size: 13px; color: var(--text-secondary);">${p.name}</span>
                          <button type="button" class="btn btn-sm btn-sheet-detail-power" data-blasphemy-id="${b.id}" data-power-name="${p.name}" style="font-size: 11px; padding: 3px 8px;">Detalhes</button>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>`;
    }).join("")
    : `<span class="cain-empty">${t("sheet.blasphemies.none")}</span>`;

  // Attach event listeners for card triggers
  el.blasphemiesListSheet.querySelectorAll(".cain-blasphemy-card-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const card = trigger.closest(".cain-blasphemy-accordion-card");
      const content = card.querySelector(".cain-blasphemy-card-content");
      const arrow = trigger.querySelector(".card-arrow");
      const isOpen = card.classList.contains("open");

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        content.offsetHeight; // force reflow
        card.classList.remove("open");
        content.style.maxHeight = "0";
        if (arrow) arrow.textContent = "▼";
      } else {
        card.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
        const handleTransitionEnd = (e) => {
          if (e.propertyName === "max-height" && card.classList.contains("open")) {
            content.style.maxHeight = "none";
            content.removeEventListener("transitionend", handleTransitionEnd);
          }
        };
        content.addEventListener("transitionend", handleTransitionEnd);
        if (arrow) arrow.textContent = "▲";
      }
    });
  });

  // Attach event listeners for sheet power detail clicks
  el.blasphemiesListSheet.querySelectorAll(".btn-sheet-detail-power").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const bId = btn.getAttribute("data-blasphemy-id");
      const pName = btn.getAttribute("data-power-name");
      const b = BLASPHEMIES.find(bb => bb.id === bId);
      if (b) {
        const power = (b.powers || []).find(p => p.name === pName);
        if (power) {
          showPowerDetailPopup(power);
        }
      }
    });
  });
}

export function renderSinMarksSheet() {
  const char = state.currentCharacter;
  if (!char || !el.sinMarksListSheet) return;

  const marks = char.sinMarks || [];
  el.sinMarksListSheet.innerHTML = marks.length
    ? marks.map(sm => {
      const m = typeof sm === "string" ? SIN_MARKS.find(s => s.id === sm) : sm;
      const name = m?.name || sm?.name || sm;
      const desc = m?.desc || sm?.desc || "";
      const penalty = m?.penalty || sm?.penalty || "";
      const benefit = m?.benefit || sm?.benefit || "";
      return `<div class="cain-sinmark-card card-glass">
          <div class="cain-sinmark-name">${name}</div>
          ${desc ? `<div class="cain-sinmark-desc">${desc}</div>` : ""}
          ${penalty ? `<div class="cain-sinmark-penalty">⚠ ${penalty}</div>` : ""}
          ${benefit ? `<div class="cain-sinmark-benefit">✦ ${benefit}</div>` : ""}
        </div>`;
    }).join("")
    : `<span class="cain-empty">${t("sheet.sinmarks.none")}</span>`;
}

export function renderEquipmentSheet() {
  const char = state.currentCharacter;
  if (!char || !el.equipmentListSheet) return;

  const equipment = char.equipment || [];
  const kp = char.kitPoints !== undefined ? char.kitPoints : 5;
  const scrip = char.scrip !== undefined ? char.scrip : 0;

  // Check if character already has service weapons equipped
  const serviceWeaponIndex = equipment.findIndex(eq => eq.name === "Armas de Serviço");
  const hasServiceWeapons = serviceWeaponIndex !== -1;
  const serviceWeapon = hasServiceWeapons ? equipment[serviceWeaponIndex] : null;
  const weaponCat = serviceWeapon ? (serviceWeapon.cat || 0) : 0;
  const weaponAesthetic = serviceWeapon ? (serviceWeapon.aesthetic || "Pistola de Serviço & Faca Tática") : "";

  el.equipmentListSheet.innerHTML = `
    <!-- Top summary bar with edits -->
    <div class="cain-kp-row">
      <div class="cain-kp-col">
        KP: <span class="cain-kp-value">${kp}</span>
        <button class="btn-kp-adjust" data-action="dec">-</button>
        <button class="btn-kp-adjust" data-action="inc">+</button>
      </div>
      <div class="cain-kp-col">
        Scrip: <span class="cain-scrip-value">${scrip}</span>
        <button class="btn-scrip-adjust" data-action="dec">-</button>
        <button class="btn-scrip-adjust" data-action="inc">+</button>
      </div>
      <button id="btn-reset-mission">Iniciar Missão (5 KP)</button>
    </div>

    <div class="cain-equip-col-left-split">
      <!-- Kit Padrão Quick Choose -->
      <div class="kit-options-container">
        <div class="kit-options-title">Adicionar do Kit Padrão:</div>
        <div class="kit-options-grid">
          <button class="btn-kit-opt" data-name="Uniforme Padrão" data-cost="0">
            <span>Uniforme Padrão (Colarinho, sapatos, broche)</span>
            <span class="btn-kit-opt-cost-free">0 KP</span>
          </button>
          <button class="btn-kit-opt" data-name="Caderno e Caneta" data-cost="1">
            <span>Caderno e Caneta</span>
            <span class="btn-kit-opt-cost">1 KP</span>
          </button>
          <button class="btn-kit-opt" data-name="Caixa de Fósforos e Lenço" data-cost="1">
            <span>Fósforos (20 un) e Lenço limpo</span>
            <span class="btn-kit-opt-cost">1 KP</span>
          </button>
          <button class="btn-kit-opt" data-name="Armas de Serviço" data-cost="2">
            <span>Armas de Serviço (Fogo CAT 0 & Branca)</span>
            <span class="btn-kit-opt-cost">2 KP</span>
          </button>
        </div>

        <!-- Add Custom Item -->
        <div class="custom-item-row">
          <input type="text" id="custom-item-name" placeholder="Nome..." class="custom-item-name-input">
          <input type="text" id="custom-item-desc" placeholder="Descrição/Detalhes..." class="custom-item-desc-input">
          <input type="number" id="custom-item-cost" placeholder="KP" min="0" max="5" value="1" class="custom-item-cost-input">
          <button id="btn-add-custom-item">Adicionar</button>
        </div>
      </div>
    </div>
  `;

  const equippedContainer = document.getElementById("equipped-items-list-sheet");
  if (equippedContainer) {
    equippedContainer.innerHTML = `
      <div class="cain-equipped-items-container">
        <div class="cain-equipped-items-title">Itens Equipados na Missão:</div>
        <div class="cain-equipped-items-list">
          ${equipment.length
        ? equipment.map((eq, index) =>
          `<div class="cain-equip-item ${eq.name === "Armas de Serviço" ? "service-weapon" : "normal-item"}">
                  <div>
                    <span class="cain-equip-name">${eq.name}</span>
                    ${eq.name === "Armas de Serviço" ? `<div class="cain-equip-meta">CAT ${eq.cat || 0} • ${eq.aesthetic || "Padrão"}</div>` : (eq.desc ? `<div class="cain-equip-meta">${eq.desc}</div>` : "")}
                  </div>
                  <div class="cain-equip-right">
                    <span class="cain-equip-cost">${eq.kpCost} KP</span>
                    <button class="btn-remove-item" data-index="${index}">&times;</button>
                  </div>
                </div>`
        ).join("")
        : `<span class="cain-empty">${t("sheet.equipment.none")}</span>`}
        </div>
      </div>
    `;
  }

  // Attach event listeners dynamically
  // KP Adjust
  el.equipmentListSheet.querySelectorAll(".btn-kp-adjust").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action === "dec") {
        char.kitPoints = Math.max(0, kp - 1);
      } else {
        char.kitPoints = kp + 1;
      }
      saveCurrentCharacter();
      renderEquipmentSheet();
    });
  });

  // Scrip Adjust
  el.equipmentListSheet.querySelectorAll(".btn-scrip-adjust").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action === "dec") {
        char.scrip = Math.max(0, scrip - 1);
      } else {
        char.scrip = scrip + 1;
      }
      saveCurrentCharacter();
      renderEquipmentSheet();
    });
  });

  // Reset Mission (sets KP to 5 and empties temporary gear)
  el.equipmentListSheet.querySelector("#btn-reset-mission")?.addEventListener("click", () => {
    if (confirm("Resetar missão? Isso redefinirá seus pontos de Kit para 5 e removerá todos os itens equipados temporários.")) {
      char.kitPoints = 5;
      char.equipment = [];
      saveCurrentCharacter();
      renderEquipmentSheet();
    }
  });

  // Standard options click
  el.equipmentListSheet.querySelectorAll(".btn-kit-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const cost = parseInt(btn.getAttribute("data-cost"));

      if (kp < cost) {
        alert("Pontos de Kit (KP) insuficientes para equipar este item!");
        return;
      }

      // Prevent duplicate equipping
      if (equipment.some(eq => eq.name === name)) {
        alert("Você já equipou este item!");
        return;
      }

      char.kitPoints = kp - cost;
      if (!char.equipment) char.equipment = [];

      if (name === "Armas de Serviço") {
        char.equipment.push({ name, kpCost: cost, cat: 0, aesthetic: "Pistola de Serviço & Faca Tática" });
      } else {
        char.equipment.push({ name, kpCost: cost });
      }

      saveCurrentCharacter();
      renderEquipmentSheet();
    });
  });

  // Add Custom Item
  el.equipmentListSheet.querySelector("#btn-add-custom-item")?.addEventListener("click", () => {
    const nameInput = el.equipmentListSheet.querySelector("#custom-item-name");
    const descInput = el.equipmentListSheet.querySelector("#custom-item-desc");
    const costInput = el.equipmentListSheet.querySelector("#custom-item-cost");
    const name = nameInput.value.trim();
    const desc = descInput ? descInput.value.trim() : "";
    const cost = parseInt(costInput.value) || 0;

    if (!name) {
      alert("Por favor, digite o nome do item!");
      return;
    }

    if (kp < cost) {
      alert("Pontos de Kit (KP) insuficientes!");
      return;
    }

    char.kitPoints = kp - cost;
    if (!char.equipment) char.equipment = [];
    char.equipment.push({ name, kpCost: cost, desc });

    saveCurrentCharacter();
    renderEquipmentSheet();
  });

  // Upgrade Service Weapon
  if (hasServiceWeapons) {
    const aestheticInput = el.equipmentListSheet.querySelector("#service-weapon-aesthetic");
    aestheticInput?.addEventListener("change", () => {
      if (serviceWeapon) {
        serviceWeapon.aesthetic = aestheticInput.value.trim();
        saveCurrentCharacter();
      }
    });

    el.equipmentListSheet.querySelector("#btn-upgrade-weapon")?.addEventListener("click", () => {
      if (weaponCat >= 3) return;
      if (scrip < 3) {
        alert("Scrip insuficiente! Você precisa de 3 Scrips para aprimorar suas armas de serviço.");
        return;
      }

      char.scrip = scrip - 3;
      if (serviceWeapon) {
        serviceWeapon.cat = weaponCat + 1;
      }
      saveCurrentCharacter();
      renderEquipmentSheet();
    });
  }

  // Remove Item
  const removeButtons = equippedContainer ? equippedContainer.querySelectorAll(".btn-remove-item") : [];
  removeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      const removed = equipment[idx];
      if (removed) {
        char.kitPoints = kp + (removed.kpCost || 0);
        char.equipment.splice(idx, 1);
        saveCurrentCharacter();
        renderEquipmentSheet();
      }
    });
  });

  if (el.hooksListSheet) {
    const hooks = char.hooks || [];
    el.hooksListSheet.innerHTML = hooks.length
      ? hooks.map((h, i) => {
        const current = h.current || 0;
        const max = h.max || 3;
        return `<div class="cain-hook-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(0,0,0,0.2); border-radius:4px; margin-bottom:4px;">
            <span class="cain-hook-name">${h.name}</span>
            <div class="cain-hook-tracker" style="display:flex; gap:4px; font-weight:bold; cursor:pointer;" data-index="${i}">
              ${Array.from({ length: max }, (_, si) =>
          `<span class="cain-hook-slash ${si < current ? 'filled' : ''}" style="color: ${si < current ? '#f87171' : 'rgba(255,255,255,0.2)'}; font-size:14px; padding:0 2px;">/</span>`
        ).join("")}
            </div>
          </div>`;
      }).join("")
      : `<span class="cain-empty">${t("sheet.hooks.none")}</span>`;

    // Hook click tracker
    el.hooksListSheet.querySelectorAll(".cain-hook-tracker").forEach(tracker => {
      tracker.addEventListener("click", () => {
        const idx = parseInt(tracker.getAttribute("data-index"));
        const hook = hooks[idx];
        if (hook) {
          hook.current = (hook.current + 1) % (hook.max + 1);
          saveCurrentCharacter();
          renderEquipmentSheet();
        }
      });
    });
  }
}

export function renderSavedMacrosSheet() {
}

export function renderHomebrewSheet() {
}

// === STUBS (mantidos para compatibilidade com modals.js) ===
export function renderAptitudesSheet() { }
export function renderHealthSheet() { }
export function renderCaboGuerraSheet() { }
export function renderCharacteristicsSheet() { }
export function renderMutationsSheet() { }
export function renderInventorySheet() { }

export function renderPsycheBursts() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("psyche-checkbox-group");
  if (!group) return;
  const psycheMax = char.psycheMax !== undefined ? char.psycheMax : 3;

  const current = char.psycheBursts !== undefined ? char.psycheBursts : 0;
  group.innerHTML = "";
  for (let i = 1; i <= psycheMax; i++) {
    const label = document.createElement("label");
    const checked = i <= current;
    label.className = `psyche-checkbox ${checked ? 'checked' : ''}`;
    label.innerHTML = `
      <input type="checkbox" ${checked ? 'checked' : ''}>
      <img src="./assets/burst.webp" class="psyche-burst-icon" alt="Burst">
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      const char = state.currentCharacter;
      if (!char) return;
      let count = 0;
      group.querySelectorAll("input").forEach(cb => {
        if (cb.checked) count++;
      });
      char.psycheBursts = count;
      saveCurrentCharacter();
      import("./cain-roller.js").then(({ renderCainRollPanel }) => renderCainRollPanel());
      renderPsycheBursts();
    });
    group.appendChild(label);
  }
}

export function renderSinTracker() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("sin-checkbox-group");
  if (!group) return;

  const sinCurrent = char.sinCurrent || 0;
  const sinMarksCount = char.sinMarks?.length || 0;
  const extraBlasphemies = char.blasphemies?.length > 1 ? char.blasphemies.length - 1 : 0;

  // Alienação modifier check
  const hasAliena = char.agendaSkill === "Alienação" || char.agendaSkill === "Alienação (Alienação)";

  const sinMax = char.sinMax !== undefined ? char.sinMax : 10;
  let sinLimit = sinMax - 2 * sinMarksCount - 1 * extraBlasphemies;
  if (hasAliena) {
    sinLimit += 2;
  }
  sinLimit = Math.max(0, Math.min(sinMax, sinLimit));

  group.innerHTML = "";
  for (let i = 1; i <= sinMax; i++) {
    const box = document.createElement("div");
    const isLocked = i > sinLimit;
    const isChecked = i <= sinCurrent && !isLocked;

    box.className = `sin-box ${isChecked ? 'checked' : ''} ${isLocked ? 'locked' : ''}`;
    box.innerHTML = `
      <input type="checkbox" ${isChecked ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
      <div class="sin-sphere"></div>
    `;

    if (!isLocked) {
      box.addEventListener("click", () => {
        const char = state.currentCharacter;
        if (!char) return;

        if (char.sinCurrent === i) {
          char.sinCurrent = i - 1;
        } else {
          char.sinCurrent = i;
        }

        saveCurrentCharacter();
        renderSinTracker();
      });
    }
    group.appendChild(box);
  }

  const warningEl = document.getElementById("sin-overflow-warning");
  if (warningEl) {
    warningEl.style.display = sinCurrent >= sinLimit && sinLimit > 0 ? "block" : "none";
  }
}

export function renderMissionsSurvived() {
  const char = state.currentCharacter;
  if (!char) return;
  if (!char.missionsChecked) {
    char.missionsChecked = [false, false, false, false, false, false, false];
  }
  for (let i = 1; i <= 7; i++) {
    const cb = document.getElementById(`mission-check-${i}`);
    if (cb) {
      cb.checked = char.missionsChecked[i - 1] || false;
      cb.onchange = (e) => {
        char.missionsChecked[i - 1] = e.target.checked;
        saveCurrentCharacter();
      };
    }
  }
}

export function renderStaticHooks() {
  const char = state.currentCharacter;
  if (!char) return;

  if (!char.staticHooks) {
    char.staticHooks = [
      { name: "", checks: [false, false, false] },
      { name: "", checks: [false, false, false] },
      { name: "", checks: [false, false, false] }
    ];
  }

  for (let i = 1; i <= 3; i++) {
    const hookData = char.staticHooks[i - 1] || { name: "", checks: [false, false, false] };
    const nameInput = document.getElementById(`hook-name-${i}`);
    if (nameInput) nameInput.value = hookData.name || "";

    for (let j = 1; j <= 3; j++) {
      const checkbox = document.getElementById(`hook-check-${i}-${j}`);
      if (checkbox) checkbox.checked = !!hookData.checks[j - 1];
    }
  }
}

export function initStaticHooksListeners() {
  for (let i = 1; i <= 3; i++) {
    const nameInput = document.getElementById(`hook-name-${i}`);
    nameInput?.addEventListener("input", () => {
      const char = state.currentCharacter;
      if (!char) return;
      if (!char.staticHooks) {
        char.staticHooks = [
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] }
        ];
      }
      char.staticHooks[i - 1].name = nameInput.value;
      saveCurrentCharacter();
    });

    for (let j = 1; j <= 3; j++) {
      const checkbox = document.getElementById(`hook-check-${i}-${j}`);
      checkbox?.addEventListener("change", () => {
        const char = state.currentCharacter;
        if (!char) return;
        if (!char.staticHooks) {
          char.staticHooks = [
            { name: "", checks: [false, false, false] },
            { name: "", checks: [false, false, false] },
            { name: "", checks: [false, false, false] }
          ];
        }
        char.staticHooks[i - 1].checks[j - 1] = checkbox.checked;
        saveCurrentCharacter();
      });
    }
  }

  document.querySelectorAll(".hook-track-col").forEach((col, index) => {
    const removeBtn = col.querySelector(".hook-remove-button");
    removeBtn?.addEventListener("click", () => {
      const char = state.currentCharacter;
      if (!char) return;
      if (!char.staticHooks) {
        char.staticHooks = [
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] },
          { name: "", checks: [false, false, false] }
        ];
      }

      char.staticHooks[index] = { name: "", checks: [false, false, false] };
      saveCurrentCharacter();

      const nameInput = document.getElementById(`hook-name-${index + 1}`);
      if (nameInput) nameInput.value = "";

      for (let j = 1; j <= 3; j++) {
        const checkbox = document.getElementById(`hook-check-${index + 1}-${j}`);
        if (checkbox) checkbox.checked = false;
      }
    });
  });
}

window.addEventListener("languageChanged", () => {
  const char = state.currentCharacter;
  if (!char) return;
  renderSkillsSheet();
  renderStressHealthSheet();
  renderAgendaSheet();
  renderBlasphemiesSheet();
  renderSinMarksSheet();
  renderEquipmentSheet();
  renderStaticHooks();
});
