import { getLang } from "./i18n.js";

// ============================================================
// CAIN RPG — DICIONÁRIO DE REGRAS E EXPLICAÇÕES (TOOLBOX)
// ============================================================

const TOOLBOX_DATA = {
  pt: {
    // Perícias Físicas
    force: {
      title: "Força",
      desc: "Representa a capacidade física de exercer força direta, violência e impacto contra o ambiente ou oponentes.",
      rules: [
        "Usado em combate corpo a corpo para golpear, empurrar, derrubar ou dominar.",
        "Aplicado para quebrar ou danificar objetos, portas, correntes ou obstáculos estruturais.",
        "Empregado para cortar, dilacerar ou infligir ferimentos severos usando lâminas ou força bruta."
      ]
    },
    conditioning: {
      title: "Atletismo",
      desc: "Define o condicionamento físico geral, resistência muscular, agilidade em deslocamento e flexibilidade.",
      rules: [
        "Usado para correr em alta velocidade, saltar distâncias consideráveis ou escalar superfícies.",
        "Empregado ao nadar contra correntes fortes ou equilibrar-se em locais precários.",
        "Utilizado para resistir a fadiga extrema, privação de sono ou exaustão física prolongada."
      ]
    },
    coordination: {
      title: "Coordenação",
      desc: "Mede a destreza manual, coordenação motora fina, reflexos rápidos e precisão com as mãos.",
      rules: [
        "Habilidade essencial para atirar com armas de fogo ou arremessar projéteis e granadas.",
        "Usada para capturar ou pegar objetos em movimento rápido com precisão.",
        "Aplicada em tarefas manuais delicadas, como desarmar dispositivos ou consertar fiação complexa."
      ]
    },
    // Perícias de Investigação
    covert: {
      title: "Furtividade",
      desc: "Reflete a capacidade de agir nas sombras, passar despercebido e manipular objetos secretamente.",
      rules: [
        "Usado para mover-se silenciosamente e ocultar-se em sombras ou coberturas.",
        "Aplicado para arrombar fechaduras, desativar alarmes físicos ou burlar travas mecânicas sem ruído.",
        "Empregado para roubar itens de bolsos ou esconder objetos pequenos sob a roupa."
      ]
    },
    interfacing: {
      title: "Interface",
      desc: "A afinidade técnica com sistemas de computação, eletrônica digital e processamento de informações.",
      rules: [
        "Usada para hackear servidores, acessar arquivos protegidos por senha e burlar segurança de rede.",
        "Aplicada para reconfigurar softwares de câmeras, sensores ou computadores industriais.",
        "Empregada para operar equipamentos eletrônicos complexos e decodificar dados criptografados."
      ]
    },
    investigation: {
      title: "Investigação",
      desc: "Representa a dedução lógica, análise de evidências e pesquisa sistemática de fatos.",
      rules: [
        "Usada para vasculhar arquivos, analisar registros históricos e ligar pistas dispersas.",
        "Aplicada para reconstruir cenas de crimes ou entender a cronologia de eventos anômalos.",
        "Útil para cruzar depoimentos e descobrir mentiras ou incongruências em discursos."
      ]
    },
    surveillance: {
      title: "Observação",
      desc: "A percepção sensorial ativa para captar detalhes, ameaças e movimentações no ambiente.",
      rules: [
        "Usada para ficar de sentinela, vigiar alvos à distância ou patrulhar perímetros.",
        "Aplicada para notar pistas quase invisíveis (ex: marcas na parede, fios de armadilha).",
        "Empregada para perceber ameaças ocultas nas sombras antes que realizem uma emboscada."
      ]
    },
    // Perícias Sociais
    negotiation: {
      title: "Negociação",
      desc: "A capacidade de persuadir, fechar acordos de mútuo benefício e obter cooperação voluntária.",
      rules: [
        "Usado para barganhar preços, trocar favores ou conseguir informações valiosas pacificamente.",
        "Aplicada para acalmar indivíduos exaltados ou persuadir testemunhas a cooperarem.",
        "Empregada para subornar oficiais corruptos ou convencer contatos a fornecerem recursos."
      ]
    },
    authority: {
      title: "Autoridade",
      desc: "A projeção de poder pessoal, intimidação, liderança e imposição de respeito sobre os outros.",
      rules: [
        "Usada para dar ordens diretas que civis ou subordinados sintam-se compelidos a seguir.",
        "Empregada para intimidar oponentes mentalmente e forçar recuos ou confissões.",
        "Utilizada para manter a moral do grupo alta e guiar aliados em momentos de pânico."
      ]
    },
    connection: {
      title: "Conexão",
      desc: "A rede de contatos, influência social e a habilidade de extrair fofocas, rumores e ajuda da comunidade.",
      rules: [
        "Usada para obter boatos sobre ocorrências profanas em uma vizinhança ou setor.",
        "Empregada para encontrar contatos úteis rápidos (médicos clandestinos, informantes).",
        "Aplicada para conseguir abrigo seguro temporário nas ruas ou acessar mercados ilegais."
      ]
    },
    // Psíquica
    psique: {
      title: "Psique",
      desc: "O poder mental inato e a resistência psicológica contra forças anômalas profanas.",
      rules: [
        "O valor desta perícia é passivo: equivale sempre à metade da sua Categoria (CAT), arredondada para cima.",
        "Usada como defesa primária para rolar testes de resistência mental contra a loucura ou aflições psíquicas.",
        "Mede o potencial latente de resistência à influência sobrenatural direta dos Pecados."
      ]
    },
    // Status e Atributos da Ficha
    hooks: {
      title: "Ganchos",
      desc: "Representam complicações, pressões acumuladas ou ganchos narrativos que cobram o seu preço.",
      rules: [
        "Como Adquirir: Você recebe ganchos de habilidades de marcas do pecado, ao sofrer consequências ou ao negociar dados extras com o Administrador.",
        "Instruções:",
        "1. Dê um nome específico ao gancho (ex: 'Sussurros no escuro', 'Perna fraturada').",
        "2. Marque um espaço do gancho correspondente se sofrer a complicação novamente, se a pressão aumentar ou se tirar '1' em um teste de Risco.",
        "3. Ao preencher todos os 3 espaços do gancho, você deve apagá-lo e sofrer o seu efeito negativo narrativo ou mecânico imediatamente."
      ]
    },
    injuries: {
      title: "Feridas",
      desc: "Danos físicos brutais que comprometem o estado de saúde geral e o fôlego do exorcista.",
      rules: [
        "Cada ferimento marcado reduz o limite de Estresse Máximo do seu personagem em 1 ponto.",
        "Se ao marcar uma Ferida o seu estresse atual passar do novo máximo, o excedente deve ser resolvido imediatamente (geralmente gerando novas consequências ou descartado).",
        "Perigo de Morte: Ao marcar 3 ou mais ferimentos, você entra em risco de morte iminente. Qualquer dano subsequente pode ser instantaneamente fatal.",
        "Cura: Feridas exigem tempo de recuperação física (normalmente uma semana de repouso por ferida) ou intervenção médica especializada avançada."
      ]
    },
    sin: {
      title: "Pecado",
      desc: "Representa o nível de corrupção profana que infecta a alma do exorcista conforme ele usa forças sobrenaturais.",
      rules: [
        "Como Acumula: Você acumula Pecado ao ativar habilidades aberrantes das suas marcas ou ao falhar em testes para resistir ao domínio profano.",
        "Limite Máximo: O limite do rastreador começa em 10, mas é reduzido em 2 para cada Marca do Pecado permanente adquirida, e em 1 para cada Blasfêmia além da primeira.",
        "Risco de Verter Pecado (Overflow): Se o pecado atingir o limite atual, você corre risco iminente de sofrer uma Mutação Profana ou ganhar uma nova Marca do Pecado permanente."
      ]
    },
    psyche: {
      title: "Pulsos Psíquicos",
      desc: "A energia mental refinada usada para alimentar habilidades de Agendas e poderes de Blasfêmias.",
      rules: [
        "Você gasta Pulsos Psíquicos para ativar as habilidades mais poderosas do seu exorcista.",
        "Recuperação: Geralmente recupera-se pulsos psíquicos ao preencher ganchos completamente, sofrer ferimentos graves, ou através de descansos e habilidades específicas de classe (como Besta).",
        "Gaste um Pulso Psíquico para obter um bônus imenso em um teste, ou para ativar efeitos sobrenaturais poderosos de sua Agenda/Blasfêmia.",
        "Ao gastar o pulso, você deve marcar a caixa correspondente. A recuperação é lenta e exige paz mental (raro).",
        "Ficar sem pulsos psíquicos o deixa suscetível a possessões e quebras mentais."
      ]
    },
    piety: {
      title: "Piedade",
      desc: "Sua centelha de convicção humana e pureza moral que serve de barreira contra as trevas.",
      rules: [
        "A Piedade pode ser gasta para aliviar o estresse acumulado ou absorver pontos temporários de Pecado antes que corrompam a ficha.",
        "Agonia Divina: Uma vez por sessão de jogo, você pode queimar (gastar) toda a sua Piedade ativa para ganhar +1D de bônus na rolagem para cada ponto de Piedade queimado.",
        "Substituição: Perder toda a piedade deixa o exorcista muito mais vulnerável às influências devastadoras dos Pecados."
      ]
    },
    // Elementos da Ficha e Regras Adicionais
    hooks: {
      title: "Ganchos",
      desc: "Os Ganchos representam motivações, laços ou traumas profundos do exorcista que afetam seu comportamento.",
      rules: [
        "Marque as caixas de um Gancho conforme o exorcista se aproxima de resolvê-lo ou cede a ele.",
        "Completar as três marcações pode gerar uma consequência narrativa, XP extra ou uma nova faceta da história.",
        "Se o Gancho for quebrado ou perdido, o personagem sofre um forte abalo emocional (Aumento de Estresse)."
      ]
    },
    injuries: {
      title: "Feridas",
      desc: "Danos físicos graves que o exorcista sofreu. O estresse é passageiro, as feridas não.",
      rules: [
        "Cada ferida marcada impõe penalidades específicas dependendo do sistema (normalmente desvantagem ou -1D em testes relevantes).",
        "Ao marcar a 3ª ferida, o personagem entra em Perigo de Morte e pode colapsar se sofrer mais dano.",
        "Feridas só são curadas com descanso prolongado, tratamento médico e gasto de recursos ou tempo no refúgio."
      ]
    },
    sin: {
      title: "Pecado",
      desc: "A corrupção moral e espiritual acumulada pelas ações do exorcista no combate às trevas.",
      rules: [
        "Sempre que você utilizar poderes da Blasfêmia, matar inocentes ou presenciar horrores cósmicos sem resistência, você ganha Pecado.",
        "Se a barra de Pecado transbordar, você sofre uma Marca do Pecado (mutação ou insanidade permanente).",
        "Pecado pode ser expurgado através de penitência, rituais no refúgio ou atos de sacrifício genuíno."
      ]
    },
    piety: {
      title: "Piedade",
      desc: "A fé ou resiliência moral do exorcista. Sua âncora com a própria humanidade.",
      rules: [
        "Pode ser gasta para resistir aos ganhos de Pecado, negar Estresse fatal ou encontrar força onde não haveria.",
        "O botão 'Agonia Divina' queima toda a sua Piedade de uma só vez para um bônus desesperado (+1D por Piedade queimada).",
        "Recupera-se agindo de acordo com a sua Agenda, confessando-se ou cumprindo os dogmas do CASTLE."
      ]
    },
    agenda: {
      title: "Agendas",
      desc: "As Agendas definem a missão, as convicções e as habilidades especiais básicas do exorcista no grupo.",
      rules: [
        "Sua Agenda inicial é escolhida durante a criação do personagem.",
        "Ela concede uma Habilidade Ativa inicial e define as Perícias/Itens especiais que o exorcista possui.",
        "Seguir a sua Agenda ajuda a recuperar Piedade e evoluir o personagem."
      ]
    },
    blasphemy: {
      title: "Blasfêmias",
      desc: "Os poderes profanos e anômalos que o exorcista pode canalizar, originados da sua semente sobrenatural.",
      rules: [
        "Você começa o jogo com uma Blasfêmia e dois de seus poderes ativos.",
        "Gastar e utilizar poderes de Blasfêmia gera acúmulo de Pecado.",
        "Ao transbordar o Pecado, a semente da Blasfêmia pode causar mutações graves e marcas permanentes."
      ]
    }
  },
  en: {
    // Physical Skills
    force: {
      title: "Force",
      desc: "Represents physical capacity to exert direct strength, violence, and impact against the environment or opponents.",
      rules: [
        "Used in melee combat to strike, push, knock down, or grapple.",
        "Applied to break or damage objects, doors, chains, or structural barriers.",
        "Employed to cut, tear, or inflict severe injuries using blades or raw strength."
      ]
    },
    conditioning: {
      title: "Conditioning",
      desc: "Defines general physical conditioning, muscular endurance, speed of movement, and flexibility.",
      rules: [
        "Used to run at high speed, jump considerable distances, or climb surfaces.",
        "Employed when swimming against strong currents or balancing in precarious places.",
        "Utilized to resist extreme fatigue, sleep deprivation, or prolonged physical exhaustion."
      ]
    },
    coordination: {
      title: "Coordination",
      desc: "Measures manual dexterity, fine motor skills, quick reflexes, and precision with hands.",
      rules: [
        "Essential skill for firing firearms or throwing projectiles and grenades.",
        "Used to catch or grab fast-moving objects with precision.",
        "Applied in delicate manual tasks such as defusing devices or repairing complex wiring."
      ]
    },
    // Investigation Skills
    covert: {
      title: "Covert",
      desc: "Reflects the ability to act in the shadows, go unnoticed, and manipulate objects secretly.",
      rules: [
        "Used to move silently and hide in shadows or cover.",
        "Applied to pick locks, disable physical alarms, or bypass mechanical locks quietly.",
        "Employed to pickpocket or conceal small items under clothing."
      ]
    },
    interfacing: {
      title: "Interfacing",
      desc: "Technical affinity with computing systems, digital electronics, and information processing.",
      rules: [
        "Used to hack servers, access password-protected files, and bypass network security.",
        "Applied to reconfigure software for cameras, sensors, or industrial computers.",
        "Employed to operate complex electronic equipment and decode encrypted data."
      ]
    },
    investigation: {
      title: "Investigation",
      desc: "Represents logical deduction, evidence analysis, and systematic research of facts.",
      rules: [
        "Used to search files, analyze historical records, and link scattered clues.",
        "Applied to reconstruct crime scenes or understand the timeline of anomalous events.",
        "Useful for cross-referencing testimonies and discovering lies or incongruencies in speech."
      ]
    },
    surveillance: {
      title: "Surveillance",
      desc: "Active sensory perception to pick up details, threats, and movements in the environment.",
      rules: [
        "Used to stand guard, monitor targets from a distance, or patrol perimeters.",
        "Applied to notice near-invisible clues (e.g., marks on walls, tripwires).",
        "Employed to perceive threats hidden in the shadows before they launch an ambush."
      ]
    },
    // Social Skills
    negotiation: {
      title: "Negotiation",
      desc: "The ability to persuade, close mutually beneficial deals, and obtain voluntary cooperation.",
      rules: [
        "Used to bargain prices, exchange favors, or obtain valuable information peacefully.",
        "Applied to calm agitated individuals or persuade witnesses to cooperate.",
        "Employed to bribe corrupt officials or convince contacts to provide resources."
      ]
    },
    authority: {
      title: "Authority",
      desc: "The projection of personal power, intimidation, leadership, and commanding respect over others.",
      rules: [
        "Used to give direct orders that civilians or subordinates feel compelled to follow.",
        "Employed to intimidate opponents mentally and force retreats or confessions.",
        "Used to keep group morale high and guide allies in moments of panic."
      ]
    },
    connection: {
      title: "Connection",
      desc: "Network of contacts, social influence, and the ability to extract gossip, rumors, and help from the community.",
      rules: [
        "Used to obtain rumors about profane occurrences in a neighborhood or sector.",
        "Employed to find quick useful contacts (underground doctors, informants).",
        "Applied to get temporary safe shelter on the streets or access illegal markets."
      ]
    },
    // Psychic
    psique: {
      title: "Psychic (Psique)",
      desc: "Innate mental power and psychological resistance against profane anomalous forces.",
      rules: [
        "The value of this skill is passive: always equals half of your Category (CAT), rounded up.",
        "Used as a primary defense to roll saving throws against madness or psychic afflictions.",
        "Measures the latent potential to resist direct supernatural influence from Sins."
      ]
    },
    // Status & Sheet Attributes
    hooks: {
      title: "Hooks",
      desc: "Represent pending complications, accumulated pressures, or narrative hooks that take their toll.",
      rules: [
        "How to Acquire: You receive hooks from sin mark skills, as consequences, or by bargaining for extra dice with the GM.",
        "Instructions:",
        "1. Give the hook a specific name (e.g., 'Whispers in the dark', 'Fractured leg').",
        "2. Mark a hook slot if you suffer the complication again, if pressure increases, or if you roll a '1' on a Risk test.",
        "3. Upon filling all 3 hook slots, you must erase it and suffer its negative narrative or mechanical effect immediately."
      ]
    },
    injuries: {
      title: "Injuries",
      desc: "Brutal physical damage that compromises the exorcist's overall health and stamina.",
      rules: [
        "Each marked injury reduces your character's Max Stress limit by 1 point.",
        "If marking an Injury pushes your current stress past the new max, the excess must be resolved immediately (usually generating further consequences or discarded).",
        "Danger of Death (Skulls): Upon marking 3 or more injuries, you enter danger of death. Any subsequent damage can be instantly fatal.",
        "Healing: Injuries require physical recovery time (usually one week of rest per injury) or advanced medical intervention."
      ]
    },
    sin: {
      title: "Sin",
      desc: "Represents the level of profane corruption infecting the exorcist's soul as they use supernatural forces.",
      rules: [
        "How it Accumulates: You accumulate Sin when activating aberrant skills from your marks or when failing tests to resist profane domain.",
        "Max Limit: The tracker limit starts at 10, but is reduced by 2 for each permanent Sin Mark acquired, and by 1 for each Blasphemy beyond the first.",
        "Risk of Sin Overflow: If sin hits the current limit, you run the risk of gaining a new mutation or a permanent Sin Mark."
      ]
    },
    psyche: {
      title: "Psychic Pulses",
      desc: "Refined mental energy used to fuel Agenda abilities and Blasphemy powers.",
      rules: [
        "You spend Psychic Pulses to activate your exorcist's most powerful abilities.",
        "Recovery: Generally recover psychic pulses by completing hooks, suffering severe injuries, resting, or via class-specific skills (e.g., Beast)."
      ]
    },
    piety: {
      title: "Piety",
      desc: "Your spark of human conviction and moral purity that serves as a barrier against the darkness.",
      rules: [
        "Piety can be spent to alleviate accumulated stress or absorb temporary Sin points before they corrupt the sheet.",
        "Divine Agony: Once per session, you can burn (spend) all your active Piety to gain +1D bonus to a roll for each point of Piety burned.",
        "Substitution: Losing all piety leaves the exorcist much more vulnerable to the devastating influences of Sins."
      ]
    },
    agenda: {
      title: "Agendas",
      desc: "Agendas define the mission, convictions, and special starting abilities of the exorcist in the group.",
      rules: [
        "Your starting Agenda is chosen during character creation.",
        "It grants a starting Active Ability and defines the special Skills/Items the exorcist possesses.",
        "Following your Agenda helps to recover Piety and evolve the character."
      ]
    },
    blasphemy: {
      title: "Blasphemies",
      desc: "The profane and anomalous powers the exorcist can channel, originating from their supernatural seed.",
      rules: [
        "You start the game with one Blasphemy and two of its active powers.",
        "Spending and using Blasphemy powers generates Sin accumulation.",
        "When Sin overflows, the Blasphemy seed can cause severe mutations and permanent marks."
      ]
    }
  }
};

