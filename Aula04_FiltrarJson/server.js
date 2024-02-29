// Importando os módulos necessários do Node.js
const fs = require('fs');        // Módulo para manipulação de arquivos
const path = require('path');    // Módulo para manipulação de caminhos
const express = require('express');  // Módulo para criação de servidores web

// Criando uma instância do servidor web usando o Express
const app = express();

// Configurando a porta em que o servidor irá escutar
const port = 3000;

// Caminho do arquivo JSON que contém os dados dos carros
const carrosPath = path.join(__dirname, 'carros.json');

// Lendo e convertendo os dados do arquivo JSON em um objeto JavaScript
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

// Função para buscar um carro específico pelo nome
function buscarCarroPorNome(nome) {
  // Utilizando o método 'find' para procurar um carro com o nome correspondente no array
  return carros.find(carro => carro.nome.toLowerCase() === nome.toLowerCase());
}

// Rota para buscar e exibir um carro pelo nome
app.get('/buscar-carro/:nome', (req, res) => {
  // Obtendo o nome do carro a ser buscado a partir dos parâmetros da URL
  const nomeDoCarroBuscado = req.params.nome;

  // Chamando a função para buscar o carro pelo nome
  const carroEncontrado = buscarCarroPorNome(nomeDoCarroBuscado);

  // Verificando se o carro foi encontrado
  if (carroEncontrado) {
    // Enviando uma resposta HTML formatada com os dados do carro encontrado
    res.send(`<h1>Carro encontrado:</h1><pre>${JSON.stringify(carroEncontrado, null, 2)}</pre>`);
  } else {
    // Enviando uma resposta indicando que o carro não foi encontrado
    res.send('<h1>Carro não encontrado.</h1>');
  }
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
