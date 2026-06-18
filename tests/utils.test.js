const { soma, ehPar, saudacao } = require('../src/utils');

describe('soma', () => {
  test('soma dois numeros positivos', () => {
    expect(soma(2, 3)).toBe(5);
  });

  test('soma com numero negativo', () => {
    expect(soma(-1, 1)).toBe(0);
  });
});

describe('ehPar', () => {
  test('4 e par', () => {
    expect(ehPar(4)).toBe(true);
  });

  test('3 nao e par', () => {
    expect(ehPar(3)).toBe(false);
  });
});

describe('saudacao', () => {
  test('retorna saudacao com nome', () => {
    expect(saudacao('Ana')).toBe('Ola, Ana!');
  });

  test('retorna saudacao padrao sem nome', () => {
    expect(saudacao('')).toBe('Ola, visitante!');
  });
});
