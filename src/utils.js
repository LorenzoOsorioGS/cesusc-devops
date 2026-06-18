// Regras de negocio simples e isoladas, faceis de cobrir com testes de unidade.

function soma(a, b) {
  return a + b;
}

function ehPar(n) {
  return n % 2 === 0;
}

function saudacao(nome) {
  if (!nome || String(nome).trim() === '') {
    return 'Ola, visitante!';
  }
  return `Ola, ${nome}!`;
}

module.exports = { soma, ehPar, saudacao };
