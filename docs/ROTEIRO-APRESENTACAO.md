# Roteiro de Apresentação — N3 DevOps (10 pontos)

> Tutorial organizado nos 10 tópicos pedidos pelo professor. Cada ponto tem:
> **O que é** · **No nosso projeto** · **Mostrar** · **Falar**.
>
> Dados reais do projeto:
> - Repositório: https://github.com/LorenzoOsorioGS/cesusc-devops
> - Aplicação no ar: **http://3.134.91.41**
> - Imagem Docker: https://hub.docker.com/r/lorenzoosorio/cesusc-devops/tags
> - Servidor: AWS EC2 Ubuntu, região us-east-2

---

## Antes de começar — abas abertas
- [ ] GitHub do repositório
- [ ] Aba **Actions** (workflows)
- [ ] Aba **Security** (alertas)
- [ ] Docker Hub (tags da imagem)
- [ ] Navegador em **http://3.134.91.41**
- [ ] VS Code no projeto + 1 terminal na pasta `cesusc-devops`

---

## 1. Aplicação

**O que é:** a aplicação que o pipeline gerencia — uma API web em Node.js + Express.

**No nosso projeto:**
- [src/app.js](../src/app.js) — define a API (rotas) e serve a página web.
- [src/utils.js](../src/utils.js) — regras de negócio (soma, saudação) — fáceis de testar.
- [src/server.js](../src/server.js) — sobe o servidor na porta 3000.
- [public/index.html](../public/index.html) — a página que aparece no navegador.
- Endpoints: `/` (página), `/api/health`, `/api/soma?a=2&b=3`, `/api/saudacao/:nome`.

**Mostrar:** abra http://3.134.91.41 e clique no botão "Testar API". Mostre o código em `src/app.js`.

**Falar:** "Nossa aplicação é uma API Node.js com Express. Tem uma página web e endpoints
de API. Ela é totalmente gerenciada pelo nosso repositório e pelo pipeline de DevOps."

---

## 2. Servidor AWS

**O que é:** onde a aplicação roda em produção — uma máquina virtual na nuvem (AWS EC2).

**No nosso projeto:**
- Instância **EC2**, Ubuntu, tipo **t3.micro** (free tier), região **us-east-2**.
- Grupo de segurança liberando portas **22 (SSH)** e **80 (HTTP)**.
- Acesso por **chave SSH** (`.pem`). A aplicação roda em um **container Docker** na porta 80.

**Mostrar:** o console da AWS (EC2 → Instâncias → `cesusc-devops`, status "Executando" e o IP público). Depois o navegador em http://3.134.91.41.

**Falar:** "O servidor é uma instância EC2 da AWS rodando Ubuntu. Liberamos só as portas
necessárias (SSH e HTTP) no grupo de segurança. O acesso administrativo é por chave SSH, e
a aplicação é exposta na porta 80."

> **Importante:** não desligar a instância — o IP público mudaria.

---

## 3. Branches

**O que é:** estratégia de versionamento. Separamos o trabalho em ramificações.

**No nosso projeto:**
- **`main`** = produção. Todo push aqui dispara o **CD (deploy)**.
- **`develop`** = integração. Todo push/PR aqui dispara o **CI**.
- **`feature/*`** = onde desenvolvemos cada funcionalidade nova.
- Fluxo: `feature/*` → PR → `develop` → PR → `main`.

**Mostrar:** no GitHub, o seletor de branches (main, develop) e o gráfico de branches (Insights → Network), se quiser.

**Falar:** "Usamos o fluxo de feature branches. Cada funcionalidade nasce numa branch
`feature`, é integrada na `develop` via Pull Request, e só código estável chega na `main`,
que representa produção."

---

## 4. Testes

**O que é:** garantia de qualidade automatizada antes de qualquer entrega.

