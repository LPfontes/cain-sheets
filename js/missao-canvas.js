/* js/missao-canvas.js - Quadro de Investigação Interativo (Canvas) */

import { state, saveCurrentMission } from "./state.js";
import { esc } from "./screen-utils.js";
import { renderMissionSheet } from "./missao.js";
import { t } from "./i18n.js";

// Estado interno do canvas
let scale = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let isDraggingCard = false;
let dragNodeId = null;
let dragStartX = 0;
let dragStartY = 0;
let isDrawingConnection = false;
let connSourceNodeId = null;
let connTempLine = null;

// Elementos do menu hover de cores para conexões
let colorMenuEl = null;
let colorMenuTimeout = null;
let activeConnPairKey = null;
let activeConnNode = null;
let activeConnTargetId = null;

// Elementos DOM cacheados
let canvasArea = null;
let canvasContainer = null;
let viewport = null;
let svgLayer = null;
let cardsLayer = null;

export function initCanvasView() {
  canvasArea = document.getElementById("missao-canvas-area");
  canvasContainer = document.getElementById("canvas-container");
  viewport = document.getElementById("canvas-viewport");
  svgLayer = document.getElementById("canvas-connections-svg");
  cardsLayer = document.getElementById("canvas-cards-layer");

  if (!canvasContainer || !viewport || !svgLayer || !cardsLayer) return;

  // Inicializar o menu hover de cores para conexões
  _initConnectionColorMenu();

  // Registrar listeners de pan e zoom uma única vez
  _setupCanvasInteractions();
  _setupToolbarListeners();
}

function _initConnectionColorMenu() {
  colorMenuEl = document.getElementById("connection-color-menu");
  if (colorMenuEl) return;

  colorMenuEl = document.createElement("div");
  colorMenuEl.id = "connection-color-menu";
  colorMenuEl.className = "hidden card-glass connection-color-menu";
  colorMenuEl.style.position = "absolute";
  colorMenuEl.style.display = "none";
  colorMenuEl.style.zIndex = "2000";
  colorMenuEl.style.opacity = "0";

  // Bolinhas coloridas
  const colorsList = ["red", "orange", "yellow", "green", "cyan", "purple", "white"];
  colorsList.forEach(color => {
    const dot = document.createElement("span");
    dot.className = `color-dot dot-${color}`;
    dot.style.width = "14px";
    dot.style.height = "14px";
    dot.style.cursor = "pointer";
    dot.title = color;

    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (activeConnPairKey && state.currentMission) {
        if (!state.currentMission.connectionColors) state.currentMission.connectionColors = {};
        state.currentMission.connectionColors[activeConnPairKey] = color;
        saveCurrentMission();
        drawConnections();
        _hideColorMenu();
      }
    });
    colorMenuEl.appendChild(dot);
  });

  // Divisor sutil
  const sep = document.createElement("div");
  sep.style.width = "1px";
  sep.style.height = "14px";
  sep.style.background = "rgba(255, 255, 255, 0.15)";
  sep.style.margin = "0 4px";
  colorMenuEl.appendChild(sep);

  // Botão de tesoura para cortar conexão
  const delBtn = document.createElement("span");
  delBtn.innerHTML = "✂️";
  delBtn.style.cursor = "pointer";
  delBtn.style.fontSize = "11px";
  delBtn.title = "Cortar Conexão";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (activeConnNode && activeConnTargetId && confirm("Cortar este fio de conexão?")) {
      activeConnNode.connections = (activeConnNode.connections || []).filter(id => id !== activeConnTargetId);
      const targetNode = state.currentMission.nodes.find(n => n.id === activeConnTargetId);
      if (targetNode) {
        targetNode.connections = (targetNode.connections || []).filter(id => id !== activeConnNode.id);
      }
      saveCurrentMission();
      drawConnections();
      _hideColorMenu();
    }
  });
  colorMenuEl.appendChild(delBtn);

  canvasContainer.appendChild(colorMenuEl);

  // Impedir fechamento se o mouse estiver sobre o menu
  colorMenuEl.addEventListener("mouseenter", () => {
    if (colorMenuTimeout) {
      clearTimeout(colorMenuTimeout);
      colorMenuTimeout = null;
    }
  });

  colorMenuEl.addEventListener("mouseleave", () => {
    _startHideTimer();
  });
}

