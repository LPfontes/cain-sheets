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
    },
    temporal_instability: {
      title: "Instabilidade Temporal",
      desc: "Muitos dos seus poderes lhe conferem esse gancho.",
      rules: [
        "Quando o gancho se resolver, role 1d6:",
        "<strong>1:</strong> Adicione permanentemente à sua agenda: 'Prove que você é você mesmo'. Se você obtiver esse resultado novamente, verta pecado imediatamente.",
        "<strong>2:</strong> Ferimentos misteriosos surgem. Você desmaia de dor, ficando fora da cena atual e sofrendo um ferimento.",
        "<strong>3:</strong> Você desaparece até o descanso. Você retorna se houver uma cena de conflito. Você não se lembra de onde estava. Ao retornar, você sofre 2 de estresse.",
        "<strong>4:</strong> Você descobre que está vestindo as roupas de outra pessoa. Apague todo o seu equipamento desta missão, mas recupere quaisquer pontos de kit gastos.",
        "<strong>5:</strong> Seu corpo está diferente. Pelo restante desta missão, escolha uma perícia na qual você tenha 1 ou mais dados. Ela agora rola 0d. Após a missão, você terá tempo para treinar e se acostumar com isso, revertendo este efeito, embora mantendo quaisquer mudanças físicas.",
        "<strong>6:</strong> Seu rosto parece um pouco diferente. As mudanças são permanentes."
      ]
    },
    sombra: {
      title: "Sombra",
      desc: "A Sombra é intangível e invisível para todos, até mesmo para aqueles com sensibilidade psíquica. Ela só pode interagir fracamente com o mundo físico e possui mente e sentidos próprios.",
      rules: [
        "Seu alcance é curto a partir de você.",
        "Ela pode atravessar paredes e superfícies facilmente, mas se retrai para dentro do seu corpo quando exposta a luz forte, impedindo-a de fazer qualquer coisa.",
        "Você pode se comunicar telepaticamente com ela, mas isso é perigoso e causa 1 ponto de estresse após o término de qualquer interação.",
        "Ela não tem obrigação de lhe dizer a verdade, a menos que você use seus poderes.",
        "Você pode se comunicar com ela com segurança usando suas habilidades, e ela conhece o futuro.",
        "O Administrador responderá por ela."
      ]
    },
    pecado_vinculado: {
      title: "Pecado Vinculado",
      desc: "Seu Pecado Vinculado tem forma e habilidades animalescas — você pode determinar qual forma ele assume.",
      rules: [
        "Ele pode entender a linguagem, mas não pode falar, e é invisível para humanos.",
        "Ele pode segui-lo a curta distância, obedecer a ordens simples e usar suas habilidades para fazer qualquer coisa. Suas capacidades gerais são CAT 0.",
        "Se ele sofrer qualquer estresse, será banido pelo resto da cena; no entanto, você pode absorver psiquicamente todo o estresse sofrido por ele para evitar esse efeito.",
        "Em uma cena de conflito, você pode sacrificar sua capacidade de agir em seu turno para permitir que seu pecado aja em seu lugar, dando-lhe comandos.",
        "Caso contrário, ele não age de forma independente nessas cenas."
      ]
    },
    ausencia: {
      title: "Ausência",
      desc: "Você pode ganhar este gancho com sua passiva. Se este gancho se encher, você sofre um ferimento e desmaia por alguns instantes.",
      rules: [
        "Ao acordar, você estará sem uma parte do corpo (role 1d6). Ela simplesmente desaparece (Um ferimento limpo) como se nunca tivesse existido, deixando um toco ou buraco.",
        "Ela não retorna, mesmo se você curar o ferimento.",
        "Se você não tiver mais nenhuma parte do corpo para perder (ao rolar), reduza o resultado em 1. Se o resultado for 0, você perde a cabeça e sofre uma (horripilante) morte instantânea.",
        "A falta de partes do corpo pode tornar algumas rolagens difíceis ou arriscadas, dependendo da situação.",
        "Você se adapta a qualquer deficiência após a missão, e ela não tem mais efeitos.",
        "<strong>1:</strong> Olho",
        "<strong>2:</strong> Nariz",
        "<strong>3:</strong> Orelha",
        "<strong>4:</strong> Dedo",
        "<strong>5:</strong> Dedo do pé",
        "<strong>6:</strong> Nada"
      ]
    },
    alma_de_ferro: {
      title: "Alma de Ferro",
      desc: "Passiva de Tensão. Quando estiver prestes a preencher seu talismã de execução e sofrer um ferimento, você pode rolar 1d6.",
      rules: [
        "Com um resultado de 4 ou mais, você fica com 1 ponto de estresse abaixo do máximo e ignora qualquer excesso, perdendo o uso desta passiva até descansar."
      ]
    },
    fornalha_interna: {
      title: "Fornalha Interna",
      desc: "Passiva de Ardência. Você pode adquirir um gancho 'Poder Instável' ao usar qualquer poder de Ardência para aumentar o CAT do poder em até +2.",
      rules: [
        "Quando o gancho se enche, você queima por dentro, sofrendo um ferimento e encerrando o gancho.",
        "Se esse ferimento for fatal, você explode em uma área igual ao seu CAT, aniquilando a si mesmo e tudo dentro dela em uma explosão massiva."
      ]
    },
    roubar_tempo: {
      title: "Roubar Tempo",
      desc: "Passiva de Fluxo. Uma vez por caçada, você pode rolar novamente todos os seus dados de descanso para si mesmo ou para um aliado.",
      rules: [
        "Considere o segundo resultado como definitivo."
      ]
    },
    freio: {
      title: "Freio",
      desc: "Passiva de Vetor. Remove automaticamente a velocidade de todos os projéteis que o atingiriam.",
      rules: [
        "Causa -1 de estresse a eles."
      ]
    },
    bolso_extradimensional: {
      title: "Bolso Extradimensional",
      desc: "Passiva de Portão. Você pode inserir um rasgo comprimido no espaço em uma peça de roupa que esteja vestindo.",
      rules: [
        "Você ganha +1 PK.",
        "Você pode guardar ou retirar itens dentro do seu bolso, que pode conter um total combinado de itens no valor de até 3 PK.",
        "Uma vez dentro, os itens são armazenados em um espaço extradimensional, ocultos e seguros, independentemente do tamanho.",
        "O bolso está preso às suas roupas e, se elas forem destruídas, os itens dentro dele saltam para fora."
      ]
    },
    mimica: {
      title: "Mímica",
      desc: "Passiva de Editar. Você pode alterar pequenos detalhes da sua aparência.",
      rules: [
        "Características físicas: altura e peso.",
        "Características estéticas: traços faciais, cor da pele, cabelo e apresentação de gênero.",
        "Idade: de 13 a 88 anos.",
        "Você sempre tem uma aparência vagamente semelhante à sua, como um parente distante.",
        "Isso não altera suas habilidades, nem restaura partes do corpo perdidas ou esconde marcas de pecado."
      ]
    },
    conexao_fantasma: {
      title: "Conexão Fantasma",
      desc: "Passiva de Assombração. Você pode conectar sua mente telepaticamente com um número de pessoas dispostas igual a CAT.",
      rules: [
        "Enquanto estiverem a uma longa distância um do outro, vocês podem conversar telepaticamente e sentir o estado emocional um do outro.",
        "Esse efeito dura até que você o use novamente, até que alguém fique inconsciente ou até que você ou outra pessoa encerre a conexão."
      ]
    },
    santuario: {
      title: "Santuário",
      desc: "Passiva de Palácio. Você e os aliados com quem você descansa podem entrar em seu palácio psíquico enquanto descansam.",
      rules: [
        "Isso melhora os testes de descanso de você e de um aliado à sua escolha que esteja descansando com você em +1.",
        "O palácio é uma projeção mental, um espaço onírico que assume a forma de uma grande casa, residência ou mansão.",
        "Sofrer dano em um palácio instantaneamente expulsa a pessoa de lá, despertando-a.",
        "Entrar mentalmente no palácio requer apenas fechar os olhos e se concentrar, deixando seu corpo externo indefeso."
      ]
    },
    ressonancia: {
      title: "Ressonância",
      desc: "Passiva de Simpatia. No início da missão, role na tabela de ressonância.",
      rules: [
        "Role 1d3, depois 1d6 e verifique as tabelas de ressonância.",
        "Quando você estiver realizando uma rolagem de ação e estiver usando um item com o qual você tenha ressonância, você recebe um bônus de +1D.",
        "Você pode gastar um pulso psíquico a qualquer momento para rolar uma ressonância adicional.",
        "Você pode manter até três ressonâncias ativas simultaneamente."
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
    },
    temporal_instability: {
      title: "Temporal Instability",
      desc: "Many of your powers grant you this hook.",
      rules: [
        "When the hook resolves, roll 1d6:",
        "<strong>1:</strong> Permanently add to your agenda: 'Prove that you are yourself'. If you get this result again, immediately trigger sin overflow.",
        "<strong>2:</strong> Mysterious wounds appear. You pass out from pain, leaving the current scene and suffering an injury.",
        "<strong>3:</strong> You disappear until you rest. You return if there is a conflict scene. You don't remember where you were. Upon returning, you suffer 2 stress.",
        "<strong>4:</strong> You find out you are wearing someone else's clothes. Erase all your equipment for this mission, but recover any spent kit points.",
        "<strong>5:</strong> Your body is different. For the remainder of this mission, choose a skill in which you have 1 or more dice. It now rolls 0d. After the mission, you will have time to train and get used to it, reversing this effect while keeping physical changes.",
        "<strong>6:</strong> Your face looks slightly different. The changes are permanent."
      ]
    },
    sombra: {
      title: "Shadow",
      desc: "The Shadow is intangible and invisible to everyone, even those with psychic sensitivity. It can only interact weakly with the physical world and has its own mind and senses.",
      rules: [
        "Its range is short from you.",
        "It can easily pass through walls and surfaces, but retreats into your body when exposed to bright light, preventing it from doing anything.",
        "You can communicate telepathically with it, but this is dangerous and causes 1 stress after any interaction ends.",
        "It is not obligated to tell you the truth, unless you use your powers.",
        "You can communicate with it safely using your abilities, and it knows the future.",
        "The GM will answer for it."
      ]
    },
    pecado_vinculado: {
      title: "Bound Sin",
      desc: "Your Bound Sin has an animalistic form and abilities — you may determine what form it takes.",
      rules: [
        "It can understand language, but cannot speak, and is invisible to humans.",
        "It can follow you at short range, obey simple orders, and use your skills to do anything. Its general capabilities are CAT 0.",
        "If it suffers any stress, it will be banished for the rest of the scene; however, you can psychically absorb all stress it suffered to prevent this effect.",
        "In a conflict scene, you can sacrifice your ability to act on your turn to allow your sin to act in your place, giving it commands.",
        "Otherwise, it does not act independently in such scenes."
      ]
    },
    ausencia: {
      title: "Absence",
      desc: "You can gain this hook through your passive. If this hook fills up, you suffer an injury and pass out for a few moments.",
      rules: [
        "When you wake up, you are missing a body part (roll 1d6). It simply disappears (a clean injury) as if it never existed, leaving a stump or hole.",
        "It does not return, even if you heal the injury.",
        "If you have no more body parts to lose (when rolling), reduce the result by 1. If the result is 0, you lose your head and suffer (horrifying) instant death.",
        "Missing body parts can make some rolls difficult or risky, depending on the situation.",
        "You adapt to any disability after the mission, and it no longer has any effects.",
        "<strong>1:</strong> Eye",
        "<strong>2:</strong> Nose",
        "<strong>3:</strong> Ear",
        "<strong>4:</strong> Finger",
        "<strong>5:</strong> Toe",
        "<strong>6:</strong> Nothing"
      ]
    },
    alma_de_ferro: {
      title: "Iron Soul",
      desc: "Tensão passive. When you are about to fill your execution talisman and suffer an injury, you may roll 1d6.",
      rules: [
        "With a result of 4 or more, you stay 1 stress below the maximum and ignore any excess, losing use of this passive until rest."
      ]
    },
    fornalha_interna: {
      title: "Internal Furnace",
      desc: "Ardência passive. You may acquire a 'Unstable Power' hook when using any Ardência power to increase the power's CAT by up to +2.",
      rules: [
        "When the hook fills, you burn inside, suffering an injury and ending the hook.",
        "If this injury is fatal, you explode in an area equal to your CAT, annihilating yourself and everything within it."
      ]
    },
    roubar_tempo: {
      title: "Steal Time",
      desc: "Fluxo passive. Once per hunt, you may reroll all your rest dice for yourself or an ally.",
      rules: [
        "Consider the second result as definitive."
      ]
    },
    freio: {
      title: "Brake",
      desc: "Vetor passive. Automatically removes speed from all projectiles that would hit you.",
      rules: [
        "Causes -1 stress to them."
      ]
    },
    bolso_extradimensional: {
      title: "Extradimensional Pocket",
      desc: "Portão passive. You can insert a compressed tear in space into a piece of clothing you are wearing.",
      rules: [
        "You gain +1 PK.",
        "You can store or retrieve items inside your pocket, which can hold a combined total of up to 3 PK worth of items.",
        "Once inside, items are stored in an extradimensional space, hidden and safe, regardless of size.",
        "The pocket is attached to your clothes; if they are destroyed, the items inside pop out."
      ]
    },
    mimica: {
      title: "Mimicry",
      desc: "Editar passive. You can alter small details of your appearance.",
      rules: [
        "Physical traits: height and weight.",
        "Aesthetic traits: facial features, skin color, hair, and gender presentation.",
        "Age: from 13 to 88 years old.",
        "You always look vaguely similar to yourself, like a distant relative.",
        "This does not change your abilities, nor restore lost body parts or hide sin marks."
      ]
    },
    conexao_fantasma: {
      title: "Ghost Connection",
      desc: "Assombração passive. You can telepathically connect your mind with a number of willing people equal to CAT.",
      rules: [
        "While at long distance from each other, you can talk telepathically and feel each other's emotional state.",
        "This effect lasts until you use it again, until someone becomes unconscious, or until you or someone else ends the connection."
      ]
    },
    santuario: {
      title: "Sanctuary",
      desc: "Palácio passive. You and allies you rest with may enter your psychic palace while resting.",
      rules: [
        "This improves rest tests for you and one ally of your choice who is resting with you by +1.",
        "The palace is a mental projection, a dreamlike space taking the form of a large house or mansion.",
        "Suffering damage in the palace instantly expels the person from it, waking them up.",
        "Entering the palace mentally requires only closing your eyes and concentrating, leaving your outer body defenseless."
      ]
    },
    ressonancia: {
      title: "Resonance",
      desc: "Simpatia passive. At the start of the mission, roll on the resonance table.",
      rules: [
        "Roll 1d3, then 1d6 and check the resonance tables.",
        "When making an action roll using an item you have resonance with, you gain +1D.",
        "You may spend a psychic pulse at any time to roll an additional resonance.",
        "You can maintain up to three active resonances simultaneously."
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
  "instabilidade temporal": "temporal_instability",
  "temporal instability": "temporal_instability",
  "ausência": "ausencia",
  "absence": "ausencia",
  "sombra": "sombra",
  "shadow": "sombra",
  "pecado vinculado": "pecado_vinculado",
  "bound sin": "pecado_vinculado",

  "alma de ferro": "alma_de_ferro",
  "iron soul": "alma_de_ferro",
  "fornalha interna": "fornalha_interna",
  "internal furnace": "fornalha_interna",
  "roubar tempo": "roubar_tempo",
  "steal time": "roubar_tempo",
  "freio": "freio",
  "brake": "freio",
  "bolso extradimensional": "bolso_extradimensional",
  "extradimensional pocket": "bolso_extradimensional",
  "mímica": "mimica",
  "mimicry": "mimica",
  "conexão fantasma": "conexao_fantasma",
  "ghost connection": "conexao_fantasma",
  "santuário": "santuario",
  "sanctuary": "santuario",
  "ressonância": "ressonancia",
  "resonance": "ressonancia",

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
  "mercy": "mercy",
  "temporal instability": "temporal_instability"
};

let toolboxElement = null;
let activeTab = "pericias";
const CATEGORY_MAP = {
  pericias: ["force", "conditioning", "coordination", "covert", "interfacing", "investigation", "surveillance", "negotiation", "authority", "connection", "psique"],
  estresse: ["hooks", "injuries", "sin", "psyche", "psychic pulses", "piety"],
  habilidade: ["agenda", "blasphemy","temporal_instability", "ausencia", "sombra", "pecado_vinculado"]
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
