import { el } from "../state.js";
import { getCustomBlasphemies, saveCustomBlasphemies } from "../state.js";
import { logger } from "../logger.js";

export function openCreateBlasphemyModal(onCreated) {
  logger.info("Modal: Abrindo modal de criação de Blasfêmia.");

  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.parentElement;

  let imageDataUrl = "";
  let powers = [{ name: "", desc: "" }];

  const renderModal = () => {
    el.modalBody.innerHTML = `
      <h3 class="modal-title blasphemy-modal-title" style="padding: 20px 20px 0;">Criar Nova Blasfêmia</h3>
      <div class="create-blasphemy-layout" style="padding: 16px 20px 0; overflow-y: auto; max-height: 72vh;">

        <div class="create-blasphemy-top-row">

          <!-- Imagem -->
          <div class="create-blasphemy-field">
            <label>Imagem</label>
            <div class="create-blasphemy-image-area">
              <div class="create-blasphemy-image-preview" id="create-blasphemy-img-preview">
                ${imageDataUrl
                  ? `<img src="${imageDataUrl}" alt="Preview">`
                  : '<span class="text-secondary" style="font-size:11px;text-align:center;">Nenhuma imagem</span>'}
              </div>
              <input type="file" id="create-blasphemy-img-input" accept="image/*" style="display:none">
              <button id="btn-create-blasphemy-upload-img" class="btn btn-sm btn-secondary">Selecionar Imagem</button>
            </div>
          </div>

          <!-- Campos principais -->
          <div class="create-blasphemy-main-fields">
            <div class="create-blasphemy-field">
              <label>Nome <span class="text-danger">*</span></label>
              <input type="text" id="create-blasphemy-name" class="input-styled" placeholder="Ex: Tensão, Ardência..." required>
            </div>

            <div class="create-blasphemy-field">
              <label>Descrição</label>
              <textarea id="create-blasphemy-desc" class="input-styled create-blasphemy-textarea" placeholder="Descrição da blasfêmia..."></textarea>
            </div>

            <div class="create-blasphemy-two-col">
              <div class="create-blasphemy-field">
                <label>Fato</label>
                <textarea id="create-blasphemy-fato" class="input-styled create-blasphemy-textarea" placeholder="Fato interessante..."></textarea>
              </div>
              <div class="create-blasphemy-field">
                <label>Passiva</label>
                <textarea id="create-blasphemy-passive" class="input-styled create-blasphemy-textarea" placeholder="Habilidade passiva... (pode usar HTML)"></textarea>
              </div>
            </div>
          </div>

        </div>

        <!-- Poderes -->
        <div class="create-blasphemy-field" style="margin-top: 4px;">
          <div class="create-blasphemy-powers-header">
            <label>Poderes <span class="text-danger">*</span></label>
            <button id="btn-add-power" class="btn btn-sm btn-secondary">+ Adicionar Poder</button>
          </div>
          <div id="create-blasphemy-powers-list" class="create-blasphemy-powers-list">
            ${powers.map((p, i) => `
              <div class="create-blasphemy-power-item" data-index="${i}">
                <div class="create-blasphemy-power-fields">
                  <input type="text" class="input-styled power-name-input" placeholder="Nome do poder" value="${p.name.replace(/"/g, '&quot;')}">
                  <textarea class="input-styled create-blasphemy-textarea power-desc-input" placeholder="Descrição do poder... (pode usar HTML)">${p.desc.replace(/"/g, '&quot;')}</textarea>
                </div>
                <button class="btn btn-sm btn-remove-power" data-index="${i}" ${powers.length <= 1 ? 'disabled style="opacity:0.3"' : ''}>&times;</button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="modal-action-footer">
        <button id="btn-create-blasphemy-cancel" class="btn btn-md btn-secondary">Cancelar</button>
        <button id="btn-create-blasphemy-save" class="btn btn-md btn-blasphemy-save">Criar Blasfêmia</button>
      </div>
    `;

    document.getElementById("btn-create-blasphemy-cancel").onclick = closeModal;
    document.getElementById("btn-create-blasphemy-save").onclick = handleSave;

    const uploadBtn = document.getElementById("btn-create-blasphemy-upload-img");
    const fileInput = document.getElementById("create-blasphemy-img-input");
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1.5 * 1024 * 1024) {
        alert("A imagem é muito grande! Escolha uma menor que 1.5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const tempImg = new Image();
        tempImg.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 300;
          let width = tempImg.width, height = tempImg.height;
          if (width > height) {
            if (width > MAX) { height *= MAX / width; width = MAX; }
          } else {
            if (height > MAX) { width *= MAX / height; height = MAX; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(tempImg, 0, 0, width, height);
          imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          renderModal();
        };
        tempImg.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    };

    document.getElementById("btn-add-power").onclick = () => {
      powers.push({ name: "", desc: "" });
      renderModal();
    };

    document.querySelectorAll(".btn-remove-power").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        if (powers.length <= 1) return;
        powers.splice(idx, 1);
        renderModal();
      };
    });

    document.querySelectorAll(".power-name-input").forEach((input, i) => {
      input.oninput = () => { powers[i].name = input.value; };
    });
    document.querySelectorAll(".power-desc-input").forEach((input, i) => {
      input.oninput = () => { powers[i].desc = input.value; };
    });
  };

  const validate = () => {
    const name = document.getElementById("create-blasphemy-name")?.value.trim();
    if (!name) { alert("O nome da blasfêmia é obrigatório."); return false; }
    const validPowers = powers.filter(p => p.name.trim());
    if (validPowers.length === 0) { alert("Adicione pelo menos um poder com nome."); return false; }
    return true;
  };

  const handleSave = () => {
    const name = document.getElementById("create-blasphemy-name")?.value.trim();
    if (!validate()) return;

    const desc = document.getElementById("create-blasphemy-desc")?.value.trim() || "";
    const fato = document.getElementById("create-blasphemy-fato")?.value.trim() || "";
    const passive = document.getElementById("create-blasphemy-passive")?.value.trim() || "";
    const validPowers = powers.filter(p => p.name.trim()).map(p => ({ name: p.name.trim(), desc: p.desc.trim() }));

    const newBlasphemy = {
      id: "custom_" + Date.now(),
      name,
      img: imageDataUrl || "",
      desc,
      fato,
      passive,
      powers: validPowers
    };

    const customList = getCustomBlasphemies();
    customList.push(newBlasphemy);
    saveCustomBlasphemies(customList);
    logger.info(`Nova blasfêmia customizada criada: "${name}" (${newBlasphemy.id})`);
    closeModal();
    if (typeof onCreated === "function") onCreated(newBlasphemy);
  };

  const closeModal = () => {
    el.modalContainer.classList.add("hidden");
  };

  renderModal();
}