function _startHideTimer() {
  if (colorMenuTimeout) clearTimeout(colorMenuTimeout);
  colorMenuTimeout = setTimeout(() => {
    _hideColorMenu();
  }, 350);
}

function _hideColorMenu() {
  if (colorMenuEl) {
    colorMenuEl.style.opacity = "0";
    colorMenuEl.style.transform = "translateY(4px)";
    setTimeout(() => {
      if (colorMenuEl && colorMenuEl.style.opacity === "0") {
        colorMenuEl.style.display = "none";
        colorMenuEl.classList.add("hidden");
      }
    }, 150);
  }
  activeConnPairKey = null;
  activeConnNode = null;
  activeConnTargetId = null;
}

export function renderCanvas() {
  const mission = state.currentMission;
  if (!mission || !cardsLayer) return;

  // Limpar camadas
  cardsLayer.innerHTML = "";
  
  // Garantir coordenadas X e Y iniciais para nós existentes
  (mission.nodes || []).forEach((node, index) => {
    if (node.x === undefined || node.y === undefined) {
      // Espalhar nós em um padrão circular no centro inicialmente
      const angle = (index / Math.max(1, mission.nodes.length)) * 2 * Math.PI;
      const radius = 150 + Math.random() * 50;
      node.x = 400 + Math.cos(angle) * radius;
      node.y = 300 + Math.sin(angle) * radius;
    }
  });

  // Renderizar cada card/nó
  (mission.nodes || []).forEach(node => {
    const cardEl = _createCardElement(node);
    cardsLayer.appendChild(cardEl);
  });

  // Atualizar as transformações (pan & zoom) aplicadas ao viewport
  _applyViewportTransforms();

  // Desenhar as linhas de conexão
  drawConnections();
}

function _applyViewportTransforms() {
  if (viewport) {
    viewport.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }
}

// Pan e Zoom do canvas
function _setupCanvasInteractions() {
  // Roda do mouse para Zoom
  canvasContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const oldScale = scale;

    if (e.deltaY < 0) {
      scale = Math.min(2.5, scale * zoomFactor);
    } else {
      scale = Math.max(0.2, scale / zoomFactor);
    }

    // Zoom centrado na posição atual do cursor do mouse
    const rect = canvasContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    panX = mouseX - (mouseX - panX) * (scale / oldScale);
    panY = mouseY - (mouseY - panY) * (scale / oldScale);

    _applyViewportTransforms();
    drawConnections();
  }, { passive: false });

  // Panning com o mouse (botão do meio, ou esquerdo em fundo vazio)
  canvasContainer.addEventListener("mousedown", (e) => {
    const isMiddleButton = e.button === 1;
    const isLeftButton = e.button === 0;
    const isSpacePressed = window.isSpaceBarPressed; // suporte a tecla espaço

    // Inicia panning apenas se clicar no fundo vazio (ou com botão do meio / espaço)
    const clickedBg = e.target === canvasContainer || e.target === viewport || e.target === svgLayer;

    if (isMiddleButton || (isLeftButton && (clickedBg || isSpacePressed))) {
      isPanning = true;
      startPanX = e.clientX - panX;
      startPanY = e.clientY - panY;
      canvasContainer.style.cursor = "grabbing";
      e.preventDefault();
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (isPanning) {
      panX = e.clientX - startPanX;
      panY = e.clientY - startPanY;
      _applyViewportTransforms();
    } else if (isDraggingCard) {
      const node = state.currentMission?.nodes?.find(n => n.id === dragNodeId);
      if (node) {
        // Obter variação de movimento compensando o zoom
        const dx = (e.clientX - dragStartX) / scale;
        const dy = (e.clientY - dragStartY) / scale;
        
        node.x += dx;
        node.y += dy;

        dragStartX = e.clientX;
        dragStartY = e.clientY;

        const cardEl = document.getElementById(`canvas-card-${node.id}`);
        if (cardEl) {
          cardEl.style.left = `${node.x}px`;
          cardEl.style.top = `${node.y}px`;
        }

        drawConnections();
      }
    } else if (isDrawingConnection && connSourceNodeId) {
      // Atualizar linha temporária de conexão
      const sourceCard = document.getElementById(`canvas-card-${connSourceNodeId}`);
      if (sourceCard && svgLayer) {
        const rect = sourceCard.getBoundingClientRect();
        const containerRect = canvasContainer.getBoundingClientRect();

        // Ponto de início da conexão (topo-centro do card de origem)
        const x1 = (rect.left + rect.width / 2 - containerRect.left - panX) / scale;
        const y1 = (rect.top - containerRect.top - panY) / scale;

        // Ponto final (posição do mouse compensando pan & zoom)
        const x2 = (e.clientX - containerRect.left - panX) / scale;
        const y2 = (e.clientY - containerRect.top - panY) / scale;

        if (!connTempLine) {
          connTempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          connTempLine.setAttribute("stroke", "#be3135");
          connTempLine.setAttribute("stroke-width", "2");
          connTempLine.setAttribute("stroke-dasharray", "4 4");
          svgLayer.appendChild(connTempLine);
        }

        connTempLine.setAttribute("x1", x1);
        connTempLine.setAttribute("y1", y1);
        connTempLine.setAttribute("x2", x2);
        connTempLine.setAttribute("y2", y2);
      }
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (isPanning) {
      isPanning = false;
      canvasContainer.style.cursor = "default";
    }

    if (isDraggingCard) {
      isDraggingCard = false;
      dragNodeId = null;
      saveCurrentMission();
    }

    if (isDrawingConnection) {
      // Se soltar em cima de outro card, cria a conexão
      const targetCard = e.target.closest(".canvas-card");
      if (targetCard) {
        const targetNodeId = targetCard.getAttribute("data-node-id");
        if (targetNodeId && targetNodeId !== connSourceNodeId) {
          _connectNodes(connSourceNodeId, targetNodeId);
        }
      }

      if (connTempLine) {
        connTempLine.remove();
        connTempLine = null;
      }
      isDrawingConnection = false;
      connSourceNodeId = null;
    }
  });

  // Gerenciar tecla de espaço para panning rápido
  window.isSpaceBarPressed = false;
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      window.isSpaceBarPressed = true;
      if (canvasContainer) canvasContainer.style.cursor = "grab";
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      window.isSpaceBarPressed = false;
      if (canvasContainer && !isPanning) canvasContainer.style.cursor = "default";
    }
  });
}