**No nosso projeto (3 tipos):**
- **Unidade** — [tests/utils.test.js](../tests/utils.test.js): testa as regras de negócio.
- **Integração (API)** — [tests/app.test.js](../tests/app.test.js): testa os endpoints HTTP (supertest).
- **Interface (Selenium)** — [tests/e2e/selenium.test.js](../tests/e2e/selenium.test.js): abre a página num navegador headless, confere o título e clica no botão.
- **Cobertura:** o Jest gera relatório de cobertura (hoje em 100%).

**Mostrar (no terminal):**
```
npm test          # unidade + integração + cobertura
npm run test:e2e  # teste de interface Selenium
```

**Falar:** "Temos testes de unidade, de integração da API e um teste de interface com
Selenium que simula o usuário no navegador. Tudo roda automaticamente no pipeline, com
relatório de cobertura. Se um teste falha, o pipeline trava e nada é entregue."

---

## 5. Commit / Pull Request

**O que é:** como o código entra no projeto, de forma rastreável e revisável.

**No nosso projeto:** todo código novo entra por **Pull Request**, e o PR só pode ser
mergeado com o **CI verde** (testes + segurança passando).

**Mostrar / Fazer ao vivo (demo principal):**
```bash
git checkout develop
git pull
git checkout -b feature/atualiza-mensagem
```
Edite [src/app.js](../src/app.js): `APP_VERSION = '1.0.0'` → `'1.1.0'`.
Edite [public/index.html](../public/index.html): troque o texto da versão/mensagem.
```bash
git add .
git commit -m "feat: atualiza versao e mensagem da aplicacao"
git push -u origin feature/atualiza-mensagem
```
No GitHub: **Compare & pull request** → base `develop` → **Create pull request**.

**Falar:** "Crio uma branch de feature, faço o commit e abro um Pull Request para a develop.
O PR é o portão de qualidade: o CI roda automaticamente nele."

---

## 6. CI — Integração Contínua

**O que é:** a cada PR/push na develop, o sistema integra e valida o código automaticamente.

**No nosso projeto:** [.github/workflows/ci.yaml](../.github/workflows/ci.yaml) roda:
- **Lint** (ESLint) — análise estática.
- **Testes de unidade + cobertura** (Jest).
- **Teste de interface** (Selenium).
- **Secret Scanning** (Gitleaks).

**Mostrar:** abra o PR / aba Actions e mostre os checks verdes do workflow **CI**.

**Falar:** "Assim que o PR abre, o CI dispara: roda a análise estática, os testes com
cobertura e o teste de interface. Só liberamos o merge com tudo verde — é a Integração Contínua."

---

## 7. CD — Entrega + Implantação Contínua

**O que é:** automatizar a ida do código para produção.
- **Continuous Delivery:** preparar o artefato pronto (a imagem Docker publicada).
- **Continuous Deployment:** implantar esse artefato em produção sem intervenção manual.

**No nosso projeto:**
- **Delivery** está no fim do [ci.yaml](../.github/workflows/ci.yaml) (job `delivery`): após os testes na develop, constrói a imagem Docker e publica no Docker Hub.
- **Deployment** está no [cd.yml](../.github/workflows/cd.yml): ao chegar na `main`, faz o deploy na EC2.

**Mostrar:** o job `delivery` verde + a imagem nova no Docker Hub. Depois a aba Actions com o workflow **CD**.

**Falar:** "Diferença importante: Delivery é deixar o pacote pronto para implantar — no
nosso caso a imagem Docker no Docker Hub. Deployment é implantar de fato em produção
automaticamente. Temos os dois."

---

## 8. Deploy

**O que é:** o ato de colocar a versão nova no servidor, ao vivo.

**No nosso projeto (continuação da demo):** depois de mergear o PR na develop, levamos para produção:
```bash
git checkout main
git pull
git merge develop
git push origin main
```
(ou abrir PR `develop → main` e mergear)

Isso dispara o **CD**, que via SSH:
1. faz `docker pull` da imagem nova,
2. para o container antigo e sobe o novo na porta 80.

