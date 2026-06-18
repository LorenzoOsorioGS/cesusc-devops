# cesusc-devops — Avaliação N3 (DevOps)

Aplicação Node.js + Express com pipeline completo de **CI / Continuous Delivery / Continuous Deployment** no GitHub Actions, deploy em **AWS EC2** e camada de **DevSecOps** (SAST, SCA, DAST, Secret Scanning) com **Docker**.

## Requisitos atendidos

| Requisito | Onde está |
|-----------|-----------|
| Branch `develop` e branches de `feature` | Fluxo Git (ver guia) |
| Workflow de CI + Delivery (lint, cobertura, testes) | [.github/workflows/ci.yaml](.github/workflows/ci.yaml) |
| Workflow de Continuous Deployment na EC2 | [.github/workflows/cd.yml](.github/workflows/cd.yml) |
| Aplicação Node.js | [src/](src/) |
| Testes de unidade | [tests/utils.test.js](tests/utils.test.js), [tests/app.test.js](tests/app.test.js) |
| Teste de interface (Selenium) | [tests/e2e/selenium.test.js](tests/e2e/selenium.test.js) |
| **Bônus** SAST | [.github/workflows/codeql.yml](.github/workflows/codeql.yml) |
| **Bônus** SCA | [.github/dependabot.yml](.github/dependabot.yml) |
| **Bônus** DAST | job `zap_scan` em [cd.yml](.github/workflows/cd.yml) |
| **Bônus** Secret Scanning | job `secret-scan` em [ci.yaml](.github/workflows/ci.yaml) |
| **Bônus** Docker | [Dockerfile](Dockerfile) |

## Rodando localmente

```bash
npm install
npm run lint        # análise estática
npm test            # testes de unidade + cobertura
npm run test:e2e    # teste de interface Selenium (requer Google Chrome)
npm start           # sobe em http://localhost:3000
```

## Endpoints

- `GET /` — página web (demo no browser)
- `GET /api/health` — status e versão
- `GET /api/soma?a=2&b=3` — soma dois números
- `GET /api/saudacao/:nome` — saudação personalizada

## Documentação de entrega

Passo a passo completo (AWS EC2, Secrets/Variables, fluxo Git, roteiro da apresentação e simulação de correção de falha) em **[docs/GUIA-ENTREGA.md](docs/GUIA-ENTREGA.md)**.
