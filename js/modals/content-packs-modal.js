/* js/modals/content-packs-modal.js — Modal de Gerenciamento de Pacotes de Conteúdo */

import { el } from "../state.js";
import { 
  getAllPacks, 
  loadPackFromFile, 
  togglePack, 
  removePack, 
  generateTemplatePack, 
  getMergedData 
} from "../content-pack-manager.js";
import { t, applyTranslations } from "../i18n.js";
import { esc } from "../screen-utils.js";

export function openContentPacksModal() {
  if (!el.modalContainer || !el.modalBody) return;

  el.modalContainer.classList.remove("hidden");
  el.modalBody.parentElement.className = "modal-content wide-modal store-modal";

  renderContentPacksModal();
}

function renderContentPacksModal() {
  const packs = getAllPacks();
  const merged = getMergedData();

  const totalSkills = Object.keys(merged.skills || {}).length;
  const totalAgendas = Array.isArray(merged.agendas) ? merged.agendas.length : Object.keys(merged.agendas || {}).length;
  const totalBlasphemies = (merged.blasphemies || []).length;
  const totalDrifters = (merged.drifters || []).length;
  const totalSins = (merged.sins || []).length;
  const totalVirtues = Array.isArray(merged.virtues) ? merged.virtues.length : Object.keys(merged.virtues || {}).length;

  const packsHtml = packs.map(pack => {
    const isBase = pack.isBase;
    return `
      <div class="card-glass" style="padding: 14px 18px; margin-bottom: 12px; border-radius: 8px; display:flex; justify-content:space-between; align-items:center; border: 1px solid rgba(255,255,255,0.1); background: rgba(15,12,10,0.6);">
        <div style="flex: 1; text-align: left; padding-right: 16px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="cain-checkbox-label" style="margin:0; cursor:pointer;">
              <input type="checkbox" class="chk-toggle-pack" data-id="${esc(pack.id)}" ${pack.enabled ? 'checked' : ''}>
              <strong style="font-size: 16px; color: white;">${esc(pack.name)}</strong>
            </label>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: ${isBase ? '#1d4ed8' : '#be3135'}; color: white; font-weight: bold;">
              ${isBase ? t('packs.tag.official') : t('packs.tag.custom')} v${esc(pack.version || '1.0')}
            </span>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin: 6px 0 4px 26px;">
            ${esc(pack.description || 'Sem descrição')}
          </p>
          <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-left: 26px;">
            <span data-i18n="packs.label.author">${t('packs.label.author')}</span> <strong>${esc(pack.author || t('packs.label.unknownAuthor'))}</strong>
          </div>
        </div>
        <div style="display:flex; gap: 8px; align-items:center;">
          <button class="btn btn-sm btn-export-pack" data-id="${esc(pack.id)}" style="font-size:12px;" data-i18n="packs.btn.export">
            ${t('packs.btn.export')}
          </button>
          ${!isBase ? `
            <button class="btn btn-sm btn-danger btn-delete-pack" data-id="${esc(pack.id)}" style="font-size:12px; padding: 4px 8px;" data-i18n="packs.btn.delete">
              ${t('packs.btn.delete')}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  el.modalBody.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
      <h3 style="font-family:'Cuasigothic', var(--font-heading); font-size:22px; text-transform:uppercase; margin:0; letter-spacing:1px; color:white;" data-i18n="packs.modal.title">
        📦 Gerenciador de Pacotes de Conteúdo
      </h3>
      <button class="modal-close" style="font-size:22px; cursor:pointer; background:none; border:none; color:white;">&times;</button>
    </div>

    <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px; text-align: left; line-height: 1.4;" data-i18n="packs.modal.desc">
      Gerencie e carregue módulos de regras, agendas, blasfêmias, equipamentos e errantes. O sistema permite separar o conteúdo de regras para garantir liberdade e conformidade.
    </p>

    <!-- Resumo dos dados ativos -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin-bottom: 16px;">
      <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; text-align:center;">
        <span style="font-size:18px; font-weight:bold; color:#be3135;">${totalAgendas}</span>
        <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;" data-i18n="packs.summary.agendas">${t('packs.summary.agendas')}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; text-align:center;">
        <span style="font-size:18px; font-weight:bold; color:#1d4ed8;">${totalBlasphemies}</span>
        <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;" data-i18n="packs.summary.blasphemies">${t('packs.summary.blasphemies')}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; text-align:center;">
        <span style="font-size:18px; font-weight:bold; color:#10b981;">${totalDrifters}</span>
        <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;" data-i18n="packs.summary.drifters">${t('packs.summary.drifters')}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; text-align:center;">
        <span style="font-size:18px; font-weight:bold; color:#f59e0b;">${totalSins}</span>
        <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;" data-i18n="packs.summary.sins">${t('packs.summary.sins')}</div>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; text-align:center;">
        <span style="font-size:18px; font-weight:bold; color:#8b5cf6;">${totalVirtues}</span>
        <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;" data-i18n="packs.summary.virtues">${t('packs.summary.virtues')}</div>
      </div>
    </div>

    <!-- Barra de Ações Rápidas -->
    <div style="display:flex; gap: 10px; margin-bottom: 16px;">
      <button id="btn-import-pack-file" class="btn btn-landing-primary" style="flex:1; font-weight:bold; font-size:13px;" data-i18n="packs.action.import">
        📂 Carregar Novo Pacote (.json)
      </button>
      <input type="file" id="input-pack-file" accept=".json" style="display:none;">
      
      <button id="btn-download-pack-template" class="btn" style="flex:1; font-size:13px;" data-i18n="packs.action.template">
        📝 Baixar Modelo de Pacote
      </button>
    </div>

    <!-- Lista de Pacotes -->
    <div style="max-height: 320px; overflow-y: auto; text-align: left; padding-right: 4px;">
      ${packsHtml}
    </div>

    <div style="margin-top: 16px; display:flex; justify-content:flex-end;">
      <button class="btn btn-secondary modal-close" data-i18n="common.close">Fechar</button>
    </div>
  `;
  applyTranslations();

  // Attach Event Listeners
  const closeBtns = el.modalBody.querySelectorAll(".modal-close");
  closeBtns.forEach(btn => {
    btn.onclick = () => el.modalContainer.classList.add("hidden");
  });

  // Toggle pack checkboxes
  el.modalBody.querySelectorAll(".chk-toggle-pack").forEach(chk => {
    chk.onchange = (e) => {
      togglePack(chk.dataset.id, chk.checked);
      renderContentPacksModal();
    };
  });

  // Delete custom pack
  el.modalBody.querySelectorAll(".btn-delete-pack").forEach(btn => {
    btn.onclick = () => {
      if (confirm(t("packs.confirmDelete"))) {
        removePack(btn.dataset.id);
        renderContentPacksModal();
      }
    };
  });

  // Export pack
  el.modalBody.querySelectorAll(".btn-export-pack").forEach(btn => {
    btn.onclick = () => {
      const packId = btn.dataset.id;
      const pack = getAllPacks().find(p => p.id === packId);
      if (!pack) return;

      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${pack.id}_pacote.json`;
      a.click();
    };
  });

  // File import button
  const fileInput = el.modalBody.querySelector("#input-pack-file");
  const importBtn = el.modalBody.querySelector("#btn-import-pack-file");
  if (importBtn && fileInput) {
    importBtn.onclick = () => fileInput.click();
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await loadPackFromFile(file);
        alert(t("packs.alertLoaded").replace("{name}", file.name));
        renderContentPacksModal();
      } catch (err) {
        alert(t("packs.alertError").replace("{error}", err.message));
      }
    };
  }

  // Template download button
  const templateBtn = el.modalBody.querySelector("#btn-download-pack-template");
  if (templateBtn) {
    templateBtn.onclick = () => {
      const template = generateTemplatePack();
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "modelo_pacote_cain.json";
      a.click();
    };
  }
}