function _setupToolbarListeners() {
  const btnAddClue = document.getElementById("btn-canvas-add-clue");
  const btnAddNote = document.getElementById("btn-canvas-add-note");
  const btnAddImage = document.getElementById("btn-canvas-add-image");
  const imageInput = document.getElementById("canvas-image-input");
  const btnFit = document.getElementById("btn-canvas-fit");
  const btnReset = document.getElementById("btn-canvas-reset");
  const btnClear = document.getElementById("btn-canvas-clear");

  btnAddClue?.addEventListener("click", () => {
    const typeSelect = document.getElementById("canvas-add-node-type");
    const type = typeSelect ? typeSelect.value : "pessoa";
    _createNewCanvasNode(t("missions.canvas.defaultNodeTitle"), type);
  });

  btnAddNote?.addEventListener("click", () => {
    _createNewCanvasNode(t("missions.canvas.cat.nota"), "nota");
  });

  btnAddImage?.addEventListener("click", () => {
    imageInput?.click();
  });

  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      _createNewCanvasNode(t("missions.canvas.defaultImageTitle"), "imagem", event.target.result);
      imageInput.value = ""; // reset
    };
    reader.readAsDataURL(file);
  });

  btnFit?.addEventListener("click", fitToScreen);
  btnReset?.addEventListener("click", () => {
    scale = 1.0;
    panX = 0;
    panY = 0;
    _applyViewportTransforms();
    drawConnections();
  });

  btnClear?.addEventListener("click", () => {
    if (confirm(t("missions.canvas.confirmClearAll"))) {
      const mission = state.currentMission;
      if (mission) {
        mission.nodes = [];
        saveCurrentMission();
        renderCanvas();
      }
    }
  });
}

function _createNewCanvasNode(name, type, imageUrl = "") {
  const mission = state.currentMission;
  if (!mission) return;

  // Adicionar no centro do viewport visível
  const rect = canvasContainer.getBoundingClientRect();
  const centerX = (rect.width / 2 - panX) / scale;
  const centerY = (rect.height / 2 - panY) / scale;

  const newNode = {
    id: "node_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name: name,
    type: type,
    desc: type === "nota" ? "Clique duas vezes para editar..." : "",
    connections: [],
    x: centerX - 100,
    y: centerY - 60,
    color: type === "nota" ? "yellow" : "default",
    imageUrl: imageUrl
  };

  if (!mission.nodes) mission.nodes = [];
  mission.nodes.push(newNode);
  saveCurrentMission();
  renderCanvas();
}

