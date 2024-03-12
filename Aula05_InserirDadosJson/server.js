const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lendo os dados do arquivo JSON
let carrosData = fs.readFileSync(carrosPath, 'utf-8');
let carros = JSON.parse(carrosData);

// Função para salvar os dados atualizados no arquivo JSON
function salvarDados() {
  fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

// Rota para exibir o formulário HTML
app.get('/adicionar-carro', (req, res) => {
  res.sendFile(path.join(__dirname, 'adicionarcarro.html'));
});

// Rota para processar a requisição POST do formulário
app.post('/adicionar-carro', (req, res) => {
  const novoCarro = req.body;

  // Verificando se o carro já existe pelo nome
  if (carros.find(carro => carro.nome.toLowerCase() === novoCarro.nome.toLowerCase())) {
    res.send('<h1>Carro já existe. Não é possível adicionar duplicatas.</h1>');
    return;
  }

  // Adicionando o novo carro ao array de carros
  carros.push(novoCarro);

  // Salvando os dados atualizados no arquivo JSON
  salvarDados();

  // Enviando uma resposta indicando que o carro foi adicionado com sucesso
  res.send('<h1>Carro adicionado com sucesso!</h1>');
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