**Mostrar:** aba Actions → workflow **CD** rodando (job `deploy`). Depois **recarregue
http://3.134.91.41** e mostre a **versão 1.1.0 / mensagem nova** no navegador.

**Falar:** "Ao chegar na main, o pipeline conecta no servidor por SSH, baixa a imagem nova
e troca o container. A aplicação é atualizada em produção sozinha — esse é o Continuous Deployment."

---

## 9. Contêineres (Docker)

**O que é:** empacotar a aplicação com tudo que ela precisa, rodando isolada e igual em
qualquer lugar.

**No nosso projeto:**
- [Dockerfile](../Dockerfile) — baseado em `node:18-alpine`, copia o código, instala
  dependências e expõe a porta 3000.
- A imagem é construída no CI e publicada em **lorenzoosorio/cesusc-devops** (Docker Hub).
- No servidor, a aplicação roda como container: `0.0.0.0:80->3000`.

**Mostrar:** o `Dockerfile`, a imagem no Docker Hub, e (opcional, via SSH) `docker ps` no servidor.

**Falar:** "Empacotamos a aplicação em uma imagem Docker. Ela é versionada no Docker Hub e
roda em container no servidor. Isso garante que o que testamos é exatamente o que vai pra produção."

---

## 10. Segurança (DevSecOps)

**O que é:** segurança integrada ao pipeline (Shift Left) — detectar falhas cedo e automaticamente.

**No nosso projeto (4 camadas):**
- **SAST** — [codeql.yml](../.github/workflows/codeql.yml): CodeQL analisa o código-fonte.
- **SCA** — [dependabot.yml](../.github/dependabot.yml): Dependabot monitora dependências e abre PRs de correção.
- **DAST** — job `zap_scan` no [cd.yml](../.github/workflows/cd.yml): OWASP ZAP "ataca" a aplicação já no ar.
- **Secret Scanning** — Gitleaks no CI + proteção nativa do GitHub (bloqueia commit de segredos).

**Mostrar:** aba **Security** do repo (Dependabot alerts, Code scanning/CodeQL, Secret scanning).
Para impressionar: mostre um alerta de vulnerabilidade, o PR do Dependabot que corrige, e o merge resolvendo.

**Falar:** "Aplicamos DevSecOps com o conceito de Shift Left: segurança desde o início.
Temos SAST analisando o código, SCA monitorando dependências, DAST atacando a aplicação em
execução, e secret scanning evitando vazamento de credenciais — tudo automatizado no pipeline."

---

## Sequência da demo ao vivo (resumo que amarra os 10 pontos)
1. Mostrar app no ar — http://3.134.91.41 **(1, 2)**
2. Criar branch de feature + commit **(3, 5)**
3. Abrir PR para develop → CI verde **(4, 6)**
4. Merge → imagem Docker publicada **(7, 9)**
5. PR develop → main → CD/Deploy **(7, 8)**
6. Recarregar o browser → versão nova **(8)**
7. Aba Security → SAST/SCA/DAST/secret scanning **(10)**

---

## Perguntas prováveis do professor
- **Delivery x Deployment?** Delivery = artefato pronto (imagem no Docker Hub); Deployment = implantar em produção automaticamente (deploy na EC2).
- **Por que main e develop?** develop integra e roda CI; main é produção e dispara o deploy.
- **Como o IP não fica no código?** Variable `SERVER_IP` + Secret `SSH_PRIVATE_KEY`; injetados em tempo de execução.
- **Se um teste falhar?** Job vermelho, merge bloqueado, nada é implantado.
- **O que o Selenium testa?** A interface no navegador (título + clique no botão).
- **SAST x DAST?** SAST analisa o código parado; DAST ataca a aplicação rodando.

## Divisão entre os 3
- **Pessoa 1:** pontos 1, 2, 3 (aplicação, servidor, branches).
- **Pessoa 2:** pontos 4, 5, 6, 7, 8 (testes, PR, CI, CD, deploy).
- **Pessoa 3:** pontos 9, 10 (contêineres, segurança) + perguntas.
