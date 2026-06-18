const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const app = require('../../src/app');

let server;
let driver;
const PORT = 3100;
// Em CI/local sobe o proprio servidor. Para testar contra a app ja publicada
// na EC2, defina E2E_BASE_URL=http://<ip_do_servidor>.
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

beforeAll(async () => {
  if (!process.env.E2E_BASE_URL) {
    await new Promise((resolve) => {
      server = app.listen(PORT, resolve);
    });
  }

  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  );

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}, 60000);

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('a pagina inicial exibe o titulo do projeto', async () => {
  await driver.get(BASE_URL);
  const titulo = await driver.wait(until.elementLocated(By.id('titulo')), 10000);
  const texto = await titulo.getText();
  expect(texto).toContain('Pipeline DevOps');
}, 30000);

test('o botao Testar API atualiza a resposta na tela', async () => {
  await driver.get(BASE_URL);
  await driver.findElement(By.id('btn-saudacao')).click();
  const alvo = await driver.wait(
    until.elementLocated(By.id('resposta-api')),
    10000
  );
  await driver.wait(async () => (await alvo.getText()).length > 0, 10000);
  const texto = await alvo.getText();
  expect(texto).toContain('ok');
}, 30000);
