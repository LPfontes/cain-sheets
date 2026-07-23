import { el, state, saveCurrentSin } from "./state.js";
import { hideAllScreens, goToLanding, esc, setupImageUpload } from "./screen-utils.js";
import { t, applyTranslations } from "./i18n.js";
import { ICONS } from "../icons.js";
import { SINS } from "./cain-data.js";
import { getMergedData } from "./content-pack-manager.js";

function getSinsData() {
  const merged = getMergedData();
  return (merged && merged.sins && merged.sins.length > 0) ? merged.sins : (SINS || []);
}

let activeThirdColTab = "perfil";

export function loadPecadoSheet(sin) {
  state.currentSin = sin;
  hideAllScreens();
  document.getElementById("landing-screen")?.classList.add("hidden");
  document.getElementById("pecado-screen")?.classList.remove("hidden");
  renderPecadoSheet();
}

export function renderPecadoSheet() {
  const sin = state.currentSin;
  const screen = document.getElementById("pecado-screen");
  if (!sin || !screen) return;

  const baseExecution = sin.executionMaxBase !== undefined ? sin.executionMaxBase : 8;
  const maxExecution = baseExecution + parseInt(sin.cat || 0) + parseInt(sin.pressure || 0);
  const maxPressure = sin.pressureMax !== undefined ? sin.pressureMax : 6;
  const maxTension = sin.tensionMax !== undefined ? sin.tensionMax : 3;

  // Polaroid Portrait
  const portraitHtml = sin.portrait
    ? `<img src="${sin.portrait}" alt="${esc(sin.name)}">`
    : `<div class="local-image-placeholder" style="display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--text-muted);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span style="font-size:12px; font-weight:bold;">Adicionar Foto</span>
       </div>`;

  // Render Traumas HTML
  let traumasHtml = "";
  for (let i = 0; i < 3; i++) {
    const t = sin.traumas[i] || { question: `Pergunta de Trauma ${i + 1}`, answer: "", revealed: false };
    traumasHtml += `
      <div class="trauma-card-row" data-trauma-idx="${i}">
        <div class="trauma-header-row">
          <input type="text" class="trauma-question conflito-form-input" value="${esc(t.question)}" placeholder="Pergunta de Trauma" data-i18n-placeholder="pecado.traumaQuestionPlaceholder">
          <label class="trauma-revealed-label">
            <input type="checkbox" class="trauma-revealed-checkbox" ${t.revealed ? 'checked' : ''}> <span data-i18n="pecado.traumaRevealed">Revelado</span>
          </label>
        </div>
        <textarea class="trauma-answer-textarea conflito-form-input pecado-field-input pecado-field-h50 mt-4" placeholder="Resposta do hospedeiro investigada..." data-i18n-placeholder="pecado.traumaAnswerPlaceholder">${esc(t.answer)}</textarea>
      </div>
    `;
  }

  // Render Domains HTML
  let domainsHtml = "";
  const sinsData = getSinsData();
  const canonicalData = sinsData.find(d => d.id === sin.type || d.name === sin.type || d.type === sin.type);
  if (sin.type !== "outro" && canonicalData) {
    // List canonical domains
    const availableDomains = canonicalData.domains || [];
    availableDomains.forEach(dom => {
      const isSelected = (sin.domains || []).includes(dom.name);
      domainsHtml += `
        <div class="domain-checkbox-row btn btn-sm btn-sheet-detail-power domain-row-flex ${isSelected ? 'selected' : ''}" data-domain-name="${esc(dom.name)}">
          <input type="checkbox" class="domain-checkbox domain-checkbox-checkbox" ${isSelected ? 'checked' : ''}>
          <div class="flex-1">
            <div class="domain-row-content-header">
              <span>${esc(dom.name)}</span>
              <button type="button" class="btn btn-sm btn-domain-details domain-details-btn" data-domain-name="${esc(dom.name)}">Detalhes</button>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    // Custom Sins: Render 3 inputs for custom domains
    if (!sin.customDomains) sin.customDomains = [
      { name: "", desc: "" },
      { name: "", desc: "" },
      { name: "", desc: "" }
    ];
    for (let i = 0; i < 3; i++) {
      const cd = sin.customDomains[i] || { name: "", desc: "" };
      domainsHtml += `
        <div class="trauma-card-row mb-8" data-cd-idx="${i}">
          <input type="text" class="custom-domain-name conflito-form-input custom-domain-name-input pecado-field-input" value="${esc(cd.name)}" placeholder="Nome do Domínio Customizado" data-i18n-placeholder="pecado.customDomainNamePlaceholder">
          <textarea class="custom-domain-desc conflito-form-input pecado-field-input pecado-field-h45" placeholder="Efeito e descrição do domínio..." data-i18n-placeholder="pecado.customDomainDescPlaceholder">${esc(cd.desc)}</textarea>
        </div>
      `;
    }
  }

  // Render Minions HTML
  let minionsHtml = "";
  if (!sin.minions || sin.minions.length === 0) {
    minionsHtml = `<div class="world-list-empty pecado-empty-list" data-i18n="pecado.noMinions">Nenhum lacaio associado.</div>`;
  } else {
    sin.minions.forEach((m, idx) => {
      minionsHtml += `
        <div class="minion-item-card" data-minion-idx="${idx}">
          <div class="minion-item-header">
            <input type="text" class="minion-name-input" value="${esc(m.name)}" placeholder="Nome do Lacaio" data-i18n-placeholder="pecado.minionNamePlaceholder">
            <div class="pecado-minion-header-actions">
              <span class="pecado-minion-header-label" data-i18n="pecado.talismanLabel">Talismã:</span>
              <input type="text" class="minion-talisman-input" value="${esc(m.talisman || '2')}" placeholder="2">
              <button class="btn-remove-minion" title="Remover lacaio">&times;</button>
            </div>
          </div>
          <textarea class="minion-desc-textarea" placeholder="Descrição ou efeitos especiais..." data-i18n-placeholder="pecado.minionDescPlaceholder">${esc(m.desc || '')}</textarea>
        </div>
      `;
    });
  }

  screen.innerHTML = `
    <div class="world-sheet-screen">
      <!-- Header -->
      <div class="section-header-row pecado-header-row">
        <div class="pecado-title-wrapper">
          <button id="btn-pecado-back" class="btn btn-sm pecado-back-btn" title="Voltar" data-i18n-title="common.back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" class="pecado-back-svg">
              <polyline points="15 18 9 12 15 6" />
            </svg> <span data-i18n="common.back">Voltar</span>
          </button>
          <input type="text" id="pecado-name-header" class="sheet-title-input pecado-name-input" value="${esc(sin.name)}" style="color: white;">
        </div>
        <div class="pecado-header-actions">
          <button id="btn-pecado-delete" class="btn btn-sm btn-danger pecado-delete-btn" style="color: white;" data-i18n="pecado.delete">
            Excluir
          </button>
        </div>
      </div>

      <div class="world-sheet-body">
        <!-- Coluna da Direita: Abas e Painéis -->
        <div class="ref-area-left">
          <div class="flex-col gap-16">
            <!-- Tabs Menu -->
            <div class="pecado-third-col-tabs">
              <button type="button" class="pecado-third-tab-btn ${activeThirdColTab === 'perfil' ? 'active' : ''}" data-tab="perfil" data-i18n="pecado.tab.profile">Perfil</button>
              <button type="button" class="pecado-third-tab-btn ${activeThirdColTab === 'palacio' ? 'active' : ''}" data-tab="palacio" data-i18n="pecado.tab.palace">Palácio</button>
              <button type="button" class="pecado-third-tab-btn ${activeThirdColTab === 'dominios' ? 'active' : ''}" data-tab="dominios" data-i18n="pecado.tab.domains">Domínios</button>
              <button type="button" class="pecado-third-tab-btn ${activeThirdColTab === 'lacaios' ? 'active' : ''}" data-tab="lacaios" data-i18n="pecado.tab.minions">Lacaios</button>
              <button type="button" class="pecado-third-tab-btn ${activeThirdColTab === 'combate' ? 'active' : ''}" data-tab="combate" data-i18n="pecado.tab.combat">Combate</button>
            </div>

            <!-- Tab Content Panels -->
            <div class="pecado-third-col-content">
              <!-- Perfil Panel -->
              <div class="pecado-tab-panel ${activeThirdColTab === 'perfil' ? '' : 'hidden'}" id="panel-perfil">
                <div class="pecado-profile-img-container">
                  <div id="pecado-image-frame">
                    ${portraitHtml}
                    <div class="local-image-overlay"><span>Alterar Imagem</span></div>
                    <input type="file" id="pecado-image-input" accept="image/*" class="pecado-file-input">
                  </div>
                  
                    <div class="pecado-profile-grid-1">
                        
                        <div class="pecado-profile-fields-row">
                          <div>
                            <label class="ws-label" data-i18n="pecado.host">Hospedeiro</label>
                            <input type="text" id="pecado-host" class="conflito-form-input pecado-field-input" value="${esc(sin.hostName)}" placeholder="Nome do Hospedeiro" data-i18n-placeholder="pecado.hostPlaceholder">
                          </div>  
                          <div class="pecado-profile-fields-half">
                              <label class="ws-label" data-i18n="pecado.sinType">Tipo de Pecado</label>
                              <select id="pecado-type" class="conflito-form-input pecado-field-input">
                                <option value="ogro" ${sin.type === 'ogro' ? 'selected' : ''} data-i18n="sins.type.ogro">Ogro (Desespero)</option>
                                <option value="idolo" ${sin.type === 'idolo' ? 'selected' : ''} data-i18n="sins.type.idolo">Ídolo (Desejo)</option>
                                <option value="cao" ${sin.type === 'cao' ? 'selected' : ''} data-i18n="sins.type.cao">Cão (Vingança)</option>
                                <option value="centopeia" ${sin.type === 'centopeia' ? 'selected' : ''} data-i18n="sins.type.centopeia">Centopeia (Ódio)</option>
                                <option value="sapo" ${sin.type === 'sapo' ? 'selected' : ''} data-i18n="sins.type.sapo">Sapo (Indulgência)</option>
                                <option value="lorde" ${sin.type === 'lorde' ? 'selected' : ''} data-i18n="sins.type.lorde">Lorde (Medo)</option>
                                <option value="outro" ${sin.type === 'outro' ? 'selected' : ''} data-i18n="sins.type.outro">Customizado (Outro)</option>
                              </select>
                            </div>
                        </div>
                        <div class="pecado-profile-fields-row">
                          <div class="pecado-profile-fields-half">
                            <label class="ws-label" data-i18n="pecado.form">Forma</label>
                            <select id="pecado-form" class="conflito-form-input pecado-field-input">
                              <option value="Separado" ${sin.form === 'Separado' ? 'selected' : ''} data-i18n="pecado.form.separated">Forma I / Separado</option>
                              <option value="Fundido" ${sin.form === 'Fundido' ? 'selected' : ''} data-i18n="pecado.form.fused">Forma II / Fundido</option>
                              <option value="Vinculado" ${sin.form === 'Vinculado' ? 'selected' : ''} data-i18n="pecado.form.bound">Forma III / Vinculado</option>
                            </select>
                          </div>
                        
                          <div class="pecado-profile-fields-row">
                            <label class="ws-label" data-i18n="pecado.cat">Categoria (CAT)</label>
                            <div id="pecado-cat-selector" class="cat-selector" title="Clique para trocar a categoria">
                              <img id="pecado-cat-img" src="./assets/cat${sin.cat}.png" alt="CAT ${sin.cat}" class="cat-image">
                              <div class="cat-arrows">
                                <button type="button" class="cat-arrow cat-prev">▲</button>
                                <button type="button" class="cat-arrow cat-next">▼</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                  <div class="card-glass pecado-card-padding">
                    <h3 class="ws-section-title pecado-section-title-line" data-i18n="pecado.profileTitle">Perfil do Pecado</h3>
                    <div class="pecado-profile-fields">
                      <div>
                        <label class="ws-label" data-i18n="pecado.desc">Descrição Geral</label>
                        <textarea id="pecado-desc" class="conflito-form-input pecado-field-input pecado-field-h80" placeholder="Descrição geral..." data-i18n-placeholder="pecado.descPlaceholder">${esc(sin.description)}</textarea>
                      </div>
                      <div>
                        <label class="ws-label" data-i18n="pecado.appearance">Aparência</label>
                        <textarea id="pecado-appearance" class="conflito-form-input pecado-field-input pecado-field-h80" placeholder="Descreva a aparência física..." data-i18n-placeholder="pecado.appearancePlaceholder">${esc(sin.appearance || '')}</textarea>
                      </div>
                      <div>
                        <label class="ws-label" data-i18n="pecado.behavior">Comportamento</label>
                        <textarea id="pecado-behavior" class="conflito-form-input pecado-field-input pecado-field-h80" placeholder="Estilo de ação, tiques, atitudes..." data-i18n-placeholder="pecado.behaviorPlaceholder">${esc(sin.behavior || '')}</textarea>
                      </div>
                  </div>
                </div>
                
              </div>
              <!-- Palácio Panel -->
              <div class="pecado-tab-panel ${activeThirdColTab === 'palacio' ? '' : 'hidden'}" id="panel-palacio">
                <div class="card-glass pecado-card-padding">
                  <h3 class="ws-section-title pecado-section-title-line" data-i18n="pecado.palaceTitle">O Palácio</h3>
                  <div class="pecado-profile-fields">
                    <div>
                      <label class="ws-label" data-i18n="pecado.palaceThemes">Temas Comuns</label>
                      <input type="text" id="pecado-palace-themes" class="conflito-form-input pecado-field-input" value="${esc(sin.palace?.themes)}" placeholder="Ex: Escuro, Frio, Imundo" data-i18n-placeholder="pecado.palaceThemesPlaceholder">
                    </div>
                    <div>
                      <label class="ws-label" data-i18n="pecado.palacePlaces">Locais Típicos</label>
                      <input type="text" id="pecado-palace-places" class="conflito-form-input pecado-field-input" value="${esc(sin.palace?.typical_places)}" placeholder="Ex: Esgotos, Galpões abandonados" data-i18n-placeholder="pecado.palacePlacesPlaceholder">
                    </div>
                    <div>
                      <label class="ws-label" data-i18n="pecado.palaceDesc">Descrição do Espaço</label>
                      <textarea id="pecado-palace-desc" class="conflito-form-input pecado-field-input pecado-field-h80" placeholder="Descreva a arquitetura labiríntica e atmosfera do Palácio..." data-i18n-placeholder="pecado.palaceDescPlaceholder">${esc(sin.palace?.desc)}</textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Domínios Panel -->
              <div class="pecado-tab-panel ${activeThirdColTab === 'dominios' ? '' : 'hidden'}" id="panel-dominios">
                <div class="card-glass pecado-card-padding">
                  <h3 class="ws-section-title pecado-section-title-line" data-i18n="pecado.domainsTitle">Domínios do Pecado</h3>
                  <p class="domain-card-desc" data-i18n="pecado.domainsSub">
                    Selecione os 3 domínios ativos.
                  </p>
                  <div id="domains-list-container" class="pecado-domains-scroll">
                    ${domainsHtml}
                  </div>
                </div>
              </div>

              <!-- Lacaios Panel -->
              <div class="pecado-tab-panel ${activeThirdColTab === 'lacaios' ? '' : 'hidden'}" id="panel-lacaios">
                <div class="card-glass pecado-card-padding">
                  <div class="pecado-minions-header">
                    <h3 class="ws-section-title pecado-minions-title" data-i18n="pecado.minionsTitle">Lacaios & Vestígios</h3>
                    <button id="btn-add-minion" class="btn btn-sm pecado-add-minion-btn" data-i18n="pecado.addMinion">+ Lacaio</button>
                  </div>
                  <div class="minions-section-list" id="minions-list-container">
                    ${minionsHtml}
                  </div>
                </div>
              </div>

              <!-- Combate Panel -->
              <div class="pecado-tab-panel ${activeThirdColTab === 'combate' ? '' : 'hidden'}" id="panel-combate">
                <div class="card-glass pecado-card-padding">
                  <h3 class="ws-section-title pecado-section-title-line" data-i18n="pecado.combatTitle">Ataques e Complicações</h3>
                  <div class="pecado-profile-fields">
                    <div>
                      <label class="ws-label" data-i18n="pecado.attacks">Ataques Recomendados</label>
                      <input type="text" id="pecado-attacks" class="conflito-form-input pecado-field-input" value="${esc(sin.attacks)}" placeholder="Armas, dentes, garras..." data-i18n-placeholder="pecado.attacksPlaceholder">
                    </div>
                    <div>
                      <label class="ws-label" data-i18n="pecado.reactionGuide">Dado de Reação (Guia de Dano)</label>
                      <div class="pecado-reaction-box">
                        • <strong>1:</strong> 5 cortes no oponente<br>
                        • <strong>2-3:</strong> 3 cortes no oponente<br>
                        • <strong>4+:</strong> 2 cortes no oponente
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna do Meio: Talismãs e Traumas -->
        <div class="flex-col gap-16">
          <!-- Talismãs Tracker -->
          <div class="card-glass talisman-section pecado-card-padding">
            <h3 class="ws-section-title pecado-section-title-line pecado-settings-row">
              <span data-i18n="pecado.talismanSectionTitle">Talismãs e Marcadores</span>
              <button type="button" id="btn-pecado-status-settings" class="pecado-status-settings-btn" title="${t("pecado.settings.title")}">⚙</button>
            </h3>

            <!-- Talismã de Execução -->
            <div class="talisman-tracker">
              <div class="talisman-header">
                <span class="talisman-title" data-i18n="pecado.executionTalisman">Talismã de Execução</span>
                <div class="talisman-align-group">
                  <label>
                    <input type="checkbox" id="pecado-inside-palace" ${sin.insidePalace ? 'checked' : ''} style="width: 20px; height: 20px;"> <span data-i18n="pecado.insidePalace">No Palácio</span>
                  </label>
                  <span class="talisman-value" id="execution-value">${sin.executionCuts || 0}/${maxExecution}</span>
                </div>
              </div>
              <div class="talisman-formula-text">
                <span data-i18n="pecado.maxCutsFormula">Cortes máximos</span>: ${baseExecution} + CAT (${sin.cat}) + <span data-i18n="pecado.pressure">Pressão</span> (${sin.pressure || 0})
              </div>
              <div class="tracker-control-row">
                <button id="btn-injury-dec" class="btn btn-sm stress-ctrl-btn flex-shrink-0">-</button>
                <div class="execution-tracker flex-1" id="execution-cuts-grid">
                  <img src="./assets/talisma_de_execucao.webp" alt="" class="execution-tracker-bg">
                </div>
                <button id="btn-injury-inc" class="btn btn-sm stress-ctrl-btn flex-shrink-0">+</button>
              </div>
              <div id="execution-status-msg" class="status-msg-executed"></div>
            </div>

            <!-- Talismã de Pressão -->
            <div class="talisman-tracker">
              <div class="talisman-header">
                <span class="talisman-title" data-i18n="pecado.pressureTalisman">Talismã de Pressão</span>
                <span class="talisman-value" id="pressure-value">${sin.pressure || 0}/${maxPressure}</span>
              </div>
              <div class="tracker-control-row">
                <button id="btn-pressure-dec" class="btn btn-sm stress-ctrl-btn flex-shrink-0">-</button>
                <div class="pressure-track flex-1" id="pressure-track">
                  <img src="./assets/talisma_tensao.webp" alt="" class="pressure-tracker-bg object-fit-cover">
                </div>
                <button id="btn-pressure-inc" class="btn btn-sm stress-ctrl-btn flex-shrink-0">+</button>
              </div>
              <div id="pressure-warning" class="warning-box">
                <strong data-i18n="pecado.outOfControl">FORA DE CONTROLE (Pressão ${maxPressure}+):</strong>
                <p data-i18n="pecado.outOfControlDesc">O pecado ganha +1 CAT temporário e efeitos ambientais secundários graves.</p>
                </div>
            </div>

            <!-- Talismã de Tensão -->
            <div class="talisman-tracker">
              <div class="talisman-header">
                <span class="talisman-title" data-i18n="pecado.tensionTalisman">Talismã de Tensão</span>
                <span class="talisman-value" id="tension-value">${sin.tension || 0}/${maxTension}</span>
              </div>
              <div class="tracker-control-row">
                <button id="btn-tension-dec" class="btn btn-sm stress-ctrl-btn flex-shrink-0">-</button>
                <div class="tension-track flex-1" id="tension-track">
                  <img src="./assets/talisma_pressao.webp" alt="" class="tension-tracker-bg object-fit-cover">
                </div>
                <button id="btn-tension-inc" class="btn btn-sm stress-ctrl-btn flex-shrink-0">+</button>
              </div>
              <div class="tension-info-row">
                <span class="tension-info-text" data-i18n="pecado.tensionDesc">
                  Marque ao passar de cena ou obter 1 no dado de risco.
                </span>
                <button id="btn-vazar-tensao" class="btn btn-sm vazar-tension-btn" data-i18n="pecado.leakTension">
                  Vazar Tensão
                </button>
              </div>
            </div>
          </div>

          <!-- Traumas -->
          <div class="card-glass pecado-card-padding">
            <h3 class="ws-section-title pecado-section-title-line" data-i18n="pecado.traumasTitle">Traumas do Pecado (Investigação)</h3>
            <p class="trauma-text-muted" data-i18n="pecado.traumasDesc">
              Perguntas e respostas descobertas pelo grupo de Exorcistas.
            </p>
            <div class="trauma-fields-container">
              ${traumasHtml}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  `;

  // Bind execution cuts
  _renderExecutionCuts(sin, maxExecution);

  // Bind pressure track
  _renderPressureTrack(sin);

  // Bind tension track
  _renderTensionTrack(sin);

  // Bind image upload
  setupImageUpload("pecado-image-frame", "pecado-image-input", sin, saveCurrentSin, "local-image-overlay");

  // Attach event listeners for inputs
  _attachPecadoListeners(sin, maxExecution);
  applyTranslations();
}

function _renderExecutionCuts(sin, maxExecution) {
  const container = document.getElementById("execution-cuts-grid");
  const statusMsg = document.getElementById("execution-status-msg");
  if (!container) return;

  // Preserve the background image
  const img = container.querySelector(".execution-tracker-bg");
  container.innerHTML = "";
  if (img) container.appendChild(img);

  const cuts = sin.executionCuts || 0;
  const rotations = [20, -10, -20, -10, 8, -18, 8, -8, 2, -9, 18];

  for (let i = 1; i <= maxExecution; i++) {
    const line = document.createElement("div");
    line.className = "execution-cut-line" + (i <= cuts ? " filled" : "");
    line.style.left = `${5 + ((i - 1) / Math.max(maxExecution - 1, 1)) * 85}%`;
    line.style.setProperty('--rotate', `${rotations[(i - 1) % rotations.length]}deg`);

    line.addEventListener("click", () => {
      if (i <= cuts) {
        sin.executionCuts = i - 1;
      } else {
        sin.executionCuts = i;
      }
      saveCurrentSin();
      _renderExecutionCuts(sin, maxExecution);
    });
    container.appendChild(line);
  }

  // Update status message
  if (statusMsg) {
    if (cuts >= maxExecution) {
      if (sin.insidePalace) {
        statusMsg.textContent = t("pecado.status.defeated");
        statusMsg.style.color = "#125e30ff";
      } else {
        statusMsg.textContent = t("pecado.status.fled");
        statusMsg.style.color = "#000000ff";
      }
    } else if (!sin.insidePalace && cuts >= 4) {
      statusMsg.textContent = t("pecado.status.fled4");
      statusMsg.style.color = "#000000ff";
    } else {
      statusMsg.textContent = "";
    }
  }
}

function _renderPressureTrack(sin) {
  const container = document.getElementById("pressure-track");
  const warning = document.getElementById("pressure-warning");
  if (!container) return;

  // Preserve the background image
  const img = container.querySelector(".pressure-tracker-bg");
  container.innerHTML = "";
  if (img) container.appendChild(img);

  const pressure = sin.pressure || 0;
  const maxPressure = sin.pressureMax !== undefined ? sin.pressureMax : 6;
  const rotations = [19, -15, 3, -10, 6, -9];

  for (let i = 1; i <= maxPressure; i++) {
    const line = document.createElement("div");
    line.className = "pressure-cut-line" + (i <= pressure ? " filled" : "");
    const leftPercent = maxPressure > 1 ? 10 + ((i - 1) / (maxPressure - 1)) * 70 : 50;
    line.style.left = `${leftPercent}%`;
    line.style.setProperty('--rotate', `${rotations[(i - 1) % rotations.length]}deg`);

    line.addEventListener("click", () => {
      if (i <= pressure) {
        sin.pressure = i - 1;
      } else {
        sin.pressure = i;
      }
      saveCurrentSin();
      renderPecadoSheet(); // Re-render because pressure affects Execution capacity
    });
    container.appendChild(line);
  }

  if (warning) {
    warning.style.display = pressure >= maxPressure ? "block" : "none";
  }
}

function _renderTensionTrack(sin) {
  const container = document.getElementById("tension-track");
  if (!container) return;

  // Preserve the background image
  const img = container.querySelector(".tension-tracker-bg");
  container.innerHTML = "";
  if (img) container.appendChild(img);

  const tension = sin.tension || 0;
  const maxTension = sin.tensionMax !== undefined ? sin.tensionMax : 3;
  const rotations = [8, -5, 3, 6, -9, 2, -3, -6, 7, 5, -8, 11];

  for (let i = 1; i <= maxTension; i++) {
    const line = document.createElement("div");
    line.className = "tension-cut-line" + (i <= tension ? " filled" : "");
    const leftPercent = maxTension > 1 ? 20 + ((i - 1) / (maxTension - 1)) * 55 : 50;
    line.style.left = `${leftPercent}%`;
    line.style.setProperty('--rotate', `${rotations[(i - 1) % rotations.length]}deg`);

    line.addEventListener("click", () => {
      if (i <= tension) {
        sin.tension = i - 1;
      } else {
        sin.tension = i;
      }
      saveCurrentSin();
      if (sin.tension >= maxTension) {
        setTimeout(() => _vazarTensao(sin), 100);
      } else {
        _renderTensionTrack(sin);
        const valSpan = document.getElementById("tension-value");
        if (valSpan) valSpan.textContent = `${sin.tension}/${maxTension}`;
      }
    });
    container.appendChild(line);
  }
}

function _vazarTensao(sin) {
  const maxPressure = sin.pressureMax !== undefined ? sin.pressureMax : 6;
  alert("Tensão atingiu o máximo! Transbordando Tensão:\n1. Aumente a Pressão do Pecado em +1.\n2. Escolha uma Ação de Tensão (Ex: Enviar lacaios, usar Domínio, novo obstáculo).");
  sin.tension = 0;
  sin.pressure = Math.min(maxPressure, (sin.pressure || 0) + 1);
  saveCurrentSin();
  renderPecadoSheet();
}

function _attachPecadoListeners(sin, maxExecution) {
  const screen = document.getElementById("pecado-screen");

  // Voltar
  screen.querySelector("#btn-pecado-back")?.addEventListener("click", () => {
    document.getElementById("pecado-screen")?.classList.add("hidden");
    goToLanding();
  });

  // Settings
  screen.querySelector("#btn-pecado-status-settings")?.addEventListener("click", () => {
    openPecadoStressSettingsModal();
  });

  // Excluir
  screen.querySelector("#btn-pecado-delete")?.addEventListener("click", () => {
    if (confirm(`Deseja realmente excluir a ficha do Pecado "${sin.name}"?`)) {
      const idx = state.sins.findIndex(s => s.id === sin.id);
      if (idx !== -1) {
        state.sins.splice(idx, 1);
        try { localStorage.setItem("cain_sins", JSON.stringify(state.sins)); } catch (e) { }
        state.currentSin = null;
        screen.classList.add("hidden");
        goToLanding();
      }
    }
  });

  // Decrement cuts button
  screen.querySelector("#btn-injury-dec")?.addEventListener("click", () => {
    if (sin.executionCuts > 0) {
      sin.executionCuts--;
      saveCurrentSin();
      const valSpan = document.getElementById("execution-value");
      if (valSpan) valSpan.textContent = `${sin.executionCuts}/${maxExecution}`;
      _renderExecutionCuts(sin, maxExecution);
    }
  });

  // Increment cuts button
  screen.querySelector("#btn-injury-inc")?.addEventListener("click", () => {
    if (sin.executionCuts < maxExecution) {
      sin.executionCuts++;
      saveCurrentSin();
      const valSpan = document.getElementById("execution-value");
      if (valSpan) valSpan.textContent = `${sin.executionCuts}/${maxExecution}`;
      _renderExecutionCuts(sin, maxExecution);
    }
  });

  // Decrement pressure button
  screen.querySelector("#btn-pressure-dec")?.addEventListener("click", () => {
    if (sin.pressure > 0) {
      sin.pressure--;
      saveCurrentSin();
      renderPecadoSheet();
    }
  });

  // Increment pressure button
  const maxPressure = sin.pressureMax !== undefined ? sin.pressureMax : 6;
  const maxTension = sin.tensionMax !== undefined ? sin.tensionMax : 3;

  screen.querySelector("#btn-pressure-inc")?.addEventListener("click", () => {
    if (sin.pressure < maxPressure) {
      sin.pressure++;
      saveCurrentSin();
      renderPecadoSheet();
    }
  });

  // Decrement tension button
  screen.querySelector("#btn-tension-dec")?.addEventListener("click", () => {
    if (sin.tension > 0) {
      sin.tension--;
      saveCurrentSin();
      _renderTensionTrack(sin);
      const valSpan = document.getElementById("tension-value");
      if (valSpan) valSpan.textContent = `${sin.tension}/${maxTension}`;
    }
  });

  // Increment tension button
  screen.querySelector("#btn-tension-inc")?.addEventListener("click", () => {
    if (sin.tension < maxTension) {
      sin.tension++;
      saveCurrentSin();
      if (sin.tension >= maxTension) {
        setTimeout(() => _vazarTensao(sin), 100);
      } else {
        _renderTensionTrack(sin);
        const valSpan = document.getElementById("tension-value");
        if (valSpan) valSpan.textContent = `${sin.tension}/${maxTension}`;
      }
    }
  });

  // Name Header Input
  const nameInput = screen.querySelector("#pecado-name-header");
  nameInput?.addEventListener("input", e => {
    sin.name = e.target.value || "Sem Nome";
    saveCurrentSin();
  });

  // Hospedeiro Input
  screen.querySelector("#pecado-host")?.addEventListener("input", e => {
    sin.hostName = e.target.value;
    saveCurrentSin();
  });

  // Tipo Dropdown
  screen.querySelector("#pecado-type")?.addEventListener("change", e => {
    const newType = e.target.value;
    const oldType = sin.type;
    if (newType !== oldType) {
      if (confirm(`Alterar o tipo de Pecado para "${newType.toUpperCase()}"? Isso irá redefinir as habilidades, aparência, traumas e lacaios para os padrões desse pecado canônico.`)) {
        sin.type = newType;
        const sinsData = getSinsData();
        const canonicalData = sinsData.find(d => d.id === newType || d.name === newType || d.type === newType);
        if (canonicalData) {
          // Pre-populate canonical
          sin.description = canonicalData.description || "";
          sin.appearance = canonicalData.appearance || "";
          sin.behavior = canonicalData.behavior || "";
          sin.traumas = (canonicalData.traumas || []).map(q => ({ question: q, answer: "", revealed: false }));
          sin.palace = {
            desc: canonicalData.palacio?.desc || "",
            themes: (canonicalData.palacio?.themes || []).join(", "),
            typical_places: (canonicalData.palacio?.typical_places || []).join(", ")
          };
          sin.attacks = canonicalData.execution?.attacks_with || "";
          sin.minions = (canonicalData.minions || []).map(m => ({ name: m.name, talisman: m.talisman, desc: m.desc }));
          sin.domains = [];
          sin.customDomains = [];
        } else {
          // Reset custom
          sin.description = "";
          sin.appearance = "";
          sin.behavior = "";
          sin.traumas = [
            { question: "", answer: "", revealed: false },
            { question: "", answer: "", revealed: false },
            { question: "", answer: "", revealed: false }
          ];
          sin.palace = { desc: "", themes: "", typical_places: "" };
          sin.attacks = "";
          sin.minions = [];
          sin.domains = [];
          sin.customDomains = [
            { name: "", desc: "" },
            { name: "", desc: "" },
            { name: "", desc: "" }
          ];
        }
        saveCurrentSin();
        renderPecadoSheet();
      } else {
        e.target.value = oldType;
      }
    }
  });

  // Forma Dropdown
  screen.querySelector("#pecado-form")?.addEventListener("change", e => {
    sin.form = e.target.value;
    saveCurrentSin();
  });

  // CAT Selector
  screen.querySelector("#pecado-cat-selector")?.addEventListener("click", e => {
    let newCat = sin.cat;
    if (e.target.closest(".cat-prev")) {
      newCat = Math.min(7, newCat + 1);
    } else if (e.target.closest(".cat-next")) {
      newCat = Math.max(1, newCat - 1);
    } else {
      return;
    }
    sin.cat = newCat;
    const img = document.getElementById("pecado-cat-img");
    if (img) {
      img.src = `./assets/cat${newCat}.png`;
      img.alt = `CAT ${newCat}`;
    }
    saveCurrentSin();
    // Re-render execution value displaying maximum cuts
    const valSpan = document.getElementById("execution-value");
    const newMax = 8 + sin.cat + (sin.pressure || 0);
    if (valSpan) valSpan.textContent = `${sin.executionCuts || 0}/${newMax}`;
    _renderExecutionCuts(sin, newMax);
  });

  // Descrição Textarea
  screen.querySelector("#pecado-desc")?.addEventListener("input", e => {
    sin.description = e.target.value;
    saveCurrentSin();
  });

  // Aparência Textarea
  screen.querySelector("#pecado-appearance")?.addEventListener("input", e => {
    sin.appearance = e.target.value;
    saveCurrentSin();
  });

  // Comportamento Textarea
  screen.querySelector("#pecado-behavior")?.addEventListener("input", e => {
    sin.behavior = e.target.value;
    saveCurrentSin();
  });

  // No Palácio checkbox
  screen.querySelector("#pecado-inside-palace")?.addEventListener("change", e => {
    sin.insidePalace = e.target.checked;
    saveCurrentSin();
    _renderExecutionCuts(sin, maxExecution);
  });

  // Vazar Tensão Button
  screen.querySelector("#btn-vazar-tensao")?.addEventListener("click", () => {
    _vazarTensao(sin);
  });

  // Traumas Listeners
  screen.querySelectorAll(".trauma-card-row").forEach(row => {
    const idx = parseInt(row.dataset.traumaIdx);
    row.querySelector(".trauma-question")?.addEventListener("input", e => {
      if (!sin.traumas[idx]) sin.traumas[idx] = { question: "", answer: "", revealed: false };
      sin.traumas[idx].question = e.target.value;
      saveCurrentSin();
    });
    row.querySelector(".trauma-answer-textarea")?.addEventListener("input", e => {
      if (!sin.traumas[idx]) sin.traumas[idx] = { question: "", answer: "", revealed: false };
      sin.traumas[idx].answer = e.target.value;
      saveCurrentSin();
    });
    row.querySelector(".trauma-revealed-checkbox")?.addEventListener("change", e => {
      if (!sin.traumas[idx]) sin.traumas[idx] = { question: "", answer: "", revealed: false };
      sin.traumas[idx].revealed = e.target.checked;
      saveCurrentSin();
    });
  });

  // Palácio Inputs
  screen.querySelector("#pecado-palace-themes")?.addEventListener("input", e => {
    if (!sin.palace) sin.palace = {};
    sin.palace.themes = e.target.value;
    saveCurrentSin();
  });
  screen.querySelector("#pecado-palace-places")?.addEventListener("input", e => {
    if (!sin.palace) sin.palace = {};
    sin.palace.typical_places = e.target.value;
    saveCurrentSin();
  });
  screen.querySelector("#pecado-palace-desc")?.addEventListener("input", e => {
    if (!sin.palace) sin.palace = {};
    sin.palace.desc = e.target.value;
    saveCurrentSin();
  });

  // Domínios Listeners
  if (sin.type !== "outro") {
    screen.querySelectorAll(".domain-checkbox-row").forEach(row => {
      const domName = row.dataset.domainName;
      row.querySelector(".btn-domain-details")?.addEventListener("click", e => {
        e.stopPropagation();
        const sinsData = getSinsData();
        const canonicalData = sinsData.find(d => d.id === sin.type || d.name === sin.type || d.type === sin.type);
        const dom = (canonicalData?.domains || []).find(d => d.name === domName);
        if (dom) {
          import("./sheet.js").then(({ showPowerDetailPopup }) => {
            showPowerDetailPopup({ name: dom.name, desc: dom.desc });
          });
        }
      });

      row.addEventListener("click", e => {
        if (e.target.closest(".btn-domain-details") || e.target.type === "checkbox") return; // Lida pelo botão/checkbox change
        const checkbox = row.querySelector(".domain-checkbox");
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      });
      row.querySelector(".domain-checkbox")?.addEventListener("change", e => {
        if (!sin.domains) sin.domains = [];
        const isChecked = e.target.checked;
        if (isChecked) {
          if (sin.domains.length >= 3) {
            alert("Um pecado pode ter no máximo 3 Domínios ativos.");
            e.target.checked = false;
            return;
          }
          if (!sin.domains.includes(domName)) sin.domains.push(domName);
          row.classList.add("selected");
        } else {
          sin.domains = sin.domains.filter(d => d !== domName);
          row.classList.remove("selected");
        }
        saveCurrentSin();
      });
    });
  } else {
    // Custom domain listeners
    screen.querySelectorAll("[data-cd-idx]").forEach(row => {
      const idx = parseInt(row.dataset.cdIdx);
      row.querySelector(".custom-domain-name")?.addEventListener("input", e => {
        sin.customDomains[idx].name = e.target.value;
        saveCurrentSin();
      });
      row.querySelector(".custom-domain-desc")?.addEventListener("input", e => {
        sin.customDomains[idx].desc = e.target.value;
        saveCurrentSin();
      });
    });
  }

  // Attacks Input
  screen.querySelector("#pecado-attacks")?.addEventListener("input", e => {
    sin.attacks = e.target.value;
    saveCurrentSin();
  });

  // Minions Add Button
  screen.querySelector("#btn-add-minion")?.addEventListener("click", () => {
    if (!sin.minions) sin.minions = [];
    sin.minions.push({ name: "Novo Lacaio", talisman: "2", desc: "" });
    saveCurrentSin();
    renderPecadoSheet();
  });

  // Minions Items Listeners
  screen.querySelectorAll(".minion-item-card").forEach(card => {
    const idx = parseInt(card.dataset.minionIdx);
    card.querySelector(".minion-name-input")?.addEventListener("input", e => {
      sin.minions[idx].name = e.target.value;
      saveCurrentSin();
    });
    card.querySelector(".minion-talisman-input")?.addEventListener("input", e => {
      sin.minions[idx].talisman = e.target.value;
      saveCurrentSin();
    });
    card.querySelector(".minion-desc-textarea")?.addEventListener("input", e => {
      sin.minions[idx].desc = e.target.value;
      saveCurrentSin();
    });
    card.querySelector(".btn-remove-minion")?.addEventListener("click", () => {
      sin.minions.splice(idx, 1);
      saveCurrentSin();
      renderPecadoSheet();
    });
  });

  // Third column tabs logic
  screen.querySelectorAll(".pecado-third-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      activeThirdColTab = tab;

      // Update tab buttons active classes
      screen.querySelectorAll(".pecado-third-tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === tab);
      });

      // Update tab panels hidden classes
      screen.querySelectorAll(".pecado-tab-panel").forEach(panel => {
        panel.classList.toggle("hidden", panel.id !== `panel-${tab}`);
      });
    });
  });
}

// Criação de Pecado a partir de modal
export function startNewPecado(name = "Novo Pecado", hostName = "", type = "ogro") {
  const newSin = {
    id: "sin_" + Date.now(),
    name: name,
    hostName: hostName,
    type: type,
    form: "Separado",
    cat: 1,
    portrait: "",
    description: "",
    appearance: "",
    behavior: "",
    traumas: [
      { question: "", answer: "", revealed: false },
      { question: "", answer: "", revealed: false },
      { question: "", answer: "", revealed: false }
    ],
    palace: { desc: "", themes: "", typical_places: "" },
    pressure: 0,
    tension: 0,
    executionCuts: 0,
    domains: [],
    customDomains: [
      { name: "", desc: "" },
      { name: "", desc: "" },
      { name: "", desc: "" }
    ],
    minions: [],
    attacks: "",
    notes: ""
  };

  // Pre-populate canonical if available
  const sinsData = getSinsData();
  const canonicalData = sinsData.find(d => d.id === type || d.name === type || d.type === type);
  if (canonicalData) {
    newSin.description = canonicalData.description || "";
    newSin.appearance = canonicalData.appearance || "";
    newSin.behavior = canonicalData.behavior || "";
    newSin.traumas = (canonicalData.traumas || []).map(q => ({ question: q, answer: "", revealed: false }));
    newSin.palace = {
      desc: canonicalData.palacio?.desc || "",
      themes: (canonicalData.palacio?.themes || []).join(", "),
      typical_places: (canonicalData.palacio?.typical_places || []).join(", ")
    };
    newSin.attacks = canonicalData.execution?.attacks_with || "";
    newSin.minions = (canonicalData.minions || []).map(m => ({ name: m.name, talisman: m.talisman, desc: m.desc }));
  }

  state.sins.push(newSin);
  try { localStorage.setItem("cain_sins", JSON.stringify(state.sins)); } catch (e) { }

  loadPecadoSheet(newSin);
}

export function openPecadoStressSettingsModal() {
  const sin = state.currentSin;
  if (!sin) return;

  const baseExecution = sin.executionMaxBase !== undefined ? sin.executionMaxBase : 8;
  const maxPressure = sin.pressureMax !== undefined ? sin.pressureMax : 6;
  const maxTension = sin.tensionMax !== undefined ? sin.tensionMax : 3;

  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.closest(".modal-content");
  if (modalContent) {
    modalContent.style.maxWidth = "450px";
  }

  el.modalBody.innerHTML = `
    <h3 class="modal-title">${t("pecado.settings.title")}</h3>
    <p class="pecado-settings-desc">${t("pecado.settings.desc")}</p>
    <div class="pecado-settings-container">
      <div class="pecado-settings-row">
        <span>${t("pecado.settings.baseExecution")}</span>
        <div class="pecado-settings-controls">
          <button type="button" class="btn btn-sm pecado-settings-btn-padding" id="btn-modal-exec-dec">-</button>
          <span id="lbl-modal-exec">${baseExecution}</span>
          <button type="button" class="btn btn-sm pecado-settings-btn-padding" id="btn-modal-exec-inc">+</button>
        </div>
      </div>
      <div class="pecado-settings-row">
        <span>${t("pecado.settings.maxPressure")}</span>
        <div class="pecado-settings-controls">
          <button type="button" class="btn btn-sm pecado-settings-btn-padding" id="btn-modal-pressure-dec">-</button>
          <span id="lbl-modal-pressure">${maxPressure}</span>
          <button type="button" class="btn btn-sm pecado-settings-btn-padding" id="btn-modal-pressure-inc">+</button>
        </div>
      </div>
      <div class="pecado-settings-row">
        <span>${t("pecado.settings.maxTension")}</span>
        <div class="pecado-settings-controls">
          <button type="button" class="btn btn-sm pecado-settings-btn-padding" id="btn-modal-tension-dec">-</button>
          <span id="lbl-modal-tension">${maxTension}</span>
          <button type="button" class="btn btn-sm pecado-settings-btn-padding" id="btn-modal-tension-inc">+</button>
        </div>
      </div>
    </div>
    <div class="pecado-settings-footer">
      <button class="btn btn-primary" id="btn-pecado-settings-close">${t("pecado.settings.ok")}</button>
    </div>
  `;

  let currentBaseExecution = baseExecution;
  let currentMaxPressure = maxPressure;
  let currentMaxTension = maxTension;

  const closeModal = () => {
    el.modalContainer.classList.add("hidden");
    if (modalContent) {
      modalContent.style.maxWidth = "";
    }
  };

  document.getElementById("btn-pecado-settings-close").onclick = closeModal;

  const bindControl = (decId, incId, lblId, min, max, getValue, setValue) => {
    document.getElementById(decId).onclick = () => {
      const val = Math.max(min, getValue() - 1);
      setValue(val);
      document.getElementById(lblId).textContent = val;
      renderPecadoSheet();
    };
    document.getElementById(incId).onclick = () => {
      const val = Math.min(max, getValue() + 1);
      setValue(val);
      document.getElementById(lblId).textContent = val;
      renderPecadoSheet();
    };
  };

  bindControl(
    "btn-modal-exec-dec", "btn-modal-exec-inc", "lbl-modal-exec",
    1, 20,
    () => currentBaseExecution,
    (val) => {
      currentBaseExecution = val;
      sin.executionMaxBase = val;
      saveCurrentSin();
    }
  );

  bindControl(
    "btn-modal-pressure-dec", "btn-modal-pressure-inc", "lbl-modal-pressure",
    1, 10,
    () => currentMaxPressure,
    (val) => {
      currentMaxPressure = val;
      sin.pressureMax = val;
      saveCurrentSin();
    }
  );

  bindControl(
    "btn-modal-tension-dec", "btn-modal-tension-inc", "lbl-modal-tension",
    1, 10,
    () => currentMaxTension,
    (val) => {
      currentMaxTension = val;
      sin.tensionMax = val;
      saveCurrentSin();
    }
  );
}
