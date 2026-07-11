import { el, state, saveCurrentCharacter } from "../state.js";
import { logger } from "../logger.js";
import { renderSavedMacrosSheet } from "../sheet.js";
import { esc } from "../screen-utils.js";

export function openCustomRollModal(macroToEdit = null) {
  const char = state.currentCharacter;
  if (!char) return;

  logger.info(`Modal: Abrindo modal de rolagem personalizada (${macroToEdit ? 'Editar' : 'Criar'}).`);

  const defaultMacro = {
    name: "",
    assimilada: false,
    instinto: "",
    instinto2: "",
    instintoBonus: 0,
    skill: "",
    skillBonus: 0,
    bonusSuccesses: 0,
    bonusPressures: 0,
    bonusAdaptations: 0,
    maxKeep: 1,
    d12Bonus: 0
  };

  const macro = macroToEdit ? { ...defaultMacro, ...macroToEdit } : { ...defaultMacro };

  el.modalContainer.classList.remove("hidden");
  el.modalBody.innerHTML = `
    <h3 class="modal-title">${macroToEdit ? "Editar Rolagem" : "Nova Rolagem Personalizada"}</h3>
    <form id="form-custom-roll" style="display:flex; flex-direction:column; gap:12px; margin-top:12px;">
      <div class="form-group-flex">
        <label for="macro-name" class="label-bold">Nome da Rolagem:</label>
        <input type="text" id="macro-name" value="${esc(macro.name)}" placeholder="Ex: Ataque Rápido, Furtividade Sutil" class="input-styled" required />
      </div>

      <div class="form-group" style="display:flex; align-items:center; justify-content:space-between; background: rgba(0, 162, 255, 0.08); border: 1px dashed rgba(0, 162, 255, 0.3); padding: 8px; border-radius: 4px;">
        <span class="label-bold" style="user-select:none;">Rolagem Assimilada (Consome 1 Assimilação / 2 Determinação e rola d12)</span>
        <label class="theme-switch">
          <input type="checkbox" id="macro-assimilada" ${macro.assimilada ? "checked" : ""}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="grid-2">
        <div class="form-group-flex">
          <label id="label-instinto-1" for="macro-instinto" class="label-bold">Instinto (d6):</label>
          <select id="macro-instinto" class="input-styled">
            <option value="">-- Nenhum --</option>
            <option value="Influência" ${macro.instinto === "Influência" ? "selected" : ""}>Influência</option>
            <option value="Percepção" ${macro.instinto === "Percepção" ? "selected" : ""}>Percepção</option>
            <option value="Potência" ${macro.instinto === "Potência" ? "selected" : ""}>Potência</option>
            <option value="Reação" ${macro.instinto === "Reação" ? "selected" : ""}>Reação</option>
            <option value="Resolução" ${macro.instinto === "Resolução" ? "selected" : ""}>Resolução</option>
            <option value="Sagacidade" ${macro.instinto === "Sagacidade" ? "selected" : ""}>Sagacidade</option>
          </select>
        </div>
        <div class="form-group-flex" id="group-instinto-bonus">
          <label for="macro-instinto-bonus" class="label-bold">Bônus Dados Instinto (d6):</label>
          <input type="number" id="macro-instinto-bonus" value="${macro.instintoBonus}" min="-5" max="10" class="input-styled" />
        </div>
        <div class="form-group-flex" id="group-instinto-2" style="display:none;">
          <label for="macro-instinto-2" class="label-bold">Instinto 2 (d12):</label>
          <select id="macro-instinto-2" class="input-styled">
            <option value="">-- Nenhum --</option>
            <option value="Influência" ${macro.instinto2 === "Influência" ? "selected" : ""}>Influência</option>
            <option value="Percepção" ${macro.instinto2 === "Percepção" ? "selected" : ""}>Percepção</option>
            <option value="Potência" ${macro.instinto2 === "Potência" ? "selected" : ""}>Potência</option>
            <option value="Reação" ${macro.instinto2 === "Reação" ? "selected" : ""}>Reação</option>
            <option value="Resolução" ${macro.instinto2 === "Resolução" ? "selected" : ""}>Resolução</option>
            <option value="Sagacidade" ${macro.instinto2 === "Sagacidade" ? "selected" : ""}>Sagacidade</option>
          </select>
        </div>
      </div>

      <div id="group-skill-container" class="grid-2">
        <div class="form-group-flex">
          <label for="macro-skill" class="label-bold">Conhecimento / Prática (d10):</label>
          <select id="macro-skill" class="input-styled">
            <option value="">-- Nenhum --</option>
            <optgroup label="Conhecimentos">
              <option value="Biologia" ${macro.skill === "Biologia" ? "selected" : ""}>Biologia</option>
              <option value="Erudição" ${macro.skill === "Erudição" ? "selected" : ""}>Erudição</option>
              <option value="Engenharia" ${macro.skill === "Engenharia" ? "selected" : ""}>Engenharia</option>
              <option value="Geografia" ${macro.skill === "Geografia" ? "selected" : ""}>Geografia</option>
              <option value="Medicina" ${macro.skill === "Medicina" ? "selected" : ""}>Medicina</option>
              <option value="Segurança" ${macro.skill === "Segurança" ? "selected" : ""}>Segurança</option>
            </optgroup>
            <optgroup label="Práticas">
              <option value="Armas" ${macro.skill === "Armas" ? "selected" : ""}>Armas</option>
              <option value="Atletismo" ${macro.skill === "Atletismo" ? "selected" : ""}>Atletismo</option>
              <option value="Expressão" ${macro.skill === "Expressão" ? "selected" : ""}>Expressão</option>
              <option value="Furtividade" ${macro.skill === "Furtividade" ? "selected" : ""}>Furtividade</option>
              <option value="Manufaturas" ${macro.skill === "Manufaturas" ? "selected" : ""}>Manufaturas</option>
              <option value="Sobrevivência" ${macro.skill === "Sobrevivência" ? "selected" : ""}>Sobrevivência</option>
            </optgroup>
          </select>
        </div>
        <div class="form-group-flex">
          <label for="macro-skill-bonus" class="label-bold">Bônus Dados Skill (d10):</label>
          <input type="number" id="macro-skill-bonus" value="${macro.skillBonus}" min="-5" max="10" class="input-styled" />
        </div>
      </div>

      <div class="grid-3">
        <div class="form-group-flex">
          <label for="macro-bonus-successes" class="label-bold" style="font-size:11px;">Sucessos Extras:</label>
          <input type="number" id="macro-bonus-successes" value="${macro.bonusSuccesses}" min="-5" max="10" class="input-styled" />
        </div>
        <div class="form-group-flex">
          <label for="macro-bonus-pressures" class="label-bold" style="font-size:11px;">Pressões Extras:</label>
          <input type="number" id="macro-bonus-pressures" value="${macro.bonusPressures}" min="-5" max="10" class="input-styled" />
        </div>
        <div class="form-group-flex">
          <label for="macro-bonus-adaptations" class="label-bold" style="font-size:11px;">Adaptações Extras:</label>
          <input type="number" id="macro-bonus-adaptations" value="${macro.bonusAdaptations}" min="-5" max="10" class="input-styled" />
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group-flex">
          <label for="macro-max-keep" class="label-bold">Dados a Manter:</label>
          <input type="number" id="macro-max-keep" value="${macro.maxKeep}" min="1" max="10" class="input-styled" required />
        </div>
        <div class="form-group-flex">
          <label for="macro-d12-bonus" class="label-bold">Bônus Dados d12:</label>
          <input type="number" id="macro-d12-bonus" value="${macro.d12Bonus || 0}" min="0" max="10" class="input-styled" />
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-close-macro" style="border-color:var(--text-muted); color:var(--text-muted);">Cancelar</button>
        <button type="submit" class="btn btn-success">Salvar Rolagem</button>
      </div>
    </form>
  `;

  const closeForm = () => {
    el.modalContainer.classList.add("hidden");
  };

  el.modalBody.querySelector(".btn-close-macro").addEventListener("click", closeForm);

  const checkboxAss = el.modalBody.querySelector("#macro-assimilada");
  const labelInst1 = el.modalBody.querySelector("#label-instinto-1");
  const groupInstBonus = el.modalBody.querySelector("#group-instinto-bonus");
  const groupInst2 = el.modalBody.querySelector("#group-instinto-2");
  const groupSkill = el.modalBody.querySelector("#group-skill-container");
  const inputMaxKeep = el.modalBody.querySelector("#macro-max-keep");

  const updateFormFields = () => {
    const isAss = checkboxAss.checked;
    if (isAss) {
      labelInst1.textContent = "Instinto 1 (d12):";
      groupInstBonus.style.display = "none";
      groupInst2.style.display = "flex";
      groupSkill.style.display = "none";
      if (parseInt(inputMaxKeep.value) === 1 && !macroToEdit) {
        inputMaxKeep.value = 2;
      }
    } else {
      labelInst1.textContent = "Instinto (d6):";
      groupInstBonus.style.display = "flex";
      groupInst2.style.display = "none";
      groupSkill.style.display = "grid";
      if (parseInt(inputMaxKeep.value) === 2 && !macroToEdit) {
        inputMaxKeep.value = 1;
      }
    }
  };

  checkboxAss.addEventListener("change", updateFormFields);
  updateFormFields();

  const form = el.modalBody.querySelector("#form-custom-roll");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("macro-name").value.trim();
    const assimilada = checkboxAss.checked;
    const instinto = document.getElementById("macro-instinto").value;
    const instinto2 = assimilada ? document.getElementById("macro-instinto-2").value : "";
    const instintoBonus = assimilada ? 0 : (parseInt(document.getElementById("macro-instinto-bonus").value) || 0);
    const skill = assimilada ? "" : document.getElementById("macro-skill").value;
    const skillBonus = assimilada ? 0 : (parseInt(document.getElementById("macro-skill-bonus").value) || 0);
    const bonusSuccesses = parseInt(document.getElementById("macro-bonus-successes").value) || 0;
    const bonusPressures = parseInt(document.getElementById("macro-bonus-pressures").value) || 0;
    const bonusAdaptations = parseInt(document.getElementById("macro-bonus-adaptations").value) || 0;
    const maxKeep = parseInt(document.getElementById("macro-max-keep").value) || 1;
    const d12Bonus = parseInt(document.getElementById("macro-d12-bonus").value) || 0;

    if (!char.savedRolls) char.savedRolls = [];

    const savedMacro = {
      id: macro.id || "macro_" + Date.now(),
      name,
      assimilada,
      instinto,
      instinto2,
      instintoBonus,
      skill,
      skillBonus,
      bonusSuccesses,
      bonusPressures,
      bonusAdaptations,
      maxKeep,
      d12Bonus
    };

    if (macro.id) {
      const idx = char.savedRolls.findIndex(m => m.id === macro.id);
      if (idx !== -1) char.savedRolls[idx] = savedMacro;
    } else {
      char.savedRolls.push(savedMacro);
    }

    saveCurrentCharacter();
    renderSavedMacrosSheet();
    closeForm();
  });
}
