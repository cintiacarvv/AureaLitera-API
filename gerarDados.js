
const fs = require('fs');
const path = require('path');

// função auxiliar para gerar números aleatórios dentro de um intervalo
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar o objeto de dados
function gerarDashboardData() {
  const e_book_vendas = getRandomInt(3000, 5000);
  const fisico_vendas = getRandomInt(800, 1500);
  const audio_vendas = getRandomInt(2000, 4000);

  const dados = {
    "gerado_em": new Date().toISOString(), // Grava a hora exata da geração
    "kpis_gerais": {
      "receita_total": (e_book_vendas * 19.90) + (fisico_vendas * 55.00) + (audio_vendas * 30.00),
      "usuarios_ativos": getRandomInt(2500, 4500),
      "total_pedidos": getRandomInt(1000, 2000),
      "livros_cadastrados": 850
    },
    "vendas_por_formato":[
      { "formato": "E-book", "quantidade": e_book_vendas, "receita": e_book_vendas * 19.90, "cor": "#4CAF50" },
      { "formato": "Físico", "quantidade": fisico_vendas, "receita": fisico_vendas * 55.00, "cor": "#FF9800" },
      { "formato": "Audiobook", "quantidade": audio_vendas, "receita": audio_vendas * 30.00, "cor": "#2196F3" }
    ],
    "faturamento_mensal_2026":[
      { "mes": "Jan", "fisico": getRandomInt(10000, 15000), "digital": getRandomInt(20000, 30000) },
      { "mes": "Fev", "fisico": getRandomInt(10000, 15000), "digital": getRandomInt(20000, 30000) },
      { "mes": "Mar", "fisico": getRandomInt(10000, 15000), "digital": getRandomInt(20000, 30000) },
      { "mes": "Abr", "fisico": getRandomInt(10000, 15000), "digital": getRandomInt(20000, 30000) },
      { "mes": "Mai", "fisico": getRandomInt(10000, 15000), "digital": getRandomInt(20000, 30000) }
    ],
    "top_5_livros_vendidos":[
      { "id": 101, "titulo": "A Bailarina de Auschwitz", "autor": "Edith Eva Eger", "vendas": getRandomInt(600, 900) },
      { "id": 102, "titulo": "O Iluminado", "autor": "Stephen King", "vendas": getRandomInt(500, 700) },
      { "id": 103, "titulo": "Hábitos Atômicos", "autor": "James Clear", "vendas": getRandomInt(400, 600) },
      { "id": 104, "titulo": "Sapiens", "autor": "Yuval Noah Harari", "vendas": getRandomInt(300, 550) },
      { "id": 105, "titulo": "Duna", "autor": "Frank Herbert", "vendas": getRandomInt(200, 500) }
    ]
  };

  return dados;
}

// gera os dados
const dashboardJson = gerarDashboardData();

// define onde o arquivo será salvo (na pasta src/services)
const dirPath = path.join(__dirname, 'src', 'services');
const filePath = path.join(dirPath, 'dashboardData.json');

// verifica se a pasta existe, se não, cria (evita erros)
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
}

// escreve os dados no arquivo formatando bonito (com 2 espaços de indentação)
fs.writeFileSync(filePath, JSON.stringify(dashboardJson, null, 2), 'utf-8');

console.log(`Sucesso! Os dados foram gerados e salvos em: ${filePath}`);