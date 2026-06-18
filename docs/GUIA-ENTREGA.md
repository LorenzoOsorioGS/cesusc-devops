# Guia de Entrega — N3 DevOps (cesusc-devops)

Este guia leva o projeto do zero ao deploy na AWS, cobrindo os requisitos obrigatórios
e o bônus de DevSecOps. Comandos em **PowerShell** (Windows). Onde for diferente no
Git Bash, está indicado.

---

## 0. Pré-requisitos (uma vez)

- [ ] Conta no **GitHub** (os 3 do grupo com acesso ao repositório).
- [ ] Conta na **AWS** (free tier).
- [ ] Conta no **Docker Hub** (para a imagem do bônus).
- [ ] **Git**, **Node.js 18+** e (opcional) **Docker Desktop** instalados localmente.

---

## 1. Subir o projeto para o GitHub

> Estamos dentro da pasta `cesusc-devops`.

```powershell
git init
git add .
git commit -m "feat: estrutura inicial do pipeline DevOps N3"

# crie o repositório vazio em github.com/<usuario>/cesusc-devops e:
git branch -M main
git remote add origin https://github.com/<usuario>/cesusc-devops.git
git push -u origin main

# cria a branch de integracao
git checkout -b develop
git push -u origin develop
```

No GitHub, em **Settings → General → Default branch**, deixe `develop` como padrão
(opcional) e proteja a `main` em **Settings → Branches → Add rule** exigindo Pull Request.

---

## 2. Provisionar a instância AWS EC2

1. Console AWS → **EC2 → Launch instance**.
2. **Name**: `cesusc-devops`.
3. **AMI**: Ubuntu Server 22.04 LTS.
4. **Tipo**: `t2.micro` (free tier).
5. **Key pair**: crie um novo (`cesusc-devops-key`), baixe o **`.pem`** e **guarde** — é a chave SSH.
6. **Network settings → Security group**, libere (Inbound rules):
   - **SSH (22)** — origem: seu IP (ou `0.0.0.0/0` para a demo).
   - **HTTP (80)** — origem: `0.0.0.0/0` (acesso da aplicação pelo browser).
7. **Launch instance** e anote o **IPv4 público** (este é o seu `SERVER_IP`).

### 2.1 Instalar Docker na EC2

Conecte via SSH (PowerShell, na pasta onde está o `.pem`):

```powershell
icacls .\cesusc-devops-key.pem /inheritance:r
icacls .\cesusc-devops-key.pem /grant:r "$($env:USERNAME):(R)"
ssh -i .\cesusc-devops-key.pem ubuntu@<SERVER_IP>
```

Já dentro da instância:

```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo usermod -aG docker ubuntu      # permite usar docker sem sudo
exit                                 # saia e reconecte para aplicar o grupo
```

> A aplicação roda em container publicado na porta **80** (`-p 80:3000`), então o acesso
> é direto em `http://<SERVER_IP>`. Não é necessário nginx nesta configuração.

---

## 3. Configurar Secrets e Variables no GitHub

Repositório → **Settings → Secrets and variables → Actions**.

### Aba **Secrets** (New repository secret)
| Nome | Valor |
|------|-------|
| `SSH_PRIVATE_KEY` | conteúdo **completo** do arquivo `.pem` (inclui `-----BEGIN...-----` e `-----END...-----`) |
| `DOCKERHUB_TOKEN` | Access Token gerado no Docker Hub (Account Settings → Security → New Access Token) |

### Aba **Variables** (New repository variable)
| Nome | Valor |
|------|-------|
| `SERVER_IP` | IPv4 público da EC2 |
| `DOCKERHUB_USERNAME` | seu usuário do Docker Hub |

> O IP **não fica hardcoded** no YAML — é resolvido por `${{ vars.SERVER_IP }}` em tempo de execução.

---

## 4. Ligar os recursos de segurança do GitHub (bônus)

