const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

function buscarCarroPorNome(nome) {
  return carros.find(carro => carro.nome.toLowerCase() === nome.toLowerCase());
}

app.get('/buscar-carro/:nome', (req, res) => {
  const nomeDoCarroBuscado = req.params.nome;
  const carroEncontrado = buscarCarroPorNome(nomeDoCarroBuscado);

  if (carroEncontrado) {
    const templatePath = path.join(__dirname, 'dadoscarro.html');
    const templateData = fs.readFileSync(templatePath, 'utf-8');

    const html = templateData
      .replace('{{nome}}', carroEncontrado.nome)
      .replace('{{desc}}', carroEncontrado.desc)
      .replace('{{url_info}}', carroEncontrado.url_info);
     

    res.send(html);
  } else {
    res.send('<h1>Carro não encontrado.</h1>');
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
