/* js/missao.js - Ficha de Investigação / Missão para CAIN RPG */

import { el, state, saveCurrentMission } from "./state.js";
import { hideAllScreens, goToLanding, esc } from "./screen-utils.js";

let activeNodeId = null;

export function startNewMission(name = "Nova Investigação", sinId = "", hook = "") {
  // Encontrar pecado para pré-carregar informações essenciais
  const sin = state.sins.find(s => s.id === sinId);
  let hostName = "";
  let trauma1 = "";
  let trauma2 = "";
  let trauma3 = "";
  let palaceLoc = "";

  if (sin) {
    hostName = sin.hostName || "";
    trauma1 = sin.traumas?.[0]?.answer || sin.traumas?.[0]?.question || "";
    trauma2 = sin.traumas?.[1]?.answer || sin.traumas?.[1]?.question || "";
    trauma3 = sin.traumas?.[2]?.answer || sin.traumas?.[2]?.question || "";
    palaceLoc = sin.palace?.desc || "";
  }

  const newMission = {
    id: "mission_" + Date.now(),
    name: name,
    hook: hook,
    sinId: sinId,
    hostName: hostName,
    hostStatus: "",
    hostIdentity: "",
    trauma1: trauma1,
    trauma2: trauma2,
    trauma3: trauma3,
    palaceLoc: palaceLoc,
    nodes: [],
    customNotes: ""
  };

  state.missions.push(newMission);
  try {
    localStorage.setItem("cain_missions", JSON.stringify(state.missions));
  } catch (e) {
    console.error("Erro ao salvar nova missão:", e);
  }

  loadMissionSheet(newMission);
}

export function loadMissionSheet(mission) {
  state.currentMission = mission;
  activeNodeId = null; // Reset selection
  hideAllScreens();
  document.getElementById("landing-screen")?.classList.add("hidden");
  document.getElementById("missao-screen")?.classList.remove("hidden");
  renderMissionSheet();
}

let staticListenersAttached = false;

export function renderMissionSheet() {
  const mission = state.currentMission;
  const screen = document.getElementById("missao-screen");
  if (!mission || !screen) return;

  // Atualizar valores dos inputs estáticos
  const nameHeader = document.getElementById("missao-name-header");
  if (nameHeader) nameHeader.value = mission.name;

  const hookTextarea = document.getElementById("missao-hook");
  if (hookTextarea) hookTextarea.value = mission.hook || "";

  const hostNameInput = document.getElementById("missao-host-name");
  if (hostNameInput) hostNameInput.value = mission.hostName || "";

  const hostStatusInput = document.getElementById("missao-host-status");
  if (hostStatusInput) hostStatusInput.value = mission.hostStatus || "";

  const trauma1Textarea = document.getElementById("missao-trauma1");
  if (trauma1Textarea) trauma1Textarea.value = mission.trauma1 || "";

  const trauma2Textarea = document.getElementById("missao-trauma2");
  if (trauma2Textarea) trauma2Textarea.value = mission.trauma2 || "";

  const trauma3Textarea = document.getElementById("missao-trauma3");
  if (trauma3Textarea) trauma3Textarea.value = mission.trauma3 || "";

  const palaceTextarea = document.getElementById("missao-palace");
  if (palaceTextarea) palaceTextarea.value = mission.palaceLoc || "";

  const customNotesTextarea = document.getElementById("missao-custom-notes");
  if (customNotesTextarea) customNotesTextarea.value = mission.customNotes || "";

  // Renderizar opções de Pecados no select
  const sinSelect = document.getElementById("missao-sin-id");
  if (sinSelect) {
    const sinsOptions = state.sins.map(s => `
      <option value="${s.id}" ${s.id === mission.sinId ? "selected" : ""}>${esc(s.name)}</option>
    `).join("");
    sinSelect.innerHTML = `<option value="">Nenhum</option>${sinsOptions}`;
  }

  _renderNodesList(mission);
  _renderNodeDetails(mission);

  if (!staticListenersAttached) {
    _attachListeners();
    staticListenersAttached = true;
  }
}