// Map screen/sheet label text to database keys
const TERM_MAP = {
  // Portuguese names
  "força": "force",
  "atletismo": "conditioning",
  "coordenação": "coordination",
  "furtividade": "covert",
  "interface": "interfacing",
  "investigação": "investigation",
  "observação": "surveillance",
  "negociação": "negotiation",
  "autoridade": "authority",
  "conexão": "connection",
  "psique": "psique",
  "ganchos": "hooks",
  "feridas": "injuries",
  "pecado": "sin",
  "pulsos psíquicos": "psyche",
  "piedade": "piety",

  "agenda": "agenda",
  "blasfêmia": "blasphemy",
  "blasphemy": "blasphemy",

  // English names
  "force": "force",
  "conditioning": "conditioning",
  "coordination": "coordination",
  "covert": "covert",
  "interfacing": "interfacing",
  "investigation": "investigation",
  "surveillance": "surveillance",
  "negotiation": "negotiation",
  "authority": "authority",
  "connection": "connection",
  "psychic": "psychic",
  "hooks": "hooks",
  "injuries": "injuries",
  "sin": "sin",
  "psychic pulses": "psychic pulses",
  "piety": "piety",
  "mercy": "mercy"
};

let toolboxElement = null;
let activeTab = "pericias";
const CATEGORY_MAP = {
  pericias: ["force", "conditioning", "coordination", "covert", "interfacing", "investigation", "surveillance", "negotiation", "authority", "connection", "psique"],
  estresse: ["hooks", "injuries", "sin", "psyche", "psychic pulses", "piety"],
  habilidade: ["agenda", "blasphemy"]
};

