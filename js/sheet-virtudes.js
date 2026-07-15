import { state, saveCurrentCharacter } from "./state.js";
import { openVirtudesModal } from "./modals.js";

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
    <h3 class="section-title" style="margin:0;">${lang === "pt" ? "VIRTUDES" : "VIRTUES"}</h3>
    <button id="btn-manage-virtudes" class="btn btn-sm btn-secondary">${lang === "pt" ? "Gerenciar" : "Manage"}</button>
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
        <div class="virtude-bond-track">
          <label>${lang === "pt" ? "Vínculo:" : "Bond:"}</label>
          <div class="bond-stars" data-virtude-id="${selectedVirtue.id}">
            ${[0, 1, 2, 3].map(lvl => `
              <span class="bond-star ${lvl <= bond ? 'filled' : ''}" data-bond-level="${lvl}">★</span>
            `).join("")}
          </div>
          <span class="bond-value">${bond}/3</span>
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
      ${lang === "pt" ? "Nenhuma virtude selecionada. Clique em Gerenciar para escolher uma." : "No virtue selected. Click Manage to choose one."}
    </div>`;
  }

  container.innerHTML = html;

  const btnManage = document.getElementById("btn-manage-virtudes");
  if (btnManage) {
    btnManage.onclick = () => openVirtudesModal();
  }

  container.querySelectorAll(".bond-star").forEach(star => {
    star.addEventListener("click", () => {
      const virtudeId = star.closest("[data-virtude-id]").getAttribute("data-virtude-id");
      const level = parseInt(star.getAttribute("data-bond-level"));
      if (!char.virtudes[virtudeId]) {
        char.virtudes[virtudeId] = { bond: 0 };
      }
      if (char.virtudes[virtudeId].bond === level) {
        char.virtudes[virtudeId].bond = level > 0 ? level - 1 : 0;
      } else {
        char.virtudes[virtudeId].bond = level;
      }
      saveCurrentCharacter();
      renderVirtudesSheet();
    });
  });
}