function _renderNodesList(mission) {
  const container = document.getElementById("nodes-categories-list");
  if (!container) return;

  const categories = [
    { type: "pessoa", label: "Pessoas / NPCs" },
    { type: "local", label: "Locais" },
    { type: "evidencia", label: "Evidências" },
    { type: "objeto", label: "Objetos" },
    { type: "obstaculo", label: "Obstáculos / Inimigos" }
  ];

  container.innerHTML = categories.map(cat => {
    const nodes = (mission.nodes || []).filter(n => n.type === cat.type);
    
    const nodesHtml = nodes.map(n => `
      <div class="node-item ${activeNodeId === n.id ? "active" : ""}" data-node-id="${n.id}">
        <span class="node-item-name">${esc(n.name || "Sem Nome")}</span>
        <span class="node-cat-badge badge-cat-${cat.type}">${cat.type}</span>
      </div>
    `).join("");

    return `
      <div class="nodes-category-container">
        <div class="nodes-category-header">${cat.label}</div>
        <div class="nodes-list">
          ${nodesHtml || `<p style="font-size:14px; margin:4px 0 12px 0;">Nenhuma pista nesta categoria.</p>`}
        </div>
      </div>
    `;
  }).join("");

  // Attach click to node list items
  container.querySelectorAll("[data-node-id]").forEach(el => {
    el.addEventListener("click", () => {
      activeNodeId = el.getAttribute("data-node-id");
      _renderNodesList(mission);
      _renderNodeDetails(mission);
    });
  });
}