export function initToolbox() {
  if (document.getElementById("sheet-toolbox")) return;

  // Insert stylesheet if not already done
  if (!document.querySelector('link[href*="toolbox.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/toolbox.css";
    document.head.appendChild(link);
  }

  // Create Toolbox container
  toolboxElement = document.createElement("div");
  toolboxElement.id = "sheet-toolbox";
  toolboxElement.className = "sheet-toolbox";
  
  // Set inner HTML template
  toolboxElement.innerHTML = `
    <button class="toolbox-toggle-tab" id="btn-toolbox-toggle-tab" title="Fechar Guia">&gt;</button>
    <div class="toolbox-header">
      <h3 class="toolbox-title">
         <span data-i18n="toolbox.title">Toolbox / Guia</span>
      </h3>
      <button class="btn-toolbox-close" id="btn-toolbox-close" title="Fechar">&times;</button>
    </div>
    <div class="toolbox-filter-container" style="display: flex; gap: 10px; align-items: center;">
      <input type="text" class="toolbox-search-input" id="toolbox-search" placeholder="Buscar regra ou perícia..." data-i18n-placeholder="toolbox.search.placeholder" style="flex: 1;">
      <button class="btn-toolbox-close" id="btn-toolbox-close-filter" title="Fechar" style="font-size: 24px; padding: 0; line-height: 1; min-width: auto; background: none; border: none;">&times;</button>
    </div>
    <div class="toolbox-body">
      <div class="toolbox-tabs">
        <button class="toolbox-tab-btn active" data-tab="pericias">PERÍCIAS</button>
        <button class="toolbox-tab-btn" data-tab="estresse">ESTRESSE</button>
        <button class="toolbox-tab-btn" data-tab="habilidade">HABILIDADES</button>
      </div>
      <div class="toolbox-glossary" id="toolbox-glossary-list"></div>
      <div class="toolbox-active-content" id="toolbox-content">
        <!-- Dynamically loaded -->
        <p style="font-family: var(--font-body); font-size: var(--font-size-sm); color: var(--text-muted); text-align: center; margin-top: 40px;">
          Clique em qualquer perícia ou rótulo de atributo na ficha para ver as regras detalhadas aqui.
        </p>
      </div>
    </div>
  `;

  // Find sheet screen layout and append it there, or to the layout grid
  const layoutGrid = document.querySelector(".sheet-layout-grid");
  if (layoutGrid) {
    layoutGrid.appendChild(toolboxElement);
  } else {
    document.body.appendChild(toolboxElement);
  }

  setupEventListeners();
  renderGlossaryButtons();
}

function setupEventListeners() {
  const toggleTabBtn = document.getElementById("btn-toolbox-toggle-tab");
  if (toggleTabBtn) {
    toggleTabBtn.addEventListener("click", closeToolbox);
  }

  const closeBtn = document.getElementById("btn-toolbox-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeToolbox);
  }

  const closeFilterBtn = document.getElementById("btn-toolbox-close-filter");
  if (closeFilterBtn) {
    closeFilterBtn.addEventListener("click", closeToolbox);
  }

  const toggleBtn = document.getElementById("btn-toggle-toolbox");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (toolboxElement) {
        if (toolboxElement.classList.contains("open")) {
          closeToolbox();
        } else {
          toolboxElement.classList.add("open");
        }
      }
    });
  }

  const searchInput = document.getElementById("toolbox-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterGlossary(e.target.value);
    });
  }

  // Handle Tab clicks
  if (toolboxElement) {
    toolboxElement.querySelectorAll(".toolbox-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        toolboxElement.querySelectorAll(".toolbox-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        renderGlossaryButtons();
        if (searchInput) searchInput.value = "";
      });
    });
  }

  // Event Delegation for sheet screen click actions
  const sheetScreen = document.getElementById("sheet-screen");
  if (sheetScreen) {
    sheetScreen.addEventListener("click", (e) => {
      // 1. Skill Name clicked
      if (e.target.classList.contains("cain-skill-name")) {
        const nameText = e.target.textContent.trim().toLowerCase();
        const cleanKey = nameText.split("(")[0].trim(); // Extract name if it has e.g. "Force (Força)"
        const termKey = TERM_MAP[cleanKey] || cleanKey;
        if (TOOLBOX_DATA.pt[termKey]) {
          openToolbox(termKey);
        }
      }
      
      // 2. Clicked on an element with data-toolbox attribute
      const toolboxTrigger = e.target.closest("[data-toolbox]");
      if (toolboxTrigger) {
        const termKey = toolboxTrigger.getAttribute("data-toolbox");
        if (TOOLBOX_DATA.pt[termKey]) {
          openToolbox(termKey);
        }
      }

      // 3. Special target: Hooks title click
      if (e.target.classList.contains("hooks-title")) {
        openToolbox("hooks");
      }
    });
  }
}

