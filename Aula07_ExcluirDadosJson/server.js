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

// Rota para exibir o formulário HTML para excluir um carro
app.get('/excluir-carro', (req, res) => {
  res.sendFile(path.join(__dirname, 'excluircarro.html'));
});

// Rota para processar a requisição POST do formulário e excluir o carro
app.post('/excluir-carro', (req, res) => {
  const { nome } = req.body;

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

  // Solicitar confirmação do usuário antes de excluir o carro
  res.send(`
    <script>
      if (confirm('Tem certeza de que deseja excluir o carro ${nome}?')) {
        window.location.href = '/excluir-carro-confirmado?nome=${nome}';
      } else {
        window.location.href = '/excluir-carro';
      }
    </script>
  `);
});

// Rota para confirmar a exclusão do carro após a confirmação do usuário
app.get('/excluir-carro-confirmado', (req, res) => {
  const nome = req.query.nome;

  // Lendo os dados do arquivo JSON
  let carrosData = fs.readFileSync(carrosPath, 'utf-8');
  let carros = JSON.parse(carrosData);

  // Procurando o carro pelo nome
  const carroIndex = carros.findIndex(carro => carro.nome.toLowerCase() === nome.toLowerCase());

  // Removendo o carro do array de carros
  carros.splice(carroIndex, 1);

  // Salvando os dados atualizados no arquivo JSON
  salvarDados(carros);

  // Enviando uma resposta indicando que o carro foi excluído com sucesso
  res.send(`<h1>O carro ${nome} foi excluído com sucesso!</h1>`);
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
