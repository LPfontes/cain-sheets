/* js/content-pack-manager.js — Gerenciador de Pacotes de Conteúdo do CAIN RPG */
import { getLang } from "./i18n.js";

const STORAGE_KEY = "cain_content_packs_v1";

let loadedPacks = [];
let basePack = null;
let officialPacks = [];
let currentLoadedLang = null;

export async function initContentPacks() {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        loadedPacks = JSON.parse(saved);
      }
    }
  } catch (e) {
    console.warn("Erro ao ler pacotes do localStorage:", e);
    loadedPacks = [];
  }

  await loadBaseAndOfficialPacks();

  if (typeof window !== "undefined") {
    window.addEventListener("languageChanged", async () => {
      await loadBaseAndOfficialPacks(true);
    });
  }
}

export async function loadBaseAndOfficialPacks(force = false) {
  const lang = getLang() || "pt";
  if (!force && basePack && currentLoadedLang === lang) return;

  currentLoadedLang = lang;
  basePack = await fetchBaseDataPack(lang);
  officialPacks = [];
  await fetchOfficialPacks(lang);
  notifyContentPacksChanged();
}

const REMOTE_DATA_REPO_URL = "https://raw.githubusercontent.com/LPfontes/cain-data/main/data/";
const OFFICIAL_PACK_FILES = ["gamesff1.json", "gamesff2.json", "gamesff3.json"];

async function safeFetchJson(relPath, lang = getLang() || "pt") {
  const fileName = relPath.split('/').pop();
  const langSubdir = lang === "en" ? "en" : "pt";

  // 1. Repositório remoto cain-data no GitHub (Fonte principal)
  try {
    const remoteRes = await fetch(`${REMOTE_DATA_REPO_URL}${langSubdir}/${fileName}`);
    if (remoteRes.ok) return await remoteRes.json();
  } catch (err) {}

  try {
    const remoteRes = await fetch(`${REMOTE_DATA_REPO_URL}${fileName}`);
    if (remoteRes.ok) return await remoteRes.json();
  } catch (err) {}

  // 2. Fallback para ambiente Node.js (testes automatizados locais)
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    try {
      const fs = await import("fs");
      const url = new URL(relPath, import.meta.url);
      const urlPath = url.pathname.replace(/^\/([A-Z]:)/i, '$1');
      if (fs.existsSync(urlPath)) {
        return JSON.parse(fs.readFileSync(urlPath, "utf-8"));
      }
    } catch (err) {}
  }

  return null;
}

async function fetchOfficialPacks(lang = getLang() || "pt") {
  officialPacks = [];
  if (OFFICIAL_PACK_FILES.length === 0) return;

  const packDataList = await Promise.all(
    OFFICIAL_PACK_FILES.map(file => safeFetchJson(`../data/${file}`, lang))
  );
  packDataList.forEach(data => {
    if (data) officialPacks.push(data);
  });
}

async function fetchBaseDataPack(lang = getLang() || "pt") {
  try {
    const [skills, rules, agendas, blasphemies, equipment, sinmarks, sins, virtues, drifters] = await Promise.all([
      safeFetchJson('../data/skills.json', lang).then(r => r || {}),
      safeFetchJson('../data/rules.json', lang).then(r => r || {}),
      safeFetchJson('../data/agendas.json', lang).then(r => r || {}),
      safeFetchJson('../data/blasphemies.json', lang).then(r => r || []),
      safeFetchJson('../data/equipment.json', lang).then(r => r || {}),
      safeFetchJson('../data/sinmarks.json', lang).then(r => r || []),
      safeFetchJson('../data/sins.json', lang).then(r => r || []),
      safeFetchJson('../data/virtues.json', lang).then(r => r || {}),
      safeFetchJson('../data/drifters.json', lang).then(r => r || [])
    ]);

    return {
      id: "cain-official-core",
      name: lang === "en" ? "CAIN RPG — Official Core Module" : "CAIN RPG — Módulo Core Oficial",
      version: "1.4",
      author: lang === "en" ? "Official / Community" : "Oficial / Comunidade",
      description: lang === "en" ? "Base package for rules, skills, agendas, blasphemies, sins, and equipment." : "Pacote base de regras, perícias, agendas, blasfêmias, pecados e equipamentos.",
      enabled: true,
      isBase: true,
      data: {
        skills,
        rules,
        agendas,
        blasphemies,
        equipment,
        sinmarks,
        sins,
        drifters,
        virtues
      }
    };
  } catch (e) {
    console.error("Erro ao carregar dados base de data/:", e);
    return {
      id: "cain-official-core",
      name: "CAIN RPG — Módulo Core Vazio",
      version: "1.0",
      enabled: true,
      isBase: true,
      data: {}
    };
  }
}

export function getAllPacks() {
  const packs = [];
  if (basePack) packs.push(basePack);

  officialPacks.forEach(offPack => {
    const savedPack = loadedPacks.find(p => p.id === offPack.id);
    if (savedPack) {
      packs.push(savedPack);
    } else {
      packs.push(offPack);
    }
  });

  const customPacks = loadedPacks.filter(p => !officialPacks.some(o => o.id === p.id) && p.id !== basePack?.id);
  return packs.concat(customPacks);
}

