import { el, state, saveCurrentCharacter } from "./state.js";
import { BLASPHEMIES, SIN_MARKS, AGENDAS, CAIN_SKILLS } from "./cain-data.js";
import { openAgendaModal, openBlasphemiesModal } from "./modals.js";
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
        <span class="cain-skill-name">${t("skills." + key)}</span>
        <div class="cain-skill-dots">
          ${Array.from({ length: 3 }, (_, i) =>
        `<span class="cain-skill-dot ${i < val ? 'filled' : ''}" data-skill="${key}" data-level="${i + 1}"></span>`
      ).join("")}
        </div>
      `;
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
      <span class="cain-skill-name">${t("skills.Psique")}</span>
      <div class="cain-skill-dots">
        ${Array.from({ length: 3 }, (_, i) =>
    `<span class="cain-skill-dot ${i < psiqueVal ? 'filled' : ''}"></span>`
  ).join("")}
      </div>
    </div>
  `;
  el.skillsListSheet.appendChild(psiqueSection);
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
    const total = 6;
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
    el.afflictionsListSheet.innerHTML = (char.afflictions || []).map(a =>
      `<span class="cain-affliction-tag">${a.name || a}</span>`
    ).join("") || `<span class="cain-empty">${t("common.none")}</span>`;
  }
}

