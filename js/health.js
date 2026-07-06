/**
 * health.js — Utilitários de saúde sem dependências circulares.
 * Importado por roller.js, chat.js e sheet.js sem criar ciclos.
 */

export function getCurrentHealthLevel(char) {
  if (!char) return 6;
  const maxPts = 1 + (char.instintos.Potência || 0) + (char.instintos.Resolução || 0);
  if (!char.dano) {
    char.dano = { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  }
  for (let lvl = 6; lvl >= 1; lvl--) {
    if ((char.dano[lvl] || 0) < maxPts) {
      return lvl;
    }
  }
  return 1;
}