export function savePacksToStorage() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedPacks));
    }
  } catch (e) {
    console.error("Erro ao salvar pacotes no localStorage:", e);
  }
  notifyContentPacksChanged();
}

export async function loadPackFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const pack = JSON.parse(e.target.result);
        if (!pack.name || (!pack.data && !pack.items)) {
          throw new Error("Formato inválido de Pacote de Conteúdo.");
        }

        const formattedPack = {
          id: pack.id || `custom-pack-${Date.now()}`,
          name: pack.name || file.name.replace(".json", ""),
          version: pack.version || "1.0",
          author: pack.author || "Personalizado",
          description: pack.description || "Pacote de conteúdo importado pelo usuário.",
          enabled: true,
          isBase: false,
          data: pack.data || pack
        };

        // Substitui se já existir pelo ID ou adiciona
        const existingIdx = loadedPacks.findIndex(p => p.id === formattedPack.id);
        if (existingIdx !== -1) {
          loadedPacks[existingIdx] = formattedPack;
        } else {
          loadedPacks.push(formattedPack);
        }

        savePacksToStorage();
        resolve(formattedPack);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsText(file);
  });
}

export function togglePack(packId, enabled) {
  if (basePack && basePack.id === packId) {
    basePack.enabled = enabled;
    notifyContentPacksChanged();
    return;
  }
  let pack = loadedPacks.find(p => p.id === packId);
  if (!pack) {
    const offPack = officialPacks.find(p => p.id === packId);
    if (offPack) {
      pack = JSON.parse(JSON.stringify(offPack));
      loadedPacks.push(pack);
    }
  }
  if (pack) {
    pack.enabled = enabled;
    savePacksToStorage();
  }
}

export function removePack(packId) {
  loadedPacks = loadedPacks.filter(p => p.id !== packId);
  savePacksToStorage();
}

