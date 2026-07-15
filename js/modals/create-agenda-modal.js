import { el } from "../state.js";
import { getCustomAgendas, saveCustomAgendas } from "../state.js";
import { logger } from "../logger.js";

export function openCreateAgendaModal(onCreated) {
  logger.info("Modal: Abrindo modal de criação de Agenda.");

  el.modalContainer.classList.remove("hidden");
  const modalContent = el.modalBody.parentElement;
  modalContent.classList.add("wide-modal");

  let imageDataUrl = "";
  let habilidades = [{ name: "", desc: "" }];

  const renderModal = () => {
    el.modalBody.innerHTML = `
      <h3 class="modal-title">Criar Nova Agenda</h3>
      <div class="create-blasphemy-layout">

        <div class="create-blasphemy-field">
          <label>Ícone</label>
          <div class="create-blasphemy-image-area">
            <div class="create-blasphemy-image-preview" id="create-agenda-img-preview">
              ${imageDataUrl ? `<img src="${imageDataUrl}" alt="Preview">` : '<span class="text-secondary">Nenhuma imagem selecionada</span>'}
            </div>
            <input type="file" id="create-agenda-img-input" accept="image/*" style="display:none">
            <button id="btn-create-agenda-upload-img" class="btn btn-sm btn-secondary">Selecionar Imagem</button>
          </div>
        </div>

        <div class="create-blasphemy-field">
          <label>Nome <span class="text-danger">*</span></label>
          <input type="text" id="create-agenda-name" class="input-styled" placeholder="Ex: Besta, Guardião..." required>
        </div>

        <div class="create-blasphemy-field">
          <label>Descrição</label>
          <textarea id="create-agenda-desc" class="input-styled create-blasphemy-textarea" placeholder="Descrição da agenda..."></textarea>
        </div>

        <div class="create-blasphemy-field">
          <label>Gatilhos Normal (um por linha)</label>
          <textarea id="create-agenda-normal" class="input-styled create-blasphemy-textarea" placeholder="Ex: Participe de uma luta"></textarea>
        </div>

        <div class="create-blasphemy-field">
          <label>Gatilhos Bold (um por linha)</label>
          <textarea id="create-agenda-bold" class="input-styled create-blasphemy-textarea" placeholder="Ex: Se contenha"></textarea>
        </div>

        <div class="create-blasphemy-field">
          <div class="create-blasphemy-powers-header">
            <label>Habilidades <span class="text-danger">*</span></label>
            <button id="btn-add-habilidade" class="btn btn-sm btn-secondary">+ Adicionar Habilidade</button>
          </div>
          <div id="create-agenda-habilidades-list" class="create-blasphemy-powers-list">
            ${habilidades.map((h, i) => `
              <div class="create-blasphemy-power-item" data-index="${i}">
                <div class="create-blasphemy-power-fields">
                  <input type="text" class="input-styled hab-name-input" placeholder="Nome da habilidade" value="${h.name.replace(/"/g, '&quot;')}">
                  <textarea class="input-styled create-blasphemy-textarea hab-desc-input" placeholder="Descrição da habilidade... (pode usar HTML)">${h.desc.replace(/"/g, '&quot;')}</textarea>
                </div>
                <button class="btn btn-sm btn-remove-power" data-index="${i}" ${habilidades.length <= 1 ? 'disabled style="opacity:0.3"' : ''}>&times;</button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <div class="modal-action-footer">
        <button id="btn-create-agenda-cancel" class="btn btn-md btn-secondary">Cancelar</button>
        <button id="btn-create-agenda-save" class="btn btn-md btn-blasphemy-save">Criar Agenda</button>
      </div>
    `;

    document.getElementById("btn-create-agenda-cancel").onclick = closeModal;
    document.getElementById("btn-create-agenda-save").onclick = handleSave;

    const uploadBtn = document.getElementById("btn-create-agenda-upload-img");
    const fileInput = document.getElementById("create-agenda-img-input");
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

    document.getElementById("btn-add-habilidade").onclick = () => {
      habilidades.push({ name: "", desc: "" });
      renderModal();
    };

    document.querySelectorAll(".btn-remove-power").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        if (habilidades.length <= 1) return;
        habilidades.splice(idx, 1);
        renderModal();
      };
    });

    document.querySelectorAll(".hab-name-input").forEach((input, i) => {
      input.oninput = () => { habilidades[i].name = input.value; };
    });
    document.querySelectorAll(".hab-desc-input").forEach((input, i) => {
      input.oninput = () => { habilidades[i].desc = input.value; };
    });
  };

  const validate = () => {
    const name = document.getElementById("create-agenda-name")?.value.trim();
    if (!name) { alert("O nome da agenda é obrigatório."); return false; }
    const validHabilidades = habilidades.filter(h => h.name.trim());
    if (validHabilidades.length === 0) { alert("Adicione pelo menos uma habilidade com nome."); return false; }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const name = document.getElementById("create-agenda-name")?.value.trim();
    const desc = document.getElementById("create-agenda-desc")?.value.trim() || "";
    const normal = document.getElementById("create-agenda-normal")?.value.split("\n").map(s => s.trim()).filter(Boolean) || [];
    const bold = document.getElementById("create-agenda-bold")?.value.split("\n").map(s => s.trim()).filter(Boolean) || [];
    const validHabilidades = habilidades.filter(h => h.name.trim()).map(h => ({ name: h.name.trim(), desc: h.desc.trim() }));

    const newAgenda = {
      id: "custom_" + Date.now(),
      name,
      icon: imageDataUrl || "",
      desc,
      normal,
      bold,
      habilidades: validHabilidades
    };

    const customList = getCustomAgendas();
    customList.push(newAgenda);
    saveCustomAgendas(customList);
    logger.info(`Nova agenda customizada criada: "${name}" (${newAgenda.id})`);
    closeModal();
    if (typeof onCreated === "function") onCreated(newAgenda);
  };

  const closeModal = () => {
    el.modalContainer.classList.add("hidden");
    modalContent.classList.remove("wide-modal");
  };

  renderModal();
}
