# Estágio de construção
FROM node:20-alpine as builder

WORKDIR /app

# Copiar arquivos de dependência primeiro (para melhor cache)
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]