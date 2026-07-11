import { el, state, saveCurrentCharacter, loadCharacter, updateCloudSyncBadge, updateCharSelector } from "../state.js";
import { getFirebaseConfig } from "../config.js";
import { getCustomTraits, getCustomMutations } from "../state.js";
import { logger } from "../logger.js";

// ============================================================================
// SISTEMA DE SINCRONIZAÇÃO EM NUVEM E LIMITAÇÃO DE ESPAÇO (SIMULADO / FIREBASE)
// ============================================================================

const MOCK_CLOUD_DB_KEY = "cain_mock_cloud_db";
let cloudCharactersCache = [];

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

async function initRealFirebase() {
  if (firebaseApp) return { auth: firebaseAuth, db: firebaseDb };

  const config = await getFirebaseConfig();
  if (!config) return null;

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    firebaseApp = initializeApp(config);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);

    return { auth: firebaseAuth, db: firebaseDb };
  } catch (e) {
    console.error("Falha ao inicializar o Firebase Real:", e);
    return null;
  }
}

export function getCloudStorageInfo() {
  const sheets = state.useRealFirebase ? cloudCharactersCache : (getMockCloudDB()[state.currentUser?.uid] || []);
  const count = sheets.length;
  const jsonStr = JSON.stringify(sheets);
  const sizeBytes = new Blob([jsonStr]).size;
  const sizeKB = (sizeBytes / 1024);

  return {
    count,
    maxCount: 10,
    sizeKB: sizeKB,
    maxSizeKB: 10240
  };
}

function getMockCloudDB() {
  return JSON.parse(localStorage.getItem(MOCK_CLOUD_DB_KEY)) || {};
}

function saveMockCloudDB(db) {
  localStorage.setItem(MOCK_CLOUD_DB_KEY, JSON.stringify(db));
}

export async function openCloudSyncModal() {
  openStorageManagerModal("nuvem");
}

window.addEventListener("beforeunload", (e) => {
  if (state.currentUser && state.hasUnsavedCloudChanges) {
    e.preventDefault();
    e.returnValue = "Você possui alterações na ficha que não foram salvas na nuvem. Sincronize antes de sair!";
    return e.returnValue;
  }
});

