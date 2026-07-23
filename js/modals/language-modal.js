/* js/modals/language-modal.js — Modal de Seleção de Idioma Padrão */

import { el } from "../state.js";
import { setLang, getLang } from "../i18n.js";

export function checkFirstVisitLanguage() {
  const savedLang = localStorage.getItem("cain_lang");
  if (!savedLang) {
    openLanguageModal(true);
  }
}

export function openLanguageModal(isFirstVisit = false) {
  if (!el.modalContainer || !el.modalBody) return;

  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.closest(".modal-content");
  if (modalContent) {
    modalContent.style.maxWidth = "520px";
  }

  const current = getLang() || "pt";

  el.modalBody.innerHTML = `
    <div class="language-modal-container" style="text-align: center; padding: 12px 6px;">
      <div style="font-size: 2.5em; margin-bottom: 8px;">🌐</div>
      <h3 class="modal-title" style="font-size: 1.6em; margin-bottom: 8px; font-family: var(--font-heading);">
        Idioma Padrão / Default Language
      </h3>
      <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: 24px; line-height: 1.5;">
        Selecione o idioma de sua preferência para a interface, regras e fichas do CAIN RPG.<br>
        <span style="font-size: 0.85em; opacity: 0.8;">Select your preferred language for the CAIN RPG interface, rules, and sheets.</span>
      </p>

      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
        <button id="btn-select-lang-pt" class="btn" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; font-size: 1.1em; border-radius: var(--radius-sm); border: 2px solid ${current === "pt" ? "var(--stamp-red, #dc2626)" : "rgba(255,255,255,0.15)"}; background: ${current === "pt" ? "rgba(220, 38, 38, 0.15)" : "rgba(0,0,0,0.3)"}; color: black; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 1.8em;">🇧🇷</span>
            <div style="text-align: left;">
              <div style="font-weight: bold; font-family: var(--font-heading);">Português (BR)</div>
              <div style="font-size: 0.75em; color: var(--text-muted);">Interface completa e regras em Português</div>
            </div>
          </div>
          ${current === "pt" ? '<span style="color: var(--stamp-red, #dc2626); font-size: 1.3em; font-weight: bold;">✓</span>' : ''}
        </button>

        <button id="btn-select-lang-en" class="btn" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; font-size: 1.1em; border-radius: var(--radius-sm); border: 2px solid ${current === "en" ? "var(--stamp-red, #dc2626)" : "rgba(255,255,255,0.15)"}; background: ${current === "en" ? "rgba(220, 38, 38, 0.15)" : "rgba(0,0,0,0.3)"}; color: black; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 1.8em;">🇺🇸</span>
            <div style="text-align: left;">
              <div style="font-weight: bold; font-family: var(--font-heading);">English (US)</div>
              <div style="font-size: 0.75em; color: var(--text-muted);">Complete English interface & official rules</div>
            </div>
          </div>
          ${current === "en" ? '<span style="color: var(--stamp-red, #dc2626); font-size: 1.3em; font-weight: bold;">✓</span>' : ''}
        </button>
      </div>

      ${!isFirstVisit ? `
        <div style="margin-top: 10px;">
          <button id="btn-cancel-lang-modal" class="btn" style="width: 100%; opacity: 0.7;">Fechar / Close</button>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById("btn-select-lang-pt")?.addEventListener("click", () => {
    setLang("pt");
    updateLanguageButtonLabel();
    closeModal();
  });

  document.getElementById("btn-select-lang-en")?.addEventListener("click", () => {
    setLang("en");
    updateLanguageButtonLabel();
    closeModal();
  });

  document.getElementById("btn-cancel-lang-modal")?.addEventListener("click", closeModal);
}

export function updateLanguageButtonLabel() {
  const btnLanguage = document.getElementById("btn-language");
  if (btnLanguage) {
    const lang = getLang() || "pt";
    btnLanguage.innerHTML = lang === "pt" ? "🌐 PT" : "🌐 EN";
  }
}

function closeModal() {
  if (el.modalContainer) {
    el.modalContainer.classList.add("hidden");
  }
}
