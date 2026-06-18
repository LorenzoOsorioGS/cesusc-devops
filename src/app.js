const express = require('express');
const path = require('path');
const { soma, saudacao } = require('./utils');

const app = express();

// Versao exibida na pagina/health-check. Altere este valor para demonstrar
// o "antes e depois" do deploy (CD) durante a apresentacao.
const APP_VERSION = '3.0.0';

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', versao: APP_VERSION });
});

app.get('/api/saudacao/:nome', (req, res) => {
  res.status(200).json({ mensagem: saudacao(req.params.nome) });
});

app.get('/api/soma', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ erro: 'Parametros a e b devem ser numeros.' });
  }
  return res.status(200).json({ resultado: soma(a, b) });
});

module.exports = app;
