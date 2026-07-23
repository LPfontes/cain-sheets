import { initContentPacks, getMergedData, loadBaseAndOfficialPacks } from "./content-pack-manager.js";

// Inicializa os pacotes e mantém a estrutura de dados reativa
await initContentPacks();

let currentMerged = getMergedData();

window.addEventListener("contentPacksChanged", (e) => {
  currentMerged = e.detail || getMergedData();
  updateExportReferences();
});

window.addEventListener("languageChanged", async () => {
  await loadBaseAndOfficialPacks(true);
  currentMerged = getMergedData();
  updateExportReferences();
});

export let CAIN_SKILLS = currentMerged.skills || {};
export let ALL_SKILLS = Object.values(CAIN_SKILLS).flatMap(category => Object.keys(category?.skills || {}));
export let CAT_TABLE = currentMerged.rules?.cat_table || {};
export let AGENDAS = currentMerged.agendas || {};
export let BLASPHEMIES = currentMerged.blasphemies || [];
export let SIN_MARKS = currentMerged.sinmarks || [];
export let DRIFTERS = currentMerged.drifters || [];
export let SINS = currentMerged.sins || [];
export let VIRTUES = currentMerged.virtues || {};

export let EQUIPMENT_BY_KP = currentMerged.equipment?.equipment_by_kp || {};
export let CONFORTO_CARREIRA = currentMerged.equipment?.conforto_carreira || [];
export let OCULTO_MEDICO = currentMerged.equipment?.oculto_medico || [];
export let KITS = currentMerged.equipment?.kits || [];
export let ESTETICOS = currentMerged.equipment?.esteticos || [];
export let POSSES = currentMerged.equipment?.posses || [];

function updateExportReferences() {
  CAIN_SKILLS = currentMerged.skills || {};
  ALL_SKILLS = Object.values(CAIN_SKILLS).flatMap(category => Object.keys(category?.skills || {}));
  CAT_TABLE = currentMerged.rules?.cat_table || {};
  AGENDAS = currentMerged.agendas || {};
  BLASPHEMIES = currentMerged.blasphemies || [];
  SIN_MARKS = currentMerged.sinmarks || [];
  DRIFTERS = currentMerged.drifters || [];
  SINS = currentMerged.sins || [];
  VIRTUES = currentMerged.virtues || {};

  EQUIPMENT_BY_KP = currentMerged.equipment?.equipment_by_kp || {};
  CONFORTO_CARREIRA = currentMerged.equipment?.conforto_carreira || [];
  OCULTO_MEDICO = currentMerged.equipment?.oculto_medico || [];
  KITS = currentMerged.equipment?.kits || [];
  ESTETICOS = currentMerged.equipment?.esteticos || [];
  POSSES = currentMerged.equipment?.posses || [];
}

export function getSkillPointsForCat(cat) {
  return CAT_TABLE[cat]?.skillPoints || 3;
}

export function getBlasphemyCountForCat(cat) {
  return CAT_TABLE[cat]?.blasphemies || 1;
}

export function getBlasphemiesForCat(cat) {
  return BLASPHEMIES.filter(b => b.cat <= cat);
}
