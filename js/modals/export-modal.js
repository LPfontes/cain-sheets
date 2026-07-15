import { el, state } from "../state.js";
import { esc } from "../screen-utils.js";

export function openExportModal() {
  if (!el.modalContainer || !el.modalBody) return;
  el.modalContainer.classList.remove("hidden");

  const chars = state.characters || [];
  const listHtml = chars.length === 0
    ? `<div class="text-secondary-md" style="padding:20px;text-align:center;color:var(--text-muted);">Nenhuma ficha salva.</div>`
    : chars.map(char => `
      <div class="list-item-row" style="padding:10px 12px; margin-bottom:6px;">
        <span class="item-name" style="font-size:var(--font-size-md);">${esc(char.name)}</span>
        <button class="btn btn-sm btn-blue btn-export-char-modal" data-id="${char.id}" style="white-space:nowrap;">Exportar</button>
      </div>
    `).join("");

  el.modalBody.innerHTML = `
    <div class="settings-modal-content">
      <h3 class="modal-title">Exportar Ficha</h3>
      <div class="text-secondary-md" style="margin-top:12px; margin-bottom:12px;">
        Selecione a ficha que deseja exportar como arquivo JSON.
      </div>
      <div class="scrollable-list" style="max-height:400px;">
        ${listHtml}
      </div>
      <div class="modal-footer">
        <button id="btn-close-export-modal" class="btn btn-md">Fechar</button>
      </div>
    </div>
  `;

  el.modalBody.querySelectorAll(".btn-export-char-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const char = state.characters.find(c => c.id === id);
      if (!char) return;
      const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${char.name.toLowerCase().replace(/\s+/g, "_")}_ficha.json`;
      a.click();
    });
  });

  const closeBtn = el.modalContainer.querySelector(".modal-close");
  if (closeBtn) closeBtn.onclick = () => el.modalContainer.classList.add("hidden");
  document.getElementById("btn-close-export-modal").onclick = () => el.modalContainer.classList.add("hidden");
  el.modalContainer.onclick = (e) => { if (e.target === el.modalContainer) el.modalContainer.classList.add("hidden"); };
}