function renderGlossaryButtons() {
  const lang = getLang() || "pt";
  const glossaryList = document.getElementById("toolbox-glossary-list");
  if (!glossaryList) return;

  const data = TOOLBOX_DATA[lang] || TOOLBOX_DATA.pt;
  const tabKeys = CATEGORY_MAP[activeTab] || [];

  glossaryList.innerHTML = Object.keys(data)
    .filter(key => tabKeys.includes(key))
    .map(key => {
      return `<button class="toolbox-glossary-btn" data-term="${key}">${data[key].title}</button>`;
    }).join("");

  glossaryList.querySelectorAll(".toolbox-glossary-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openToolbox(btn.dataset.term);
    });
  });
}

function filterGlossary(query) {
  const cleanQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const glossaryList = document.getElementById("toolbox-glossary-list");
  if (!glossaryList) return;

  const buttons = glossaryList.querySelectorAll(".toolbox-glossary-btn");
  buttons.forEach(btn => {
    const text = btn.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (text.includes(cleanQuery)) {
      btn.style.display = "";
    } else {
      btn.style.display = "none";
    }
  });
}

export function openToolbox(termKey) {
  if (!toolboxElement) {
    initToolbox();
  }

  // Switch to the correct tab if the term is in another category
  for (const [tabName, keys] of Object.entries(CATEGORY_MAP)) {
    if (keys.includes(termKey)) {
      if (activeTab !== tabName) {
        activeTab = tabName;
        if (toolboxElement) {
          toolboxElement.querySelectorAll(".toolbox-tab-btn").forEach(btn => {
            if (btn.dataset.tab === tabName) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        }
        renderGlossaryButtons();
      }
      break;
    }
  }

  const lang = getLang() || "pt";
  const contentContainer = document.getElementById("toolbox-content");
  const data = TOOLBOX_DATA[lang] || TOOLBOX_DATA.pt;
  const termData = data[termKey];

  if (!termData || !contentContainer) return;

  // Active glossary button styling
  const glossaryList = document.getElementById("toolbox-glossary-list");
  if (glossaryList) {
    glossaryList.querySelectorAll(".toolbox-glossary-btn").forEach(btn => {
      if (btn.dataset.term === termKey) {
        btn.classList.add("active");
        btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Populate Content
  contentContainer.innerHTML = `
    <h4 class="toolbox-active-title">${termData.title}</h4>
    <p class="toolbox-active-desc">${termData.desc}</p>
    <div class="toolbox-rules-header">${lang === "pt" ? "DIRETRIZES E REGRAS:" : "GUIDELINES & RULES:"}</div>
    <ul class="toolbox-rules-list">
      ${termData.rules.map(rule => `<li>${rule}</li>`).join("")}
    </ul>
    <div style="margin-top: 24px;">
      <button class="btn btn-sm" id="btn-toolbox-close-bottom" style="width: 100%; border-color: var(--color-rust); color: var(--color-rust-glow);">${lang === "pt" ? "Fechar Guia" : "Close Guide"}</button>
    </div>
  `;

  const closeBottomBtn = document.getElementById("btn-toolbox-close-bottom");
  if (closeBottomBtn) {
    closeBottomBtn.addEventListener("click", closeToolbox);
  }

  // Open the drawer
  toolboxElement.classList.add("open");
}

export function closeToolbox() {
  if (toolboxElement) {
    toolboxElement.classList.remove("open");
  }
}

// Re-render glossary if language changes
window.addEventListener("languageChanged", () => {
  renderGlossaryButtons();
});
