const getRelativeUrl = (relativePath) => new URL(relativePath, import.meta.url).href;

const [skillsData, rulesData, agendasData, blasphemiesData, equipmentData, sinmarksData] = await Promise.all([
  fetch(getRelativeUrl('../data/skills.json')).then(r => r.json()),
  fetch(getRelativeUrl('../data/rules.json')).then(r => r.json()),
  fetch(getRelativeUrl('../data/agendas.json')).then(r => r.json()),
  fetch(getRelativeUrl('../data/blasphemies.json')).then(r => r.json()),
  fetch(getRelativeUrl('../data/equipment.json')).then(r => r.json()),
  fetch(getRelativeUrl('../data/sinmarks.json')).then(r => r.json())
]);

export const CAIN_SKILLS = skillsData;
export const ALL_SKILLS = Object.values(CAIN_SKILLS).flatMap(category => Object.keys(category.skills));
export const CAT_TABLE = rulesData.cat_table;
export const AGENDAS = agendasData;
export const BLASPHEMIES = blasphemiesData;

export const SIN_MARKS = sinmarksData;

export const EQUIPMENT_BY_KP = equipmentData.equipment_by_kp;
export const CONFORTO_CARREIRA = equipmentData.conforto_carreira;
export const OCULTO_MEDICO = equipmentData.oculto_medico;
export const KITS = equipmentData.kits;
export const ESTETICOS = equipmentData.esteticos;
export const POSSES = equipmentData.posses;

export function getSkillPointsForCat(cat) {
  return CAT_TABLE[cat]?.skillPoints || 3;
}

export function getBlasphemyCountForCat(cat) {
  return CAT_TABLE[cat]?.blasphemies || 1;
}

export function getBlasphemiesForCat(cat) {
  return BLASPHEMIES.filter(b => b.cat <= cat);
}