export function renderInjuryCheckboxes() {
  const char = state.currentCharacter;
  if (!char) return;
  const group = document.getElementById("injury-checkbox-group");
  if (!group) return;
  const injuries = char.injuries || 0;
  const maxInjuries = char.injuriesMax !== undefined ? char.injuriesMax : 3;
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
      <button id="btn-edit-agenda" class="btn btn-sm">Editar Agenda</button>
    </div>
    <div class="cain-agenda-section">
        ${skillName ? `
          <div class="cain-agenda-item b" style="display:flex; flex-direction:column; gap:4px; padding: 10px; border-left: 3px solid var(--color-rust-glow); background: rgba(59, 130, 246, 0.03);">
            <strong style="font-size: 1.1em;">${skillName}</strong>
            ${skillDesc ? `<span style="font-size:var(--font-size-md); line-height: 1.4;">${skillDesc}</span>` : ''}
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

      const activePowers = ["Canalizar", "Aprimorar", "Invocar"].filter(p => (char.blasphemyPowers || []).includes(p));

      return `<div class="cain-blasphemy-card card-glass">
              <div class="cain-blasphemy-name">${b.name}</div>
              <div class="cain-blasphemy-desc">${b.desc}</div>
              ${b.passive ? `<div class="cain-blasphemy-passive" style="margin-top: 8px; font-weight: 600; padding: 6px; border-left: 2px solid var(--stamp-red); background: rgba(141,36,40,0.05); border-radius: 4px; line-height: 1.4;"><strong>Passiva:</strong> ${b.passive}</div>` : ''}
              ${activePowers.length ? `
                <div class="cain-blasphemy-powers" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px;">
                  <strong style="font-size: 0.9em; color: var(--stamp-red);">Poderes Selecionados:</strong>
                  <ul style="margin: 4px 0 0 0; padding-left: 16px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                    ${activePowers.map(powerName => {
        const customPower = b.powers?.find(p => p.name === powerName);
        const descTemplate = customPower
          ? customPower.desc
          : (powerName === "Canalizar" ? `Canalize o poder da ${b.name} para infligir dano ou criar um efeito imediato.` :
            powerName === "Aprimorar" ? `Aprimore uma ação existente usando o poder da ${b.name}.` :
              powerName === "Invocar" ? `Invoque um efeito duradouro da ${b.name} que persiste por uma cena.` : "");
        return `<li><strong>${powerName}</strong>: ${descTemplate}</li>`;
      }).join("")}
                  </ul>
                </div>
              ` : ''}
            </div>`;
    }).join("")
    : `<span class="cain-empty">${t("sheet.blasphemies.none")}</span>`;
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
    <div class="cain-kp-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px; background:rgba(255,255,255,0.02); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
      <div>
        KP: <strong style="color:var(--border-color); font-size:16px;">${kp}</strong>
        <button class="btn btn-xs btn-kp-adjust" data-action="dec" style="padding:1px 6px; margin-left:6px; background:rgba(255,255,255,0.1); color:white; border:none; border-radius:3px;">-</button>
        <button class="btn btn-xs btn-kp-adjust" data-action="inc" style="padding:1px 6px; background:rgba(255,255,255,0.1); color:white; border:none; border-radius:3px;">+</button>
      </div>
      <div>
        Scrip: <strong style="color:#fbbf24; font-size:16px;">${scrip}</strong>
        <button class="btn btn-xs btn-scrip-adjust" data-action="dec" style="padding:1px 6px; margin-left:6px; background:rgba(255,255,255,0.1); color:white; border:none; border-radius:3px;">-</button>
        <button class="btn btn-xs btn-scrip-adjust" data-action="inc" style="padding:1px 6px; background:rgba(255,255,255,0.1); color:white; border:none; border-radius:3px;">+</button>
      </div>
      <button class="btn btn-xs" id="btn-reset-mission" style="padding:4px 10px; background:var(--border-color); color:black; font-weight:bold; border:none; border-radius:3px;">Iniciar Missão (5 KP)</button>
    </div>

    <!-- Kit Padrão Quick Choose -->
    <div class="kit-options-container" style="background:rgba(255,255,255,0.01); padding:12px; border-radius:6px; margin-bottom:12px; border:1px dashed rgba(255,255,255,0.08);">
      <div style="font-weight:600; font-size:11px; margin-bottom:8px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Adicionar do Kit Padrão:</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:10px;">
        <button class="btn btn-sm btn-kit-opt" data-name="Uniforme Padrão" data-cost="0" style="text-align:left; font-size:11px; justify-content:space-between; display:flex; padding:6px 8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white;">
          <span>Uniforme Padrão (Colarinho, sapatos, broche)</span> <strong style="color:var(--text-muted);">0 KP</strong>
        </button>
        <button class="btn btn-sm btn-kit-opt" data-name="Caderno e Caneta" data-cost="1" style="text-align:left; font-size:11px; justify-content:space-between; display:flex; padding:6px 8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white;">
          <span>Caderno e Caneta</span> <strong style="color:var(--border-color);">1 KP</strong>
        </button>
        <button class="btn btn-sm btn-kit-opt" data-name="Caixa de Fósforos e Lenço" data-cost="1" style="text-align:left; font-size:11px; justify-content:space-between; display:flex; padding:6px 8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white;">
          <span>Fósforos (20 un) e Lenço limpo</span> <strong style="color:var(--border-color);">1 KP</strong>
        </button>
        <button class="btn btn-sm btn-kit-opt" data-name="Armas de Serviço" data-cost="2" style="text-align:left; font-size:11px; justify-content:space-between; display:flex; padding:6px 8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white;">
          <span>Armas de Serviço (Fogo CAT 0 & Branca)</span> <strong style="color:var(--border-color);">2 KP</strong>
        </button>
      </div>

      <!-- Add Custom Item -->
      <div style="display:flex; margin-top:8px; gap:6px; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
        <input type="text" id="custom-item-name" placeholder="Nome do item personalizado..." class="form-control" style="flex:1; font-size:11px; padding:6px 8px; height:28px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:4px;">
        <input type="number" id="custom-item-cost" placeholder="KP" min="0" max="5" value="1" class="form-control" style="width:50px; font-size:11px; padding:6px 8px; height:28px; text-align:center; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:4px;">
        <button class="btn btn-sm" id="btn-add-custom-item" style="padding:6px 12px; font-size:11px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; border-radius:4px; font-weight:bold;">+ Adicionar</button>
      </div>
    </div>

    <!-- Service Weapons upgrading option -->
    ${hasServiceWeapons ? `
    <div class="weapon-upgrade-container" style="background:rgba(251,191,36,0.03); padding:12px; border-radius:6px; margin-bottom:12px; border:1px solid rgba(251,191,36,0.15);">
      <div style="font-weight:600; font-size:12px; margin-bottom:4px; color:#fbbf24; display:flex; align-items:center; gap:6px;">
        ⚔️ Armas de Serviço (Armaria do CASTLE)
      </div>
      <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px; line-height:1.4;">
        Você pode escolher a estética das suas armas. Podem ser melhoradas em +1 CAT gastando 3 Scrips (máximo CAT 3).
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:11px; color:var(--text-secondary); min-width:60px;">Estética:</span>
          <input type="text" id="service-weapon-aesthetic" value="${weaponAesthetic}" placeholder="Ex: Revólver pesado e Faca tática..." class="form-control" style="flex:1; font-size:11px; padding:4px 8px; height:24px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:4px;">
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(251,191,36,0.08); padding-top:8px; margin-top:4px;">
          <span style="font-size:11px; color:var(--text-secondary);">Categoria Atual: <strong style="color:#fbbf24; font-size:12px;">CAT ${weaponCat}</strong></span>
          <button class="btn btn-xs" id="btn-upgrade-weapon" style="background:#fbbf24; color:black; font-weight:bold; border:none; padding:3px 10px; font-size:10px; border-radius:3px; cursor:pointer;" ${weaponCat >= 3 ? "disabled" : ""}>
            ${weaponCat >= 3 ? 'Máximo Atingido (CAT 3)' : 'Melhorar (+1 CAT | Custo: 3 Scrip)'}
          </button>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Equipped list -->
    <div style="font-weight:600; font-size:11px; margin-bottom:8px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Itens Equipados na Missão:</div>
    <div class="cain-equipped-items-list" style="display:flex; flex-direction:column; gap:6px;">
      ${equipment.length
      ? equipment.map((eq, index) =>
        `<div class="cain-equip-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(0,0,0,0.2); border-radius:4px; border-left:3px solid ${eq.name === "Armas de Serviço" ? "#fbbf24" : "var(--border-color)"};">
              <div>
                <span class="cain-equip-name" style="font-weight:500;">${eq.name}</span>
                ${eq.name === "Armas de Serviço" ? `<div style="font-size:10px; color:var(--text-muted); margin-top:2px;">CAT ${eq.cat || 0} • ${eq.aesthetic || "Padrão"}</div>` : ""}
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="cain-equip-cost" style="font-size:10px; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${eq.kpCost} KP</span>
                <button class="btn-remove-item" data-index="${index}" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:14px; padding:0 4px; line-height:1;">&times;</button>
              </div>
            </div>`
      ).join("")
      : `<span class="cain-empty">${t("sheet.equipment.none")}</span>`}
    </div>
  `;

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
    const costInput = el.equipmentListSheet.querySelector("#custom-item-cost");
    const name = nameInput.value.trim();
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
    char.equipment.push({ name, kpCost: cost });

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
  el.equipmentListSheet.querySelectorAll(".btn-remove-item").forEach(btn => {
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

  const current = char.psycheBursts !== undefined ? char.psycheBursts : 3;
  group.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
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

  let sinLimit = 10 - 2 * sinMarksCount - 1 * extraBlasphemies;
  if (hasAliena) {
    sinLimit += 2;
  }
  sinLimit = Math.max(0, Math.min(10, sinLimit));

  group.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
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
