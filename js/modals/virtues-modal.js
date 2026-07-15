import { el, state, saveCurrentCharacter } from "../state.js";
import { logger } from "../logger.js";
import { renderVirtudesSheet } from "../sheet.js";

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
        desc: v.desc,
        likes: v.likes,
        dislikes: v.dislikes,
        favorite_food: v.favorite_food,
        strictures: v.bond.strictures,
        abilities: v.bond.abilities
      }));
    } else {
      VIRTUES_DATA = Object.entries(json).map(([id, v]) => ({
        id,
        name: v.name,
        title: v.title,
        desc: v.desc,
        likes: v.likes,
        dislikes: v.dislikes,
        favorite_food: v.favorite_food,
        strictures: v.bond.strictures,
        abilities: v.bond.abilities
      }));
    }
  } catch (e) {
    console.error("Failed to load virtues data", e);
  }
}

export async function openVirtudesModal() {
  await loadVirtuesData();

  const char = state.currentCharacter;
  if (!char) return;

  logger.info("Modal: Abrindo modal de Gerenciar Virtudes.");

  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.parentElement;
  modalContent.classList.add("wide-modal");

  if (!char.virtudes) char.virtudes = {};

  const currentVirtueId = Object.keys(char.virtudes)[0] || null;
  let tempVirtudes = currentVirtueId ? { [currentVirtueId]: { ...char.virtudes[currentVirtueId] } } : {};
  let activeVirtueId = currentVirtueId || VIRTUES_DATA[0]?.id || null;

  let dragState = null;
  const onDragMove = (clientX, clientY) => {
    if (!dragState) return;
    modalContent.style.setProperty("position", "fixed", "important");
    modalContent.style.left = (dragState.origLeft + clientX - dragState.startX) + "px";
    modalContent.style.top = (dragState.origTop + clientY - dragState.startY) + "px";
    modalContent.style.right = "auto";
    modalContent.style.bottom = "auto";
  };
  const onDragEnd = () => {
    if (!dragState) return;
    dragState = null;
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDragMove);
    document.removeEventListener("touchend", onDragEnd);
  };
  const onDragStart = (clientX, clientY) => {
    const rect = modalContent.getBoundingClientRect();
    dragState = { startX: clientX, startY: clientY, origLeft: rect.left, origTop: rect.top };
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
    document.addEventListener("touchmove", onDragMove, { passive: false });
    document.addEventListener("touchend", onDragEnd);
  };
  modalContent.addEventListener("mousedown", (e) => {
    const title = e.target.closest(".modal-title");
    if (!title || e.target.closest("button")) return;
    e.preventDefault();
    onDragStart(e.clientX, e.clientY);
  });
  modalContent.addEventListener("touchstart", (e) => {
    const title = e.target.closest(".modal-title");
    if (!title || e.target.closest("button")) return;
    onDragStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  const observer = new MutationObserver(() => {
    if (el.modalContainer.classList.contains("hidden")) {
      dragState = null;
      modalContent.style.position = "";
      modalContent.style.left = "";
      modalContent.style.top = "";
      modalContent.style.right = "";
      modalContent.style.bottom = "";
      observer.disconnect();
    }
  });
  observer.observe(el.modalContainer, { attributes: true, attributeFilter: ["class"] });

  const closeModal = () => {
    el.modalContainer.classList.add("hidden");
    el.modalBody.parentElement.classList.remove("wide-modal");
  };

  const renderModalContent = () => {
    const activeV = VIRTUES_DATA.find(v => v.id === activeVirtueId) || VIRTUES_DATA[0];
    const bond = activeV ? (tempVirtudes[activeV.id]?.bond ?? 0) : 0;
    const lang = localStorage.getItem("cain_lang") || "pt";

    el.modalBody.innerHTML = `
      <h3 class="modal-title">${lang === "pt" ? "Gerenciar Virtudes" : "Manage Virtues"}</h3>
      <div class="modal-split-layout">
        <div class="modal-grid-col">
          ${VIRTUES_DATA.map(v => {
            const active = v.id === activeVirtueId;
            const vbond = tempVirtudes[v.id]?.bond ?? 0;
            return `
              <div class="blasphemy-grid-card ${active ? 'active' : ''} ${vbond > 0 ? 'owned' : ''}" data-id="${v.id}">
                <div class="blasphemy-card-img-wrapper">
                  <img src="assets/viculos/${v.id.toUpperCase()}.webp" alt="${v.name}">
                </div>
                <div class="blasphemy-card-info">
                  <span class="blasphemy-card-name virtue-color-${v.id}">${v.name}</span>
                  ${v.title ? `<span class="blasphemy-card-subname">${v.title}</span>` : ""}
                </div>
                ${vbond > 0 ? `<span class="blasphemy-card-check">✦${vbond}</span>` : ""}
              </div>
            `;
          }).join("")}
        </div>

        <div class="modal-detail-panel">
          ${activeV ? `
            <div class="modal-detail-header">
              <div class="modal-detail-img-wrapper">
                <img src="assets/viculos/${activeV.id.toUpperCase()}.webp" alt="${activeV.name}">
              </div>
              <div class="modal-detail-info">
                <div class="modal-detail-header-content">
                  <h4 class="modal-detail-title virtue-color-${activeV.id}">${activeV.name}</h4>
                  ${activeV.title ? `<div class="modal-detail-subtitle virtue-color-${activeV.id}">${activeV.title}</div>` : ""}
                </div>
                <div class="modal-detail-desc" style="margin-bottom: 12px;">
                  ${activeV.desc ? activeV.desc.split("\n\n").map(p => `<p style="margin-bottom: 8px;">${p}</p>`).join("") : ""}
                </div>

            ${activeV.likes ? `
            <div class="virtude-detail-section">
              <strong>${lang === "pt" ? "Gosta:" : "Likes:"}</strong>
              <span>${activeV.likes.join(", ")}</span>
            </div>` : ""}

            ${activeV.dislikes ? `
            <div class="virtude-detail-section">
              <strong>${lang === "pt" ? "Não Gosta:" : "Dislikes:"}</strong>
              <span>${activeV.dislikes.join(", ")}</span>
            </div>` : ""}

            ${activeV.favorite_food ? `
            <div class="virtude-detail-section">
              <strong>${lang === "pt" ? "Comida Favorita:" : "Favorite Food:"}</strong>
              <span>${activeV.favorite_food.join(", ")}</span>
            </div>` : ""}

            ${activeV.strictures ? `
            <div class="virtude-detail-section">
              <strong>${lang === "pt" ? "Restrições:" : "Strictures:"}</strong>
              <ul style="margin: 4px 0 0 0; padding-left: 16px;">
                ${activeV.strictures.map(s => `<li>${s}</li>`).join("")}
              </ul>
            </div>` : ""}

            <div class="virtude-bond-track" style="margin-top: 12px;">
              <label><strong>${lang === "pt" ? "Vínculo:" : "Bond:"}</strong></label>
              <div class="bond-stars" data-virtude-id="${activeV.id}">
                ${[0, 1, 2, 3].map(lvl => `
                  <span class="bond-star ${lvl <= bond ? 'filled' : ''}" data-bond-level="${lvl}">★</span>
                `).join("")}
              </div>
              <span class="bond-value">${bond}/3</span>
            </div>

            <div class="virtude-benefits" style="margin-top: 12px;">
              ${activeV.abilities ? Object.entries(activeV.abilities).map(([level, desc]) => {
                const lvlNum = level === "0" ? 0 : level === "I" ? 1 : level === "II" ? 2 : 3;
                return `
                  <div class="benefit ${bond >= lvlNum ? 'unlocked' : ''}" style="margin-bottom: 6px;">
                    <span class="benefit-level">${level}:</span> ${desc}
                  </div>
                `;
              }).join("") : ""}
            </div>
          ` : `<p style="color: var(--text-muted); padding: 20px; text-align: center;">${lang === "pt" ? "Selecione uma virtude." : "Select a virtue."}</p>`}
        </div>
      </div>
     </div>

</div>
      <div class="modal-action-footer">
        <button id="btn-virtudes-modal-cancel" class="btn btn-md btn-secondary">${lang === "pt" ? "Cancelar" : "Cancel"}</button>
        <button id="btn-virtudes-modal-save" class="btn btn-md btn-blasphemy-save">${lang === "pt" ? "Salvar" : "Save"}</button>
      </div>
    `;

    const gridCol = el.modalBody.querySelector(".modal-grid-col");
    if (gridCol && window._virtueGridScroll != null) {
      gridCol.scrollTop = window._virtueGridScroll;
    }

    el.modalBody.querySelectorAll(".blasphemy-grid-card").forEach(card => {
      card.addEventListener("click", () => {
        const grid = el.modalBody.querySelector(".modal-grid-col");
        window._virtueGridScroll = grid ? grid.scrollTop : 0;
        activeVirtueId = card.getAttribute("data-id");
        // Selecting a virtue sets it as the only one
        tempVirtudes = { [activeVirtueId]: tempVirtudes[activeVirtueId] || { bond: 0 } };
        renderModalContent();
      });
    });

    el.modalBody.querySelectorAll(".bond-star").forEach(star => {
      star.addEventListener("click", () => {
        const virtudeId = star.closest("[data-virtude-id]").getAttribute("data-virtude-id");
        const level = parseInt(star.getAttribute("data-bond-level"));
        if (!tempVirtudes[virtudeId]) {
          tempVirtudes[virtudeId] = { bond: 0 };
        }
        if (tempVirtudes[virtudeId].bond === level) {
          tempVirtudes[virtudeId].bond = level > 0 ? level - 1 : 0;
        } else {
          tempVirtudes[virtudeId].bond = level;
        }
        renderModalContent();
      });
    });

    document.getElementById("btn-virtudes-modal-cancel").onclick = closeModal;

    document.getElementById("btn-virtudes-modal-save").onclick = () => {
      // Ensure only the selected virtue is saved
      char.virtudes = activeVirtueId ? { [activeVirtueId]: tempVirtudes[activeVirtueId] || { bond: 0 } } : {};
      saveCurrentCharacter();
      renderVirtudesSheet();
      closeModal();
    };
  };

  renderModalContent();
}
