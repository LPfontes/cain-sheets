/* js/sheet-skills.js - Aptitudes e Perícias */

import { el, state, saveCurrentCharacter } from "./state.js";
import { CAIN_SKILLS } from "./cain-data.js";
import { openCainRollForSkill } from "./cain-roller.js";
import { t } from "./i18n.js";

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
          <button class="cain-skill-roll-btn" data-skill="${key}" title="Rolar ${t("skills." + key)}">🎲</button>  
          <span class="cain-skill-name">${t("skills." + key)}</span>
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
        <button class="cain-skill-roll-btn" data-skill="Psique" title="Rolar ${t("skills.Psique")}">🎲</button>  
        <span class="cain-skill-name">${t("skills.Psique")}</span>
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

export function renderAptitudesSheet() { }
