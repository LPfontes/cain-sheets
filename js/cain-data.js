export const CAIN_SKILLS = {
  physical: {
    label: "Físicas",
    skills: {
      Force: { name: "Força   ", desc: "Força direta, violência, lutar, quebrar, cortar" },
      Conditioning: { name: "Atletismo ", desc: "Deslocamento, correr, escalar, nadar, equilibrar, fadiga" },
      Coordination: { name: "Coordenação ", desc: "Habilidade manual, precisão, atirar, arremessar, pegar" }
    }
  },
  investigation: {
    label: "Investigação",
    skills: {
      Covert: { name: "Furtividade", desc: "Ações secretas, mover-se em silêncio, arrombar fechaduras" },
      Interfacing: { name: "Interface", desc: "Computadores, hacking, eletrônicos, sistemas" },
      Investigation: { name: "Investigação", desc: "Analisar registros, pesquisar, deduzir pistas" },
      Surveillance: { name: "Observação", desc: "Notar detalhes, vigiar, patrulhar, perceber ameaças" }
    }
  },
  social: {
    label: "Sociais",
    skills: {
      Negotiation: { name: "Negociação", desc: "Barganhar, convencer, persuadir, diplomacia" },
      Authority: { name: "Autoridade", desc: "Intimidar, comandar, liderar, impor respeito" },
      Connection: { name: "Conexão", desc: "Contatos, obter boatos, rede de informações" }
    }
  },
  psique: {
    label: "Psíquica",
    skills: {
      Psique: { name: "Psique", desc: "Metade da categoria, arredondado para cima" }
    }
  }
};

export const ALL_SKILLS = [
  "Force", "Conditioning", "Coordination",
  "Covert", "Interfacing", "Investigation", "Surveillance",
  "Negotiation", "Authority", "Connection",
  "Psique"
];

export const CAT_TABLE = {
  1: { label: "CAT 1 — Iniciante", skillPoints: 3, blasphemies: 1, desc: "Recém-ingresso em CASTLE. Poderes limitados." },
  2: { label: "CAT 2 — Operador", skillPoints: 5, blasphemies: 2, desc: "Já provou seu valor em campo." },
  3: { label: "CAT 3 — Veterano", skillPoints: 7, blasphemies: 3, desc: "Exorcista experiente com poderes consolidados." },
  4: { label: "CAT 4 — Elite", skillPoints: 9, blasphemies: 4, desc: "Força-tarefa de elite. Temido pelos Pecados." },
  5: { label: "CAT 5 — Lenda", skillPoints: 12, blasphemies: 5, desc: "Poder quase incontrolável. Lenda viva." }
};

export const AGENDAS = {
  "beast": {
    "name": "Besta",
    "desc": "A violência é sua linguagem.",
    "icon": "./assets/agendas/icons/Besta.webp",
    "normal": ["Participe de uma luta"],
    "bold": ["Se contenha"],
    "habilidades": [
      { "name": "Insetos!!!", "desc": "Você tem +1D ao infligir dano ou violência contra oponentes humanos." },
      { "name": "Vou te derrubar comigo", "desc": "Recupere 1 pulso psíquico ao sofrer um ferimento, preencher um gancho ou sofrer uma aflição." },
      { "name": "Lei da Natureza", "desc": "Quando você inflige violência com uma ação, se rolar dois ou mais 6, a ação inflige 1 corte adicional em quaisquer talismãs e você recupera 1 pulso psíquico." },
      { "name": "Músculo Vermelho", "desc": "Você pode sofrer 2 estresses não letais para ganhar +1D em qualquer rolagem violenta ou vigorosa." },
      { "name": "Dentes à Mostra", "desc": "Enquanto você tiver dois ou mais ferimentos ou aflições, não será mais difícil usar capacidades mundanas contra forças sobrenaturais e suas habilidades físicas humanas serão 1/2 CAT em vez de CAT 0." }
    ]
  },
  "condemned": {
    "name": "Condenado",
    "desc": "Você só pode escolher esta agenda se já tiver uma marca de pecado.<br> Se for sua primeira agenda, você pode começar com uma marca de pecado de sua escolha (escolha apenas a localização, ainda role 1d6 para a habilidade).",
    
    "icon": "./assets/agendas/icons/Condenado.webp",
    "normal": ["Demonstre sua humanidade"],
    "bold": ["Demonstre sua distancia da humanidade"],
    "habilidades": [
      { "name": "Carnexeno", "desc": "Ignore '1's rolados para ganhar Pecado." },
      { "name": "Último Suspiro da Humanidade", "desc": "Escolha uma marca de pecado que você possua. Evolua essa marca de pecado. Ela não modifica mais as rolagens de resistência." },
      { "name": "Aceleração", "desc": "Quando você ganha 2 ou mais de Pecado como parte de uma ação, sua ação também ganha +1D." },
      { "name": "Mutação Simpática", "desc": "Você pode sofrer 1d3 de Pecado para conceder a um aliado os benefícios de qualquer habilidade de marca de pecado que você possua por uma cena." },
      { "name": "Metamorfose", "desc": "Entre missões ou durante o descanso, você pode sofrer 1 de Pecado para rolar novamente a habilidade de uma de suas marcas de Pecado. Se você rolar uma habilidade que já possui, escolha uma em vez disso." }
    ]
  },
  "guardian": {
    "name": "Guardião",
    "desc": "Você não recebe pagamento nem XP pelos mortos.",
    "icon": "./assets/agendas/icons/Guardiao.webp",
    "normal": ["Proteja seu povo"],
    "bold": ["Não deixe ninguém para trás"],
    "habilidades": [
      { "name": "Muralha de Ferro", "desc": "Quando você defende alguém próximo em uma cena de conflito, você pode optar por transferir quaisquer consequências sofridas pelo seu alvo para você." },
      { "name": "A Agonia Excessiva de Seguir em Frente", "desc": "Elimine 1 ponto de estresse quando a pressão aumentar, se você tiver mais de 3." },
      { "name": "Castelo", "desc": "Quando qualquer aliado sofrer um ferimento, você elimina 1 ponto de estresse e ganha +1D em sua próxima ação." },
      { "name": "Contrapeso", "desc": "Ao descansar, aliados que gastam dados de descanso podem definir os resultados dos dados deles nos seus invés." },
      { "name": "Analgésico", "desc": "Seu primeiro ferimento sofrido não reduz o estresse máximo." }
    ]
  },
  "firefly": {
    "name": "Vaga-Lume",
    "desc": "",
    "icon": "./assets/agendas/icons/Vaga_lume.webp",
    "normal": ["Resolva problemas de forma criativa"],
    "bold": ["Escolha a solução mais simples"],
    "habilidades": [
      { "name": "Jack!", "desc": "No início de uma missão, escolha uma perícia que você tenha em 0. Você pode melhorá-la para 1 apenas durante a duração desta missão." },
      { "name": "Sempre há um caminho", "desc": "Se não houver uma entrada ou saída para um local, você pode encontrar uma." },
      { "name": "Mãos de Óleo", "desc": "Você começa uma missão com 1d3+1 Pontos de Kit extras." },
      { "name": "Peças Extras", "desc": "Você pode marcar 1 PK para +1D em qualquer rolagem que envolva consertar, fabricar, desmontar ou modificar dispositivos ou máquinas." },
      { "name": "Ponto Fraco", "desc": "Quando um aliado realiza uma ação violenta ou vigorosa, você pode conceder a ele +1D em sua ação e +1 corte em quaisquer talismãs em caso de sucesso." }
    ]
  },
  "solitary": {
    "name": "Solitário",
    "desc": "",
    "icon": "./assets/agendas/icons/Solitario.webp",
    "normal": ["Demonstre sua habilidade superior"],
    "bold": ["Deixe a máscara escorregar"],
    "habilidades": [
      { "name": "Do Pó ao Pó", "desc": "O estresse não se transfere mais quando você sofre um ferimento (o excesso é perdido)." },
      { "name": "Ataque Silencioso", "desc": "Ganha +1D em ações violentas contra alvos que não estão cientes da sua presença." },
      { "name": "Eu mesmo resolvo", "desc": "Uma vez por cena, quando alguém falha em uma rolagem, você pode intervir para ajudá-lo, desde que seja capaz. Você ganha 1d3+1 de estresse não letal, mas rola 1D e adiciona ao resultado total." },
      { "name": "Torre", "desc": "Quando você tiver sucesso em ajudar um aliado, você pode sofrer 2 de estresse não letal para ajudar outro aliado de sua escolha com a mesma ação." },
      { "name": "Não é Nada", "desc": "Você pode ignorar sofrer um ferimento dizendo \"Não é Nada\". Ganhe o gancho \"Não é Nada\". Quando o gancho se enche, você desaba e sofre morte instantânea." }
    ]
  },
  "rigorous": {
    "name": "Rigoroso",
    "desc": "ERADICATE THE VERMIN",
    "icon": "./assets/agendas/icons/Rigoroso.webp",
    "normal": ["Seguir ordens"],
    "bold": ["Desobedecer ordens"],
    "habilidades": [
      { "name": "Terno Preto", "desc": "Ganha +1D em ações para liderar, intimidar ou dar ordens a humanos comuns." },
      { "name": "Mea Culpa", "desc": "Na primeira vez em uma caçada que você sofrer um ferimento ou uma aflição, alivie 1d3+1 de pecado." },
      { "name": "Eliminar a Mancha", "desc": "Ganha +1D e inflija +1 corte em talismãs na primeira vez que você rolar contra pecados que tenham metade ou menos de seu talismã de execução restante." },
      { "name": "Foco Total", "desc": "Você só pode ser afetado por uma aflição no máximo (você pode escolher qual descartar e manter)." },
      { "name": "Seguindo as Regras", "desc": "Uma vez por caçada, quando você testemunhar ou encontrar evidências do Domínio de um pecado, você pode forçar o Administrador a mostrar o texto exato das regras desse Domínio." }
    ]
  },
  "machine": {
    "name": "Máquina",
    "desc": "SE O SEU GRUPO DESCANSAR, VOCÊ PODE ESCOLHER SE EXCLUIR DO DESCANSO",
    "icon": "./assets/agendas/icons/Maquina.webp",
    "normal": ["Priorize o trabalho em detrimento das suas necessidades pessoais"],
    "bold": ["Faça uma pausa"],
    "habilidades": [
      { "name": "O Trabalho", "desc": "Você pode optar por ganhar +1D em qualquer rolagem. Se o fizer, sofra 1 de estresse para cada vez que usou esta habilidade nesta missão." },
      { "name": "Explosão Cerebral", "desc": "Ao investigar ou pesquisar algo, você pode sofrer 1 de estresse não letal para rolar novamente um dado em sua rolagem de ação." },
      { "name": "Retomar Fôlego", "desc": "Quando a pressão chegar a 4, alivie todo o estresse ou remova uma aflição." },
      { "name": "Hora Extra", "desc": "Você pode ganhar +1D em todas as ações para investigar, analisar ou coletar informações durante a duração de uma cena." },
      { "name": "Pequeno Universo Organizado", "desc": "Duas vezes por caçada, fora de conflito, você pode aumentar ou diminuir em 1 o valor de qualquer talismã em sua ficha ou na de um aliado." }
    ]
  },
  "moth": {
    "name": "Mariposa",
    "desc": "",
    "icon": "./assets/agendas/icons/Mariposa.webp",
    "normal": ["Descubra verdades ocultas ou desconfortáveis sobre o mundo"],
    "bold": ["Descubra verdades ocultas ou desconfortáveis sobre você mesmo"],
    "habilidades": [
      { "name": "Joia Psíquica", "desc": "Na primeira vez que você ou um aliado responder a uma pergunta sobre o trauma de um Pecado, recupere 1 pulso psíquico, recupere 1 pecado e elimine 1 ponto de estresse." },
      { "name": "Alienação", "desc": "Seu limite de pecado aumenta em 2." },
      { "name": "Êxtase", "desc": "Você elimina 1 ponto de estresse ao sofrer uma aflição, ferimento ou gancho." },
      { "name": "Larval", "desc": "Se você terminar uma missão com 7 ou mais de pecado, ganhe 1 ponto de experiência. Se verter pecado, ganhe 1 ponto de experiência." },
      { "name": "Revelar", "desc": "Você pode perguntar ao Administrador sobre um personagem presente: \"Do que essa pessoa tem medo?\". Ganhe +1D ao agir de acordo com as respostas pelo resto da cena." }
    ]
  },
  "torch": {
    "name": "Tocha",
    "desc": "",
    "icon": "./assets/agendas/icons/Tocha.webp",
    "normal": ["Lidere o caminho"],
    "bold": ["Deixe que outro assuma a liderança"],
    "habilidades": [
      { "name": "Lançador de vento da sorte", "desc": "Quando você rola 0d para qualquer ação, nunca é difícil." },
      { "name": "Sangue quente", "desc": "Sua primeira ação em uma cena de conflito ganha +1D e inflija +1 corte em quaisquer talismãs." },
      { "name": "Fonte de Poder", "desc": "Depois de caçar, você pode ganhar 1d3 pulsos psíquicos, que podem acabar pondo você acima do seu máximo." },
      { "name": "Relembrar", "desc": "No final de uma sessão, você pode descrever algo que outro personagem fez que impressionou você e dar àquele personagem 1 xp." },
      { "name": "Esforce-se", "desc": "Uma vez por caçada, você pode fazer uma re-rolagem completa de qualquer ação que você ou um aliado acabou de tirar, tomando o segundo resultado como final." }
    ]
  },
  "sombra": {
    "name": "Sombra",
    "desc": "Ao escolher esta agenda, escolha outro personagem para ser seu rival.",
    "icon": "./assets/agendas/icons/sombra.webp",
    "normal": ["Ofusque seu rival"],
    "bold": ["Deixe seu rival ofuscar você"],
    "habilidades": [
      { "name": "Alcançar", "desc": "Se o seu rival tiver menos estresse do que você quando a pressão aumentar, apague 1 estresse. Se ele tiver mais pulsos psíquicos, recupere 1 pulso psíquico." },
      { "name": "Sincronizar", "desc": "Ao ajudar seu rival, você sofre 1 de estresse não letal e +1D na ação para ajudar." },
      { "name": "Você não pode morrer agora", "desc": "Uma vez por caçada, se seu rival sofrer um ferimento ou sofrer morte instantânea, você pode sofrer 2d3 de estresse para permitir que ele ignore isso." },
      { "name": "Semente das sombras", "desc": "Escolha um poder de blasfêmia que seu rival tenha. Você pode usar esse poder nesta caçada, mas seu maximo é CAT 0." },
      { "name": "Técnica de Pinça", "desc": "Quando você participa de um trabalho em equipe com seu rival, você sofre 1 estresse não letal, mas também pode rolar novamente um dos dados uma vez." }
    ]
  },
  "feiticeiro": {
    "name": "Feiticeiro",
    "desc": "",
    "icon": "./assets/agendas/icons/Feiticeiro.webp",
    "normal": ["Demonstre seus poderes chamativos"],
    "bold": ["Convide a catástrofe"],
    "habilidades": [
      { "name": "Técnica Perfeita", "desc": "Escolha uma blasfêmia. Uma vez por caçada, você pode aumentar o CAT dessa blasfêmia em +1 temporariamente por uma cena inteira." },
      { "name": "Truque", "desc": "Escolha uma habilidade de blasfêmia. Você pode usá-la duas vezes por caçada sem gastar um pulso psíquico, mas todos os parâmetros terão no máximo CAT 0." },
      { "name": "Movimento Final", "desc": "Escolha um poder de blasfêmia. Você pode aumentar os dados e o CAT desse poder em +1 na próxima vez que usá-lo." },
      { "name": "Técnica de mímica", "desc": "Escolha um poder de qualquer blasfêmia, sem ter tomado essa blasfêmia. Isso não altera seus limites de XP ou de pecado." },
      { "name": "Tecer", "desc": "Quando você usa uma blasfêmia, você pode aumentar o CAT da próxima blasfêmia usada por um aliado contra o mesmo alvo em +1 e conceder +1D em qualquer jogada." }
    ]
  },
  "rouxinol": {
    "name": "Rouxinol",
    "desc": "Minha Agenda",
    "icon": "./assets/agendas/icons/Rouxinol.webp",
    "normal": ["Consiga alguém para fazer a sua vontade"],
    "bold": ["Faça algo altruísta"],
    "habilidades": [
      { "name": "Codependência", "desc": "Quando alguém ajuda você, você pode trocar 1 estresse (de você para essa pessoa ou vice-versa)." },
      { "name": "Espiral", "desc": "Você sempre pode saber se alguém está mentindo para você, embora não seja a natureza da mentira." },
      { "name": "Amarras", "desc": "Quando você descansa com um parceiro consentido, eles adicionam +1 a todos os seus resultados de descanso." },
      { "name": "Fibra Branca", "desc": "Você pode sofrer 2 de estresse não letal para ganhar +1D em qualquer teste para mentir ou manipular alguém." },
      { "name": "Fascínio", "desc": "Você pode declarar seu fascínio por outro personagem do grupo no início de qualquer caçada." }
    ]
  },
  "demonio": {
    "name": "Demónio",
    "desc": "Você pode usar scrip como pontos de kit.",
    "icon": "./assets/agendas/icons/demonio.webp",
    "normal": ["Enriqueça-se"],
    "bold": ["Doe algo valioso"],
    "habilidades": [
      { "name": "Estimulantes do mercado negro", "desc": "Você pode gastar até 2 scrips por missão como um pulso psíquico." },
      { "name": "Parcerias com fornecedores", "desc": "Você ganha um desconto de 1 scrip em todos os itens de kit e itens estéticos, até um mínimo de 1." },
      { "name": "Credor duvidoso", "desc": "Entre missões, você pode optar por ganhar 1d3 scrip uma vez, mas começar a próxima missão com 1 ferimento." },
      { "name": "Sem Coração", "desc": "Você ganha +1 scrip por executar pecados." },
      { "name": "Impecável", "desc": "Uma vez por missão, você pode destruir um kit de expansão estético que possua e que valha 3 ou mais scrips em vez de sofrer um ferimento." }
    ]
  }
};

