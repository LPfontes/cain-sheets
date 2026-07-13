/* js/sheet-equipment.js - Loja de Equipamento e Inventário */

import { el, state, saveCurrentCharacter } from "./state.js";
import { EQUIPMENT_BY_KP, CONFORTO_CARREIRA, OCULTO_MEDICO, KITS, ESTETICOS, POSSES } from "./cain-data.js";
import { t } from "./i18n.js";
import { esc } from "./screen-utils.js";

let activeEquipTab = "kp";

export function renderEquipmentSheet() {
  const char = state.currentCharacter;
  if (!char || !el.equipmentListSheet) return;

  const equipment = char.equipment || [];
  const kp = char.kitPoints !== undefined ? char.kitPoints : 5;
  const scrip = char.scrip !== undefined ? char.scrip : 0;

  // Render original top bar & equipped items list in el.equipmentListSheet
  el.equipmentListSheet.innerHTML = `
    <!-- Top summary bar -->
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
      <button id="btn-reset-mission" class="btn">Iniciar Missão (5 KP)</button>
    </div>

    <!-- Button to open store modal -->
    <button id="btn-open-equipment-store" class="btn btn-landing-primary" style="width: 100%; margin: 12px 0 6px 0; font-size: 14px; font-weight: bold; text-transform: uppercase;">
    Abrir Loja de Equipamentos
    </button>
  `;

  const equippedContainer = document.getElementById("equipped-items-list-sheet");
  if (equippedContainer) {
    equippedContainer.innerHTML = `
      <div class="cain-equipped-items-container">
        <div class="cain-equipped-items-title">Itens Equipados na Missão:</div>
        <div class="cain-equipped-items-list" style="max-height: 250px; overflow-y: auto;">
          ${equipment.length
            ? equipment.map((eq, index) => {
              let currencyText = eq.scripCost ? `${eq.scripCost} Scrip` : `${eq.kpCost || 0} KP`;
              return `<div class="cain-equip-item ${eq.name === "Armas de Serviço" ? "service-weapon" : "normal-item"}">
                  <div style="text-align:left;">
                    <span class="cain-equip-name">${eq.name}</span>
                    ${eq.name === "Armas de Serviço" ? `<div class="cain-equip-meta">CAT ${eq.cat || 0} • ${eq.aesthetic || "Padrão"}</div>` : (eq.desc ? `<div class="cain-equip-meta">${eq.desc}</div>` : "")}
                  </div>
                  <div class="cain-equip-right">
                    <span class="cain-equip-cost">${currencyText}</span>
                    <button class="btn-remove-item" data-index="${index}">&times;</button>
                  </div>
                </div>`;
            }).join("")
            : `<span class="cain-empty" style="font-size:11px; color:var(--text-muted);">${t("sheet.equipment.none")}</span>`}
        </div>
      </div>
    `;
  }

  // Attach button click for open equipment store
  el.equipmentListSheet.querySelector("#btn-open-equipment-store")?.addEventListener("click", () => {
    openEquipmentStoreModal();
  });

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

  // Reset Mission
  el.equipmentListSheet.querySelector("#btn-reset-mission")?.addEventListener("click", () => {
    if (confirm("Resetar missão? Isso redefinirá seus pontos de Kit para 5 e removerá todos os itens equipados temporários.")) {
      char.kitPoints = 5;
      char.equipment = [];
      saveCurrentCharacter();
      renderEquipmentSheet();
    }
  });

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
}

export function openEquipmentStoreModal() {
  const char = state.currentCharacter;
  if (!char) return;

  el.modalContainer.classList.remove("hidden");
  el.modalBody.parentElement.classList.add("wide-modal");

  renderStoreModalContent();
}