Repositório → **Settings → Advanced Security** (ou *Code security*):

- [ ] **Dependency graph** → Enable
- [ ] **Dependabot alerts** → Enable
- [ ] **Dependabot security updates** → Enable
- [ ] **Secret scanning** → Enable (+ **Push protection**)

O **CodeQL (SAST)** já está versionado em [codeql.yml](../.github/workflows/codeql.yml) e roda
sozinho. O **Dependabot (SCA)** usa [dependabot.yml](../.github/dependabot.yml).

---

## 5. Fluxo de trabalho Git (o que demonstrar na apresentação)

```powershell
# 1) a partir de develop, crie uma branch de feature
git checkout develop
git pull
git checkout -b feature/mensagem-nova

# 2) faça uma alteração visível (ex.: editar APP_VERSION em src/app.js
#    e o texto em public/index.html) e commite
git add .
git commit -m "feat: atualiza mensagem da pagina inicial"
git push -u origin feature/mensagem-nova
```

3. No GitHub, abra **Pull Request: `feature/mensagem-nova` → `develop`**.
   → dispara o **workflow CI** (lint, testes, cobertura, Selenium, secret scan e build da imagem).
4. Faça o **merge** do PR na `develop`.
5. Abra **Pull Request: `develop` → `main`** e faça o merge.
   → dispara o **workflow CD** (deploy na EC2 + OWASP ZAP).
6. Atualize `http://<SERVER_IP>` no browser e mostre a aplicação atualizada.

> **Resumo:** CI roda no caminho até a `develop`; CD roda quando chega na `main`.
> Mostrar os dois é só seguir os dois PRs acima.

---

## 6. Roteiro da apresentação (checklist)

- [ ] Mostrar a aplicação no ar: `http://<SERVER_IP>`.
- [ ] Criar/commitar em uma **branch de feature**.
- [ ] Abrir **PR para `develop`** e mostrar o **CI** rodando (verde).
- [ ] Mostrar relatório de **cobertura** (artifact) e o **Selenium** passando.
- [ ] Merge `develop` → `main` e mostrar o **CD** rodando.
- [ ] Recarregar o browser e mostrar a **aplicação atualizada**.
- [ ] (Bônus) Mostrar aba **Security**: CodeQL, Dependabot e relatório do **OWASP ZAP**.
- [ ] (Bônus) Mostrar a **imagem no Docker Hub**.

---

## 7. Bônus: simular e corrigir uma falha de segurança

Forma simples e segura de demonstrar o ciclo "detectar → corrigir":

1. **Introduzir uma dependência vulnerável** numa branch de feature:
   ```powershell
   git checkout develop
   git checkout -b feature/falha-seguranca
   npm install lodash@4.17.11   # versão antiga com CVE conhecido
   git add package.json package-lock.json
   git commit -m "chore: adiciona dependencia vulneravel (demo)"
   git push -u origin feature/falha-seguranca
   ```
2. Abra o PR → o **Dependabot/CodeQL** sinaliza o alerta na aba **Security**.
3. **Corrigir**: atualizar para a versão segura e mostrar o alerta sumir.
   ```powershell
   npm install lodash@4.17.21
   git add package.json package-lock.json
   git commit -m "fix: corrige dependencia vulneravel"
   git push
   ```

> Alternativa para SAST: inserir um trecho inseguro (ex.: uso de `eval()` com entrada do
> usuário) e mostrar o **CodeQL** apontando o problema no PR; depois remover e mostrar verde.

> Alternativa para Secret Scanning: tentar commitar um token fake (ex.:
> `AKIAIOSFODNN7EXAMPLE`) e mostrar a **push protection** bloqueando.

---

## 8. Validar a imagem Docker localmente (opcional)

```powershell
docker build -t cesusc-devops:local .
docker run -d -p 3000:3000 --name cesusc-devops cesusc-devops:local
# acesse http://localhost:3000  | parar: docker rm -f cesusc-devops
```