export const BLASPHEMIES = [
  { 
    id: "tensao", 
    name: "Tensão", 
    
    img: "assets/blasf/TENSÃO.jpg",
    desc: "Projete um campo psíquico de incrível densidade e durabilidade. Isso geralmente assume a forma de uma superfície metálica brilhante, visível apenas para aqueles com sensibilidade psíquica.<br><br><strong>Fato:</strong> Usuários de Tensão têm alta probabilidade de vivenciar episódios da síndrome de encarceramento pelo menos semi-regularmente até que consigam dominar seus poderes. Consulte o manual de campo.", 
    passive: "<strong>Alma de Ferro:</strong> Quando você estiver prestes a preencher seu talismã de execução e sofrer um ferimento, você pode rolar 1d6. Com um resultado de 4 ou mais, você fica com 1 ponto de estresse abaixo do máximo e ignora qualquer excesso, perdendo o uso desta passiva até descansar.",
    powers: [
      { name: "Égide", desc: "<strong>[Instantâneo Curto | Sem custo de pulso]</strong> Quando você ou um aliado visível a curta distância de você marcar estresse por danos externos, você pode intervir respondendo às seguintes perguntas:<br>• Você consegue alcançar seu alvo a tempo?<br>• Existe alguma parte do ambiente que você possa usar para proteger seu alvo?<br>• Você está colocando seu coração nisso?<br><br>Você cria uma força de tensão instantânea de incrível intensidade, bloqueando danos. Para cada resposta \"sim\", role 1d6. Para cada resultado 2 ou mais, reduza o estresse sofrido em 1, e para cada resultado 6, reduza-o em 2. Isso pode reduzir o estresse sofrido a 0. Após usar este poder, ele perde sua utilidade até descansar." },
      { name: "Estase", desc: "<strong>[Maldição, 1 cena, Curto | Requer 1 pulso]</strong> Com um gesto, você pode trancar a si mesmo ou um grupo de humanos ou exorcistas do tamanho CAT em uma gaiola de tensão que os cobre como uma segunda pele, paralisando-os. Se um humano for hostil ou relutante, role PSIQUE e gaste o pulso psíquico apenas in caso de sucesso.<br><br>Uma vez preso, seu alvo fica imobilizado, incapaz de se mover ou reagir durante a cena e imune a todos os danos e efeitos externos. O efeito só termina quando a cena se encerra e não é possível dissipá-lo antes. O alvo pode ser movido como um objeto (muito rígido) e permanece totalmente consciente enquanto estiver dentro, ele pode ver como se estivesse olhando através de um vidro grosso e não precisa respirar." },
      { name: "Ruptura", desc: "<strong>[Instantâneo Curto | Requer 1 pulso]</strong> Você pode projetar uma força de tensão de incrível força sobre qualquer borda, tão óbvia quanto uma lâmina e tão sutil quanto uma unha, e usá-la como um instrumento de corte. Role PSIQUE para cortar um objeto ou oponente de até o tamanho CAT com um golpe limpo e decisivo, gastando apenas um pulso psíquico no sucesso.<br>• Ganhe +1D se estiver atacando para proteger outra pessoa<br>• Ganhe +1D contra objetos imóveis ou oponentes." },
      { name: "Maleato", desc: "<strong>[Transmutação, Até o descanso, Adjacente | Requer 1 pulso]</strong> Você pode inverter e infundir um campo de tensão para tornar uma área de matéria não viva incrivelmente maleável e macia. O tamanho desse bloco de matéria que você pode afetar é afetado por CAT. Escolha um dos seguintes efeitos e você poderá ganhar ou conceder +1D quando você ou qualquer aliado agir para tirar proveito deste poder:<br>• Borracha: A matéria torna-se elástica e flexível.<br>• Lama: A matéria derrete e transforma-se em uma lama espessa. Torna-se maleável, pegajosa e difícil de atravessar.<br>• Líquido: A matéria derrete e transforma-se em líquido.<br><br>Esse poder pode facilmente afetar os parâmetros das rolagens, como dificuldade e risco. Quando o efeito expira, a matéria retorna lentamente ao seu estado e forma originais." },
      { name: "Fortaleza", desc: "<strong>[Invocação, Até o descanso, Curto | Requer 1 pulso]</strong> Uma vez por cena, você pode criar um campo de tensão pontual com um tamanho determinado até CAT, que aparece como uma grande superfície plana de força reluzente, invisível aos humanos. Ele só pode existir como um plano reto (sem curvas ou dobras) e pode interceptar ou sobrepor qualquer material não vivo, mas, fora isso, é tão rígido quanto um objeto sólido e impede que toda matéria e energia, viva ou não viva, o atravesse. Possui um talismã de 2+CAT para sua durabilidade, que pode sofrer dano como um talismã de execução por oponentes. O campo dura até ser destruído, até ser usado novamente ou até ser restaurado." }
    ]
  },
  { 
    id: "ardencia", 
    name: "Ardência", 
    
    img: "assets/blasf/ARD.jpg",
    desc: "Manipular energia potencial para criar clarões de calor ou frio extremos. A mais potente e perigosa das blasfêmias — para os outros e para quem a pratica.<br><br><strong>Fato:</strong> O uso de Ardência seria considerado desumano contra soldados humanos.", 
    passive: "<strong>Fornalha Interna:</strong> Você pode adquirir um gancho ''Poder Instável'' ao usar qualquer poder de Ardência para aumentar o CAT do poder em até +2. Quando o gancho se enche, você queima por dentro, sofrendo um ferimento e encerrando o gancho. Se esse ferimento for fatal, você explode em uma área igual ao seu CAT, aniquilando a si mesmo e tudo dentro dela em uma explosão massiva. Nada pode sobreviver a isso.",
    powers: [
      { name: "Fúria", desc: "<strong>[Instantânea, Longo | Requer 1 pulso]</strong> Você pode criar uma explosão feroz de energia destrutiva em um local dentro do alcance, com uma área de explosão de até CAT. Ao usar este poder, role PSIQUE e responda às seguintes perguntas, ganhando +1D para cada resposta \"sim\", gastando um pulso psíquico apenas em caso de sucesso.<br>• Você está disposto a causar danos indiscriminados, sem se importar com o que destrói, queima ou incinera?<br>• Você está disposto a deixar que sua raiva controle o resultado?<br><br>Qualquer pergunta para a qual você responda \"sim\" afeta o resultado da ação, independentemente do resultado do dado. Além disso, se você respondeu \"sim\" a pelo menos uma pergunta, a área afetada é SEMPRE igual ao CAT máximo, e os aliados na área ou próximos a você sofrem 2 pontos de estresse, que não podem ser ignorados." },
      { name: "Vazio", desc: "<strong>[Instantânea, Curto | Requer 1 pulso]</strong> Você cria um vácuo instantâneo queimando o ar. O vácuo gera um estrondo ensurdecedor, afetando uma área de até CAT. Afeta todos na área, exceto você. Escolha um dos seguintes efeitos e, em seguida, você poderá ganhar ou conceder +1D quando você ou qualquer aliado em seguida realizar uma ação para se beneficiar deste poder:<br>• Fraco: Suga objetos soltos que não estejam presos, vestidos ou parafusados.<br>• Médio: Todos os humanos e exorcistas na área são derrubados e puxados para o centro, exceto você.<br>• Forte: Pecados e veículos de tamanho até CAT são desequilibrados ou puxados, dependendo do tamanho. Vidros se quebram. O estrondo é momentaneamente ensurdecedor.<br><br>Esse poder pode afetar os parâmetros dos dados, como dificuldade e risco." },
      { name: "Inferno", desc: "<strong>[Transmutação, Adjacente, Até o descanso | Requer 1 pulso]</strong> Você pode liberar energia no solo e em qualquer coisa que o toque em uma área determinada por CAT+2, escolhendo quente ou frio. Escolha um dos seguintes efeitos, que dura até você descansar. Você pode ganhar ou conceder +1D quando você ou qualquer aliado agir para tomar vantagem deste poder:<br>• Esquentar: Desconforto para humanos, temperatura baixa ou alta, superfícies quentes ou frias, etc.<br>• Escaldar: Grande desconforto para humanos, que não podem permanecer na área, e desconforto para pecadores e exorcistas. Congela ou ferve água, canos, quebra vidros, etc.<br>• Ferver: Mortal para humanos, pecadores e exorcistas sofrem 2 pontos de estresse se permanecerem na área por mais tempo do que uma cena. Acenda fogueiras ou congele o ar em cômodos, derreta janelas ou queime portas, ou congele objetos.<br><br>Esse poder pode afetar os parâmetros de dados, como dificuldade e risco." },
      { name: "Sabre", desc: "<strong>[Instantânea, Alcance CAT | Requer 1 pulso]</strong> Libere uma explosão de energia em um feixe altamente destrutivo. O feixe segue em linha reta com um alcance igual a CAT, atravessando paredes, portas e obstruções sem esforço. É extremamente alto e brilhante. Role PSIQUE para seus efeitos, gastando apenas um pulso psíquico em caso de sucesso.<br><br>Opcionalmente, você pode remover o limitador desta habilidade ao usá-la. Se o fizer, para cada resultado '6' que você rolar ao usar a habilidade, esta habilidade inflige 1 corte extra em um talismã, mas você também sofre 2 de estresse, o que pode matá-lo ou causar-lhe um ferimento. Este estresse não pode ser reduzido ou ignorado de forma alguma." },
      { name: "Tempestade", desc: "<strong>[Transmutação, Extrema, Toda a Caçada | Sem custo de pulso]</strong> Você pode gastar qualquer número de pulsos psíquicos para enviar energia potencial para a atmosfera, afetando um microclima em uma área equivalente a CAT+2, com um máximo de CAT 7. Escolha uma das opções abaixo, mais uma para cada pulso psíquico gasto. Os efeitos escolhidos duram toda a missão ou até serem dispensados.<br>• Céu limpo: Céu limpo na área, cancelando qualquer previsão do tempo (incluindo as abaixo).<br>• Chuva: Chuva encharca a área pela duração da intensidade escolhida (chuvisco, aguaceiro, chuva torrencial).<br>• Frio: O ar congela, congelando a água e formando gelo em estradas e caminhos. Qualquer precipitação se transforma em neve.<br>• Neblina: Neblina densa se forma, limitando a visibilidade.<br>• Vendaval: Ventos fortes varrem a área, dissipando neblina, fumaça ou poeira, dificultando a audição e a movimentação ao ar livre.<br><br>Esse poder pode afetar os parâmetros de dados, como dificuldade e risco.<br>Uma vez usado, você perde o uso deste poder até descansar." }
    ]
  },
  { 
    id: "fluxo", 
    name: "Fluxo", 
    
    img: "assets/blasf/FLUXO.jpg",
    desc: "Manipule a direção e o fluxo do próprio tempo.<br><br><strong>Fato:</strong> Este poder é relativamente novo e, como está, é pouco compreendido. Felizmente, os eventos temporais são rigorosamente regulados pela TEMERITY através de um Pecado cativo chamado de Spindle.", 
    passive: "<strong>Roubar Tempo:</strong> Uma vez por caçada, você pode rolar novamente todos os seus dados de descanso para si mesmo ou para um aliado, considerando o segundo resultado como definitivo.",
    powers: [
      { name: "Parar", desc: "<strong>[Transmutação, Instantânea, Si mesmo | Requer 1+ pulso]</strong> Você gasta até três pulsos psíquicos para congelar o tempo em uma área ao seu redor igual a CAT. Role 1d6 para cada pulso psíquico gasto e some os resultados — esse é o número de segundos que você tem. Tudo que entra nessa área é imediatamente afetado (incluindo tudo que entra ou sai da área), mas o tempo flui normalmente fora dela. Nesse tempo congelado, você não é afetado e:<br>• Você não pode usar poderes psíquicos, mas também não pode ser afetado por eles. Qualquer poder atualmente ativo em você ou que o esteja afetando, além deste, se dissipa.<br>• Você pode realizar uma atividade ou ação que se encaixe na duração. Depois que você fizer um teste de ação para qualquer coisa, o efeito termina, independentemente do resultado.<br><br>Em seguida, obtenha instabilidade temporal." },
      { name: "Acelerar", desc: "<strong>[Instantânea, Adjacente | Requer 1 pulso]</strong> Você pode acelerar a cura natural do seu corpo ou do corpo de outras pessoas, proporcionando os seguintes benefícios:<br>• Cure imediatamente 1d3 de estresse em si mesmo ou em outro alvo. Se o seu alvo estiver ferido, aumente isso em +1<br>• Você pode curar um grupo CAT de humanos morrendo ou feridos. Humans morrendo são estabilizados e não correm mais perigo de morrer, mas ficam inconscientes. Caso contrário, humanos gravemente feridos são curados a ponto de conseguirem se mover (lentamente) por conta própria. Ferimentos leves são totalmente curados.<br><br>Em seguida, obtenha instabilidade temporal." },
      { name: "Reversão", desc: "<strong>[Instantâneo Adjacente]</strong> Ao tocar em um objeto de tamanho até CAT, você pode reverter sua passagem no tempo durante a última hora.<br>• Isso poderia mover fisicamente o objeto, reverter danos em um objeto, etc.<br>• Ainda pode afetar o mundo físico, então qualquer coisa no caminho de um objeto em uma reversão será atingida, e qualquer coisa colocada sobre ele se moverá junto.<br><br>Se causar dano ou impacto, role PSIQUE para isso.<br>• Não pode reverter a vida em matéria não viva, como cadáveres, mas pode movê-los temporariamente e reverter os danos como se estivessem vivos.<br><br>Você pode interromper esse efeito com a sua vontade, mas para retomá-lo é necessário usar esse poder novamente." },
      { name: "Cisma", desc: "<strong>[Transmutação, Instantânea, 1 cena | Requer 1 pulso]</strong> Você pode criar uma bolha de tempo alterado igual à área CAT. Dentro da bolha, você abre uma janela para um dia no passado ou no futuro a partir do momento em que a bolha foi criada. Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder:<br>• O estado da área dentro da bolha se limita à própria bolha e inclui objetos ou pessoas em seu interior.<br>• Você e seus aliados podem entrar ou sair da bolha à vontade.<br>• Seres sobrenaturais, incluindo exorcistas, na linha temporal presente, que estiverem presos na bolha no momento de sua criação, não serão afetados. Humanos e o mundo da linha temporal presente que estiverem presos na bolha são \"pausados\", deixam de existir durante sua duração e não têm memória do incidente.<br>• Objetos removidos da bolha, seja do passado ou do futuro, incluindo seres vivos, simplesmente desaparecem até retornarem à bolha.<br><br>A bolha representa uma linha do tempo \"alternativa\", portanto, qualquer alteração feita dentro dela não aparecerá na linha do tempo presente ou futura (ou seja, deixar um objeto em uma linha do tempo passada não fará com que ele apareça no presente)." },
      { name: "Travar", desc: "<strong>[Instantânea, Curto | Requer 1 pulso]</strong> Você pode reverter brevemente o tempo para alterar a causalidade de qualquer evento que tenha ocorrido como resultado de uma rolagem de ação feita por você ou por um aliado dentro do alcance de CAT, instantaneamente após ver o resultado. Role a ação novamente, considerando o segundo resultado como definitivo.<br><br>Ao usar este poder, você ganha instabilidade temporal. Se usá-lo novamente antes de descansar, você ganha 1d3 de instabilidade temporal." }
    ]
  },
  { 
    id: "vetor", 
    name: "Vetor", 
    
    img: "assets/blasf/VETOR.jpg",
    desc: "Imbuir objetos ou seres vivos com uma explosão repentina e intensa de velocidade.<br><br><strong>Fato:</strong> Apresenta a maior taxa de mortalidade entre usuários sem treinamento, que geralmente morrem em decorrência de quedas.", 
    passive: "<strong>Freio:</strong> Remove automaticamente a velocidade de todos os projéteis que o atingiriam, causando -1 de estresse a eles.",
    powers: [
      { name: "Corrente", desc: "<strong>[Transmutação, Até o descanso, Alcance CAT+2 | Requer 1 pulso]</strong> Você cria uma força vetorial fraca, porém persistente, em uma área que dura até você descansar. Ela cria uma linha com comprimento aproximado de CAT+2 e largura equivalente à de uma rua. Essa linha empurra constantemente em uma direção (incluindo para cima ou para baixo), como um vento forte. Aliados que se movem nessa direção recebem +1D em ações para se moverem a favor da corrente. Qualquer coisa que se mova contra a corrente tem dificuldade, e qualquer coisa que caia cai lentamente. Torna-se difícil para aliados se moverem contra a corrente, e ações realizadas contra qualquer um que tente lutar contra a corrente recebem +1D. Você pode dissipar esse efeito à vontade." },
      { name: "Bala", desc: "<strong>[Instantânea, Alcance CAT+1 | Requer 1 pulso]</strong> Você pode infundir fortes rajadas de velocidade no ar na ponta dos dedos, criando balas de ar pressurizado que acertam com extrema força. Role PSIQUE para obter seus efeitos, gastando apenas um pulso psíquico em caso de sucesso.<br>• Ganhe +1D ao atirar de uma posição elevada.<br>• Ganhe +1D ao atirar para desarmar, distrair ou incapacitar em vez de causar dano." },
      { name: "Arremesso", desc: "<strong>[Adjacente, Instantânea | Requer 1 pulso]</strong> Com um toque, você pode imbuir velocidade em si mesmo, em outro objeto ou em outro ser vivo e lançá-lo para longe. O tamanho combinado do objeto ou ser e o alcance do lançamento devem ser iguais ou menores que seu CAT+2. Uma vez lançado, a direção do seu alvo não pode ser alterada.<br><br>Você pode, alternativamente, remover toda a velocidade tocando um objeto ou pessoa de tamanho CAT+2, parando-o completamente. Role PSIQUE para os efeitos deste poder, incluindo qualquer dano infligido, e gaste um pulso psíquico apenas em pelo menos um sucesso." },
      { name: "Levantar", desc: "<strong>[Encantamento, Si mesmo, 1 cena | Requer 1 pulso]</strong> Você inverte o efeito da gravidade sobre si mesmo e sobre um grupo de exorcistas ou humanos de tamanho CAT, com um efeito vetorial baixo, porém constante. Por esta cena, todos os afetados recebem os seguintes benefícios:<br>• Você pode correr, andar ou escalar superfícies verticais.<br>• Você pode diminuir a velocidade da sua queda à vontade e não pode se machucar ao cair.<br>• Você pode planar por uma distância igual ao alcance CAT. Você precisa começar em uma altitude para obter esse benefício.<br><br>Esse poder pode facilmente afetar os parâmetros das rolagens, como dificuldade e risco." },
      { name: "Sutileza", desc: "<strong>[Toda a caçada, Alcance CAT | Sem custo de pulso]</strong><br>Passiva: Você pode manipular com precisão fios de força para realizar habilidades motoras que você realizaria com as mãos a ½ do alcance CAT, como abrir portas, pegar objetos ou até mesmo digitar em um teclado, etc. Role um teste de perícia relevante, como Interface, para isso.<br>• Você precisa ser capaz de ver seu alvo, mesmo que ele esteja longe. No entanto, você pode realizar essa manipulação mesmo que seu caminho até o alvo esteja bloqueado, como se você pudesse vê-lo através de uma janela, etc.<br>• Você pode pegar objetos e movê-los pelo ar, mas eles não podem ser maiores ou mais pesados do que um laptop ou uma maleta cheia." }
    ]
  },
  { 
    id: "portao", 
    name: "Portão", 
    
    img: "assets/blasf/PORTÃO.jpg",
    desc: "Manipule o espaço como um escultor trabalha com argila.<br><br><strong>Alerta:</strong> O uso indevido pode levar a perdas extremas de pessoal. Use com cautela.", 
    passive: "Você pode inserir um rasgo comprimido no espaço em uma peça de roupa que esteja vestindo.<br>• Você ganha +1 PK<br>• Você pode guardar ou retirar itens dentro do seu bolso, que pode conter um total combinado de itens no valor de até 3 PK. Uma vez dentro, os itens são armazenados em um espaço extradimensional, ocultos e seguros, independentemente do tamanho. O bolso está preso às suas roupas e, se elas forem destruídas, os itens dentro dele saltam para fora.",
    powers: [
      { name: "Florescer", desc: "<strong>[Invocação, Curto, 1 cena | Requer 1 pulso]</strong> Ao dividir o espaço de maneiras criativas, você cria um número de duplicatas controláveis de quaisquer um de seus membros ou mãos igual a CAT+1 em quaisquer superfícies a curta distância de você, emergindo de uma fenda no espaço. Elas ficam presas no lugar e não podem se mover. Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder:<br>• Você pode controlá-los como seus membros normais, realizando ações com eles e tendo sensações normais.<br>• Eles podem ser colocados em qualquer superfície, incluindo superfícies em movimento ou seres vivos.<br>• Você absorve qualquer estresse que eles sofreriam com suas ações realizadas através deles." },
      { name: "Labirinto", desc: "<strong>[Transmutação, Si mesmo, Alcance CAT, Toda a caçada | Requer 1 pulso]</strong> Você reorganiza uma área igual a CAT ao seu redor, causando a reorganização de estruturas construídas por humanos na área. Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para se beneficiar deste poder:<br>• Criar ou remover portas e janelas, ou alterar a disposição existente delas.<br>• Adicionar corredores ou reorganizar a planta dos cômodos.<br>• Alterar a direção da gravidade dentro de um cômodo. Por exemplo, você pode fazer com que uma parede seja o \"chão\".<br>• Aumentar ou diminuir o tamanho de um cômodo.<br>• Rearranjar ou remover os móveis dentro de um cômodo da maneira que preferir.<br><br>Você não pode remover cômodos completamente, tornar qualquer cômodo menor que um armário ou maior que um salão de baile, ou adicionar qualquer coisa que já não exista em um edifício além de corredores. Isso poderia fazer com que uma estrutura fosse maior por dentro do que por fora. Para cada escolha, o Administrador rola 1d6. Se ele rolar pelo menos um '1', o Administrador ganha um uso deste poder contra você em seu CAT atual e pode ativá-lo quando quiser." },
      { name: "Rasgar", desc: "<strong>[Invocação, Até o descanso | Requer 1 pulso]</strong> Você cria um ponto dentro do alcance de CAT e outro ponto dentro do mesmo alcance, embora precise ser capaz de ver ambos os pontos ao usar esta habilidade. Os dois pontos são conectados por uma fenda no tecido da realidade, um portal que pode ser atravessado e conecta os dois pontos como se estivessem lado a lado. Objetos, seres e forças de até ½ CAT de tamanho podem se mover livremente através da fenda durante a duração, e o momento é preservado." },
      { name: "Comprimir", desc: "<strong>[Instantânea, Alcance Especial | Requer 1 pulso]</strong> Você pode escolher um único ser vivo ou objeto que você possa ver. O tamanho combinado do objeto ou ser e a distância que você tenta movê-lo deve ser igual ou menor que CAT+2. Role PSIQUE se o seu alvo estiver resistindo, gastando apenas um pulso psíquico in caso de sucesso. Enquanto você puder ver seu alvo, com pelo menos um sucesso, você pode comprimir o espaço entre vocês dois para mover seu alvo para bem ao seu lado. Da perspectiva do alvo, ele não parece se mover, mas o mundo se distorce ao seu redor. Ele ignora todas as obstruções físicas entre ele e você - enquanto você puder ver seu alvo, ele simplesmente aparece ao seu lado.<br>Você pode ganhar ou conceder +1D quando você ou qualquer aliado realizar uma ação para tirar proveito deste poder." },
      { name: "Transmissão", desc: "<strong>[Instantânea, Alcance CAT+2 | Requer 1 pulso]</strong> Mova-se instantaneamente para qualquer área dentro do alcance CAT+2. No entanto, o Administrador fará as seguintes perguntas e rolará 1d6 para cada resposta \"não\":<br>• Você conhece o seu destino?<br>• Você consegue ver para onde está indo?<br>• Você está calmo e concentrado?<br><br>Com pelo menos um '1', você acaba em um local diferente próximo ao seu destino, mas o Administrador escolhe onde. Com dois '1', você acaba em outro lugar brevemente antes de chegar ao seu destino final. Além de estar um pouco distante de seu destino, você também sofre 2d3 de estresse." }
    ]
  },
  { 
    id: "sufoco", 
    name: "Sufoco", 
    
    img: "assets/blasf/SUFOCO.jpg",
    desc: "Suprima as propriedades inatas do universo. Minta para Deus.<br><br><strong>Fato:</strong> As perspectivas de sobrevivência a longo prazo são ruins, mas são compensadas pela utilidade; portanto, os usuários dessa blasfêmia são bons candidatos para transplante de órgãos (ver TM ref 4456).", 
    passive: "<strong>Ausência:</strong> Você pode melhorar o CAT de qualquer um dos seus poderes de Sufoco em +2 ao usá-los, até um CAT máximo de 7. No entanto, ao fazer isso, você ganha o Gancho ''Ausência''.<br><br><strong>Gancho (Ausência):</strong> Se este gancho se enche, você sofre um ferimento e desmaia por alguns instantes. Ao acordar, você estará sem uma parte do corpo (role 1d6). Ela simplesmente desaparece (Um ferimento limpo) como se nunca tivesse existido, deixando um toco ou buraco. Ela não retorna, mesmo se você curar o ferimento. Se você não tiver mais nenhuma parte do corpo para perder (ao rolar), reduza o resultado em 1. Se o resultado for 0, você perde a cabeça e sofre uma (horripilante) morte instantânea. A falta de partes do corpo pode tornar algumas rolagens difíceis ou arriscadas, dependendo da situação. Você se adapta a qualquer deficiência após a missão, e ela não tem mais efeitos.<br>1. Olho<br>2. Nariz<br>3. Orelha<br>4. Dedo<br>5. Dedo do pé<br>6. Nada",
    powers: [
      { name: "Abstrair", desc: "<strong>[Transmutação, Curto, 1 cena | Requer 1 pulso]</strong> Com um gesto, você remove as propriedades reconhecíveis de CAT+1 número de ferramentas, veículos, janelas, portas ou quaisquer outros objetos distintos que possam ser segurados ou usados. Os objetos escolhidos não podem mais ser usados para o seu propósito original e nenhum humano, pecado ou exorcista (incluindo você!) pode reconhecê-los — encará-los por muito tempo causa extremo desconforto, mesmo para exorcistas. Por exemplo, armas não podem mais atirar, portas não podem mais ser abertas e não é possível olhar através de janelas.<br><br>Conceda ou ganhe +1D quando você ou qualquer aliado realizar a próxima ação para tirar vantagem deste poder. Ele também pode afetar os parâmetros das rolagens enquanto estiver ativo." },
      { name: "Suavizar", desc: "<strong>[Transmutação, Curto, 1 cena | Requer 1 pulso]</strong> Você remove temporariamente quase toda a fricção de um grupo de humanos ou exorcistas do tamanho CAT, ou de uma área de tamanho CAT. A área ou o(s) alvo(s) tornam-se incrivelmente escorregadios. Se o alvo for uma área, torna-se difícil para qualquer pessoa ficar em pé, escalar ou se mover normalmente nela, embora as pessoas ainda consigam deslizar.<br>• Role PSIQUE para afetar alvos hostis com este poder, gastando apenas um pulso psíquico em caso de sucesso.<br>• Você pode moldar esta área se desejar afetar apenas parte dela, ou moldar um caminho.<br><br>Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder. Este poder também pode afetar facilmente os parâmetros das rolagens, como dificuldade e risco." },
      { name: "Oco", desc: "<strong>[Encantamento, Adjacente, Até o descanso | Requer 1 pulso]</strong> Você remove temporariamente o peso de um único objeto, humano ou exorcista, fazendo com que ele tenha um peso total de 450g se for mais pesado. O tamanho do objeto deve ser CAT ou menor, e você pode encerrar essa modificação a qualquer momento, embora precise usar este poder novamente para recuperar seus efeitos. Role PSIQUE para quaisquer usos criativos deste poder, gastando um pulso psíquico apenas em caso de sucesso.<br>• Ganhe ou conceda +1D quando você ou qualquer aliado realizar uma ação para aproveitar este poder.<br>• Este poder termina no alvo anterior se for usado novamente.<br><br>Esse poder pode facilmente afetar os parâmetros das rolagens, como dificuldade e risco." },
      { name: "Idade das Trevas", desc: "<strong>[Encantamento, Si mesmo, Até o descanso | Requer 1 pulso]</strong> Você gera um campo poderoso a partir do seu corpo, impedindo até mesmo os avanços humanos mais simples de funcionarem na área CAT. O efeito se move com você. Você pode escolher até três dos seguintes efeitos para suprimir, cessando seu funcionamento, e então ganhar ou conceder +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder:<br>• Eletricidade<br>• Internet<br>• Motor de combustão<br>• Agua corrente<br>• Maçanetas, trincos de janelas, zíperes, fechos<br>• Lareiras abertas<br><br>Essas coisas param de funcionar mesmo que não faça sentido, ou seja, interromper o fluxo de água significaria que a pressão da água simplesmente pararia de funcionar. Você pode encerrar este efeito voluntariamente, mas deve encerrar todos os efeitos de uma vez." },
      { name: "Cegar", desc: "<strong>[Transmutação, Adjacente, 1 cena | Requer 1 pulso]</strong> Um número de objetos ou seres vivos igual a CAT, ou uma área de tamanho até CAT que você tocar, deixa de produzir som, refletir luz ou ambos na cena. Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder:<br>• Ao selecionar uma pessoa, o efeito se move com ela pela cena.<br>• Ao selecionar um local, o efeito afeta uma área, removendo todo o som e/ou luz. Você pode \"filtrar\" esse efeito permitindo que a luz ou o som dentro do local funcionem normalmente, mas impedindo que entrem ou saiam da área.<br><br>Esse poder pode facilmente afetar os parâmetros das rolagens, como dificuldade e risco." }
    ]
  },
  { 
    id: "sussurro", 
    name: "Sussurro", 
    
    img: "assets/blasf/SUSSURRO.jpg",
    desc: "Sua sombra é animada e faminta. Ela conhece o futuro.<br><br><strong>Fato:</strong> Esse alter ego geralmente se manifesta na puberdade e só você pode vê-lo, permanecendo invisível até mesmo para outros exorcistas. A crença comum é que a \"sombra\" vista seja um componente da sua própria morte futura.", 
    passive: "<strong>Sombra:</strong> Você abriga um ser à parte que o segue por toda parte, até mesmo quando você dorme.<br><br>A SOMBRA é intangível e invisível para todos, até mesmo para aqueles com sensibilidade psíquica. Ela só pode interagir fracamente com o mundo físico e possui mente e sentidos próprios. Seu alcance é de alcance curto a partir de você. Ela pode atravessar paredes e superfícies facilmente, mas se retrai para dentro do seu corpo quando exposta a luz forte, impedindo-a de fazer qualquer coisa.<br><br>Você pode se comunicar telepaticamente com ela, mas isso é perigoso e causa 1 ponto de estresse após o término de qualquer interação. Ela não tem obrigação de lhe dizer a verdade, a menos que você use seus poderes. Você pode se comunicar com ela com segurança usando suas habilidades, e ela conhece o futuro. O Administrador responderá por ela.",
    powers: [
      { name: "Arrepio", desc: "<strong>[Encantamento, Si mesmo, 1 cena | Requer 1 pulso]</strong> Quando estiver procurando por um humano, pecado, exorcista, local ou objeto, você pode declarar \"eu sinto um arrepio\". Você envia um pulso psíquico em um raio de alcance CAT ao seu redor, que permanece ativo durante esta cena. Enquanto seu alvo estiver perto o suficiente para estar ao seu alcance, você sente uma forte sensação de frio e desconforto. Você pode localizar essa sensação facilmente. Rastrear seu alvo nunca é difícil enquanto este poder estiver ativo. Se seu alvo estiver a curta distância de você, você também ganha +1D em quaisquer testes para rastreá-lo ou localizá-lo." },
      { name: "Dissecar", desc: "<strong>[Instantânea, Alcance CAT | Requer 1 pulso]</strong> Examine um humano ou exorcista que você possa ver dentro do alcance de CAT, role PSIQUE e faça à sua sombra uma das seguintes perguntas, e mais uma para cada sucesso. Ela responde com sinceridade, mas pode usar no máximo três palavras para cada resposta:<br>• Essa pessoa está mentindo?<br>• Qual é a principal emoção que essa pessoa está sentindo?<br>• De onde essa pessoa acabou de vir?<br>• Para onde ela pretende ir em seguida?<br><br>Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito de cada resposta." },
      { name: "Onipresença", desc: "<strong>[Instantânea, Alcance CAT+2 | Sem custo de pulso]</strong> Quando um aliado está em cena, você não está presente nessa cena e seu aliado está dentro do alcance de CAT+2, você pode usar este poder para entrar na cena, tendo já previsto que esse curso de eventos ocorreria. Role PSIQUE e escolha uma das seguintes opções para cada sucesso:<br>• Ninguém está te seguindo<br>• Você está escondido<br>• Você consegue entrar no local que seu aliado está sem ser distração ou danos<br>• Você tem consigo uma ferramenta ou objeto útil para a situação atual (uma chave, uma arma, uma chave inglesa, etc.)<br><br>Após usar esse poder, você perderá sua capacidade de usá-lo até descansar." },
      { name: "Precognição", desc: "<strong>[Instantânea, Si mesmo | Requer 1 pulso]</strong> Quando o Administrador estiver descrevendo uma cena ou você estiver prestes a tomar uma ação, você pode \"ter um flashback\". Faça um teste de ação ou refaça esta cena no passado, onde você teve uma visão do momento presente. Isso não pode alterar completamente os fatos estabelecidos do presente (você não pode ter nocauteado alguém no passado se acabou de conversar com essa pessoa no presente, por exemplo), mas pode mudar a situação ou alterar detalhes do presente, ou pode ajudar a si ou qualquer aliado.<br><br>Por exemplo, você poderia ter feito preparativos para o momento atual (trancado ou destrancado uma porta, guardado algum equipamento, feito uma ligação, etc.). Se você usar esse poder para equipamentos, marque o uso de PK normalmente. Se a situação for complicada, sofra também 1 ponto de estresse não letal. Se for complexa ou improvável, sofra 3 pontos de estresse não letal." },
      { name: "Presságio", desc: "<strong>[Instantânea, Si mesmo | Requer 1 pulso]</strong> Pergunte à sua sombra: \"O que acontecerá se eu fizer X?\", onde X é uma simples sequência de atividades que você planeja realizar na próxima hora (abrir esta porta, comparecer à reunião, atacar esta pessoa, descer esta rua). A sombra lhe dará uma breve impressão do futuro:<br>• Ganhe +1D quando você ou um aliado agir de acordo com a resposta.<br>• Role o dado de risco antes de realizar a ação. Você pode desistir da ação se quiser, mas se seguir o mesmo curso de ação no futuro, use o dado de risco pré-rolado." }
    ]
  },
  { 
    id: "editar", 
    name: "Editar", 
    img:"assets/blasf/EDIT.jpg",
    desc: "As coisas como são não precisam ser como são. Você pode escolher, filtrando os fios das possibilidades e convidando-os a se fundirem com o mundo real.<br><br><strong>Fato:</strong> A doutrina CAIN afirma claramente que a existência de realidades \"alternativas\" não foi comprovada atualmente.", 
    passive: "<strong>Mímica:</strong> Você pode alterar pequenos detalhes da sua aparência. Você pode modificar qualquer um dos seguintes aspectos do seu corpo em repouso, dentro de uma variação do seu corpo original:<br>• Características físicas, como altura e peso<br>• Características estéticas, como traços faciais, cor da pele, cabelo e apresentação de gênero<br>• Idade, de 13 a 88 anos<br>Você sempre tem uma aparência vagamente semelhante à sua, como um parente distante. Suas roupas sempre mudam para se ajustarem a você, embora você não possa alterá-las. Isso não altera em nada suas habilidades ou capacidades gerais, e também não restaura partes do corpo perdidas, nem esconde marcas de pecado ou cicatrizes.",
    powers: [
      { name: "Utilidade", desc: "<strong>[Até o descanso, Curto | Requer 1 pulso]</strong> Quando você precisar de qualquer objeto, ferramenta ou veículo comum que caiba em um cômodo pequeno, você pode fazê-lo aparecer em uma superfície ao seu alcance como se sempre tivesse estado lá, sem gastar KP. No entanto, o administrador escolhe um, ou dois se o item for perigoso ou raro:<br>• O item está usado, amassado, arranhado ou é de baixa qualidade.<br>• O item é um item real que alguém próximo possuía e que desapareceu, e essa pessoa virá procurá-lo.<br>• O item está com algum defeito e parece uma imitação barata feita de materiais estranhos com textura esponjosa ou orgânica.<br>• O item está faltando peças e não funciona tão bem quanto deveria com elas.<br><br>O item não pode ser único, como um carro, chave, livro, etc. específicos; ele é um representante genérico de uma categoria. Ele desaparece após um período de inatividade." },
      { name: "Uniforme", desc: "<strong>[Encantamento, Si mesmo, Até o descanso | Requer 1 pulso]</strong> Você faz uma breve edição de si mesmo. Você não pode fazer isso em público (você precisa de privacidade, por mais tênue que seja). Esse poder faz com que você faça parte oficialmente de qualquer profissão ou grupo com mais de 5 membros, com qualquer uniforme, equipamento, carteira de identidade, filiação etc. necessários, e altera a realidade para que isso aconteça. Mesmo que as pessoas não se lembrem particularmente de você ter feito parte de um grupo, elas podem ter uma vaga noção de que você era membro.<br><br>Você não adquire nenhuma habilidade específica e quaisquer mudanças que você possa ter que fazer serão pessoais e devem incluir coisas que você poderia vestir ou carregar em uma ou ambas as mãos.<br><br>Ganhe ou conceda +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder." },
      { name: "Absurdo", desc: "<strong>[Maldição, Curto, 1 cena | Requer 1 pulso]</strong> Você troca uma quantidade de CAT de humanos ou exorcistas por uma versão diferente deles mesmos de uma linha temporal alternativa. Você deve rolar PSIQUE para que este poder tenha efeito em alvos hostis, gastando apenas um pulso psíquico em caso de sucesso. Isso pode mudar:<br>• O que o alvo está vestindo, mas não segurando (portanto, tudo o que estiver segurando na mão permanece o mesmo)<br>• Aparência física dos alvos, conforme seu poder de Mímica.<br><br>Os alvos retêm suas memórias, e isso não altera a realidade para acomodar a mudança, podendo facilmente desorientar humanos despreparados. A mudança é perfeita em todos os outros aspectos. Conceda ou receba +1D quando você ou qualquer aliado realizar a próxima ação para tirar proveito deste poder." },
      { name: "Filtro", desc: "<strong>[Transmutação, Adjacente, 1 cena | Requer 1 pulso]</strong> Você cria um campo forte que afeta toda a matéria em uma área aproximadamente do tamanho de um pequeno cômodo, que deve conter você. Nessa área, você ganha +1D para examinar seu conteúdo e:<br>• Pode tornar qualquer matéria transparente ou opaca.<br>• Pode alterar a iluminação do cômodo como se fosse iluminada por uma fonte de luz invisível, ou extinguir quaisquer fontes de luz no cômodo.<br>• Pode mover quaisquer objetos na área sem tocá-los e \"fixá-los\" em qualquer ponto do espaço, fazendo-os flutuar.<br>• Pode desmontar com segurança qualquer objeto inanimado solto ou mobília em suas partes constituintes ou remontar qualquer objeto quebrado, desde que as peças estejam presentes.<br><br>Esse efeito expira quando a cena termina ou se você sair da área por qualquer motivo." },
      { name: "Copia", desc: "<strong>[Invocação, adjacente, 1 cena | Requer 1 pulso]</strong> Você cria uma cópia temporária e exata de um humano ou exorcista.<br>• Isso cria um doppelgänger: um clone simples e obediente, sem muita inteligência ou capacidade de falar.<br>• Você pode dar a ele instruções simples de uma ou duas frases, que ele seguirá da melhor maneira possível.<br>• Ele se dissolve em uma gosma pálida quando a cena termina, quando tocado por qualquer pessoa que não seja você, ou se sofrer qualquer dano.<br><br>Essa habilidade cria uma cópia do alvo em seu estado atual, incluindo qualquer objeto mundano que a pessoa esteja carregando ou vestindo. Um doppelgänger não pode obter, usar ou se beneficiar de poderes psíquicos e rola apenas 1d6 para realizar qualquer ação." }
    ]
  },
  { 
    id: "vinculo", 
    name: "Vínculo", 
    
    img: "assets/blasf/VINCULO.jpg",
    desc: "Com a vontade de quem a possui, até mesmo os Pecados podem ser controlados, ligados a talismãs especialmente preparados em forma espiritual.<br><br><strong>Fato:</strong> A prática de vincular é uma arte antiga, porém herética, punida com execução imediata. Felizmente, CAIN oferece uma sentença indefinida para vinculadores que permanecem sob seu serviço.", 
    passive: "<strong>Pecado Vinculado:</strong> Você possui a habilidade proibida de aprisionar Pecados. Você tem a essência obediente de um pecado menor aprisionada a você, sob seu controle.<br><br>Seu Pecado Vinculado tem forma e habilidade animalescas - você pode determinar qual forma ele assume. Ele pode entender a linguagem, mas não pode falar, e é invisível para humanos.<br><br>Ele pode segui-lo a curta distância, obedecer a ordens simples e usar suas habilidades para fazer qualquer coisa. Suas capacidades gerais são CAT 0.<br><br>Se ele sofrer qualquer estresse, será banido pelo resto da cena; no entanto, você pode absorver psiquicamente todo o estresse sofrido por ele para evitar esse efeito.<br><br>Em uma cena de conflito, você pode sacrificar sua capacidade de agir em seu turno para permitir que seu pecado age em seu lugar, dando-lhe comandos. Caso contrário, ele não age de forma independente nessas cenas.",
    powers: [
      { name: "Espirito Proibido", desc: "<strong>[Si mesmo, Instantâneo | Requer 1 pulso]</strong> Você pode gastar um Pulso Psíquico para potencializar seu pecado em uma única ação. Como parte dessa ação:<br>• Após esta cena, ele pode ignorar qualquer estresse sofrido. Este efeito se acumula se este poder for usado novamente.<br>• Você remove as limitações do seu espírito. A ação ganha +1D e faz com que ele sofra uma transformação monstruosa semelhante à sua forma original. Ele se torna de tamanho igual a CAT+1 e pode facilmente mover, levantar, golpear ou arremessar objetos ou seres de tamanho igual. Role PSIQUE para seus efeitos. Após a ação, ele retorna ao seu tamanho normal." },
      { name: "Render", desc: "<strong>[Encantamento, Si mesmo, Até o descanso | Requer 1 pulso]</strong> Você utiliza a energia do seu pecado para se fundir parcialmente com a sua essência. Seu corpo sofre uma leve mutação para se adaptar a essa mudança. Manifeste imediatamente uma marca de pecado temporária e role para determinar a localização e a habilidade, que você mantém até encerrar essa habilidade antecipadamente ou descansar. Você pode ganhar 1 de pecado para rolar novamente a habilidade da marca, quantas vezes quiser, a qualquer momento enquanto este poder estiver ativo. Se você verter pecado enquanto este efeito estiver ativo e resistir com sucesso, você manifestará a marca de pecado escolhida permanentemente em vez de rolar os dados para obtê-la." },
      { name: "Espirito da Horda", desc: "<strong>[Si mesmo, 1 cena | Requer 1 pulso]</strong> Você pode gastar um Pulso Psíquico para fortalecer seu pecado por uma cena. Na próxima vez que ele usar uma ação para se deslocar ou se mover, ele ganha +1D. Como parte desta ação:<br>• Você pode transformá-lo na forma de um veículo ou criatura montável de até o tamanho CAT por uma cena. Ele pode se mover na velocidade CAT, torna-se parcialmente visível para humanos e tem espaço para um grupo de passageiros humanos ou exorcistas de tamanho ½ CAT.<br>• Ele pode planar por uma curta distância enquanto estiver na forma de veículo, com ou sem passageiros." },
      { name: "Espirito Caçador", desc: "<strong>[Si mesmo, 1 cena | Requer 1 pulso]</strong> Você pode gastar um Pulso Psíquico para fortalecer seu pecado por uma cena. Na próxima vez que ele usar uma ação para rastrear ou observar, ele ganha +1D. Como parte desta ação:<br>• Agora ele pode se separar de você a distâncias extremas quando liberado.<br>• Você pode se comunicar telepaticamente com ele.<br>• Ele adquire a capacidade de voar, enxergar e cheirar extremamente bem – também consegue enxergar no escuro e no espectro térmico, com clareza a longas distâncias.<br>• Você pode se concentrar, dissociando-se do seu corpo e tornando-se extremamente vulnerável. Enquanto se concentra dessa forma, no entanto, você pode usar os sentidos do seu pecado em vez dos seus. Você pode ativar e desativar esse efeito à vontade durante a cena." },
      { name: "Penumbra", desc: "<strong>[Invocação, Adjacente, Até o descanso | Requer 1 pulso]</strong> Você cria uma área desenhada como um grande círculo, abrangendo uma área de até tamanho CAT+1, e escolhe um tipo da lista abaixo. A prisão leva apenas um instante para ser criada, mas demora alguns minutos para ativar e para que seus efeitos surtam efeito. Ela dura até você descansar ou até ser usada novamente.<br>• Um manto branco impede a entrada dos Pecados, mas permite que humanos e exorcistas passem normalmente.<br>• Um manto negro impede a entrada de humanos ou exorcistas. Além disso, os humanos (geralmente) não conseguirão ver o interior da área e agirão como se ela não existisse.<br>• Você pode inverter esse efeito, se desejar, impedindo a saída em vez da entrada.<br><br>A prisão pode ser destruída por um atacante sobrenatural determinado, mas possui um talismã de CAT 4+ para durabilidade, resistindo ao estresse como um talismã de execução." }
    ]
  },
  { id: "assombracao", 
    name: "Assombração", 
     
    img: "assets/blasf/ASSO.jpg", 
    desc: "Corte o corpo e a alma com uma faca de trinchar.<br><br><strong>Fato:</strong> Entre todos os exorcistas, os usuários da Assombração são os que têm maior probabilidade de \"se esvaziarem\" durante o sono, deixando um corpo vazio. Esse evento é muito raro, sua causa é desconhecida e é 100% fatal.", 
    passive: "<strong>Conexão Fantasma:</strong> Você pode conectar sua mente telepaticamente com um número de pessoas dispostas que você tocar igual a CAT. Enquanto estiverem a uma longa distância um do outro, vocês podem conversar telepaticamente e sentir o estado emocional um do outro. Esse efeito dura até que você o use novamente, até que alguém fique inconsciente ou até que você ou outra pessoa encerre a conexão.",
    powers: [
      { name: "Fios", desc: "<strong>[Encantamento, Si mesmo, Até o descanso | Requer 1 pulso]</strong> Você consegue sentir o mundo invisível dos vestígios da graça. Ao usar esse poder, você fecha os olhos e consegue ver, através das pálpebras, os padrões que a alma deixa no ambiente.<br>• Você adquire a habilidade de ver seres vivos, mesmo através de paredes, dentro do alcance CAT.<br>• Você pode ver os vestígios de um pecado ou de alguém forte em graça, como um exorcista, que deixa um rastro de luz tênue pelo ar.<br>• Você ganha +1D em ações para rastrear ou localizar seres vivos ou vestígios de pecados na área. No entanto, você não pode ver nenhuma matéria inanimada (você fica efetivamente cego) enquanto mantém esse poder, e realizar ações que dependem da visão são difíceis.<br><br>Esse poder termina quando você abre os olhos ou quando descansa." },
      { name: "Profanar", desc: "<strong>[Adjacente, Instantâneo | Sem custo de pulso]</strong> Você pode injetar uma semblante de vida nos cadáveres de até CAT humanos ou exorcistas tocando-os nos olhos. Você pode fazer três perguntas ao(s) cadáver(es) no total (independentemente de quantos você animar), após o efeito terminar e eles voltam a morte. O efeito também expira se passar uma hora.<br>• Você não pode usar esse poder no mesmo cadáver mais de uma vez.<br>• O poder não devolve a vida ao corpo, mas acessa suas memórias. Se a cabeça ou o cérebro estiverem ausentes, ou se o corpo não tiver língua, etc., esse poder não funcionará.<br><br>Um cadáver é obrigado a responder com sinceridade, mas só pode falar sobre o conhecimento e as memórias que possuía antes de morrer. Ele pode ter apenas conhecimento parcial de uma situação ou pode falar de acordo com seu próprio ponto de vista.<br><br>Em seguida, perca o uso desse poder até descansar." },
      { name: "Passageiro", desc: "<strong>[Maldição, Alcance extremo, 1 cena | Requer 1 pulso]</strong> Você escolhe um grupo de pessoas dispostas, com tamanho igual ou inferior a ½ CAT em alcance extremo, que devem ser capazes de ouvi-lo (mesmo telepaticamente) ou vê-lo. Você absorve a presença psíquica delas para dentro do seu corpo durante esse período. Seus corpos ficam dormentes, vulneráveis e insensíveis. No entanto:<br>• Agora eles compartilham o controle do seu corpo com você, incluindo todos os sentidos.<br>• Você pode ceder o controle do seu corpo a eles para permitir que façam testes de ação usando suas perícias ou habilidades, mas seu corpo (equipamentos, acesso, etc.) não será afetado.<br>• Você pode ajudar normalmente ou auxiliá-los nessas perícias.<br><br>Eles não podem usar poderes psíquicos enquanto estiverem te possuindo dessa forma, e você sofrerá os danos ou as consequências das ações deles." },
      { name: "Espirito", desc: "<strong>[Si mesmo, 1 cena | Requer 1 pulso]</strong> Você pode projetar sua percepção para fora do seu corpo e vagar por um alcance de CAT+2, tornando-se um ser feito de pura energia psíquica.<br>• Ao praticar este poder, seu corpo real fica insensível e indefeso.<br>• Você pode voar na velocidade CAT, é invisível para aqueles que não são psiquicamente sensíveis e pode atravessar paredes, pisos e objetos facilmente enquanto estiver nesta forma.<br>• Você não pode interagir com o mundo físico nem ser afetado por ele. Você não pode usar ou se beneficiar de seus próprios poderes psíquicos, mas poderes psíquicos ou efeitos de outros ainda podem afetá-lo.<br><br>Se sua forma for destruída de alguma forma (por uma força sobrenatural), você sofre 1 ponto de estresse, este poder termina e você não poderá usá-lo novamente até que a cena passe. Este poder pode facilmente afetar os parâmetros das rolagens, como dificuldade e risco." },
      { name: "Possessão", desc: "<strong>[Maldição, Curto, 1 cena | Requer 1 pulso]</strong> Você pode projetar sua percepção para fora do seu corpo para possuir um humano, animal ou cadáver (em bom estado) que você possa ver dentro do alcance por uma cena. Seres sobrenaturais são imunes a este efeito. Humanos que tentarem resistir podem precisar de um teste de PSIQUE para serem possuídos com sucesso.<br>• Ao possuir outro ser, seu corpo real fica insensível e indefeso.<br>• Para humanos e animais, você não pode forçar um alvo a se ferir ou a tomar ações que indiretamente o façam sofrer danos.<br>• As ações que o alvo realiza utilizam suas perícias, mas o corpo ou equipamento do alvo pode alterar as circunstâncias.<br><br>Você é expulso do corpo se ele sofrer estresse." }
    ]
  },
    { 
    id: "palacio", 
    name: "Palácio", 
     
    img: "assets/blasf/PALACIO.jpg",
    desc: "O conteúdo da sua mente é tão concreto para você quanto a própria realidade.", 
    passive: "<strong>Santuário:</strong> Você e os aliados com quem você descansa podem entrar em seu palácio psíquico enquanto descansam. Isso melhora os testes de descanso de você e de um aliado à sua escolha que esteja descansando com você em +1.<br><br>• O palácio é uma projeção mental, um espaço onírico que assume a forma de uma grande casa, residência ou mansão em um local de sua escolha. Sair do local simplesmente retorna a você, e, como um fenômeno puramente psíquico, você pode controlar sua aparência e decoração.<br>• Sofrer dano em um palácio instantaneamente expulsa a pessoa de lá, despertando-a, em vez de causar-lhe dano real. Visitantes podem sair a qualquer momento.<br>• Entrar mentalmente no palácio requer apenas fechar os olhos e se concentrar, deixando seu corpo externo indefeso e insensível. Isso pode ser feito por você a qualquer momento, e por seus aliados descansando com você ou com seus poderes.",
    powers: [
      { name: "Hall de entrada", desc: "<strong>[Invocação | Sem custo de pulso]</strong><br>Passiva: Seu palácio possui um tulpa, um ser psíquico que assume a forma de um servo ou mordomo. Ele é leal a você, e você pode determinar sua personalidade e aparência ao adquirir este poder.<br><br>Ativo: Você invoca seu tulpa, escolhendo um:<br>• Faça com que seu tulpa o auxilie em uma tarefa relacionada a pesquisa, artesanato ou investigação, concedendo +1D em sua próxima rolagem e fazendo um corte extra em um talismã para cada '6' que você rolar.<br>• Manifeste brevemente seu tulpa fora do seu palácio, em curto alcance, como uma pessoa real, um espelho de sua aparência dentro do palácio, mas vestido como você quiser. Eles têm aproximadamente as capacidades de uma pessoa comum (categoria 0) e rolam 2d para atividades que um servo ou mordomo típico poderia fazer e 0d para todo o resto. Qualquer dano sofrido por eles os bane de volta para o palácio." },
      { name: "Salão", desc: "<strong>[1 cena, Área de investigação | Requer 1 pulso]</strong> Escolha uma pessoa ou um grupo de até um CAT na área de investigação e diga o(s) nome(s) (real(is)) dela(s) em voz alta. Você pode trazer a si mesmo e a sombra psíquica dela(s) para dentro do seu palácio, não importa onde ela(s) esteja(m).<br>Se o(s) seu(s) alvo(s) estiver(em) disposto(s), você pode optar por trazer a consciência psíquica real dela(s) para dentro do seu palácio, fazendo com que ela(s) perceba(m) e se lembre(m) do que está acontecendo lá dentro, como se estivesse(m) em um sonho. O corpo real dela(s) fica(m) inconsciente(s) e vulnerável(is). Ela(s) pode(m) sair voluntariamente. Você também pode trazer um duplo psíquico de uma pessoa, disposta ou não, para o seu palácio. Ela(s) não é(são) afetada(s), mas o duplo é uma cópia da mente dela(s) no momento da invocação. Quaisquer memórias formadas pelo duplo não serão transferidas. O duplo não pode sair até que a cena termine ou até que ela(s) sofra(m) dano como de costume. Uma pessoa ou duplicata invocada desta forma não é obrigada de forma alguma a se comportar de maneira diferente de sua versão original.<br><br>Conceda ou ganhe +1D na próxima rolagem, seja você mesmo ou um aliado que esteja se beneficiando deste poder." },
      { name: "Bar", desc: "<strong>[Si mesmo, 1 cena | Sem custo de pulso]</strong> Uma vez por cena, você pode abrir qualquer porta fechada e dar de cara com um bar (físico e real) in vez da sala que você esperaria. É um bar pequeno e típico, bem abastecido, com petiscos, alguns pratos quentes e bebidas alcoólicas e não alcoólicas. Ele é reabastecido entre as missões. O bar só existe enquanto você estiver dentro dele ou segurando a porta; itens externos ou pessoas dentro dele são empurrados para fora antes que ele desapareça.<br><br>Ao descansar no seu bar, você pode rolar 1d3+1 e fazer uma das seguintes ações, gastando cargas do dado que acabou de rolar para cada opção:<br>• 1 carga: Elimina 1 estresse de uma pessoa<br>• 2 cargas: Desmarca 1 marca em todos os ganchos de uma pessoa<br>• 3 cargas: Remove um ferimento<br><br>Para cada um, descreva uma bebida, um lanche, uma refeição ou outra forma de relaxamento ou bem-estar que você está preparando para o seu convidado." },
      { name: "Biblioteca", desc: "<strong>[Instantânea, Si mesmo | Sem custo de pulso]</strong> Seu palácio possui uma biblioteca de informações do subconsciente psíquico. Quando desejar coletar informações ou investigar qualquer assunto, você pode obter +1D na rolagem ao acessar esta biblioteca. No entanto, em seguida, o Administrador rola 1d6 para cada um dos seguintes:<br>• A informação é rara?<br>• A informação é proibida de alguma forma?<br>• A informação é pertinente a um grupo poderoso?<br><br>Para cada '1', você sofre 2 de estresse não letal ao ler algo perturbador na biblioteca." },
      { name: "Adega", desc: "<strong>[Encantamento, alcance infinito, Instantâneo | Requer 1 pulso]</strong> Você pode simular situações dentro do seu palácio antes de colocá-las em prática na realidade. Você pode usar este poder e rolar os dados para definir um número de aliados igual a ½ do seu CAT, mesmo que não esteja fisicamente presente. No entanto, você só pode definir um alvo se puder descrever a maneira como treinou ou se preparou com ele, ou com uma cópia psíquica dele, para a situação atual. Essa configuração nunca pode ser arriscada, mas não pode reduzir o risco. Se você falhar na rolagem de configuração, pode sofrer 1d3 de estresse não letal para rolar novamente, considerando o segundo resultado como definitivo." }
    ]
  },
  { 
    id: "simpatia", 
    name: "Simpatia", 
     
    img: "assets/blasf/SIMPATIA.jpg",
    desc: "Os seres humanos deixam impressões em tudo o que tocam. Você pode fazer mais do que tocar.<br><br><strong>Fato:</strong> A PSICOMETRIA É PROIBIDA NO CAMPUS - CASTLE REF 0094", 
    passive: "<strong>Ressonância:</strong> No início da missão, role na tabela de ressonância. Ao realizar essa rolagem, role 1d3, depois 1d6 e, em seguida, verifique as tabelas de ressonância após esta entrada de blasfêmia. Quando você estiver realizando uma rolagem de ação e estiver usando um item com o qual você tenha ressonância, você recebe um bônus de +1D. Você pode gastar um pulso psíquico a qualquer momento para rolar uma ressonância adicional. Você pode manter até três ressonâncias ativas simultaneamente e só pode se beneficiar de uma por vez.<br><br><strong>Tabela de Ressonâncias (1d3 + 1d6):</strong><br>• 11: Celulares<br>• 12: Luzes<br>• 13: Facas<br>• 14: Chaves<br>• 15: Livros<br>• 16: Tacos de basebol<br>• 21: Bolas<br>• 22: Armas<br>• 23: Canecas<br>• 24: Computadores<br>• 25: Sapatos<br>• 26: Ferramentas elétricas<br>• 31: Cordas<br>• 32: Martelos<br>• 33: Carros<br>• 34: Portas<br>• 35: Mochilas<br>• 36: Luvas",
    powers: [
      { name: "Ligação", desc: "<strong>[Encantamento, 1 cena | Requer 1 pulso]</strong> Para a cena, você pode criar uma ligação incrivelmente forte com um objeto que está segurando em uma ou ambas as mãos.<br>• Agora você está em ressonância com esse item. Ele ainda é mundano.<br>• Agora você pode usá-lo como uma arma mundana de corte ou concussão, mesmo que normalmente não fosse uma arma. Ele tem aproximadamente o poder de um bastão ou espada de CAT 0.<br>• O item se torna virtualmente indestrutível e você pode fazer com que ele retorne à sua mão, voando pelo ar, a curta distância.<br>• Você pode descarregar esse poder para desferir um golpe com o objeto, concedendo-lhe um poder destrutivo sobrenatural igual a CAT. Role PSIQUE para seus efeitos (ele ganha +1D na rolagem como de costume devido à ressonância). Em seguida, encerre este efeito e destrua o item." },
      { name: "Psicometria", desc: "<strong>[Instantâneo, Adjacente | Sem custo de pulso]</strong> Você pode tocar em objetos para visualizar remotamente suas memórias. Você pode visualizar um número de dias igual ao seu CAT. Role PSIQUE e, em seguida, faça uma pergunta, mais uma pergunta adicional para cada sucesso.<br>• Onde este objeto esteve?<br>• Quem tocou neste objeto?<br>• Para que este objeto foi usado?<br>• A que mais este objeto está conectado?<br><br>As memórias de um objeto são impressionistas e imprecisas, e geralmente só estão \"cientes\" do seu entorno imediato. Após usar esse poder, perca seu uso até descansar." },
      { name: "Amplificar", desc: "<strong>[Invocação, Adjacente, 1 cena | Requer 1 pulso]</strong> Você pode expandir as propriedades mundanas de um item comum que não seja uma arma a níveis extremos. Ao tocar um objeto mundano de até o tamanho de um CAT, você automaticamente entra em ressonância com ele na cena, e suas propriedades son ampliadas a níveis extremos, como se estivessem na escala de um CAT. Por exemplo:<br>• A velocidade, a dirigibilidade e a resistência de um carro<br>• O brilho e a intensidade de uma luz, e a área que ela ilumina<br>• A capacidade de uma porta de travar e resistir a impactos<br><br>Isso pode afetar facilmente a dificuldade e o risco das rolagens. O objeto continua sendo mundano." },
      { name: "Diplomacia", desc: "<strong>[Instantâneo, Curto | Requer 1 pulso]</strong> Você faz um pedido simples a um objeto como se fosse uma pessoa, ou lhe faz uma pergunta simples de sim ou não. Por exemplo, você pode pedir a uma porta para abrir ou manter fechada (mesmo que ela normalmente não pudesse ser trancada, ou que você não tenha a chave), a um computador para desligar ou encontrar informações para você, ou a um carro para ligar sem chave ou dirigir sozinho. Se precisar fazer um teste para isso, role PSIQUE ou use uma ação social, como negociação ou autoridade. Você pode afetar objetos de até o tamanho CAT com isso. Objetos aos quais são feitas perguntas só podem responder com sim ou não e não podem vocalizar." },
      { name: "Aliança", desc: "<strong>[Invocação, Curto, 1 cena | Requer 1 pulso]</strong> Um objeto de até tamanho CAT em curto alcance agora pode realizar uma ação de ajuda em um aliado, rolando 1d6, ou PSIQUE se você estiver em ressonância com esse objeto. O objeto pode sofrer ou causar consequências normalmente a partir dessas ações. Os aliados precisam ser capazes de interagir com ele ou usar o objeto para obter seus benefícios. O objeto não adquire a capacidade de se mover ou se animar de qualquer forma, mas a sorte simplesmente se curva ao seu redor." }
    ]
  }
];

