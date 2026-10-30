// Todo o texto fixo do site fica aqui, para editar sem mexer no layout.

export const perfil = {
  nome: 'Leon Nascimento Moreira',
  nomeCurto: 'Leon N. Moreira',
  cargo: 'Engenheiro de Software · Full Stack',
  local: 'Salvador, BA',
  frase: 'Construo sistemas que a operação usa todo dia, do banco de dados ao deploy, e agora com IA dentro.',
  apresentacao:
    'Cuido de ponta a ponta dos sistemas internos do Grupo Line: regra de negócio, banco, API, telas, testes e produção. Gosto de pegar processo que vive em planilha e na cabeça de uma pessoa só e transformar em sistema que qualquer um da equipe consegue usar.',
  email: 'leon.moreira112@gmail.com',
  whatsapp: 'https://wa.me/5571983485255?text=Ol%C3%A1%20Leon%2C%20vi%20seu%20portf%C3%B3lio',
  linkedin: 'https://www.linkedin.com/in/leon-nascimento-moreira-70a41b244/',
  github: 'https://github.com/Leonn001',
  cv: '/cv/leon-nascimento-moreira.pdf',
};

export const lineAi = {
  titulo: 'LineAI: IA dentro do Line Gestão',
  chamada:
    'Um chat no canto da tela onde a equipe pergunta em português e a IA responde com os dados reais do sistema, ou já deixa a operação pronta para a pessoa só conferir.',
  exemplos: [
    'Qual a média de consumo dessa linha nos últimos 3 meses?',
    'Qual a franquia dela?',
    'Faz o Mureg dessas 10 linhas para o DDD 11.',
  ],
  decisoes: [
    {
      titulo: 'A IA não grava nada',
      texto:
        'Para Mureg, troca de número, troca de chip ou importação, ela abre a tela certa com tudo preenchido. Quem confirma é a pessoa, no mesmo modal que já existia.',
    },
    {
      titulo: 'Usa o login de quem pergunta',
      texto:
        'As consultas rodam no navegador, pela API do sistema, com a permissão da própria pessoa. A IA nunca vê nem faz mais do que ela já poderia fazer na tela.',
    },
    {
      titulo: 'Conhece a regra do negócio',
      texto:
        'Se pedem um Mureg sem mudar o DDD, ela barra e sugere troca de número. Média de consumo é calculada no código, não "de cabeça" pelo modelo.',
    },
    {
      titulo: 'Entende quem digita errado',
      texto: 'Busca tolerante a erro de digitação: quando não acha exato, pergunta "Você quis dizer Fulano?" antes de mostrar qualquer dado.',
    },
    {
      titulo: 'Feita para não ser abusada',
      texto:
        'Instruções que não mudam por pedido, dado do sistema tratado como informação e nunca como ordem, limite de uso por pessoa e registro de cada pergunta.',
    },
  ],
  stack: ['.NET', 'Angular', 'OpenAI (function calling)', 'PostgreSQL', 'Testcontainers'],
  imagem: '/assets/lineai.png',
};

export const caseLineGestao = {
  titulo: 'Line Gestão: a operação da Line Móvel fora das planilhas',
  link: 'https://linegestao.linemovel.com.br/',
  problema:
    'Milhares de linhas, contas, planos, clientes e chips viviam em mais de quatro planilhas grandes, que só uma funcionária sabia usar. Cadastro, bloqueio, fatura, qualquer pergunta da diretoria passava por ela. Se ela não estivesse, a informação parava.',
  solucao:
    'Um sistema web multiusuário com permissão por perfil, histórico de cada alteração e as regras da operadora guardadas no banco, não na memória de quem opera. Hoje tem portal do cliente integrado ao CRM, fatura em PDF, dashboard, consumo, bloqueios, portabilidade, troca de número e de chip.',
  papel:
    'Desde 2026 cuido do desenvolvimento e da sustentação, junto da operação: levantamento, modelo de dados, API, telas, migração das planilhas, deploy, backup e a LineAI.',
  creditoLink: 'https://www.linkedin.com/in/eduardolopesx03/',
  decisoes: [
    {
      titulo: 'Deploy sem medo',
      texto:
        'Cada versão passa pelo CI no GitHub, faz backup do banco, sobe em Docker, roda um teste de fumaça e, se algo falhar, volta sozinha. Voltar à mão é um comando.',
    },
    {
      titulo: 'Testes contra banco de verdade',
      texto:
        'Mais de 1.500 testes: unidade, segurança, integração com Postgres real em container e frontend. Antes de refatorar algo crítico, primeiro escrevo o teste que prende o comportamento atual.',
    },
    {
      titulo: 'Dados conferidos antes de entrar',
      texto: 'Cada planilha antiga foi comparada número a número com o banco antes de ser dada como certa. Resultado: zero divergência.',
    },
    {
      titulo: 'Erro que a pessoa entende',
      texto: 'Nenhuma tela mostra código técnico ou id interno. A linha aparece pelo número, o cliente pelo nome, e a mensagem diz o que fazer.',
    },
  ],
  stack: ['Angular', '.NET 10', 'Entity Framework', 'PostgreSQL', 'Docker', 'GitHub Actions', 'nginx'],
};