function _connectNodes(id1, id2) {
  const mission = state.currentMission;
  if (!mission) return;

  const node1 = mission.nodes.find(n => n.id === id1);
  const node2 = mission.nodes.find(n => n.id === id2);

  if (!node1 || !node2) return;

  if (!node1.connections) node1.connections = [];
  if (!node2.connections) node2.connections = [];

  if (!node1.connections.includes(id2)) node1.connections.push(id2);
  if (!node2.connections.includes(id1)) node2.connections.push(id1);

  saveCurrentMission();
  drawConnections();
}

export function drawConnections() {
  if (!svgLayer || !state.currentMission) return;

  // Limpar linhas existentes, exceto o <defs>
  const lines = svgLayer.querySelectorAll("path, line:not([stroke-dasharray])");
  lines.forEach(l => l.remove());

  const mission = state.currentMission;
  const nodes = mission.nodes || [];
  
  // Rastrear conexões desenhadas para evitar duplicatas (bidirecional)
  const drawn = new Set();

  nodes.forEach(node => {
    const card1 = document.getElementById(`canvas-card-${node.id}`);
    if (!card1) return;

    (node.connections || []).forEach(connId => {
      const pairKey = [node.id, connId].sort().join("-");
      if (drawn.has(pairKey)) return;

      const card2 = document.getElementById(`canvas-card-${connId}`);
      if (!card2) return;

      // Calcular topo-centro
      const r1 = card1.getBoundingClientRect();
      const r2 = card2.getBoundingClientRect();
      const containerRect = canvasContainer.getBoundingClientRect();

      // Compensando pan e zoom para desenhar no sistema de coordenadas interno do SVG
      const x1 = (r1.left + r1.width / 2 - containerRect.left - panX) / scale;
      const y1 = (r1.top - containerRect.top - panY) / scale;
      const x2 = (r2.left + r2.width / 2 - containerRect.left - panX) / scale;
      const y2 = (r2.top - containerRect.top - panY) / scale;

      // Desenhar path do cabo vermelho com uma leve curva estilizada
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Ponto médio com um leve deslocamento para criar uma curva de varal realista
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 + 15; // caimento gravitacional leve

      path.setAttribute("d", `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
      
      // Mapeamento de cores da conexão
      const connColor = (mission.connectionColors && mission.connectionColors[pairKey]) || "red";
      let strokeColor = "#be3135";
      let hoverColor = "#ff4a4e";
      
      if (connColor === "yellow") {
        strokeColor = "#d8b136";
        hoverColor = "#ffeb60";
      } else if (connColor === "green") {
        strokeColor = "#2da522";
        hoverColor = "#5eff4e";
      } else if (connColor === "cyan") {
        strokeColor = "#1a5060";
        hoverColor = "#00c3ff";
      } else if (connColor === "white") {
        strokeColor = "#cccccc";
        hoverColor = "#ffffff";
      } else if (connColor === "purple") {
        strokeColor = "#9a11d7";
        hoverColor = "#ca65ff";
      }

      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "3");
      path.setAttribute("fill", "none");
      path.setAttribute("filter", "url(#glow)");
      path.setAttribute("style", "cursor: pointer; pointer-events: stroke; transition: stroke-width 0.1s, stroke 0.1s;");
      
      // Evento de hover na linha
      path.addEventListener("mouseenter", (e) => {
        path.setAttribute("stroke-width", "5");
        path.setAttribute("stroke", hoverColor);

        if (colorMenuTimeout) {
          clearTimeout(colorMenuTimeout);
          colorMenuTimeout = null;
        }

        activeConnPairKey = pairKey;
        activeConnNode = node;
        activeConnTargetId = connId;

        // Posicionar o menu hover
        if (colorMenuEl) {
          colorMenuEl.classList.remove("hidden");
          const cRect = canvasContainer.getBoundingClientRect();
          // Ponto médio cliente (entre os dois cards)
          const clientMidX = (r1.left + r1.width / 2 + r2.left + r2.width / 2) / 2;
          const clientMidY = (r1.top + r2.top) / 2;

          colorMenuEl.style.display = "flex";
          // Forçar renderização inicial para ler largura real do menu
          const menuW = colorMenuEl.offsetWidth || 150;
          const menuH = colorMenuEl.offsetHeight || 30;

          const menuLeft = clientMidX - cRect.left - menuW / 2;
          const menuTop = clientMidY - cRect.top - menuH - 12;

          colorMenuEl.style.left = `${menuLeft}px`;
          colorMenuEl.style.top = `${menuTop}px`;
          colorMenuEl.style.opacity = "1";
          colorMenuEl.style.transform = "translateY(0)";
        }
      });

      path.addEventListener("mouseleave", () => {
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke", strokeColor);
        _startHideTimer();
      });

      // Cortar conexão com duplo clique como fallback
      path.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        if (confirm("Cortar este fio de conexão?")) {
          node.connections = (node.connections || []).filter(id => id !== connId);
          const targetNode = nodes.find(n => n.id === connId);
          if (targetNode) {
            targetNode.connections = (targetNode.connections || []).filter(id => id !== node.id);
          }
          saveCurrentMission();
          drawConnections();
          _hideColorMenu();
        }
      });

      svgLayer.appendChild(path);
      drawn.add(pairKey);
    });
  });
}

function _createCardElement(node) {
  const card = document.createElement("div");
  card.className = `canvas-card card-glass color-${node.color || "default"} type-${node.type}`;
  card.id = `canvas-card-${node.id}`;
  card.setAttribute("data-node-id", node.id);
  card.style.left = `${node.x}px`;
  card.style.top = `${node.y}px`;

  if (node.width) card.style.width = `${node.width}px`;
  if (node.height) card.style.height = `${node.height}px`;

  // Header do Card (Drag Handle)
  const header = document.createElement("div");
  header.className = "canvas-card-header canvas-card-drag-handle";

  // Ícone/Badge de tipo
  let badgeHtml = "";
  const catText = t(`missions.canvas.cat.${node.type}`);
  if (node.type !== "nota" && node.type !== "imagem") {
    badgeHtml = `<span class="node-cat-badge badge-cat-${node.type}">${catText}</span>`;
  } else if (node.type === "nota") {
    badgeHtml = `<span class="node-cat-badge badge-cat-nota" style="background:#d8b136; color:#000;">${catText}</span>`;
  } else {
    badgeHtml = `<span class="node-cat-badge badge-cat-imagem" style="background:#5e5c5c; color:#fff;">${catText}</span>`;
  }

  header.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; width:100%; pointer-events:none;">
      <span class="card-title-text" style="font-weight:bold; font-family:var(--font-heading); color:white; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:130px;">${esc(node.name)}</span>
      ${badgeHtml}
    </div>
  `;

  // Drag listeners
  header.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // apenas esquerdo
    e.stopPropagation();
    isDraggingCard = true;
    dragNodeId = node.id;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    // Coloca o card arrastado no topo z-index
    document.querySelectorAll(".canvas-card").forEach(c => c.style.zIndex = 10);
    card.style.zIndex = 100;
  });

  card.appendChild(header);

  // Corpo do card
  const body = document.createElement("div");
  body.className = "canvas-card-body";

  // Imagem incorporada
  if (node.imageUrl) {
    const imgWrap = document.createElement("div");
    imgWrap.className = "card-image-wrap";
    imgWrap.innerHTML = `<img src="${node.imageUrl}" alt="${esc(node.name)}" style="width:100%; height:auto; display:block; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.08); object-fit:cover;">`;
    body.appendChild(imgWrap);
  } else if (node.type === "imagem") {
    const imgWrap = document.createElement("div");
    imgWrap.className = "card-image-wrap";
    imgWrap.innerHTML = `
      <div class="image-placeholder" style="height:80px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); border:1px dashed rgba(255,255,255,0.15); border-radius:var(--radius-sm); cursor:pointer;">
        <span style="font-size:20px;">🖼️</span>
        <span style="font-size:10px; color:var(--text-muted);">${t("missions.canvas.clickToUpload")}</span>
      </div>
    `;
    imgWrap.addEventListener("click", () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          node.imageUrl = event.target.result;
          saveCurrentMission();
          renderCanvas();
        };
        reader.readAsDataURL(file);
      };
      fileInput.click();
    });
    body.appendChild(imgWrap);
  }

  // Descrição
  const descEl = document.createElement("div");
  descEl.className = "card-desc-text";
  descEl.innerHTML = esc(node.desc || t("missions.canvas.noDescDoubleTap"));
  body.appendChild(descEl);

  card.appendChild(body);

  // Knob/Alça de Conexão (Desenhar nova linha)
  const connector = document.createElement("div");
  connector.className = "card-connector-handle";
  connector.title = t("missions.canvas.connectorTitle");
  connector.innerHTML = "📌";

  connector.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    isDrawingConnection = true;
    connSourceNodeId = node.id;
  });

  card.appendChild(connector);

  // Ações rápidas no rodapé do Card (Mudar cor, deletar)
  const footer = document.createElement("div");
  footer.className = "canvas-card-footer";
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.alignItems = "center";
  footer.style.marginTop = "8px";
  footer.style.borderTop = "1px solid rgba(255,255,255,0.05)";
  footer.style.paddingTop = "4px";

  // Menu de cores
  const colors = ["default", "red", "orange", "yellow", "green", "cyan", "purple"];
  const colorPicker = document.createElement("div");
  colorPicker.style.display = "flex";
  colorPicker.style.gap = "4px";
  
  colors.forEach(c => {
    const dot = document.createElement("span");
    dot.className = `color-dot dot-${c} ${node.color === c ? "active" : ""}`;
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      node.color = c;
      saveCurrentMission();
      renderCanvas();
    });
    colorPicker.appendChild(dot);
  });

  footer.appendChild(colorPicker);

  // Excluir card
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.style.background = "none";
  deleteBtn.style.border = "none";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontSize = "12px";
  deleteBtn.title = t("missions.canvas.deleteCardTitle");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(t("missions.canvas.confirmDeleteCard").replace("{name}", node.name))) {
      // Remove do state
      const mission = state.currentMission;
      mission.nodes = (mission.nodes || []).filter(n => n.id !== node.id);
      
      // Remove conexões de terceiros
      mission.nodes.forEach(n => {
        n.connections = (n.connections || []).filter(cid => cid !== node.id);
      });

      saveCurrentMission();
      renderCanvas();
      renderMissionSheet(); // Atualiza a aba lista se o usuário voltar
    }
  });

  footer.appendChild(deleteBtn);
  card.appendChild(footer);

  // Clique duplo para editar dados
  card.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    _showCardEditModal(node);
  });

  // Handle de Redimensionamento
  const resizer = document.createElement("div");
  resizer.className = "card-resizer-handle";
  resizer.innerHTML = "◢";
  resizer.title = t("missions.canvas.resizerTitle");
  resizer.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // apenas esquerdo
    e.stopPropagation();
    e.preventDefault();
    
    const startW = card.offsetWidth;
    const startH = card.offsetHeight;
    const mouseStartX = e.clientX;
    const mouseStartY = e.clientY;
    
    const onMouseMove = (moveEvent) => {
      const dw = (moveEvent.clientX - mouseStartX) / scale;
      const dh = (moveEvent.clientY - mouseStartY) / scale;
      
      const newW = Math.max(150, startW + dw);
      const newH = Math.max(80, startH + dh);
      
      card.style.width = `${newW}px`;
      card.style.height = `${newH}px`;
      
      node.width = newW;
      node.height = newH;
      
      drawConnections();
    };
    
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      saveCurrentMission();
    };
    
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });
  card.appendChild(resizer);

  return card;
}

