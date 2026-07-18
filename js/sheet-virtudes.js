import { state, saveCurrentCharacter } from "./state.js";
import { openVirtudesModal } from "./modals.js";
import { t } from "./i18n.js";

let VIRTUES_DATA = [];

async function loadVirtuesData() {
  if (VIRTUES_DATA.length > 0) return;
  const lang = localStorage.getItem("cain_lang") || "pt";
  const file = lang === "en" ? "data/en/virtues.json" : "data/virtues.json";
  try {
    const res = await fetch(file);
    const json = await res.json();
    if (lang === "en") {
      VIRTUES_DATA = json.virtues.map(v => ({
        id: v.id,
        name: v.name,
        title: v.title,
        img: "",
        desc: v.desc,
        strictures: v.bond.strictures.join(" "),
        bond0: v.bond.abilities["0"],
        bond1: v.bond.abilities["I"],
        bond2: v.bond.abilities["II"],
        bond3: v.bond.abilities["III"],
        highBlasphemy: ""
      }));
    } else {
      VIRTUES_DATA = Object.entries(json).map(([id, v]) => ({
        id,
        name: v.name,
        title: v.title,
        img: "",
        desc: v.desc,
        strictures: v.bond.strictures.join(" "),
        bond0: v.bond.abilities["0"],
        bond1: v.bond.abilities["I"],
        bond2: v.bond.abilities["II"],
        bond3: v.bond.abilities["III"],
        highBlasphemy: ""
      }));
    }
  } catch (e) {
    console.error("Failed to load virtues data", e);
  }
}

loadVirtuesData();

export function renderVirtudesSheet() {

  const char = state.currentCharacter;
  if (!char) return;
  if (!char.virtudes) {
    char.virtudes = {};
  }

  const container = document.getElementById("virtudes-container");
  if (!container) return;

  const lang = localStorage.getItem("cain_lang") || "pt";

  const virtudeIds = Object.keys(char.virtudes);
  const selectedVirtueId = virtudeIds.length > 0 ? virtudeIds[0] : null;
  const selectedVirtue = selectedVirtueId ? VIRTUES_DATA.find(v => v.id === selectedVirtueId) : null;

  let html = `<div class="virtude-header-bar">
    <h3 class="section-title" style="margin:0;">${t("sheet.virtues.title")}</h3>
    <button id="btn-manage-virtudes" class="btn btn-sm btn-secondary"style="color:black" >${t("sheet.virtues.manage")}</button>
  </div>`;

  if (selectedVirtue) {
    const bond = char.virtudes[selectedVirtueId]?.bond ?? 0;
    html += `
      <div class="card-glass virtude-card virtude-bonded">
        <div class="virtude-header">
          <span class="virtude-icon">✦</span>
          <h4 class="virtude-name virtue-color-${selectedVirtue.id}">${selectedVirtue.name}</h4>
          ${selectedVirtue.title ? `<span class="virtude-title">${selectedVirtue.title}</span>` : ""}
        </div>
        <div class="virtude-bond-track" style="margin-top: 12px;">
          <label><strong>${t("sheet.virtues.bond")}:</strong></label>
          <div class="bond-levels" data-virtude-id="${selectedVirtue.id}" style="--virtue-active-color: ${{prudence:'#0b78f1',hope:'#9d00fd',fortitude:'#f10b0b',charity:'#e30bf1',faith:'#fdc739',justice:'#90fdee'}[selectedVirtue.id] || 'var(--color-rust-glow)'}">
            ${[[0,"0"],[1,"I"],[2,"II"],[3,"III"]].map(([lvl, label]) => `
              <button class="bond-level-btn ${bond === lvl ? 'active' : ''}" data-bond-level="${lvl}">${label}</button>
            `).join("")}
          </div>
        </div>
        <div class="virtude-benefits">
          <div class="benefit ${bond >= 0 ? 'unlocked' : ''}">
            <span class="benefit-level">0:</span> ${selectedVirtue.bond0}
          </div>
          <div class="benefit ${bond >= 1 ? 'unlocked' : ''}">
            <span class="benefit-level">I:</span> ${selectedVirtue.bond1}
          </div>
          <div class="benefit ${bond >= 2 ? 'unlocked' : ''}">
            <span class="benefit-level">II:</span> ${selectedVirtue.bond2}
          </div>
          <div class="benefit ${bond >= 3 ? 'unlocked' : ''}">
            <span class="benefit-level">III:</span> ${selectedVirtue.bond3}
          </div>
        </div>
      </div>`;
  } else if (VIRTUES_DATA.length > 0) {
    html += `<div class="text-secondary-md" style="padding: 20px; text-align: center; color: var(--ink-faded);">
      ${t("sheet.virtues.empty")}
    </div>`;
  }

  container.innerHTML = html;

  const btnManage = document.getElementById("btn-manage-virtudes");
  if (btnManage) {
    btnManage.onclick = () => openVirtudesModal();
  }

  container.querySelectorAll(".bond-level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const virtudeId = btn.closest("[data-virtude-id]").getAttribute("data-virtude-id");
      const level = parseInt(btn.getAttribute("data-bond-level"));
      if (!char.virtudes[virtudeId]) {
        char.virtudes[virtudeId] = { bond: 0 };
      }
      char.virtudes[virtudeId].bond = level;
      saveCurrentCharacter();
      renderVirtudesSheet();
    });
  });
}
