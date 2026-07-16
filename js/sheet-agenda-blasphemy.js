/* js/sheet-agenda-blasphemy.js - Agendas e Blasphemias */

import { el, state, saveCurrentCharacter } from "./state.js";
import { AGENDAS, BLASPHEMIES } from "./cain-data.js";
import { openAgendaModal, openBlasphemiesModal } from "./modals.js";
import { t } from "./i18n.js";

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
    position:fixed;z-index:1310;
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
                ${b.img ? `<img class="cain-blasphemy-card-thumb" src="${b.img}" alt="${b.name}">` : ''}
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
      const power = b?.powers?.find(p => p.name === pName);
      if (power) showPowerDetailPopup(power);
    });
  });
}

export function renderMutationsSheet() { }