// Mescla e retorna os dados consolidados de todos os pacotes ativos
export function getMergedData() {
  const merged = {
    skills: {},
    rules: { cat_table: {} },
    agendas: {},
    blasphemies: [],
    equipment: {
      equipment_by_kp: { "0": [], "1": [], "2": [], "3": [], "4": [], "5": [] },
      conforto_carreira: [],
      oculto_medico: [],
      kits: [],
      esteticos: [],
      posses: []
    },
    sinmarks: [],
    sins: [],
    drifters: [],
    virtues: {},
    quirks: [],
    special_rules: [],
    recreation: [],
    aesthetics: [],
    toolbox: {}
  };

  const activePacks = getAllPacks().filter(p => p.enabled !== false && p.data);

  activePacks.forEach(pack => {
    const d = pack.data;
    if (!d) return;

    // Perícias
    if (d.skills) {
      Object.assign(merged.skills, d.skills);
    }

    // Regras
    if (d.rules) {
      if (d.rules.cat_table) Object.assign(merged.rules.cat_table, d.rules.cat_table);
      Object.assign(merged.rules, d.rules);
    }

    // Agendas (suporta Objeto ou Array e normaliza propriedades PT/EN)
    if (d.agendas) {
      const normalizeAgenda = (item, key) => {
        const rawHabs = item.habilidades || item.abilities || [];
        const habs = rawHabs.map(h => ({
          name: h.name || "",
          desc: h.desc || h.description || "",
          description: h.description || h.desc || ""
        }));

        let normal = [];
        if (Array.isArray(item.normal)) normal = item.normal;
        else if (typeof item.normal === "string") normal = [item.normal];
        else if (Array.isArray(item.items?.normal)) normal = item.items.normal;
        else if (typeof item.items?.normal === "string") normal = [item.items.normal];

        let bold = [];
        if (Array.isArray(item.bold)) bold = item.bold;
        else if (Array.isArray(item.bolded)) bold = item.bolded;
        else if (typeof item.bold === "string") bold = [item.bold];
        else if (typeof item.bolded === "string") bold = [item.bolded];
        else if (Array.isArray(item.items?.bolded)) bold = item.items.bolded;
        else if (typeof item.items?.bolded === "string") bold = [item.items.bolded];

        return {
          ...item,
          id: item.id || key,
          name: item.name || key,
          desc: item.desc || item.description || "",
          description: item.description || item.desc || "",
          habilidades: habs,
          abilities: habs,
          normal,
          bold,
          bolded: bold,
          icon: item.icon || "assets/avatar.png"
        };
      };

      if (Array.isArray(d.agendas)) {
        d.agendas.forEach((item, idx) => {
          const key = item.id || (item.name ? item.name.toLowerCase() : `agenda_${idx}`);
          merged.agendas[key] = normalizeAgenda(item, key);
        });
      } else if (typeof d.agendas === "object") {
        Object.entries(d.agendas).forEach(([key, item]) => {
          merged.agendas[key] = normalizeAgenda(item, key);
        });
      }
    }

    // Mapeamento de imagens de blasfêmias (para corrigir 404s de extensões/nomes trocados em pacotes)
    const BLASF_IMG_MAP = {
      "assets/blasf/LEI.jpg": "assets/blasf/LEI.webp",
      "assets/blasf/NULO.jpg": "assets/blasf/NULL.webp",
      "assets/blasf/ENTRELACAR.jpg": "assets/blasf/ENTWINE.webp",
      "assets/blasf/FORCA.jpg": "assets/blasf/STRENGTH.webp",
      "assets/blasf/SHAKE.jpg": "assets/blasf/shake.webp",
      "assets/blasf/VÉU.jpg": "assets/blasf/veil.webp",
      "assets/blasf/VEU.jpg": "assets/blasf/veil.webp"
    };

    // Blasfêmias
    if (Array.isArray(d.blasphemies)) {
      const normalized = d.blasphemies.map(b => ({
        ...b,
        img: BLASF_IMG_MAP[b.img] || b.img || ""
      }));
      merged.blasphemies = merged.blasphemies.concat(normalized);
    } else if (d.blasphemies && typeof d.blasphemies === "object") {
      const normalizedObj = {};
      Object.entries(d.blasphemies).forEach(([k, b]) => {
        normalizedObj[k] = { ...b, img: BLASF_IMG_MAP[b?.img] || b?.img || "" };
      });
      Object.assign(merged.blasphemies, normalizedObj);
    }

    // Equipamentos
    if (d.equipment) {
      if (d.equipment.equipment_by_kp) {
        Object.entries(d.equipment.equipment_by_kp).forEach(([kp, items]) => {
          if (!merged.equipment.equipment_by_kp[kp]) merged.equipment.equipment_by_kp[kp] = [];
          merged.equipment.equipment_by_kp[kp] = merged.equipment.equipment_by_kp[kp].concat(items);
        });
      }
      if (Array.isArray(d.equipment.conforto_carreira)) merged.equipment.conforto_carreira.push(...d.equipment.conforto_carreira);
      if (Array.isArray(d.equipment.oculto_medico)) merged.equipment.oculto_medico.push(...d.equipment.oculto_medico);
      if (Array.isArray(d.equipment.kits)) merged.equipment.kits.push(...d.equipment.kits);
      if (Array.isArray(d.equipment.esteticos)) merged.equipment.esteticos.push(...d.equipment.esteticos);
      if (Array.isArray(d.equipment.posses)) merged.equipment.posses.push(...d.equipment.posses);
    }

    // Marcas de Pecado
    if (Array.isArray(d.sinmarks)) merged.sinmarks.push(...d.sinmarks);

    // Pecados
    if (Array.isArray(d.sins)) merged.sins.push(...d.sins);

    // Drifters
    if (Array.isArray(d.drifters)) merged.drifters.push(...d.drifters);

    // Virtudes (suporta Objeto ou Array)
    if (d.virtues) {
      if (Array.isArray(d.virtues)) {
        d.virtues.forEach((item, idx) => {
          const key = item.id || (item.name ? item.name.toLowerCase() : `virtue_${idx}`);
          // Skip invalid keys that would cause circular references
          if (key === "virtues") return;
          merged.virtues[key] = item;
        });
      } else if (typeof d.virtues === "object") {
        Object.entries(d.virtues).forEach(([key, val]) => {
          // Skip keys that are nested wrapper objects (e.g. { "virtues": {...} })
          if (key === "virtues") return;
          merged.virtues[key] = val;
        });
      }
    }

    // Quirks
    if (Array.isArray(d.quirks)) merged.quirks.push(...d.quirks);

    // Regras Especiais
    if (Array.isArray(d.special_rules)) merged.special_rules.push(...d.special_rules);

    // Recreação
    if (Array.isArray(d.recreation)) merged.recreation.push(...d.recreation);

    // Estética
    if (Array.isArray(d.aesthetics)) merged.aesthetics.push(...d.aesthetics);

    // Toolbox (Dicionário de Regras)
    if (d.toolbox) Object.assign(merged.toolbox, d.toolbox);
  });

  return merged;
}

export function generateTemplatePack() {
  return {
    id: "meu-pacote-customizado",
    name: "Meu Pacote Customizado de CAIN",
    version: "1.0",
    author: "Seu Nome",
    description: "Descreva aqui as novas agendas, equipamentos ou drifters do seu pacote.",
    data: {
      agendas: [
        {
          "name": "Nova Agenda",
          "color": "#be3135",
          "desc": "Descrição da nova agenda...",
          "skills": ["Skill 1", "Skill 2"]
        }
      ],
      blasphemies: [],
      equipment: {
        "equipment_by_kp": {
          "1": [
            { "name": "Novo Item Especial", "desc": "Efeito do item..." }
          ]
        }
      },
      drifters: [
        {
          "id": "drifter-custom-01",
          "tmid": "TMID: CUSTOM-01",
          "name": "Nova Anomalia",
          "category": "Anomalia",
          "execution": { "solo": 5 },
          "description": "Descrição do drifter...",
          "behavior": "Comportamento...",
          "specials": []
        }
      ]
    }
  };
}

function notifyContentPacksChanged() {
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("contentPacksChanged", { detail: getMergedData() }));
  }
}
