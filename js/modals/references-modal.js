import { el, state } from "../state.js";
import { worldState } from "../world-state.js";
import { esc } from "../screen-utils.js";

export function openSelectReferencesModal(title, stateKey, currentIds, callback, isSingle = false) {
  if (!el.modalContainer || !el.modalBody) return;
  el.modalContainer.classList.remove("hidden");

  const items = stateKey === "characters"
    ? (window._worldStateCharacters || [])
    : (worldState[stateKey] || []);

  let selectedSet = new Set(Array.isArray(currentIds) ? currentIds : (currentIds ? [currentIds] : []));

  function renderList(filterText = "") {
    const listContainer = el.modalBody.querySelector(".ref-modal-list");
    if (!listContainer) return;

    const filtered = items.filter(item => {
      const name = (item.name || item.nome || item.titulo || "").toLowerCase();
      return name.includes(filterText.toLowerCase());
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div class="text-secondary-xs" style="text-align:center; padding:16px;">Nenhum item encontrado.</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(item => {
      const name = item.name || item.nome || item.titulo || item.id;
      const isSelected = selectedSet.has(item.id);
      return `
        <label class="list-item-row" style="gap:10px; padding:10px; border-radius:6px; border:1px solid ${isSelected ? 'var(--border-color, #3b82f6)' : 'rgba(255,255,255,0.05)'}; cursor:pointer; user-select:none; transition:all 0.2s;">
          <input type="${isSingle ? 'radio' : 'checkbox'}" name="ref-item" value="${item.id}" ${isSelected ? 'checked' : ''} style="cursor:pointer;">
          <span style="font-size:14px; color:#fff;">${esc(name)}</span>
        </label>
      `;
    }).join("");

    listContainer.querySelectorAll('input[name="ref-item"]').forEach(input => {
      input.addEventListener("change", (e) => {
        const val = e.target.value;
        if (isSingle) {
          selectedSet.clear();
          if (e.target.checked) {
            selectedSet.add(val);
          }
        } else {
          if (e.target.checked) {
            selectedSet.add(val);
          } else {
            selectedSet.delete(val);
          }
        }
        renderList(document.getElementById("ref-modal-search").value);
      });
    });
  }

  el.modalBody.innerHTML = `
    <h3 class="modal-title" style="margin-bottom: 16px;">${esc(title)}</h3>
    <div style="margin-bottom: 12px;">
      <input type="text" id="ref-modal-search" class="ws-input input-styled" placeholder="Buscar...">
    </div>
    <div class="ref-modal-list scrollable-list" style="max-height: 45vh; margin-bottom: 16px;">
    </div>
    <div class="modal-footer">
      <button id="btn-ref-modal-cancel" class="btn btn-secondary">Cancelar</button>
      <button id="btn-ref-modal-confirm" class="btn btn-success">Confirmar</button>
    </div>
  `;

  renderList();

  const searchInput = document.getElementById("ref-modal-search");
  searchInput.addEventListener("input", (e) => {
    renderList(e.target.value);
  });

  const closeModal = () => el.modalContainer.classList.add("hidden");

  const closeBtn = el.modalContainer.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }
  document.getElementById("btn-ref-modal-cancel").onclick = closeModal;

  document.getElementById("btn-ref-modal-confirm").onclick = () => {
    callback(Array.from(selectedSet));
    closeModal();
  };
}
