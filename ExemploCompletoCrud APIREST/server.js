const fs = require('fs');
const path = require('path');
const express = require('express');

// Criar app Express
const app = express();
const port = 3001;

// Caminho do arquivo JSON onde ficam os carros
const carrosPath = path.join(__dirname, 'carros.json');

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Servir arquivos estáticos da pasta "public" (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Função para ler dados do JSON (leitura síncrona simples)
function lerDados() {
  const data = fs.readFileSync(carrosPath, 'utf-8');
  return JSON.parse(data);
}

// Função para salvar dados no JSON (sobrescreve arquivo)
function salvarDados(carros) {
  fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

/*
 * ROTA: GET /api/carros
 * Retorna a lista de carros em formato JSON
 */
app.get('/api/carros', (req, res) => {
  const carros = lerDados();
  res.json(carros);
});

/*
 * ROTA: POST /api/carros
 * Adiciona um novo carro. Espera receber JSON no corpo.
 */
app.post('/api/carros', (req, res) => {
  let carros = lerDados();
  const novoCarro = req.body;

  // Verifica se o carro já existe pelo nome (ignora maiúsc/minúsc)
  if (carros.find(c => c.nome.toLowerCase() === novoCarro.nome.toLowerCase())) {
    return res.status(400).json({ error: 'Carro já existe' });
  }

  carros.push(novoCarro);
  salvarDados(carros);
  res.status(201).json(novoCarro);
});

/*
 * ROTA: PUT /api/carros/:nome
 * Atualiza um carro existente identificado pelo nome na URL
 */
app.put('/api/carros/:nome', (req, res) => {
  let carros = lerDados();
  const nome = req.params.nome.toLowerCase();

  // Buscar índice do carro a ser atualizado
  const index = carros.findIndex(c => c.nome.toLowerCase() === nome);

  if (index === -1) {
    return res.status(404).json({ error: 'Carro não encontrado' });
  }

  // Atualiza os dados do carro mantendo o nome original
  carros[index] = {
    nome: carros[index].nome,
    desc: req.body.desc,
    url_info: req.body.url_info,
    url_foto: req.body.url_foto,
    url_video: req.body.url_video
  };

  salvarDados(carros);
  res.json(carros[index]);
});

/*
 * ROTA: DELETE /api/carros/:nome
 * Remove um carro identificado pelo nome
 */
app.delete('/api/carros/:nome', (req, res) => {
  let carros = lerDados();
  const nome = req.params.nome.toLowerCase();

  // Busca índice para remover
  const index = carros.findIndex(c => c.nome.toLowerCase() === nome);

  if (index === -1) {
    return res.status(404).json({ error: 'Carro não encontrado' });
  }

  const excluido = carros.splice(index, 1)[0];
  salvarDados(carros);
  res.json({ message: `Carro ${excluido.nome} excluído com sucesso` });
});

// Inicia o servidor na porta 3001
app.listen(port, () => {
  console.log(`API REST rodando em http://localhost:${port}`);
});
