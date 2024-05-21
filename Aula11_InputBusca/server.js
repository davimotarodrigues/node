// Importando os módulos necessários do Node.js
const fs = require('fs');      
const path = require('path');   
const express = require('express');  
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
  // Utilizando o método 'find' para procurar um carro com o nome 
  //correspondente no array
  return carros.find(carro => carro.nome.toLowerCase() === nome.toLowerCase());
}

// Rota para exibir a página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/buscarCarro.html'));
});

// Rota para processar a submissão do formulário e buscar o carro pelo nome
app.get('/buscar-carro', (req, res) => {
  const nomeDoCarroBuscado = req.query.nome;
  const carroEncontrado = buscarCarroPorNome(nomeDoCarroBuscado);
  
  if (carroEncontrado) {
    res.send(`<h1>Carro encontrado:</h1><pre>${JSON.stringify(carroEncontrado, null, 2)}
    </pre>`);
  } else {
    res.send('<h1>Carro não encontrado.</h1>');
  }
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