function renderStoreModalContent() {
  const char = state.currentCharacter;
  if (!char) return;

  const equipment = char.equipment || [];
  const kp = char.kitPoints !== undefined ? char.kitPoints : 5;
  const scrip = char.scrip !== undefined ? char.scrip : 0;

  // Check if character already has service weapons equipped
  const serviceWeaponIndex = equipment.findIndex(eq => eq.name === "Armas de Serviço");
  const hasServiceWeapons = serviceWeaponIndex !== -1;
  const serviceWeapon = hasServiceWeapons ? equipment[serviceWeaponIndex] : null;
  const weaponCat = serviceWeapon ? (serviceWeapon.cat || 0) : 0;
  const weaponAesthetic = serviceWeapon ? (serviceWeapon.aesthetic || "Pistola de Serviço & Faca Tática") : "";

  let tabContent = "";
  if (activeEquipTab === "kp") {
    tabContent = `
      <div class="kit-options-container">
        <div class="kit-options-title">Adicionar do Kit Padrão:</div>
        <div class="kit-options-grid">
          <button class="btn-kit-opt" data-name="Uniforme Padrão" data-cost="0">
            <strong>Uniforme Padrão</strong>
            <span>Colarinho, sapatos, broche</span>
            <span class="btn-kit-opt-cost-free">0 KP</span>
          </button>
          <button class="btn-kit-opt" data-name="Caderno e Caneta" data-cost="1">
            <strong>Caderno e Caneta</strong>
            <span>Anotações de campo</span>
            <span class="btn-kit-opt-cost">1 KP</span>
          </button>
          <button class="btn-kit-opt" data-name="Caixa de Fósforos e Lenço" data-cost="1">
            <strong>Fósforos e Lenço</strong>
            <span>Fósforos (20 un) e Lenço limpo</span>
            <span class="btn-kit-opt-cost">1 KP</span>
          </button>
          <button class="btn-kit-opt" data-name="Armas de Serviço" data-cost="2">
            <strong>Armas de Serviço</strong>
            <span>Fogo CAT 0 & Branca</span>
            <span class="btn-kit-opt-cost">2 KP</span>
          </button>
        </div>
      </div>
    `;

    if (hasServiceWeapons) {
      tabContent += `
        <div class="weapon-upgrade-container" style="margin-top: 12px;">
          <div class="weapon-upgrade-title">
            <span>Aprimoramento de Armas (CAT ${weaponCat})</span>
            <span style="font-size: 10px; color: var(--text-muted); margin-left: auto;">Scrip: ${scrip}</span>
          </div>
          <div class="weapon-upgrade-form" style="margin-top: 8px;">
            <div class="weapon-upgrade-field">
              <span class="weapon-upgrade-label">Estética</span>
              <input type="text" id="service-weapon-aesthetic" class="weapon-upgrade-input" value="${esc(weaponAesthetic)}" placeholder="Ex: Revólver Cromado & Adaga de Osso">
            </div>
            <button id="btn-upgrade-weapon" class="btn btn-sm" style="margin-top: 4px;" ${weaponCat >= 3 ? "disabled" : ""}>
              ${weaponCat >= 3 ? "Melhoria Máxima" : "Melhorar Categoria (3 Scrip)"}
            </button>
          </div>
        </div>
      `;
    }
  } else if (activeEquipTab === "aquisicao") {
    let itemsHtml = "";
    Object.entries(EQUIPMENT_BY_KP).forEach(([kpCost, items]) => {
      items.forEach(item => {
        itemsHtml += `
          <div class="cain-equip-shop-item">
            <div class="cain-equip-shop-info">
              <span class="cain-equip-shop-name">${item.name}</span>
              <div class="cain-equip-shop-desc">${item.desc || ""}</div>
            </div>
            <button class="btn btn-sm btn-buy-equip btn-landing-primary" data-name="${esc(item.name)}" data-desc="${esc(item.desc || "")}" data-cost="${kpCost}" data-currency="kp">
              Equipar (${kpCost} KP)
            </button>
          </div>
        `;
      });
    });
    tabContent = `
      <div class="cain-equip-shop-content"">
        ${itemsHtml || '<p style="font-size:11px; color:var(--text-muted);">Nenhum item disponível.</p>'}
      </div>
    `;
  } else if (activeEquipTab === "esteticos") {
    let itemsHtml = ESTETICOS.map(item => `
      <div class="cain-equip-shop-item">
        <div class="cain-equip-shop-info">
          <span class="cain-equip-shop-name">${item.name}</span>
          <div class="cain-equip-shop-desc">${item.desc}</div>
        </div>
        <button class="btn btn-sm btn-buy-equip btn-landing-primary" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
          Comprar (${item.cost} Scrip)
        </button>
      </div>
    `).join("");
    tabContent = `
      <div class="cain-equip-shop-content">
        ${itemsHtml || '<p style="font-size:11px; color:var(--text-muted);">Nenhum item disponível.</p>'}
      </div>
    `;
  } else if (activeEquipTab === "conforto") {
    let itemsHtml = CONFORTO_CARREIRA.map(item => `
      <div class="cain-equip-shop-item">
        <div class="cain-equip-shop-info">
          <span class="cain-equip-shop-name">${item.name}</span>
          <div class="cain-equip-shop-desc">${item.desc}</div>
        </div>
        <button class="btn btn-sm btn-buy-equip btn-landing-primary" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
          Comprar (${item.cost} Scrip)
        </button>
      </div>
    `).join("");
    tabContent = `
      <div style="max-height: 250px; overflow-y: auto; padding-right:4px;">
        ${itemsHtml || '<p style="font-size:11px; color:var(--text-muted);">Nenhum item disponível.</p>'}
      </div>
    `;
  } else if (activeEquipTab === "oculto") {
    let itemsHtml = OCULTO_MEDICO.map(item => `
      <div class="cain-equip-shop-item">
        <div class="cain-equip-shop-info">
          <span class="cain-equip-shop-name">${item.name}</span>
          <div class="cain-equip-shop-desc">${item.desc} (PK: ${item.pk || 0})</div>
        </div>
        <button class="btn btn-sm btn-buy-equip btn-landing-primary" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
          Comprar (${item.cost} Scrip)
        </button>
      </div>
    `).join("");
    tabContent = `
      <div class="cain-equip-shop-content">
        ${itemsHtml || '<p style="font-size:11px; color:var(--text-muted);">Nenhum item disponível.</p>'}
      </div>
    `;
  } else if (activeEquipTab === "kits") {
    let itemsHtml = KITS.map(item => `
      <div class="cain-equip-shop-item">
        <div class="cain-equip-shop-info">
          <span class="cain-equip-shop-name">${item.name}</span>
          <div class="cain-equip-shop-desc">${item.desc}</div>
        </div>
        <button class="btn btn-sm btn-buy-equip btn-landing-primary" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost || 1}" data-currency="kp">
          Equipar (${item.cost || 1} KP)
        </button>
      </div>
    `).join("");
    tabContent = `
      <div class="cain-equip-shop-content">
        ${itemsHtml || '<p style="font-size:11px; color:var(--text-muted);">Nenhum item disponível.</p>'}
      </div>
    `;
  } else if (activeEquipTab === "posses") {
    let itemsHtml = POSSES.map(item => `
      <div class="cain-equip-shop-item">
        <div class="cain-equip-shop-info">
          <span class="cain-equip-shop-name">${item.name}</span>
          <div class="cain-equip-shop-desc">${item.desc}</div>
        </div>
        <button class="btn btn-sm btn-buy-equip btn-landing-primary" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
          Comprar (${item.cost} Scrip)
        </button>
      </div>
    `).join("");
    tabContent = `
      <div class="cain-equip-shop-content">
        ${itemsHtml || '<p style="font-size:11px; color:var(--text-muted);">Nenhum item disponível.</p>'}
      </div>
    `;
  } else if (activeEquipTab === "custom") {
    tabContent = `
      <div class="custom-item-form-container">
        <div class="kit-options-title" style="font-size: 14px; text-transform: none;">Criar Item Customizado</div>
        <div class="custom-item-field">
          <label>Nome do Item</label>
          <input type="text" id="custom-item-name" placeholder="Ex: Medalhão da Sorte" class="custom-item-name-input" style="width:100%; box-sizing:border-box;">
        </div>
        <div class="custom-item-field">
          <label>Descrição</label>
          <input type="text" id="custom-item-desc" placeholder="Ex: Dá +1 em rolagens..." class="custom-item-desc-input" style="width:100%; box-sizing:border-box;">
        </div>
        <div class="custom-item-field-row">
          <div class="custom-item-field" style="flex: 1;">
            <label>Custo em KP</label>
            <input type="number" id="custom-item-cost" min="0" max="10" value="1" class="custom-item-cost-input" style="width:100%; box-sizing:border-box;">
          </div>
          <button id="btn-add-custom-item" style="flex: 1; height: 30px;">Criar e Equipar</button>
        </div>
      </div>
    `;
  }

  el.modalBody.innerHTML = `
    <h3 class="modal-title">Loja de Equipamentos</h3>
    <p class="text-secondary-md" style="margin-bottom: 12px;">Compre itens estéticos e posses usando seus Scrips ou equipe ferramentas de Castle usando Kit Points (KP).</p>

    <!-- Top summary bar inside modal -->
    <div class="cain-kp-row" style="margin-bottom: 12px; justify-content: flex-start; gap: 16px;">
      <div class="cain-kp-col">
        KP Disponível: <span class="cain-kp-value">${kp}</span>
      </div>
      <div class="cain-kp-col">
        Scrip Disponível: <span class="cain-scrip-value">${scrip}</span>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="cain-equip-tabs">
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "kp" ? "active" : ""}" data-tab="kp">Padrão</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "aquisicao" ? "active" : ""}" data-tab="aquisicao">Equipamentos</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "esteticos" ? "active" : ""}" data-tab="esteticos">Estéticos</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "conforto" ? "active" : ""}" data-tab="conforto">Conforto</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "oculto" ? "active" : ""}" data-tab="oculto">Oculto</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "kits" ? "active" : ""}" data-tab="kits">Kits</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "posses" ? "active" : ""}" data-tab="posses">Posses</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "custom" ? "active" : ""}" data-tab="custom">Custom</button>
    </div>

    <div class="cain-equip-col-left-split">
      ${tabContent}
    </div>

    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <button class="btn btn-secondary modal-close">Fechar Loja</button>
    </div>
  `;

  // Attach tab switching events
  el.modalBody.querySelectorAll(".btn-equip-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeEquipTab = btn.getAttribute("data-tab");
      renderStoreModalContent();
    });
  });

  // Attach buy/equip shop events
  el.modalBody.querySelectorAll(".btn-buy-equip").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const desc = btn.getAttribute("data-desc") || "";
      const cost = parseInt(btn.getAttribute("data-cost")) || 0;
      const currency = btn.getAttribute("data-currency");

      if (currency === "kp") {
        if (kp < cost) {
          alert("Pontos de Kit (KP) insuficientes para equipar este item!");
          return;
        }
        if (equipment.some(eq => eq.name === name)) {
          alert("Você já equipou este item!");
          return;
        }
        char.kitPoints = kp - cost;
        if (!char.equipment) char.equipment = [];
        char.equipment.push({ name, desc, kpCost: cost });
      } else {
        if (scrip < cost) {
          alert("Scrip insuficiente para comprar este item!");
          return;
        }
        if (equipment.some(eq => eq.name === name)) {
          alert("Você já possui este item!");
          return;
        }
        char.scrip = scrip - cost;
        if (!char.equipment) char.equipment = [];
        char.equipment.push({ name, desc, kpCost: 0, scripCost: cost });
      }

      saveCurrentCharacter();
      renderEquipmentSheet();
      renderStoreModalContent();
    });
  });

  // Standard options click
  el.modalBody.querySelectorAll(".btn-kit-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const cost = parseInt(btn.getAttribute("data-cost"));

      if (kp < cost) {
        alert("Pontos de Kit (KP) insuficientes para equipar este item!");
        return;
      }

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
      renderStoreModalContent();
    });
  });

  // Upgrade Service Weapon
  if (hasServiceWeapons) {
    const aestheticInput = el.modalBody.querySelector("#service-weapon-aesthetic");
    aestheticInput?.addEventListener("change", () => {
      if (serviceWeapon) {
        serviceWeapon.aesthetic = aestheticInput.value.trim();
        saveCurrentCharacter();
        renderEquipmentSheet();
      }
    });

    el.modalBody.querySelector("#btn-upgrade-weapon")?.addEventListener("click", () => {
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
      renderStoreModalContent();
    });
  }

  // Add Custom Item
  el.modalBody.querySelector("#btn-add-custom-item")?.addEventListener("click", () => {
    const nameInput = el.modalBody.querySelector("#custom-item-name");
    const descInput = el.modalBody.querySelector("#custom-item-desc");
    const costInput = el.modalBody.querySelector("#custom-item-cost");
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
    renderStoreModalContent();
  });
}

export function renderInventorySheet() { }