// Modal para gerenciar todo o conteúdo armazenado localmente
export async function openStorageManagerModal(defaultTab = "fichas") {
  logger.info("Modal: Abrindo gerenciador de armazenamento.");
  el.modalContainer.classList.remove("hidden");

  let activeTab = defaultTab;

  const config = await getFirebaseConfig();
  state.useRealFirebase = !!config;

  if (state.useRealFirebase && state.currentUser && cloudCharactersCache.length === 0) {
    try {
      const firebase = await initRealFirebase();
      if (firebase) {
        const { getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
        const snap = await getDocs(q);
        const cloudSheets = [];
        snap.forEach(d => cloudSheets.push(d.data()));
        cloudCharactersCache = cloudSheets;
      }
    } catch (e) {
      console.warn("Erro ao carregar dados do Firebase no cache:", e);
    }
  }

  async function pushCharacterToCloud(char) {
    const stats = getCloudStorageInfo();
    const characterId = char.id;

    if (state.useRealFirebase) {
      try {
        const firebase = await initRealFirebase();
        if (!firebase) return;

        const { doc, setDoc, getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

        const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
        const snap = await getDocs(q);
        const cloudSheets = [];
        snap.forEach(d => cloudSheets.push(d.data()));

        const exists = cloudSheets.some(c => c.id === characterId);

        if (!exists && cloudSheets.length >= stats.maxCount) {
          alert(`Erro de Limite: Você atingiu o limite de ${stats.maxCount} fichas salvas na nuvem. Apague uma ficha no Firestore antes de adicionar outra.`);
          renderContent();
          return;
        }

        const updatedSheets = [...cloudSheets.filter(c => c.id !== characterId), char];
        const newSizeBytes = new Blob([JSON.stringify(updatedSheets)]).size;
        const newSizeKB = newSizeBytes / 1024;
        if (newSizeKB > stats.maxSizeKB) {
          alert(`Erro de Espaço: Limite de armazenamento de ${stats.maxSizeKB} KB excedido (tamanho necessário: ${newSizeKB.toFixed(2)} KB). Reduza o tamanho de anotações ou remova outras fichas.`);
          renderContent();
          return;
        }

        const docData = {
          ...char,
          userId: state.currentUser.uid,
          lastUpdated: Date.now()
        };
        await setDoc(doc(firebase.db, "characters", characterId), docData);

        cloudCharactersCache = updatedSheets;
        if (state.currentCharacter && state.currentCharacter.id === characterId) {
          state.hasUnsavedCloudChanges = false;
          localStorage.setItem("cain_has_unsaved_changes", "false");
        }
        logger.info(`Sincronização Firestore: Ficha de "${char.name}" salva com sucesso.`);

        alert(`Ficha de "${char.name}" salva no Firestore com sucesso!`);
        renderContent();
        updateCloudSyncBadge();
      } catch (err) {
        logger.error("Erro ao salvar no Firestore:", err);
        alert("Erro ao gravar dados na nuvem real. Verifique sua conexão e regras do Firestore.");
        renderContent();
      }
    } else {
      const db = getMockCloudDB();
      const uid = state.currentUser.uid;
      const userSheets = db[uid] || [];

      const existsIndex = userSheets.findIndex(c => c.id === characterId);

      const pendingSheets = [...userSheets];
      if (existsIndex !== -1) {
        pendingSheets[existsIndex] = char;
      } else {
        pendingSheets.push(char);
      }

      if (existsIndex === -1 && userSheets.length >= stats.maxCount) {
        alert(`Erro de Limite: Você atingiu o limite de ${stats.maxCount} fichas salvas na nuvem. Apague uma ficha no banco antes de adicionar outra.`);
        renderContent();
        return;
      }

      const newSizeBytes = new Blob([JSON.stringify(pendingSheets)]).size;
      const newSizeKB = newSizeBytes / 1024;
      if (newSizeKB > stats.maxSizeKB) {
        alert(`Erro de Espaço: Limite de armazenamento de ${stats.maxSizeKB} KB excedido (tamanho necessário: ${newSizeKB.toFixed(2)} KB). Reduza o tamanho de anotações ou remova outras fichas.`);
        renderContent();
        return;
      }

      db[uid] = pendingSheets;
      saveMockCloudDB(db);

      if (state.currentCharacter && state.currentCharacter.id === characterId) {
        state.hasUnsavedCloudChanges = false;
        localStorage.setItem("cain_has_unsaved_changes", "false");
      }
      logger.info(`Sincronização: Ficha de "${char.name}" sincronizada com a nuvem.`);

      alert(`Ficha de "${char.name}" enviada com sucesso!`);
      renderContent();
      updateCloudSyncBadge();
    }
  }

  const renderContent = () => {
    let html = "";

    if (activeTab === "fichas") {
      html = `
        <h4 class="section-heading" style="color:var(--text-primary); margin-bottom:12px;">Personagens Salvos (${state.characters.length})</h4>
        ${state.characters.length === 0 ? `
          <p class="text-secondary-xs">Nenhum personagem salvo.</p>
        ` : `
          <div class="scrollable-list" style="gap:8px; max-height:300px;">
            ${state.characters.map(char => `
              <div class="list-item-row -lg">
                <div>
                  <div class="item-name">${char.name}</div>
                  <div class="text-secondary-xs">${char.ocupacao || "Sem Ocupação"}</div>
                </div>
                <div class="flex-row -gap-sm">
                  <button class="btn btn-sm btn-export-char" data-id="${char.id}" style="padding:4px 8px;">📥 Exportar</button>
                  <button class="btn btn-sm btn-danger btn-delete-char" data-id="${char.id}" style="padding:4px 8px;">❌ Excluir</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;

    } else if (activeTab === "homebrew") {
      const customTraits = getCustomTraits();
      const customMutations = getCustomMutations();

      html = `
        <h4 class="section-heading" style="color:var(--text-primary);">Características Customizadas (${customTraits.length})</h4>
        <div class="scrollable-list" style="margin-bottom:16px; max-height:150px;">
          ${customTraits.length === 0 ? `<p class="text-secondary-xs">Nenhuma característica criada.</p>` :
          customTraits.map((t, idx) => `
              <div class="list-item-row">
                <div>
                  <span class="item-name" style="font-size:var(--font-size-xs);">${t.nome}</span>
                  <small class="text-secondary-xs" style="font-size:10px; margin-left:6px;">(Custo: ${t.custo} XP)</small>
                </div>
                <button class="btn btn-xs btn-danger btn-delete-custom-trait btn-tiny" data-idx="${idx}">❌ Excluir</button>
              </div>
            `).join('')
        }
        </div>

        <h4 class="section-heading" style="color:var(--text-primary);">Mutações Customizadas (${customMutations.length})</h4>
        <div class="scrollable-list" style="max-height:150px;">
          ${customMutations.length === 0 ? `<p class="text-secondary-xs">Nenhuma mutação criada.</p>` :
          customMutations.map((m, idx) => `
              <div class="list-item-row">
                <div>
                  <span class="item-name" style="font-size:var(--font-size-xs);">${m.name}</span>
                  <small class="text-secondary-xs" style="font-size:10px; margin-left:6px;">(${m.suit.toUpperCase()})</small>
                </div>
                <button class="btn btn-xs btn-danger btn-delete-custom-mutation btn-tiny" data-idx="${idx}">❌ Excluir</button>
              </div>
            `).join('')
        }
        </div>
      `;
    } else if (activeTab === "nuvem") {
      if (!state.currentUser) {
        html = `
          <h4 class="section-heading" style="color:var(--text-primary); margin-bottom:12px;">Sincronização em Nuvem</h4>
          <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 40px; margin-bottom: 16px; color: var(--border-color);">☁️</div>
            <p class="item-name" style="margin-bottom: 8px;">Salve suas fichas na nuvem de forma segura.</p>
            <p class="text-secondary-xs" style="margin-bottom: 20px; max-width: 320px; margin-left: auto; margin-right: auto; line-height: 1.4;">
              Conecte-se com sua conta Google para enviar suas fichas locais e acessá-las em qualquer outro navegador ou dispositivo móvel.
            </p>
            
            <button id="btn-google-sign-in" class="btn" style="background: #fff; color: #1f1f1f; border-color: #fff; padding: 10px 20px; font-weight: bold; border-radius: 4px; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.56 2.69-3.86 2.69-6.57zm-8.64 6.8c1.89 0 3.48-.63(4.64)-1.7l-2.9-2.24c-.8.54-1.84.86-2.9.86-2.23 0-4.12-1.51-4.8-3.53H.07v2.32C1.23 14 5.02 16 9 16zm-4.8-7.93c-.17-.5-.26-1.03-.26-1.57s.09-1.07.26-1.57V2.63H.07C-.48 3.74-.8 4.97-.8 6.28s.32 2.54.87 3.65l3.27-2.53zm4.8-4.87c1.03 0 1.95.35 2.68 1.05l2.01-2.01C11.53.86 9.89.5 9 .5 5.02.5 1.23 2.5.07 6.28l3.27 2.53c.68-2.02 2.57-3.53 4.8-3.53z" fill="#4285F4"/>
              </svg>
              Entrar com o Google
            </button>
          </div>
        `;
      } else {
        const stats = getCloudStorageInfo();
        const sizePercent = Math.min(100, (stats.sizeKB / stats.maxSizeKB) * 100);
        const countPercent = Math.min(100, (stats.count / stats.maxCount) * 100);

        const otherCharacters = state.characters.filter(c => !state.currentCharacter || c.id !== state.currentCharacter.id);
        let otherCharactersHtml = "";
        if (otherCharacters.length > 0) {
          otherCharactersHtml = `
            <div class="cloud-section section-divider">
              <h5 class="cloud-section-title">Enviar Outras Fichas</h5>
              <div class="scrollable-list">
                ${otherCharacters.map(char => `
                  <div class="list-item-row">
                    <span class="cloud-char-name">${char.name}</span>
                    <button class="btn btn-xs btn-cloud-push-other btn-outline -cyan btn-tiny" data-char-id="${char.id}">
                      📤 Enviar
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        let cloudCharactersHtml = "";
        if (cloudCharactersCache && cloudCharactersCache.length > 0) {
          cloudCharactersHtml = `
              <div class="cloud-section section-divider">
                <h5 class="cloud-section-title">Fichas na Nuvem</h5>
                <div class="scrollable-list">
                  ${cloudCharactersCache.map(char => `
                    <div class="list-item-row">
                      <span class="cloud-char-name">${char.name}</span>
                      <button class="btn btn-xs btn-cloud-delete-char btn-tiny" data-char-id="${char.id}" style="border-color:var(--color-danger); color:var(--color-danger); background:rgba(239,68,68,0.04); cursor:pointer;">
                        🗑️ Apagar
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
        }

        html = `
          <div class="user-card">
            <div class="user-avatar">
              ${state.currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <div class="user-info">
              <div class="user-name">${state.currentUser.displayName}</div>
              <div class="user-email">${state.currentUser.email}</div>
            </div>
            <button id="btn-google-sign-out" class="btn btn-xs btn-danger" style="padding: 4px 8px;">Sair</button>
          </div>

          ${state.hasUnsavedCloudChanges ? `
            <div class="alert-box -warning">
              <span>⚠️</span>
              <span>Modificações pendentes de envio!</span>
            </div>
          ` : `
            <div class="alert-box -success">
              <span>✔️</span>
              <span>Sincronizado com o Firebase</span>
            </div>
          `}

          <div style="margin-bottom:10px; text-align:left;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); margin-bottom:2px;">
              <span>Espaço:</span>
              <strong>${stats.sizeKB.toFixed(2)} KB / ${stats.maxSizeKB} KB</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${sizePercent}%;"></div>
            </div>
          </div>

          <div style="margin-bottom:16px; text-align:left;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); margin-bottom:2px;">
              <span>Fichas na Nuvem:</span>
              <strong>${stats.count} / ${stats.maxCount}</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${countPercent}%;"></div>
            </div>
          </div>

          <div class="grid-2" style="gap:10px; margin-bottom:10px;">
            <button id="btn-cloud-push" class="btn btn-outline -cyan" style="padding: 8px; font-size:11px;">
              📤 Enviar Atual
            </button>
            <button id="btn-cloud-pull" class="btn btn-outline -green" style="padding: 8px; font-size:11px;">
              📥 Puxar Nuvem
            </button>
          </div>

          ${cloudCharactersHtml}

          ${otherCharactersHtml}
        `;
      }
    } else if (activeTab === "backup") {
      html = `
        <h4 class="section-heading" style="color:var(--text-primary); margin-bottom:12px;">Backup e Importação Completa</h4>
        <p class="text-secondary-xs" style="margin-bottom:20px; line-height:1.4;">
          Exporte absolutamente tudo do seu jogo (todas as fichas de personagens, refúgios, regiões, conflitos, locais e customizações de homebrew) em um único arquivo de backup completo, ou restaure um backup existente.
        </p>

        <div style="display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:24px;">
          <button id="btn-export-all-backup" class="btn btn-block btn-outline -cyan" style="padding:10px;">
            📤 Exportar Backup Completo (.JSON)
          </button>
          
          <button id="btn-trigger-import-backup" class="btn btn-block btn-outline -green" style="padding:10px;">
            📥 Importar Backup Completo (.JSON)
          </button>
          <input type="file" id="file-import-all-backup" accept=".json" style="display:none;">
        </div>

        <h4 class="section-heading" style="color:var(--color-danger);">Zona de Risco</h4>
        <div class="alert-box -danger" style="justify-content:space-between; padding:12px;">
          <div style="flex:1; padding-right:12px;">
            <div class="item-name" style="font-size:var(--font-size-xs); color:#fff; margin-bottom:2px;">Apagar Tudo do Navegador</div>
            <div class="text-secondary-xs" style="font-size:10px;">Isso limpará absolutamente todas as fichas locais, dados do mundo, e homebrews permanentemente.</div>
          </div>
          <button id="btn-wipe-everything" class="btn btn-danger btn-sm" style="white-space:nowrap;">Limpar Tudo</button>
        </div>
      `;
    }

    el.modalBody.innerHTML = `
      <h3 class="modal-title">Gerenciador de Armazenamento</h3>
      
      <div class="lib-tab-bar" style="margin-top:16px; margin-bottom:16px;">
        <button class="lib-tab ${activeTab === 'fichas' ? 'active' : ''}" data-tab="fichas">👤 Fichas</button>
        <button class="lib-tab ${activeTab === 'homebrew' ? 'active' : ''}" data-tab="homebrew">🧪 Custom</button>
        <button class="lib-tab ${activeTab === 'nuvem' ? 'active' : ''}" data-tab="nuvem">☁️ Nuvem</button>
        <button class="lib-tab ${activeTab === 'backup' ? 'active' : ''}" data-tab="backup">💾 Backup</button>
      </div>

      <div class="storage-tab-content-container" style="min-height:280px; margin-bottom:20px;">
        ${html}
      </div>

      <div class="section-divider modal-footer" style="justify-content:space-between;">
        <button id="btn-back-to-settings" class="btn btn-md btn-secondary">Voltar</button>
        <button id="btn-close-storage-manager" class="btn btn-md">Fechar</button>
      </div>
    `;

    el.modalBody.querySelectorAll(".lib-tab").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        activeTab = tabBtn.getAttribute("data-tab");
        renderContent();
      });
    });

    document.getElementById("btn-back-to-settings").addEventListener("click", async () => {
      const { openSettingsModal } = await import("./settings-modal.js");
      openSettingsModal();
    });
    document.getElementById("btn-close-storage-manager").addEventListener("click", () => {
      el.modalContainer.classList.add("hidden");
    });

    if (activeTab === "fichas") {
      el.modalBody.querySelectorAll(".btn-export-char").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const char = state.characters.find(c => c.id === id);
          if (!char) return;
          const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${char.name.toLowerCase().replace(/\s+/g, "_")}_ficha.json`;
          a.click();
        });
      });

      el.modalBody.querySelectorAll(".btn-delete-char").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const char = state.characters.find(c => c.id === id);
          if (!char) return;
          if (confirm(`Tem certeza de que deseja excluir a ficha de ${char.name}? Esta ação não pode ser desfeita.`)) {
            const index = state.characters.findIndex(c => c.id === id);
            if (index !== -1) {
              state.characters.splice(index, 1);
              localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));

              if (state.currentCharacter && state.currentCharacter.id === id) {
                if (state.characters.length > 0) {
                  import("../state.js").then(({ loadCharacter }) => loadCharacter(state.characters[0].id));
                } else {
                  state.currentCharacter = null;
                  window.location.reload();
                  return;
                }
              }
              import("../state.js").then(({ updateCharSelector }) => updateCharSelector());
              renderContent();
            }
          }
        });
      });
    }



    if (activeTab === "homebrew") {
      el.modalBody.querySelectorAll(".btn-delete-custom-trait").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          const traits = getCustomTraits();
          const name = traits[idx]?.nome;
          if (confirm(`Tem certeza de que deseja excluir a característica customizada "${name}"?`)) {
            traits.splice(idx, 1);
            localStorage.setItem("cain_homebrew_traits", JSON.stringify(traits));
            import("../sheet.js").then(({ renderHomebrewSheet }) => renderHomebrewSheet());
            renderContent();
          }
        });
      });

      el.modalBody.querySelectorAll(".btn-delete-custom-mutation").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          const mutations = getCustomMutations();
          const name = mutations[idx]?.name;
          if (confirm(`Tem certeza de que deseja excluir a mutação customizada "${name}"?`)) {
            mutations.splice(idx, 1);
            localStorage.setItem("cain_homebrew_mutations", JSON.stringify(mutations));
            import("../sheet.js").then(({ renderHomebrewSheet }) => renderHomebrewSheet());
            renderContent();
          }
        });
      });
    }

    if (activeTab === "nuvem") {
      const btnSignIn = document.getElementById("btn-google-sign-in");
      if (btnSignIn) {
        btnSignIn.addEventListener("click", async () => {
          if (state.useRealFirebase) {
            try {
              const firebase = await initRealFirebase();
              if (firebase) {
                const { signInWithPopup, GoogleAuthProvider } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(firebase.auth, provider);

                state.currentUser = {
                  uid: result.user.uid,
                  displayName: result.user.displayName,
                  email: result.user.email
                };
                localStorage.setItem("cain_mock_user", JSON.stringify(state.currentUser));
                logger.info(`Autenticação: Logado via Google (Real) - ${state.currentUser.displayName}`);

                const { getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
                const snap = await getDocs(q);
                const cloudSheets = [];
                snap.forEach(d => cloudSheets.push(d.data()));
                cloudCharactersCache = cloudSheets;

                renderContent();
                updateCloudSyncBadge();
              }
            } catch (error) {
              logger.error("Erro no login real do Google:", error);
              alert("Falha no login com Google. Verifique seu arquivo .env.");
            }
          } else {
            const name = prompt("Digite seu nome para simular o login do Google:", "Jogador Exorcista");
            if (name === null) return;
            const email = prompt("Digite seu e-mail do Google:", "jogador@gmail.com");
            if (!email) return;

            const mockUser = {
              uid: "google_user_" + Math.random().toString(36).substr(2, 9),
              displayName: name,
              email: email
            };

            state.currentUser = mockUser;
            localStorage.setItem("cain_mock_user", JSON.stringify(mockUser));
            logger.info("Autenticação: Login efetuado com sucesso via conta Google (Simulado).");
            renderContent();
            updateCloudSyncBadge();
          }
        });
      }

      el.modalBody.querySelectorAll(".btn-cloud-delete-char").forEach(btn => {
        btn.addEventListener("click", async () => {
          const charId = btn.getAttribute("data-char-id");
          const char = cloudCharactersCache.find(c => c.id === charId);
          if (!char) return;

          if (!confirm(`Tem certeza que deseja apagar a ficha de "${char.name}" da NUVEM? Esta ação é irreversível e NÃO afetará a sua ficha local.`)) {
            return;
          }

          btn.disabled = true;
          btn.textContent = "Apagando...";

          try {
            if (state.useRealFirebase) {
              const firebase = await initRealFirebase();
              if (firebase) {
                const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                await deleteDoc(doc(firebase.db, "characters", charId));
              }
            } else {
              const db = getMockCloudDB();
              const uid = state.currentUser.uid;
              if (db[uid]) {
                db[uid] = db[uid].filter(c => c.id !== charId);
                saveMockCloudDB(db);
              }
            }

            cloudCharactersCache = cloudCharactersCache.filter(c => c.id !== charId);
            renderContent();
            updateCloudSyncBadge();
          } catch (e) {
            logger.error("Erro ao apagar ficha da nuvem", e);
            alert("Erro ao apagar a ficha. Tente novamente.");
            btn.disabled = false;
            btn.textContent = "🗑️ Apagar";
          }
        });
      });

      const btnSignOut = document.getElementById("btn-google-sign-out");
      if (btnSignOut) {
        btnSignOut.addEventListener("click", async () => {
          if (confirm("Tem certeza que deseja sair de sua conta Google? Suas fichas locais permanecerão salvas no navegador.")) {
            if (state.useRealFirebase) {
              try {
                const firebase = await initRealFirebase();
                if (firebase) {
                  const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
                  await signOut(firebase.auth);
                }
              } catch (e) {
                console.error("Erro ao deslogar do Firebase:", e);
              }
            }
            state.currentUser = null;
            state.hasUnsavedCloudChanges = false;
            cloudCharactersCache = [];
            localStorage.removeItem("cain_mock_user");
            localStorage.removeItem("cain_has_unsaved_changes");
            logger.info("Autenticação: Desconexão efetuada.");
            renderContent();
            updateCloudSyncBadge();
          }
        });
      }

      const btnPush = document.getElementById("btn-cloud-push");
      if (btnPush) {
        btnPush.addEventListener("click", async () => {
          if (!state.currentCharacter) {
            alert("Crie ou selecione um personagem primeiro!");
            return;
          }
          btnPush.disabled = true;
          btnPush.textContent = "⌛ Enviando...";
          await pushCharacterToCloud(state.currentCharacter);
        });
      }

      const btnPull = document.getElementById("btn-cloud-pull");
      if (btnPull) {
        btnPull.addEventListener("click", async () => {
          let cloudSheets = [];
          btnPull.disabled = true;
          btnPull.textContent = "⌛ Carregando...";

          if (state.useRealFirebase) {
            try {
              const firebase = await initRealFirebase();
              if (!firebase) { btnPull.disabled = false; btnPull.textContent = "📥 Puxar da Nuvem"; return; }

              const { getDocs, collection, query, where } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
              const q = query(collection(firebase.db, "characters"), where("userId", "==", state.currentUser.uid));
              const snap = await getDocs(q);
              snap.forEach(d => cloudSheets.push(d.data()));
              cloudCharactersCache = cloudSheets;
            } catch (err) {
              logger.error("Erro ao puxar dados do Firestore:", err);
              alert("Não foi possível conectar ao Firestore. Verifique seu arquivo .env.");
              btnPull.disabled = false;
              btnPull.textContent = "📥 Puxar da Nuvem";
              return;
            }
          } else {
            const db = getMockCloudDB();
            const uid = state.currentUser.uid;
            cloudSheets = db[uid] || [];
          }

          if (cloudSheets.length === 0) {
            alert("Nenhuma ficha encontrada na nuvem para esta conta.");
            btnPull.disabled = false;
            btnPull.textContent = "📥 Puxar da Nuvem";
            return;
          }

          if (confirm(`Encontramos ${cloudSheets.length} fichas na nuvem. Deseja importá-las? Fichas locais com o mesmo ID serão substituídas.`)) {
            cloudSheets.forEach(cloudChar => {
              const localIndex = state.characters.findIndex(c => c.id === cloudChar.id);
              if (localIndex !== -1) {
                state.characters[localIndex] = cloudChar;
              } else {
                state.characters.push(cloudChar);
              }
            });

            localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
            import("../state.js").then(({ updateCharSelector, loadCharacter }) => {
              updateCharSelector();
              if (state.currentCharacter) {
                const reloadedChar = state.characters.find(c => c.id === state.currentCharacter.id);
                if (reloadedChar) loadCharacter(reloadedChar.id);
              } else if (state.characters.length > 0) {
                loadCharacter(state.characters[0].id);
              }
            });

            state.hasUnsavedCloudChanges = false;
            localStorage.setItem("cain_has_unsaved_changes", "false");
            logger.info("Sincronização: Fichas carregadas da nuvem.");
            alert("Fichas importadas da nuvem com sucesso!");
            renderContent();
            updateCloudSyncBadge();
          } else {
            btnPull.disabled = false;
            btnPull.textContent = "📥 Puxar da Nuvem";
          }
        });
      }

      document.querySelectorAll(".btn-cloud-push-other").forEach(btn => {
        btn.addEventListener("click", async () => {
          const charId = btn.getAttribute("data-char-id");
          const char = state.characters.find(c => c.id === charId);
          if (!char) return;

          btn.disabled = true;
          btn.textContent = "⌛ Enviando...";
          await pushCharacterToCloud(char);
        });
      });
    }

    if (activeTab === "backup") {
      document.getElementById("btn-export-all-backup").addEventListener("click", () => {
        const backup = {
          format: "cain_full_backup",
          version: 1,
          timestamp: Date.now(),
          characters: state.characters,
          traits: getCustomTraits(),
          mutations: getCustomMutations()
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `backup_completo_cain_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      });

      const fileInput = document.getElementById("file-import-all-backup");
      document.getElementById("btn-trigger-import-backup").addEventListener("click", () => {
        fileInput.click();
      });

      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            if (data.format !== "cain_full_backup") {
              alert("Formato de arquivo inválido! Por favor, selecione um arquivo de backup do CAIN RPG.");
              return;
            }

            if (confirm("Esta importação irá mesclar os dados importados com os seus dados locais existentes. Deseja prosseguir?")) {
              if (data.characters && Array.isArray(data.characters)) {
                data.characters.forEach(char => {
                  const existingIdx = state.characters.findIndex(c => c.id === char.id);
                  if (existingIdx !== -1) {
                    state.characters[existingIdx] = char;
                  } else {
                    state.characters.push(char);
                  }
                });
                localStorage.setItem("cain_exorcists", JSON.stringify(state.characters));
              }

              if (data.traits && Array.isArray(data.traits)) {
                const existing = getCustomTraits();
                const merged = [...existing, ...data.traits.filter(t => !existing.some(et => et.id === t.id))];
                localStorage.setItem("cain_homebrew_traits", JSON.stringify(merged));
              }
              if (data.mutations && Array.isArray(data.mutations)) {
                const existing = getCustomMutations();
                const merged = [...existing, ...data.mutations.filter(m => !existing.some(em => em.id === m.id))];
                localStorage.setItem("cain_homebrew_mutations", JSON.stringify(merged));
              }

              alert("Backup importado e mesclado com sucesso! O aplicativo será recarregado.");
              window.location.reload();
            }
          } catch (err) {
            alert("Erro ao ler o arquivo de backup: " + err.message);
          }
        };
        reader.readAsText(file);
      });

      document.getElementById("btn-wipe-everything").addEventListener("click", () => {
        if (confirm("⚠️ ATENÇÃO EXTREMA: Você está prestes a deletar ABSOLUTAMENTE TUDO (personagens, fichas, mundos, refúgios, homebrew). Esta ação é permanente e NÃO PODE ser desfeita. Tem certeza absoluta?")) {
          localStorage.clear();
          sessionStorage.clear();
          alert("Todos os dados foram apagados com sucesso.");
          window.location.reload();
        }
      });
    }
  };

  renderContent();
}
