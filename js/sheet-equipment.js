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
      <button id="btn-reset-mission" class="btn">${t("sheet.equipment.shop.reset_btn")}</button>
    </div>

    <!-- Button to open store modal -->
    <button id="btn-open-equipment-store" class="btn btn-landing-primary" style="width: 100%; margin: 12px 0 6px 0; font-size: 14px; font-weight: bold; text-transform: uppercase;">
    ${t("sheet.equipment.shop.open_btn")}
    </button>
  `;

  const equippedContainer = document.getElementById("equipped-items-list-sheet");
  if (equippedContainer) {
    equippedContainer.innerHTML = `
      <div class="cain-equipped-items-container">
        <div class="cain-equipped-items-title">${t("sheet.equipment.shop.equipped_title")}</div>
        <div class="cain-equipped-items-list" style="max-height: 250px; overflow-y: auto;">
          ${equipment.length
        ? equipment.map((eq, index) => {
          let currencyText = eq.scripCost ? `${eq.scripCost} Scrip` : `${eq.kpCost || 0} KP`;
          const displayName = t(`equipment.items.${eq.name}`);
          const displayDesc = t(`equipment.items.desc.${eq.name}`);
          const descText = eq.name === "Armas de Serviço"
            ? `CAT ${eq.cat || 0} • ${eq.aesthetic || t("equipment.items.desc.Armas de Serviço") || "Padrão"}`
            : (displayDesc && displayDesc !== `equipment.items.desc.${eq.name}` ? displayDesc : eq.desc || "");
          return `<div class="cain-equip-item ${eq.name === "Armas de Serviço" ? "service-weapon" : "normal-item"}">
                  <div style="text-align:left;">
                    <span class="cain-equip-name">${displayName}</span>
                    ${eq.name === "Armas de Serviço" ? `<div class="cain-equip-meta">${descText}</div>` : (descText ? `<div class="cain-equip-meta">${descText}</div>` : "")}
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
    if (confirm(t("sheet.equipment.shop.reset_confirm"))) {
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
  el.modalBody.parentElement.classList.add("wide-modal", "store-modal");

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
        <div class="kit-options-title" style="font-family:'Cuasigothic', var(--font-heading); font-size:16px; text-transform:uppercase; letter-spacing:0.5px; color:white; margin-bottom:10px;">${t("sheet.equipment.shop.tabs.kp")}</div>
        <div class="kit-options-grid">
          <button class="btn-kit-opt card-glass" data-name="Uniforme Padrão" data-cost="0">
            <strong>${t("equipment.items.Uniforme Padrão")}</strong>
            <span>${t("equipment.items.desc.Uniforme Padrão")}</span>
            <span class="btn-kit-opt-cost-free">${t("sheet.equipment.shop.free") || "Gratuito"}</span>
          </button>
          <button class="btn-kit-opt card-glass" data-name="Caderno e Caneta" data-cost="1">
            <strong>${t("equipment.items.Caderno e Caneta")}</strong>
            <span>${t("equipment.items.desc.Caderno e Caneta")}</span>
            <span class="btn-kit-opt-cost">1 KP</span>
          </button>
          <button class="btn-kit-opt card-glass" data-name="Caixa de Fósforos e Lenço" data-cost="1">
            <strong>${t("equipment.items.Caixa de Fósforos e Lenço")}</strong>
            <span>${t("equipment.items.desc.Caixa de Fósforos e Lenço")}</span>
            <span class="btn-kit-opt-cost">1 KP</span>
          </button>
          <button class="btn-kit-opt card-glass" data-name="Armas de Serviço" data-cost="2">
            <strong>${t("equipment.items.Armas de Serviço")}</strong>
            <span>${t("equipment.items.desc.Armas de Serviço")}</span>
            <span class="btn-kit-opt-cost">2 KP</span>
          </button>
        </div>
      </div>
    `;

    if (hasServiceWeapons) {
      tabContent += `
        <div class="weapon-upgrade-container card-glass" style="margin-top: 16px; padding: 16px; border: 1.5px solid rgba(255,255,255,0.08); border-radius: 6px;">
          <div class="weapon-upgrade-title" style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:'Cuasigothic', var(--font-heading); font-size:15px; text-transform:uppercase; letter-spacing:0.5px;">${t("sheet.equipment.shop.weapon_upgrade")} — CAT ${weaponCat}</span>
            <span style="font-size: 11px; color: var(--text-muted);">Scrip: ${scrip}</span>
          </div>
          <div class="weapon-upgrade-form" style="margin-top: 12px; display:flex; flex-direction:column; gap:10px;">
            <div class="weapon-upgrade-field" style="display:flex; flex-direction:column; gap:4px; text-align:left; align-items:start;">
              <span class="weapon-upgrade-label" style="font-size:18px; font-weight:bold; color:white;">${t("sheet.equipment.shop.aesthetic")}</span>
              <input type="text" id="service-weapon-aesthetic" class="weapon-upgrade-input" value="${esc(weaponAesthetic)}" placeholder="Ex: Revólver Cromado & Adaga de Osso" style="color:black !important; background:white; border:1px solid #ccc; padding:6px 10px; border-radius:4px;">
            </div>
            <button id="btn-upgrade-weapon" class="btn btn-sm" style="margin-top: 4px; font-weight:bold;" ${weaponCat >= 3 ? "disabled" : ""}>
              ${weaponCat >= 3 ? t("sheet.equipment.shop.max_reached") : t("sheet.equipment.shop.upgrade_btn")}
            </button>
          </div>
        </div>
      `;
    }
  } else if (activeEquipTab === "aquisicao") {
    let itemsHtml = "";
    Object.entries(EQUIPMENT_BY_KP).forEach(([kpCost, items]) => {
      items.forEach(item => {
        const displayName = t(`equipment.items.${item.name}`);
        const displayDesc = t(`equipment.items.desc.${item.name}`);
        itemsHtml += `
          <div class="cain-equip-shop-card card-glass">
            <div class="cain-equip-shop-info">
              <span class="cain-equip-shop-name">${displayName}</span>
              <p class="cain-equip-shop-desc">${displayDesc || ""}</p>
            </div>
            <button class="btn btn-sm btn-buy-equip btn-buy-kp" data-name="${esc(item.name)}" data-desc="${esc(item.desc || "")}" data-cost="${kpCost}" data-currency="kp">
              ${t("sheet.equipment.shop.equip_kp").replace("{cost}", kpCost)}
            </button>
          </div>
        `;
      });
    });
    tabContent = `
      <div class="cain-equip-shop-grid">
        ${itemsHtml || `<p style="font-size:11px; color:var(--text-muted); grid-column:1/-1;">${t("sheet.equipment.shop.no_items")}</p>`}
      </div>
    `;
  } else if (activeEquipTab === "esteticos") {
    let itemsHtml = ESTETICOS.map(item => {
      const displayName = t(`equipment.items.${item.name}`);
      const displayDesc = t(`equipment.items.desc.${item.name}`);
      return `
        <div class="cain-equip-shop-card card-glass">
          <div class="cain-equip-shop-info">
            <span class="cain-equip-shop-name">${displayName}</span>
            <p class="cain-equip-shop-desc">${displayDesc}</p>
          </div>
          <button class="btn btn-sm btn-buy-equip btn-buy-scrip" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
            ${t("sheet.equipment.shop.buy_scrip").replace("{cost}", item.cost)}
          </button>
        </div>
      `;
    }).join("");
    tabContent = `
      <div class="cain-equip-shop-grid">
        ${itemsHtml || `<p style="font-size:11px; color:var(--text-muted); grid-column:1/-1;">${t("sheet.equipment.shop.no_items")}</p>`}
      </div>
    `;
  } else if (activeEquipTab === "conforto") {
    let itemsHtml = CONFORTO_CARREIRA.map(item => {
      const displayName = t(`equipment.items.${item.name}`);
      const displayDesc = t(`equipment.items.desc.${item.name}`);
      return `
        <div class="cain-equip-shop-card card-glass">
          <div class="cain-equip-shop-info">
            <span class="cain-equip-shop-name">${displayName}</span>
            <p class="cain-equip-shop-desc">${displayDesc}</p>
          </div>
          <button class="btn btn-sm btn-buy-equip btn-buy-scrip" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
            ${t("sheet.equipment.shop.buy_scrip").replace("{cost}", item.cost)}
          </button>
        </div>
      `;
    }).join("");
    tabContent = `
      <div class="cain-equip-shop-grid">
        ${itemsHtml || `<p style="font-size:11px; color:var(--text-muted); grid-column:1/-1;">${t("sheet.equipment.shop.no_items")}</p>`}
      </div>
    `;
  } else if (activeEquipTab === "oculto") {
    let itemsHtml = OCULTO_MEDICO.map(item => {
      const displayName = t(`equipment.items.${item.name}`);
      const displayDesc = t(`equipment.items.desc.${item.name}`);
      return `
        <div class="cain-equip-shop-card card-glass">
          <div class="cain-equip-shop-info">
            <span class="cain-equip-shop-name">${displayName}</span>
            <p class="cain-equip-shop-desc">${displayDesc} (PK: ${item.pk || 0})</p>
          </div>
          <button class="btn btn-sm btn-buy-equip btn-buy-scrip" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
            ${t("sheet.equipment.shop.buy_scrip").replace("{cost}", item.cost)}
          </button>
        </div>
      `;
    }).join("");
    tabContent = `
      <div class="cain-equip-shop-grid">
        ${itemsHtml || `<p style="font-size:11px; color:var(--text-muted); grid-column:1/-1;">${t("sheet.equipment.shop.no_items")}</p>`}
      </div>
    `;
  } else if (activeEquipTab === "kits") {
    let itemsHtml = KITS.map(item => {
      const displayName = t(`equipment.items.${item.name}`);
      const displayDesc = t(`equipment.items.desc.${item.name}`);
      return `
        <div class="cain-equip-shop-card card-glass">
          <div class="cain-equip-shop-info">
            <span class="cain-equip-shop-name">${displayName}</span>
            <p class="cain-equip-shop-desc">${displayDesc}</p>
          </div>
          <button class="btn btn-sm btn-buy-equip btn-buy-kp" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost || 1}" data-currency="kp">
            ${t("sheet.equipment.shop.equip_kp").replace("{cost}", item.cost || 1)}
          </button>
        </div>
      `;
    }).join("");
    tabContent = `
      <div class="cain-equip-shop-grid">
        ${itemsHtml || `<p style="font-size:11px; color:var(--text-muted); grid-column:1/-1;">${t("sheet.equipment.shop.no_items")}</p>`}
      </div>
    `;
  } else if (activeEquipTab === "posses") {
    let itemsHtml = POSSES.map(item => {
      const displayName = t(`equipment.items.${item.name}`);
      const displayDesc = t(`equipment.items.desc.${item.name}`);
      return `
        <div class="cain-equip-shop-card card-glass">
          <div class="cain-equip-shop-info">
            <span class="cain-equip-shop-name">${displayName}</span>
            <p class="cain-equip-shop-desc">${displayDesc}</p>
          </div>
          <button class="btn btn-sm btn-buy-equip btn-buy-scrip" data-name="${esc(item.name)}" data-desc="${esc(item.desc)}" data-cost="${item.cost}" data-currency="scrip">
            ${t("sheet.equipment.shop.buy_scrip").replace("{cost}", item.cost)}
          </button>
        </div>
      `;
    }).join("");
    tabContent = `
      <div class="cain-equip-shop-grid">
        ${itemsHtml || `<p style="font-size:11px; color:var(--text-muted); grid-column:1/-1;">${t("sheet.equipment.shop.no_items")}</p>`}
      </div>
    `;
  } else if (activeEquipTab === "custom") {
    tabContent = `
      <div class="custom-item-form-container card-glass">
        <div class="kit-options-title" style="font-family:'Cuasigothic', var(--font-heading); font-size: 16px; text-transform: uppercase; margin-bottom: 12px; letter-spacing:0.5px;">${t("sheet.equipment.shop.custom.title")}</div>
        <div class="custom-item-field">
          <label>${t("sheet.equipment.shop.custom.name")}</label>
          <input type="text" id="custom-item-name" placeholder="Ex: Medalhão da Sorte" class="custom-item-name-input">
        </div>
        <div class="custom-item-field" style="margin-top: 8px;">
          <label>${t("sheet.equipment.shop.custom.desc")}</label>
          <input type="text" id="custom-item-desc" placeholder="Ex: Dá +1 em rolagens..." class="custom-item-desc-input">
        </div>
        <div class="custom-item-field-row" style="margin-top: 12px; display:flex; gap:12px; align-items:flex-end;">
          <div class="custom-item-field" style="flex: 1;">
            <label>${t("sheet.equipment.shop.custom.cost")}</label>
            <input type="number" id="custom-item-cost" min="0" max="10" value="1" class="custom-item-cost-input">
          </div>
          <button id="btn-add-custom-item" class="btn" style="flex: 1; height: 34px; font-weight:bold;">${t("sheet.equipment.shop.custom.btn")}</button>
        </div>
      </div>
    `;
  }

  el.modalBody.innerHTML = `
    <!-- Header Gótico -->
    <div class="cain-store-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
      <h3 class="modal-title" style="font-family:'Cuasigothic', var(--font-heading); font-size:24px; text-transform:uppercase; margin:0; letter-spacing:1px; color:white;">${t("sheet.equipment.shop.title")}</h3>
      <button class="modal-close" style="position:static; font-size:22px; cursor:pointer; background:none; border:none; color:white;">&times;</button>
    </div>
    <p class="text-secondary-md" style="margin-bottom: 6px; font-size: 18px; color:white; line-height:1.4;">${t("sheet.equipment.shop.subtitle")}</p>
    <!-- Dashboard de Moedas -->
    <div class="cain-store-dashboard" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div class="cain-store-wallet cain-store-wallet--kp card-glass" style="display:flex; align-items:center; gap:12px; padding:10px 16px; border-radius:6px; background:transparent;">
        <div style="text-align:left;">
          <div style="font-size:var(--font-size-lg); text-transform:uppercase; letter-spacing:0.5px; color:#1d4ed8; font-weight:bold;">${t("sheet.equipment.shop.kp_title")}</div>
          <div style="font-family:var(--font-heading); font-size:var(--font-size-lg); font-weight:bold; color:#1d4ed8; margin-top:2px;">${kp} <span style="font-size:20px; font-weight:normal; color:white;">${t("sheet.equipment.shop.available")}</span></div>
        </div>
      </div>
      <div class="cain-store-wallet cain-store-wallet--scrip card-glass" style="display:flex; align-items:center; gap:12px; padding:10px 16px; border-radius:6px; background:transparent;">
        <div style="text-align:left;">
          <div style="font-size:var(--font-size-lg); text-transform:uppercase; letter-spacing:0.5px; color:#be3135; font-weight:bold;">${t("sheet.equipment.shop.scrip_title")}</div>
          <div style="font-family:var(--font-heading); font-size:var(--font-size-lg); font-weight:bold; color:#be3135; margin-top:2px;">${scrip} <span style="font-size:20px; font-weight:normal; color:white;">${t("sheet.equipment.shop.available")}</span></div>
        </div>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="cain-equip-tabs">
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "kp" ? "active" : ""}" data-tab="kp">${t("sheet.equipment.shop.tabs.kp")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "aquisicao" ? "active" : ""}" data-tab="aquisicao">${t("sheet.equipment.shop.tabs.aquisicao")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "esteticos" ? "active" : ""}" data-tab="esteticos">${t("sheet.equipment.shop.tabs.esteticos")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "conforto" ? "active" : ""}" data-tab="conforto">${t("sheet.equipment.shop.tabs.conforto")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "oculto" ? "active" : ""}" data-tab="oculto">${t("sheet.equipment.shop.tabs.oculto")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "kits" ? "active" : ""}" data-tab="kits">${t("sheet.equipment.shop.tabs.kits")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "posses" ? "active" : ""}" data-tab="posses">${t("sheet.equipment.shop.tabs.posses")}</button>
      <button class="btn btn-sm btn-equip-tab ${activeEquipTab === "custom" ? "active" : ""}" data-tab="custom">${t("sheet.equipment.shop.tabs.custom")}</button>
    </div>

    <div class="cain-equip-col-left-split">
      ${tabContent}
    </div>

    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <button class="btn btn-secondary modal-close">${t("sheet.equipment.shop.close")}</button>
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
          alert(t("sheet.equipment.shop.alert.insufficient_kp"));
          return;
        }
        if (equipment.some(eq => eq.name === name)) {
          alert(t("sheet.equipment.shop.alert.already_equipped"));
          return;
        }
        char.kitPoints = kp - cost;
        if (!char.equipment) char.equipment = [];
        char.equipment.push({ name, desc, kpCost: cost });
      } else {
        if (scrip < cost) {
          alert(t("sheet.equipment.shop.alert.insufficient_scrip"));
          return;
        }
        if (equipment.some(eq => eq.name === name)) {
          alert(t("sheet.equipment.shop.alert.already_owned"));
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
        alert(t("sheet.equipment.shop.alert.insufficient_kp"));
        return;
      }

      if (equipment.some(eq => eq.name === name)) {
        alert(t("sheet.equipment.shop.alert.already_equipped"));
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
        alert(t("sheet.equipment.shop.alert.upgrade_scrip"));
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
      alert(t("sheet.equipment.shop.alert.custom_name"));
      return;
    }

    if (kp < cost) {
      alert(t("sheet.equipment.shop.alert.custom_kp"));
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