function _renderNodeDetails(mission) {
  const container = document.getElementById("node-details-container");
  if (!container) return;

  const node = (mission.nodes || []).find(n => n.id === activeNodeId);

  if (!node) {
    container.innerHTML = `
      <div class="card-glass missao-card-padding" style="text-align:center; padding: 40px 20px;">
        <p style="color:var(--text-muted); margin:0;">Selecione uma pista na lista ao lado para ver e configurar suas conexões.</p>
      </div>
    `;
    return;
  }

  // Options for linking OTHER nodes
  const availableToLink = (mission.nodes || []).filter(n => n.id !== node.id && !(node.connections || []).includes(n.id));
  const linkOptions = availableToLink.map(n => `<option value="${n.id}">${esc(n.name)} (${n.type})</option>`).join("");

  // Connected nodes list
  const connectionsHtml = (node.connections || []).map(connId => {
    const connNode = (mission.nodes || []).find(n => n.id === connId);
    if (!connNode) return "";
    return `
      <div class="node-connection-row">
        <span class="node-connection-link" data-goto-node-id="${connNode.id}">${esc(connNode.name)} (${connNode.type})</span>
        <button class="btn-remove-connection" data-remove-conn-id="${connNode.id}">&times;</button>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="card-glass missao-card-padding">
      <div class="missao-node-details-header-container">
        <div class="node-details-header">
          <div class="node-details-title-row">
            <input type="text" id="node-name" class="missao-name-input" style="font-size: var(--font-size-md); padding:0; margin:0;" value="${esc(node.name)}" placeholder="Nome da Pista">
          </div>
        </div>

        <div class="missao-form-group">
          <label style="color:black;">Categoria</label>
          <select id="node-type" class="missao-form-input" style="color:black;">
            <option value="pessoa" ${node.type === "pessoa" ? "selected" : ""}>Pessoa / NPC</option>
            <option value="local" ${node.type === "local" ? "selected" : ""}>Local</option>
            <option value="evidencia" ${node.type === "evidencia" ? "selected" : ""}>Evidência</option>
            <option value="objeto" ${node.type === "objeto" ? "selected" : ""}>Objeto</option>
            <option value="obstaculo" ${node.type === "obstaculo" ? "selected" : ""}>Obstáculo / Inimigo</option>
          </select>
        </div>
        <button id="btn-delete-node" class="btn btn-sm btn-danger" style="padding: 2px 8px;">Apagar</button>
      </div>
      <div class="missao-form-group">
        <label>Descrição / Informações Secretas</label>
        <textarea id="node-desc" class="missao-form-input" style="height: 100px; resize: vertical;" placeholder="Descreva os detalhes desta pista...">${esc(node.desc || "")}</textarea>
      </div>

      <!-- TEIA DE CONEXÕES -->
      <div class="node-connections-section">
        <div class="node-connections-title">Teia de Conexões</div>
        <div class="node-connections-list">
          ${connectionsHtml || `<p style="color:var(--text-muted); font-size:11px; margin:0;">Este nó não está conectado a nenhuma outra pista.</p>`}
        </div>

        ${linkOptions ? `
          <div class="connection-add-row">
            <select id="select-add-connection" class="connection-add-select">
              <option value="">-- Conectar a --</option>
              ${linkOptions}
            </select>
            <button id="btn-add-connection" class="btn btn-sm">+ Conectar</button>
          </div>
        ` : ""}
      </div>
    </div>
  `;

  // Bind Col 3 Events
  const nameInput = document.getElementById("node-name");
  const typeSelect = document.getElementById("node-type");
  const descText = document.getElementById("node-desc");

  nameInput?.addEventListener("input", (e) => {
    node.name = e.target.value;
    saveCurrentMission();
    // Re-render list column to update name
    const listEl = document.querySelector(`[data-node-id="${node.id}"] .node-item-name`);
    if (listEl) listEl.textContent = e.target.value;
  });

  typeSelect?.addEventListener("change", (e) => {
    node.type = e.target.value;
    saveCurrentMission();
    renderMissionSheet();
  });

  descText?.addEventListener("input", (e) => {
    node.desc = e.target.value;
    saveCurrentMission();
  });

  document.getElementById("btn-delete-node")?.addEventListener("click", () => {
    if (confirm(`Excluir permanentemente a pista "${node.name}"?`)) {
      // Remove connection references in other nodes
      (mission.nodes || []).forEach(n => {
        n.connections = (n.connections || []).filter(cid => cid !== node.id);
      });
      mission.nodes = (mission.nodes || []).filter(n => n.id !== node.id);
      activeNodeId = null;
      saveCurrentMission();
      renderMissionSheet();
    }
  });

  document.getElementById("btn-add-connection")?.addEventListener("click", () => {
    const select = document.getElementById("select-add-connection");
    const targetId = select?.value;
    if (!targetId) return;

    const targetNode = (mission.nodes || []).find(n => n.id === targetId);
    if (!targetNode) return;

    if (!node.connections) node.connections = [];
    if (!targetNode.connections) targetNode.connections = [];

    if (!node.connections.includes(targetId)) node.connections.push(targetId);
    if (!targetNode.connections.includes(node.id)) targetNode.connections.push(node.id);

    saveCurrentMission();
    renderMissionSheet();
  });

  container.querySelectorAll("[data-goto-node-id]").forEach(el => {
    el.addEventListener("click", () => {
      activeNodeId = el.getAttribute("data-goto-node-id");
      _renderNodesList(mission);
      _renderNodeDetails(mission);
    });
  });

  container.querySelectorAll("[data-remove-conn-id]").forEach(el => {
    el.addEventListener("click", () => {
      const removeId = el.getAttribute("data-remove-conn-id");
      const targetNode = (mission.nodes || []).find(n => n.id === removeId);
      
      node.connections = (node.connections || []).filter(cid => cid !== removeId);
      if (targetNode) {
        targetNode.connections = (targetNode.connections || []).filter(cid => cid !== node.id);
      }

      saveCurrentMission();
      renderMissionSheet();
    });
  });
}

function _attachListeners() {
  const screen = document.getElementById("missao-screen");
  if (!screen) return;

  // Back Button
  screen.querySelector("#btn-missao-back")?.addEventListener("click", () => {
    document.getElementById("missao-screen")?.classList.add("hidden");
    goToLanding();
  });

  // Name header
  screen.querySelector("#missao-name-header")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (!mission) return;
    mission.name = e.target.value || "Nova Investigação";
    saveCurrentMission();
  });

  // Delete Case
  screen.querySelector("#btn-missao-delete")?.addEventListener("click", () => {
    const mission = state.currentMission;
    if (!mission) return;
    if (confirm(`Deseja realmente apagar permanentemente a investigação "${mission.name}"?`)) {
      const idx = state.missions.findIndex(m => m.id === mission.id);
      if (idx !== -1) {
        state.missions.splice(idx, 1);
        try {
          localStorage.setItem("cain_missions", JSON.stringify(state.missions));
        } catch (e) {}
        state.currentMission = null;
        screen.classList.add("hidden");
        goToLanding();
      }
    }
  });

  // Core fields updates
  screen.querySelector("#missao-hook")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.hook = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-sin-id")?.addEventListener("change", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.sinId = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-host-name")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.hostName = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-host-status")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.hostStatus = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-trauma1")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.trauma1 = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-trauma2")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.trauma2 = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-trauma3")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.trauma3 = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-palace")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.palaceLoc = e.target.value;
      saveCurrentMission();
    }
  });

  screen.querySelector("#missao-custom-notes")?.addEventListener("input", (e) => {
    const mission = state.currentMission;
    if (mission) {
      mission.customNotes = e.target.value;
      saveCurrentMission();
    }
  });

  // Add Clue Node button
  screen.querySelector("#btn-add-node")?.addEventListener("click", () => {
    const mission = state.currentMission;
    if (!mission) return;
    const typeSelect = document.getElementById("new-node-type");
    const selectedType = typeSelect ? typeSelect.value : "pessoa";
    const newNode = {
      id: "node_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: "Nova Pista",
      type: selectedType,
      desc: "",
      connections: []
    };
    if (!mission.nodes) mission.nodes = [];
    mission.nodes.push(newNode);
    activeNodeId = newNode.id;

    saveCurrentMission();
    renderMissionSheet();
  });
}
