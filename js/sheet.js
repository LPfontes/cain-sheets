/* js/sheet.js - Entrada principal da Ficha de Exorcista do CAIN RPG */

import { renderSkillsSheet } from "./sheet-skills.js";
import { renderStressHealthSheet } from "./sheet-stress-health.js";
import { renderAgendaSheet } from "./sheet-agenda-blasphemy.js";
import { renderBlasphemiesSheet } from "./sheet-agenda-blasphemy.js";
import { renderSinMarksSheet } from "./sheet-sinmarks.js";
import { renderEquipmentSheet } from "./sheet-equipment.js";
import { renderStaticHooks } from "./sheet-hooks-notes.js";
import { renderVirtudesSheet } from "./sheet-virtudes.js";
import { state } from "./state.js";

// Re-exportar tudo para compatibilidade com o resto da aplicação
export { renderSkillsSheet, renderAptitudesSheet } from "./sheet-skills.js";
export { renderStressHealthSheet, renderInjuryCheckboxes, renderHealthSheet, renderPsycheBursts, renderSinTracker } from "./sheet-stress-health.js";
export { renderAgendaSheet, renderBlasphemiesSheet, showPowerDetailPopup, renderMutationsSheet } from "./sheet-agenda-blasphemy.js";
export { renderSinMarksSheet } from "./sheet-sinmarks.js";
export { renderEquipmentSheet, renderInventorySheet } from "./sheet-equipment.js";
export { renderSavedMacrosSheet, renderHomebrewSheet, renderCaboGuerraSheet, renderCharacteristicsSheet, renderMissionsSurvived, renderStaticHooks, initStaticHooksListeners } from "./sheet-hooks-notes.js";
export { renderVirtudesSheet } from "./sheet-virtudes.js";

// Escuta por mudanças de idioma para re-renderizar todas as partes da ficha
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
  renderVirtudesSheet();
});
