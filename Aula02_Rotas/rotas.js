const http = require('http');

const server = http.createServer((req, res) => {
  // Rota principal
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bem-vindo ao meu servidor Node.js!');
  }

  // Rota para página aluno
  else if (req.url === '/aluno') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ALUNOS');
  }

  // Rota para página professor
  else if (req.url === '/professor') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('PROFESSORES.');
  }

  // Rota não encontrada
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Rota não encontrada!');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