export type Projeto = { nome: string; status: string; texto: string; stack: string[]; credito?: { nome: string; link: string } };

export const projetos: Projeto[] = [
  {
    nome: 'Robô Reset',
    status: 'Em uso',
    texto:
      'Reset de linhas em lote no portal da operadora, centenas por vez. O motor em Python é do Lucas Anjos; eu fiz o painel web que enfileira, acompanha, pausa e retoma cada lote, e a leitura de cotas por conta, grupo e linha.',
    stack: ['Python', 'Painel web', 'Automação'],
    credito: { nome: 'Lucas Anjos', link: 'https://www.linkedin.com/in/lucas-anjos-5a8a35143/' },
  },
  {
    nome: 'DocLine',
    status: 'Em uso',
    texto:
      'Plataforma interna de documentos. Contratos e termos que levavam uma tarde de copiar e colar saem em minutos, em .docx, a partir de modelos com cláusulas condicionais.',
    stack: ['Node', 'React', 'Geração de .docx'],
  },
  {
    nome: 'Vídeos em código',
    status: 'Mídia',
    texto:
      'Posts animados da Line Móvel feitos com Remotion: narração sincronizada palavra a palavra, cenas em React e renderização automática. Trocou o texto, sai um vídeo novo.',
    stack: ['React', 'Remotion', 'TTS'],
  },
  {
    nome: 'LineFinance',
    status: 'Descontinuado',
    texto:
      'Meu primeiro sistema no Grupo Line: financeiro com DRE por categoria. Foi descontinuado quando a empresa adotou o Conta Azul, e o trabalho seguiu para o Line Gestão.',
    stack: ['Angular', '.NET', 'PostgreSQL'],
  },
];

export const metodo = [
  { titulo: 'Produção com cuidado', texto: 'Todo deploy guarda o que estava no ar e volta com um comando. Quando algo parece errado, olho o log antes de dar palpite.' },
  { titulo: 'Teste antes de mexer', texto: 'Antes de refatorar o que funciona, escrevo o teste que prova que continua funcionando. A bateria inteira roda antes de cada entrega.' },
  { titulo: 'O processo inteiro', texto: 'Regra de negócio, dados, API, tela e deploy. O que importa é a operação funcionando de ponta a ponta, não só a minha parte.' },
  { titulo: 'IA com pé no chão', texto: 'Uso IA para explorar, gerar e revisar código, e coloquei IA no produto. Sempre com especificação antes, teste depois e humano confirmando o que importa.' },
];

export const stack = [
  { area: 'Linguagens', itens: 'C#, TypeScript, JavaScript, Java, SQL, Python' },
  { area: 'Back-end', itens: 'ASP.NET / .NET, Entity Framework, Node.js, Spring Boot, APIs REST, JWT' },
  { area: 'Front-end', itens: 'Angular, React, Next.js, Remotion' },
  { area: 'Dados', itens: 'PostgreSQL (migrations, triggers, auditoria), MySQL, importação de planilhas' },
  { area: 'Infra', itens: 'Docker, Linux, nginx, GitHub Actions, Vercel, AWS (EC2, S3, RDS)' },
  { area: 'IA', itens: 'OpenAI e Gemini com function calling, agentes de código, prompts com regra de negócio' },
  { area: 'Segurança', itens: 'Pentest web (DESEC), hardening de API, IDOR, validação de entrada' },
];

export const trajetoria = [
  {
    periodo: '01/2026 — hoje',
    titulo: 'Desenvolvedor Full Stack · Grupo Line',
    texto: 'Line Gestão, LineAI, Robô Reset, DocLine e os demais sistemas internos: requisitos, arquitetura, back, front, banco e produção.',
  },
  {
    periodo: '12/2025 — 01/2026',
    titulo: 'Desenvolvedor Full Stack · SeClick',
    texto: 'API REST com autenticação e interface em React e Node, com deploy em produção.',
  },
  {
    periodo: '07/2024 — 12/2024',
    titulo: 'Desenvolvedor Full Stack (freelance) · vistoria cautelar',
    texto: 'Front em PHP e JavaScript e endpoints em Java com Spring Boot, com requisitos levantados direto com o cliente.',
  },
  {
    periodo: '2026',
    titulo: 'Engenharia de Software · UCSal',
    texto: 'Cursos: Pentest na Prática (DESEC), Spring Boot e Java (DevDojo), AWS Cloud Practitioner.',
  },
];

export const origem =
  'Sou de Utinga, no interior da Bahia, e vim para Salvador cursar Engenharia de Software. Comecei com freelances e hoje cuido de sistemas em produção usados todo dia.';
