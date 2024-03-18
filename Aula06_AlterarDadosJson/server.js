const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para salvar os dados atualizados no arquivo JSON
function salvarDados(carros) {
  fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

// Rota para exibir o formulário HTML para atualizar os dados do carro
app.get('/atualizar-carro', (req, res) => {
  res.sendFile(path.join(__dirname, 'atualizarcarro.html'));
});

// Rota para processar a requisição POST do formulário e atualizar os dados do carro
app.post('/atualizar-carro', (req, res) => {
  const { nome, novaDescricao, novaUrlInfo, novaUrlFoto, novaUrlVideo } = req.body;
  // Lendo os dados do arquivo JSON
  let carrosData = fs.readFileSync(carrosPath, 'utf-8');
  let carros = JSON.parse(carrosData);
  // Procurando o carro pelo nome
  const carroIndex = carros.findIndex(carro => carro.nome.toLowerCase() === nome.toLowerCase());
  // Verificando se o carro existe
  if (carroIndex === -1) {
    res.send('<h1>Carro não encontrado.</h1>');
    return;
  }

  // Atualizando os dados do carro
  carros[carroIndex].desc = novaDescricao;
  carros[carroIndex].url_info = novaUrlInfo;
  carros[carroIndex].url_foto = novaUrlFoto;
  carros[carroIndex].url_video = novaUrlVideo;

  // Salvando os dados atualizados no arquivo JSON
  salvarDados(carros);

  // Enviando uma resposta indicando que os dados foram atualizados com sucesso
  res.send('<h1>Dados do carro atualizados com sucesso!</h1>');
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
