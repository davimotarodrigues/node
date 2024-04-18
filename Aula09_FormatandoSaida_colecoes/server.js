const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

function criarCard(carro) {
    return `
    <div class="card mb-3">
    <img src="${carro.url_foto}" class="card-img-top w-100 h-auto" alt="${carro.nome}">
        <div class="card-body">
            <h5 class="card-title">${carro.nome}</h5>
            <p class="card-text">${carro.desc}</p>
            <a href="${carro.url_info}" class="btn btn-primary">Mais Informações</a>
        </div>
    </div>
    `;
}

app.get('/', (req, res) => {
    const cardsHtml = carros.map(carro => criarCard(carro)).join('');
    const pageHtmlPath = path.join(__dirname, 'dadoscarro.html');
    let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
    pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
    res.send(pageHtml);
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
