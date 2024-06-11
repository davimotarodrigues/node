const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');
const carrosData = fs.readFileSync(carrosPath, 'utf-8');
const carros = JSON.parse(carrosData);

// Função para truncar a descrição
function truncarDescricao(descricao, comprimentoMaximo) {
    if (descricao.length > comprimentoMaximo) {
        return descricao.slice(0, comprimentoMaximo) + '...';
    }
    return descricao;
}

app.get('/', (req, res) => {
    let carsTable = '';

    carros.forEach(carro => {

        const descricaoTruncada = truncarDescricao(carro.desc, 100); // Limitando a descrição a 100 caracteres

        carsTable += `
        <tr>
            <td><a href="${carro.url_info}">${carro.nome}</a></td>
            <td>${descricaoTruncada}</td>
            <td><img src="${carro.url_foto}" alt="${carro.nome}" style="max-width: 100px;"></td>
        </tr>
        `;
    });

    const htmlContent = fs.readFileSync('dadoscarro.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{carsTable}}', carsTable);

    res.send(finalHtml);
});


// Rota para buscar carros por categoria
app.get('/buscarPorCategoria', (req, res) => {
    const categoria = req.query.categoria.toLowerCase();
    const carrosFiltrados = carros.filter(carro => carro.categoria.toLowerCase() === categoria);

    let carsTable = '';

    carrosFiltrados.forEach(carro => {
        const descricaoTruncada = truncarDescricao(carro.desc, 100); // Limitando a descrição a 100 caracteres

        carsTable += `
        <tr>
            <td><a href="${carro.url_info}">${carro.nome}</a></td>
            <td>${descricaoTruncada}</td>
            <td><img src="${carro.url_foto}" alt="${carro.nome}" style="max-width: 100px;"></td>
        </tr>
        `;
    });

    const htmlContent = fs.readFileSync('dadoscarro.html', 'utf-8');
    const finalHtml = htmlContent.replace('{{carsTable}}', carsTable);

    res.send(finalHtml);
});


app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
