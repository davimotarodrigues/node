const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Função para ler e salvar dados
function lerDados() {
  const data = fs.readFileSync(carrosPath, 'utf-8');
  return JSON.parse(data);
}

function salvarDados(carros) {
  fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

// Página inicial com links
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------- ADICIONAR ----------
app.get('/adicionar-carro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adicionarcarro.html'));
});

app.post('/adicionar-carro', (req, res) => {
  let carros = lerDados();
  const novoCarro = req.body;

  if (carros.find(c => c.nome.toLowerCase() === novoCarro.nome.toLowerCase())) {
    return res.send('<h1>Carro já existe!</h1><a href="/">Voltar</a>');
  }

  carros.push(novoCarro);
  salvarDados(carros);
  res.send('<h1>Carro adicionado com sucesso!</h1><a href="/">Voltar</a>');
});

// ---------- ATUALIZAR ----------
app.get('/atualizar-carro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'atualizarcarro.html'));
});

app.post('/atualizar-carro', (req, res) => {
  let carros = lerDados();
  const { nome, novaDescricao, novaUrlInfo, novaUrlFoto, novaUrlVideo } = req.body;
  const index = carros.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

  if (index === -1) {
    return res.send('<h1>Carro não encontrado.</h1><a href="/">Voltar</a>');
  }

  carros[index] = {
    nome,
    desc: novaDescricao,
    url_info: novaUrlInfo,
    url_foto: novaUrlFoto,
    url_video: novaUrlVideo
  };

  salvarDados(carros);
  res.send('<h1>Carro atualizado com sucesso!</h1><a href="/">Voltar</a>');
});

// ---------- EXCLUIR ----------
app.get('/excluir-carro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'excluircarro.html'));
});

app.post('/excluir-carro', (req, res) => {
  const { nome } = req.body;
  const confirm = `
    <script>
      if (confirm('Deseja excluir o carro ${nome}?')) {
        window.location.href = '/excluir-carro-confirmado?nome=${nome}';
      } else {
        window.location.href = '/';
      }
    </script>
  `;
  res.send(confirm);
});

app.get('/excluir-carro-confirmado', (req, res) => {
  let carros = lerDados();
  const nome = req.query.nome;
  const index = carros.findIndex(c => c.nome.toLowerCase() === nome.toLowerCase());

  if (index === -1) {
    return res.send('<h1>Carro não encontrado.</h1><a href="/">Voltar</a>');
  }

  carros.splice(index, 1);
  salvarDados(carros);
  res.send(`<h1>Carro "${nome}" excluído com sucesso!</h1><a href="/">Voltar</a>`);
});

// ---------- LISTAR ----------
app.get('/carros', (req, res) => {
  const carros = lerDados();

  let html = `
    <h1>Lista de Carros</h1>
    <ul>
      ${carros.map(c => `
        <li>
          <strong>${c.nome}</strong> - ${c.desc}<br>
          <a href="${c.url_info}" target="_blank">Mais informações</a><br>
          <a href="${c.url_foto}" target="_blank">Ver foto</a> |
          <a href="${c.url_video}" target="_blank">Ver vídeo</a><br>
          <a href="/atualizar-carro">Editar</a> |
          <a href="/excluir-carro">Excluir</a>
        </li><br>
      `).join('')}
    </ul>
    <a href="/">Voltar</a>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Servidor rodando: http://localhost:${port}`);
});