// Modal simplificado de edição do card usando o modal genérico da página
function _showCardEditModal(node) {
  const container = document.getElementById("modal-container");
  const body = document.getElementById("modal-body");
  if (!container || !body) return;

  const typeOptions = [
    { value: "pessoa", label: "Pessoa / NPC" },
    { value: "local", label: "Local" },
    { value: "evidencia", label: "Evidência" },
    { value: "objeto", label: "Objeto" },
    { value: "obstaculo", label: "Obstáculo / Inimigo" },
    { value: "nota", label: "Nota Adesiva" },
    { value: "imagem", label: "Foto / Imagem" }
  ].map(opt => `<option value="${opt.value}" ${node.type === opt.value ? "selected" : ""}>${opt.label}</option>`).join("");

  body.innerHTML = `
    <h3 class="modal-title" style="margin-bottom:15px; font-family:var(--font-heading); text-transform:uppercase;">Editar Elemento</h3>
    <div class="missao-form-group">
      <label style="color: black !important;; display:block; font-size:12px; margin-bottom:4px;">Título / Nome</label>
      <input type="text" id="modal-edit-name" class="missao-form-input" style="color:black !important;" value="${esc(node.name || "")}" placeholder="Título">
    </div>
    <div class="missao-form-group">
      <label style="color:black !important; display:block; font-size:12px; margin-bottom:4px;">Categoria</label>
      <select id="modal-edit-type" class="missao-form-input" style="color:black !important;">
        ${typeOptions}
      </select>
    </div>
    <div class="missao-form-group">
      <label style="color:black !important; display:block; font-size:12px; margin-bottom:4px;">Descrição / Anotações</label>
      <textarea id="modal-edit-desc" class="missao-form-input" style="height:120px; resize:vertical;" placeholder="Detalhes...">${esc(node.desc || "")}</textarea>
    </div>
    <div class="missao-form-group" id="modal-edit-img-wrap">
      <label style="color:black !important; display:block; font-size:12px; margin-bottom:4px;">Anexar Imagem URL / Substituir</label>
      <div style="display:flex; gap:8px;">
        <input type="text" id="modal-edit-img-url" class="missao-form-input" style="flex:1; color:black !important;" value="${esc(node.imageUrl || "")}" placeholder="https://exemplo.com/imagem.png ou Base64">
        <button class="btn btn-sm btn-secondary" id="btn-modal-upload-img" type="button" style="white-space:nowrap; color:black !important;">Carregar Foto</button>
      </div>
    </div>
    
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
      <button class="btn btn-sm btn-secondary" id="btn-modal-cancel">Cancelar</button>
      <button class="btn btn-sm btn-primary" id="btn-modal-save">Salvar Alterações</button>
    </div>
  `;

  // Mostrar modal
  container.classList.remove("hidden");

  // Ouvinte de upload local de imagem
  document.getElementById("btn-modal-upload-img")?.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const inputUrl = document.getElementById("modal-edit-img-url");
        if (inputUrl) inputUrl.value = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  });

  const typeSelect = document.getElementById("modal-edit-type");

  // Salvar
  document.getElementById("btn-modal-save")?.addEventListener("click", () => {
    node.name = document.getElementById("modal-edit-name").value || "Sem Nome";
    node.type = typeSelect.value;
    node.desc = document.getElementById("modal-edit-desc").value;
    
    if (document.getElementById("modal-edit-img-url")) {
      node.imageUrl = document.getElementById("modal-edit-img-url").value;
    }

    saveCurrentMission();
    container.classList.add("hidden");
    renderCanvas();
    renderMissionSheet(); // sincronizar
  });

  // Cancelar e Fechar
  const closeModal = () => container.classList.add("hidden");
  document.getElementById("btn-modal-cancel")?.addEventListener("click", closeModal);
  container.querySelector(".modal-close")?.addEventListener("click", closeModal);
}

// Centraliza a visão em todos os elementos do Canvas
export function fitToScreen() {
  const mission = state.currentMission;
  if (!mission || !mission.nodes || mission.nodes.length === 0 || !canvasContainer) return;

  // Obter min e max de coordenadas
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  mission.nodes.forEach(node => {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + 200); // 200px largura aprox
    maxY = Math.max(maxY, node.y + 120); // 120px altura aprox
  });

  const boardWidth = maxX - minX;
  const boardHeight = maxY - minY;
  const rect = canvasContainer.getBoundingClientRect();

  // Calcular zoom adequado deixando uma margem
  const scaleX = (rect.width * 0.8) / boardWidth;
  const scaleY = (rect.height * 0.8) / boardHeight;
  scale = Math.max(0.4, Math.min(1.5, Math.min(scaleX, scaleY)));

  // Calcular pan centralizado
  const boardCenterX = minX + boardWidth / 2;
  const boardCenterY = minY + boardHeight / 2;

  panX = rect.width / 2 - boardCenterX * scale;
  panY = rect.height / 2 - boardCenterY * scale;

  _applyViewportTransforms();
  drawConnections();
}
