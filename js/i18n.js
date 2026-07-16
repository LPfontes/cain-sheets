// Internationalization for CAIN RPG
const TRANSLATIONS = {
  pt: {
    // Landing
    "landing.title": "Exorcistas",
    "landing.tabs.exorcists": "Exorcistas",
    "landing.subtitle": "Selecione um Exorcista para continuar ou crie um novo",
    "landing.counter": "Exorcista(s) registrado(s)",
    "landing.empty.title": "Nenhum exorcista registrado",
    "landing.empty.sub": "Crie seu primeiro personagem para começar",
    "landing.new": "Novo Registro",
    "landing.import": "Importar Registro",
    "landing.table": "Mesa de Jogo",
    "landing.tabs.missions": "Investigações",
    "missions.title": "Investigações",
    "missions.empty.title": "Nenhuma investigação registrada",
    "missions.empty.sub": "Crie sua primeira investigação para começar",
    "missions.new": "Nova Investigação",
    "missions.import": "Importar",
    "missions.counter": "Investigação(ões) registrada(s)",

    // Header Controls
    "header.rules": "Regras",
    "header.rules.title": "Abrir/Fechar Regras",
    "header.newChar": "Nova Ficha",
    "header.newChar.title": "Criar Nova Ficha",
    "header.import": "Importar",
    "header.import.title": "Importar Ficha JSON",
    "header.export": "Exportar",
    "header.export.title": "Exportar Ficha JSON",
    "header.assimilation": "Teste de Assimilação",
    "header.assimilation.title": "Realizar Teste de Assimilação",
    "header.tarot": "Refazer Tarot",
    "header.tarot.title": "Refazer Leitura (Tarot)",
    "header.delete.title": "Apagar Personagem",
    "header.sync.title": "Sincronizar Nuvem",
    "header.items.title": "Gerenciar Itens",
    "header.settings.title": "Configurações",
    "header.talisman": "Talismãs",
    "header.talisman.title": "Painel de Talismãs",

    // Wizard
    "wizard.title": "Criação de Exorcista (CAIN)",
    "wizard.step1": "Passo 1: O Papel do Exorcista",
    "wizard.step1.help": "Responda às seguintes perguntas. Você pode compartilhar com o grupo, se quiser.",
    "wizard.q1": "Como você manifestou seus poderes pela primeira vez?",
    "wizard.q2": "Sua semente profana está no seu cérebro ou no seu coração?",
    "wizard.q3": "O que você esconde nas partes mais profundas de si?",
    "wizard.q4": "Sua mão é realmente sua mão?",
    "wizard.q5": "Você se lembra do rosto da sua mãe?",
    "wizard.step2": "Passo 2: Identidade do Exorcista",
    "wizard.step2.help": "Dê um nome ao seu exorcista e decida a aparência dele. Anote o número de identificação interna e preencha os detalhes.",
    "wizard.name": "Nome do Exorcista:",
    "wizard.xid": "Número de Identificação (CID):",
    "wizard.appearance": "Aparência:",
    "wizard.step3": "Passo 3: Perícias",
    "wizard.step3.help": "Todas as perícias começam em <strong>1</strong>. Em seguida, <strong>aumente duas para 2</strong> e <strong>reduza três para 0</strong>.",
    "wizard.step3.info": "Use + para aumentar 2 perícias até 2, e - para reduzir 3 perícias até 0. Total deve ser <strong>9 pontos</strong>.",
    "wizard.skill.points": "Pontos distribuídos:",
    "wizard.step4": "Passo 4: Agenda",
    "wizard.step4.help": "Escolha uma agenda e <strong>uma habilidade</strong> dessa agenda.",
    "wizard.choose.skill": "Escolha 1 Habilidade:",
    "wizard.step5": "Passo 5: Blasfêmias",
    "wizard.step5.help": "Escolha uma blasfêmia e <strong>dois poderes</strong> dessa blasfêmia.",
    "wizard.choose.powers": "Escolha 2 Poderes:",
    "wizard.cancel": "Cancelar",
    "wizard.prev": "Anterior",
    "wizard.next": "Próximo",
    "wizard.finish": "Finalizar & Salvar",
    "wizard.validation.name": "Por favor, insira o nome do Exorcista.",
    "wizard.validation.skills": "O total de perícias deve ser 9. Distribuídos: {total}/9.",
    "wizard.validation.skills.increase": "Você deve aumentar exatamente 2 perícias para 2. Atualmente: {count2}.",
    "wizard.validation.skills.decrease": "Você deve reduzir exatamente 3 perícias para 0. Atualmente: {count0}.",
    "wizard.validation.agenda": "Escolha uma agenda.",
    "wizard.validation.agenda.skill": "Escolha uma habilidade da agenda.",
    "wizard.validation.blasphemy": "Escolha uma blasfêmia.",
    "wizard.validation.blasphemy.powers": "Escolha exatamente 2 poderes da blasfêmia.",
    "wizard.success": "Exorcista {name} ({xid}) criado com sucesso!",

    // Sheet
    "sheet.name": "Nome",
    "sheet.category": "Categoria",
    "sheet.xid": "XID",
    "sheet.agenda": "Agenda",
    "sheet.blasphemy": "Blasfêmia",
    "sheet.sex": "Sexo",
    "sheet.hair": "Cabelo",
    "sheet.eyes": "Olhos",
    "sheet.stress": "Estresse",
    "sheet.injuries": "Feridas",
    "sheet.skills": "Perícias",
    "sheet.agenda.normal": "Agenda Normal",
    "sheet.agenda.bold": "Agenda em Negrito",
    "sheet.blasphemies": "Blasfêmias",
    "sheet.equipment": "Equipamento",
    "sheet.hooks": "Ganchos",
    "sheet.notes": "Anotações",
    "sheet.notes.mission": "MISSÃO",
    "sheet.notes.mission.desc": "Objetivos, pistas e informações da missão atual.",
    "sheet.notes.contacts": "CONTATOS",
    "sheet.notes.contacts.desc": "Aliados, informantes e pessoas de confiança.",
    "sheet.notes.secrets": "SEGREDOS",
    "sheet.notes.secrets.desc": "Informações confidenciais e descobertas importantes.",
    "sheet.notes.journal": "DIÁRIO",
    "sheet.notes.journal.desc": "Relatos pessoais, reflexões e observações.",
    "sheet.notes.personal": "PESSOAL",
    "sheet.notes.personal.q1": "Como você manifestou seus poderes pela primeira vez?",
    "sheet.notes.personal.q2": "Sua semente profana está no seu cérebro ou no seu coração?",
    "sheet.notes.personal.q3": "O que você esconde nas partes mais profundas de si?",
    "sheet.notes.personal.q4": "Sua mão é realmente sua mão?",
    "sheet.notes.personal.q5": "Você se lembra do rosto da sua mãe?",
    "sheet.xp": "XP",
    "sheet.roll": "Lançar Dados",
    "sheet.change.photo": "Alterar Foto",
    "sheet.piedade": "Piedade",
    "sheet.divine.agony": "Agonia Divina",
    "sheet.divine.agony.active": "Ativado! +{bonus}D nesta rolagem",
    "sheet.age": "Idade",
    "sheet.cut": "Corte:",
    "sheet.sin": "Pecado:",
    "sheet.psyche": "Pulsos Psíquicos:",
    "sheet.piety": "Piedade:",
    "sheet.afflictions": "Aflições:",
    "sheet.custom.title": "ROLAGENS PERSONALIZADAS",
    "sheet.rollchat.title": "Chat de Rolagens",
    "sheet.rollchat.placeholder": "Nenhuma rolagem.",
    "sheet.rollchat.clear": "Limpar",
    "sheet.sin.warning": "RISCO DE VERTER PECADO!",

    // Sheet tabs
    "sheet.tab.perfil": "Perfil",
    "sheet.tab.agenda": "Agenda",
    "sheet.tab.blasphemies": "Blasfêmias",
    "sheet.tab.sinmarks": "Marcas do Pecado",
    "sheet.tab.equip": "Equip.",
    "sheet.tab.notes": "Notas",
    "sheet.tab.virtudes": "Virtudes",

    // Dynamic Sheet Content
    "sheet.agenda.activeSkill": "Habilidade de Agenda Ativa",
    "sheet.agenda.noActiveSkill": "Nenhuma habilidade de agenda selecionada.",
    "sheet.agenda.normalItems": "Itens Normais",
    "sheet.agenda.noNormalItems": "Nenhum item normal.",
    "sheet.agenda.boldItems": "Itens em Negrito",
    "sheet.agenda.noBoldItems": "Nenhum item negrito.",
    "sheet.blasphemies.none": "Nenhuma Blasfêmia adquirida.",
    "sheet.sinmarks.none": "Nenhuma Marca do Pecado.",
    "sheet.equipment.none": "Nenhum equipamento.",
    "sheet.hooks.none": "Nenhum gancho ativo.",
    "common.none": "Nenhum",

    // Toolbox
    "toolbox.title": "Guia de Regras",
    "toolbox.search.placeholder": "Buscar regra ou perícia...",

    // Common
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.edit": "Editar",
    "common.close": "Fechar",
    "common.confirm": "Confirmar",
    "common.yes": "Sim",
    "common.no": "Não",
    "common.language": "Idioma",
    "common.danger": "Perigo",
    "common.size": "Tam",
    "common.noName": "Sem nome",
    "common.degree": "Grau",
    "common.conflict": "Conflito",

    // Landing card options
    "landing.card.export": "Exportar Ficha",
    "landing.card.duplicate": "Duplicar Ficha",
    "landing.card.delete": "Excluir Ficha",

    // Sheet type modal
    "modal.sheet.type.title": "Que tipo de ficha deseja criar?",
    "modal.sheet.type.exorcista": "Exorcista",
    "modal.sheet.type.exorcista.desc": "Ficha de personagem jogador",
    "modal.sheet.type.missao": "Missão",
    "modal.sheet.type.missao.desc": "Rastreamento de sessão",
    "modal.sheet.type.pecado": "Pecado",
    "modal.sheet.type.pecado.desc": "Inimigo ou ameaça sobrenatural",

    // Skill names and groups
    "skills.physical": "Físicas",
    "skills.investigation": "Investigação",
    "skills.social": "Sociais",
    "skills.psychic": "Psíquica",
    "skills.Force": "Força",
    "skills.Conditioning": "Atletismo",
    "skills.Coordination": "Coordenação",
    "skills.Covert": "Furtividade",
    "skills.Interfacing": "Interface",
    "skills.Investigation": "Investigação",
    "skills.Surveillance": "Observação",
    "skills.Negotiation": "Negociação",
    "skills.Authority": "Autoridade",
    "skills.Connection": "Conexão",
    "skills.Psique": "Psique",
    "sheet.profile.xid.placeholder": "CX-0000",
    "sheet.profile.agenda.placeholder": "Agenda",
    "sheet.profile.blasphemy.placeholder": "Blaspêmia",
    "pecado.status.defeated": "DERROTADO / EXECUTADO!",
    "pecado.status.fled": "FUGIU PARA O PALÁCIO (Fugiu para o Palácio)!",
    "pecado.status.fled4": "FUGIU PARA O PALÁCIO (Fugiu após 4 cortes fora do Palácio)!",
  },
  en: {
    // Landing
    "landing.title": "Exorcists",
    "landing.tabs.exorcists": "Exorcists",
    "landing.subtitle": "Select an Exorcist to continue or create a new one",
    "landing.counter": "Exorcist(s) registered",
    "landing.empty.title": "No exorcists registered",
    "landing.empty.sub": "Create your first character to get started",
    "landing.new": "New Record",
    "landing.import": "Import Record",
    "landing.table": "Game Table",
    "landing.tabs.missions": "Investigations",
    "missions.title": "Investigations",
    "missions.empty.title": "No investigations registered",
    "missions.empty.sub": "Create your first investigation to get started",
    "missions.new": "New Investigation",
    "missions.import": "Import",
    "missions.counter": "Investigation(s) registered",

    // Header Controls
    "header.rules": "Rules",
    "header.rules.title": "Open/Close Rules",
    "header.newChar": "New Character",
    "header.newChar.title": "Create New Character",
    "header.import": "Import",
    "header.import.title": "Import JSON Character",
    "header.export": "Export",
    "header.export.title": "Export JSON Character",
    "header.assimilation": "Assimilation Test",
    "header.assimilation.title": "Perform Assimilation Test",
    "header.tarot": "Redo Tarot",
    "header.tarot.title": "Re-read Tarot",
    "header.delete.title": "Delete Character",
    "header.sync.title": "Cloud Sync",
    "header.items.title": "Manage Items",
    "header.settings.title": "Settings",
    "header.talisman": "Talismans",
    "header.talisman.title": "Talisman Board",

    // Wizard
    "wizard.title": "Exorcist Creation (CAIN)",
    "wizard.step1": "Step 1: The Exorcist's Paper",
    "wizard.step1.help": "An Exorcist is a piece of paper. Answer the following questions and write down the answers. You may share with the group if you wish.",
    "wizard.q1": "How did you first manifest your powers?",
    "wizard.q2": "Is your profane seed in your brain or in your heart?",
    "wizard.q3": "What do you hide in the deepest parts of yourself?",
    "wizard.q4": "Is your hand really your hand?",
    "wizard.q5": "Do you remember your mother's face?",
    "wizard.step2": "Step 2: Exorcist Identity",
    "wizard.step2.help": "Give your exorcist a name and decide their appearance. Note their internal identification number and fill in the details.",
    "wizard.name": "Exorcist Name:",
    "wizard.xid": "Identification Number (CID):",
    "wizard.appearance": "Appearance:",
    "wizard.step3": "Step 3: Skills",
    "wizard.step3.help": "All skills start at <strong>1</strong>. Then, <strong>increase two to 2</strong> and <strong>decrease three to 0</strong>.",
    "wizard.step3.info": "Use + to increase 2 skills to 2, and - to decrease 3 skills to 0. Total must be <strong>9 points</strong>.",
    "wizard.skill.points": "Points distributed:",
    "wizard.step4": "Step 4: Agenda",
    "wizard.step4.help": "Choose an agenda and <strong>one skill</strong> from that agenda.",
    "wizard.choose.skill": "Choose 1 Skill:",
    "wizard.step5": "Step 5: Blasphemies",
    "wizard.step5.help": "Choose a blasphemy and <strong>two powers</strong> from that blasphemy.",
    "wizard.choose.powers": "Choose 2 Powers:",
    "wizard.cancel": "Cancel",
    "wizard.prev": "Previous",
    "wizard.next": "Next",
    "wizard.finish": "Finish & Save",
    "wizard.validation.name": "Please enter the Exorcist's name.",
    "wizard.validation.skills": "Total skill points must be 9. Distributed: {total}/9.",
    "wizard.validation.skills.increase": "You must increase exactly 2 skills to 2. Currently: {count2}.",
    "wizard.validation.skills.decrease": "You must decrease exactly 3 skills to 0. Currently: {count0}.",
    "wizard.validation.agenda": "Please choose an agenda.",
    "wizard.validation.agenda.skill": "Please choose an agenda skill.",
    "wizard.validation.blasphemy": "Please choose a blasphemy.",
    "wizard.validation.blasphemy.powers": "Please choose exactly 2 blasphemy powers.",
    "wizard.success": "Exorcist {name} ({xid}) successfully created!",

    // Sheet
    "sheet.name": "Name",
    "sheet.category": "Category",
    "sheet.xid": "XID",
    "sheet.agenda": "Agenda",
    "sheet.blasphemy": "Blasphemy",
    "sheet.sex": "Sex",
    "sheet.hair": "Hair",
    "sheet.eyes": "Eyes",
    "sheet.stress": "Stress",
    "sheet.injuries": "Injuries",
    "sheet.skills": "Skills",
    "sheet.agenda.normal": "Normal Agenda",
    "sheet.agenda.bold": "Bold Agenda",
    "sheet.blasphemies": "Blasphemies",
    "sheet.equipment": "Equipment",
    "sheet.hooks": "Hooks",
    "sheet.notes": "Notes",
    "sheet.notes.mission": "MISSION",
    "sheet.notes.mission.desc": "Objectives, clues and current mission info.",
    "sheet.notes.contacts": "CONTACTS",
    "sheet.notes.contacts.desc": "Allies, informants and trusted people.",
    "sheet.notes.secrets": "SECRETS",
    "sheet.notes.secrets.desc": "Confidential information and important discoveries.",
    "sheet.notes.journal": "JOURNAL",
    "sheet.notes.journal.desc": "Personal accounts, reflections and observations.",
    "sheet.notes.personal": "PERSONAL",
    "sheet.notes.personal.q1": "How did you first manifest your powers?",
    "sheet.notes.personal.q2": "Is your profane seed in your brain or in your heart?",
    "sheet.notes.personal.q3": "What do you hide in the deepest parts of yourself?",
    "sheet.notes.personal.q4": "Is your hand really your hand?",
    "sheet.notes.personal.q5": "Do you remember your mother's face?",
    "sheet.xp": "XP",
    "sheet.roll": "Roll Dice",
    "sheet.change.photo": "Change Photo",
    "sheet.piedade": "Mercy",
    "sheet.divine.agony": "Divine Agony",
    "sheet.divine.agony.active": "Active! +{bonus}D on this roll",
    "sheet.age": "Age",
    "sheet.cut": "Cut:",
    "sheet.sin": "Sin:",
    "sheet.psyche": "Psychic Pulses:",
    "sheet.piety": "Piety:",
    "sheet.afflictions": "Afflictions:",
    "sheet.custom.title": "🎲 CUSTOM ROLLS",
    "sheet.rollchat.title": "Roll Chat",
    "sheet.rollchat.placeholder": "No rolls.",
    "sheet.rollchat.clear": "Clear",
    "sheet.sin.warning": "RISK OF SIN OVERFLOW!",

    // Sheet tabs
    "sheet.tab.perfil": "Profile",
    "sheet.tab.agenda": "Agenda",
    "sheet.tab.blasphemies": "Blasphemies",
    "sheet.tab.sinmarks": "Sin Marks",
    "sheet.tab.equip": "Equip.",
    "sheet.tab.notes": "Notes",
    "sheet.tab.virtues": "Virtues",

    // Dynamic Sheet Content
    "sheet.agenda.activeSkill": "Active Agenda Skill",
    "sheet.agenda.noActiveSkill": "No active agenda skill selected.",
    "sheet.agenda.normalItems": "Normal Items",
    "sheet.agenda.noNormalItems": "No normal items.",
    "sheet.agenda.boldItems": "Bold Items",
    "sheet.agenda.noBoldItems": "No bold items.",
    "sheet.blasphemies.none": "No Blasphemies acquired.",
    "sheet.sinmarks.none": "No Sin Marks.",
    "sheet.equipment.none": "No equipment.",
    "sheet.hooks.none": "No active hooks.",
    "common.none": "None",

    // Toolbox
    "toolbox.title": "Rules Guide",
    "toolbox.search.placeholder": "Search rule or skill...",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.language": "Language",
    "common.danger": "Danger",
    "common.size": "Size",
    "common.noName": "No name",
    "common.degree": "Grade",
    "common.conflict": "Conflict",

    // Landing card options
    "landing.card.export": "Export Sheet",
    "landing.card.duplicate": "Duplicate Sheet",
    "landing.card.delete": "Delete Sheet",

    // Sheet type modal
    "modal.sheet.type.title": "What type of sheet do you want to create?",
    "modal.sheet.type.exorcista": "Exorcist",
    "modal.sheet.type.exorcista.desc": "Player character sheet",
    "modal.sheet.type.missao": "Mission",
    "modal.sheet.type.missao.desc": "Session tracking",
    "modal.sheet.type.pecado": "Sin",
    "modal.sheet.type.pecado.desc": "Enemy or supernatural threat",

    // Skill names and groups
    "skills.physical": "Physical",
    "skills.investigation": "Investigation",
    "skills.social": "Social",
    "skills.psychic": "Psychic",
    "skills.Force": "Force",
    "skills.Conditioning": "Conditioning",
    "skills.Coordination": "Coordination",
    "skills.Covert": "Covert",
    "skills.Interfacing": "Interfacing",
    "skills.Investigation": "Investigation",
    "skills.Surveillance": "Surveillance",
    "skills.Negotiation": "Negotiation",
    "skills.Authority": "Authority",
    "skills.Connection": "Connection",
    "skills.Psique": "Psyche",
    "sheet.profile.xid.placeholder": "CX-0000",
    "sheet.profile.agenda.placeholder": "Personal agenda",
    "sheet.profile.blasphemy.placeholder": "Blasphemy",
    "pecado.status.defeated": "DEFEATED / EXECUTED!",
    "pecado.status.fled": "FLED TO THE PALACE (Fled to the Palace)!",
    "pecado.status.fled4": "FLED TO THE PALACE (Fled after 4 cuts outside the Palace)!",
  }
};

let currentLang = localStorage.getItem("cain_lang") || "pt";

export function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.pt[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("cain_lang", lang);
  applyTranslations();
  window.dispatchEvent(new Event("languageChanged"));
}

export function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (translated) {
      if (el.tagName === "INPUT" && el.type !== "file") {
        el.placeholder = translated;
      } else {
        el.innerHTML = translated;
      }
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const translated = t(key);
    if (translated) {
      el.placeholder = translated;
    }
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    const translated = t(key);
    if (translated) {
      el.title = translated;
    }
  });
}

export function toggleLanguage() {
  setLang(currentLang === "pt" ? "en" : "pt");
}
