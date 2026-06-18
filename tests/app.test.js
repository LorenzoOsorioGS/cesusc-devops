const request = require('supertest');
const app = require('../src/app');

describe('API HTTP', () => {
  test('GET /api/health retorna status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/soma soma dois numeros', async () => {
    const res = await request(app).get('/api/soma?a=2&b=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.resultado).toBe(5);
  });

  test('GET /api/soma com parametro invalido retorna 400', async () => {
    const res = await request(app).get('/api/soma?a=x&b=3');
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/saudacao/:nome retorna mensagem personalizada', async () => {
    const res = await request(app).get('/api/saudacao/Italo');
    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Ola, Italo!');
  });
});