export const SIN_MARKS = [
  { id: "olho_do_pecado", name: "Olho do Pecado", desc: "Um olho adicional se abre em seu corpo. Você enxerga o invisível, mas atrai a atenção de entidades.", penalty: "-1 Stress Max", benefit: "Percepção sobrenatural constante" },
  { id: "toque_necrosado", name: "Toque Necrosado", desc: "Sua pele escurece e enrijece. Seu toque causa dor, mas você sente menos.", penalty: "Dificuldade em interações sociais", benefit: "+1 dado em testes de intimidação" },
  { id: "lingua_do_abismo", name: "Língua do Abismo", desc: "Você fala em línguas infernais involuntariamente.", penalty: "Revela sua posição em momentos críticos", benefit: "Pode compreender qualquer criatura" },
  { id: "sede_de_sangue", name: "Sede de Sangue", desc: "Uma fome insaciável por carne humana cresce em você.", penalty: "Precisa resistir ou atacar o mais próximo", benefit: "+1d6 em ataques corpo a corpo" },
  { id: "marca_da_condenacao", name: "Marca da Condenação", desc: "Runas negras queimam em sua pele.", penalty: "-1 em todos Resistências", benefit: "Pode gastar Stress para ativar Blasfêmias sem custo" }
];

export const EQUIPMENT_BY_KP = {
  0: [
    { name: "Identificação CASTLE", desc: "Crachá e documentos de identificação" },
    { name: "Comunicador", desc: "Rádio ponto-a-ponto criptografado" },
    { name: "Caderno e Caneta", desc: "Anotações de campo" },
    { name: "Lanterna", desc: "Lanterna de mão simples" }
  ],
  1: [
    { name: "Kit de Primeiros Socorros", desc: "Curativos, antissépticos, ataduras" },
    { name: "Corda (15m)", desc: "Corda de escalada resistente" },
    { name: "Isqueiro Tático", desc: "Isqueiro à prova de vento" },
    { name: "Garrafa Térmica", desc: "Mantém líquidos quentes/frios" },
    { name: "Ração de Emergência", desc: "3 dias de comida desidratada" }
  ],
  2: [
    { name: "Pistola de Serviço", desc: "Calibre 9mm, padrão CASTLE" },
    { name: "Bastão Tático", desc: "Bastão retrátil de aço" },
    { name: "Colete Leve", desc: "Proteção balística nível II" },
    { name: "Algemas Reforçadas", desc: "Contenção de humanos e criaturas" },
    { name: "Drone de Reconhecimento", desc: "Pequeno drone com câmera" }
  ],
  3: [
    { name: "Escopeta de Combate", desc: "Calibre 12, ação de bomba" },
    { name: "Colete Pesado", desc: "Proteção balística nível III" },
    { name: "Kit de Demolição", desc: "Explosivos controlados" },
    { name: "Visão Noturna", desc: "Óculos de visão noturna" },
    { name: "Kit de Invasão", desc: "Ferramentas para abrir fechaduras" }
  ],
  4: [
    { name: "Fuzil de Precisão", desc: "Fuzil sniper calibre .308" },
    { name: "Equipamento Tático Pesado", desc: "Blindagem completa com suporte vital" },
    { name: "Câmara de Contenção Portátil", desc: "Gaiola selada para transporte de entidades" },
    { name: "Scanner de Energia Paranormal", desc: "Detecta atividade sobrenatural num raio de 500m" }
  ],
  5: [
    { name: "Arma Experimental CASTLE", desc: "Protótipo de alta potência contra Pecados" },
    { name: "Kit de Ritual Completo", desc: "Todos os componentes para rituais complexos" },
    { name: "Veículo Blindado Leve", desc: "Transporte tático com compartimento de contenção" }
  ]
};

export function getSkillPointsForCat(cat) {
  return CAT_TABLE[cat]?.skillPoints || 3;
}

export function getBlasphemyCountForCat(cat) {
  return CAT_TABLE[cat]?.blasphemies || 1;
}

export function getBlasphemiesForCat(cat) {
  return BLASPHEMIES.filter(b => b.cat <= cat);
}
