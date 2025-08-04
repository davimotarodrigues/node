const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const cursosPath = path.join(__dirname, 'cursos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Funções para ler e salvar cursos
function lerCursos() {
  if (!fs.existsSync(cursosPath)) {
    fs.writeFileSync(cursosPath, '[]');
  }
  const data = fs.readFileSync(cursosPath, 'utf-8');
  return JSON.parse(data);
}

function salvarCursos(cursos) {
  fs.writeFileSync(cursosPath, JSON.stringify(cursos, null, 2));
}

// --- Páginas HTML estáticas ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/adicionar-curso', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adicionarcurso.html'));
});

app.get('/atualizar-curso', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'atualizarcurso.html'));
});

app.get('/excluir-curso', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'excluircurso.html'));
});

app.get('/listar-cursos', (req, res) => {
  const cursos = lerCursos();

  let html = `
    <h1>Lista de Cursos</h1>
    <ul>
      ${cursos.map(c => `
        <li>
          <strong>ID ${c.id} - ${c.nome}</strong> (${c.periodo})<br>
          ${c.descricao}
        </li><br>
      `).join('')}
    </ul>
    <a href="/">Voltar</a>
  `;

  res.send(html);
});

app.get('/buscar-curso', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buscarcurso.html'));
});

// --- Rotas CRUD ---
// Cadastrar novo curso
app.post('/cursos', (req, res) => {
  const { nome, periodo, descricao } = req.body;

  if (!nome || !periodo || !descricao) {
    return res.send('<h1>Erro: nome, período e descrição são obrigatórios.</h1><a href="/adicionar-curso">Voltar</a>');
  }

  const cursos = lerCursos();
  const novoId = cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;

  // Evitar duplicidade de nome+periodo
  if (cursos.find(c => c.nome.toLowerCase() === nome.toLowerCase() && c.periodo.toLowerCase() === periodo.toLowerCase())) {
    return res.send('<h1>Erro: Curso com esse nome e período já existe.</h1><a href="/adicionar-curso">Voltar</a>');
  }

  const novoCurso = { id: novoId, nome, periodo, descricao };
  cursos.push(novoCurso);
  salvarCursos(cursos);

  res.send('<h1>Curso adicionado com sucesso!</h1><a href="/">Voltar</a>');
});

// Atualizar curso pelo id
app.post('/atualizar-curso', (req, res) => {
  const { id, nome, periodo, descricao } = req.body;
  const cursoId = parseInt(id);

  if (!id || !nome || !periodo || !descricao) {
    return res.send('<h1>Erro: id, nome, período e descrição são obrigatórios.</h1><a href="/atualizar-curso">Voltar</a>');
  }

  const cursos = lerCursos();
  const index = cursos.findIndex(c => c.id === cursoId);
  if (index === -1) {
    return res.send('<h1>Erro: Curso não encontrado.</h1><a href="/atualizar-curso">Voltar</a>');
  }

  cursos[index] = { id: cursoId, nome, periodo, descricao };
  salvarCursos(cursos);

  res.send('<h1>Curso atualizado com sucesso!</h1><a href="/">Voltar</a>');
});

// Excluir curso pelo id
app.post('/excluir-curso', (req, res) => {
  const { id } = req.body;
  const cursoId = parseInt(id);

  if (!id) {
    return res.send('<h1>Erro: id é obrigatório.</h1><a href="/excluir-curso">Voltar</a>');
  }

  let cursos = lerCursos();
  const index = cursos.findIndex(c => c.id === cursoId);

  if (index === -1) {
    return res.send('<h1>Erro: Curso não encontrado.</h1><a href="/excluir-curso">Voltar</a>');
  }

  cursos.splice(index, 1);
  salvarCursos(cursos);

  res.send('<h1>Curso excluído com sucesso!</h1><a href="/">Voltar</a>');
});

// Buscar cursos por nome ou período (query string)
app.get('/cursos/busca', (req, res) => {
  const { nome, periodo } = req.query;
  const cursos = lerCursos();

  let resultados = cursos;

  if (nome) {
    resultados = resultados.filter(c => c.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  if (periodo) {
    resultados = resultados.filter(c => c.periodo.toLowerCase() === periodo.toLowerCase());
  }

  if (resultados.length === 0) {
    return res.send('<h1>Nenhum curso encontrado.</h1><a href="/buscar-curso">Voltar</a>');
  }

  let html = `
    <h1>Resultado da busca</h1>
    <ul>
      ${resultados.map(c => `
        <li>
          <strong>ID ${c.id} - ${c.nome}</strong> (${c.periodo})<br>
          ${c.descricao}
        </li><br>
      `).join('')}
    </ul>
    <a href="/buscar-curso">Voltar</a>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
