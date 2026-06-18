FROM node:18-alpine

WORKDIR /app

# Copia apenas os manifestos primeiro para aproveitar o cache de camadas.
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o codigo da aplicacao.
COPY src ./src
COPY public ./public

EXPOSE 3000
ENV PORT=3000

CMD ["node", "src/server.js"]
