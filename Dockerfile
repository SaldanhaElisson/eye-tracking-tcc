# Estágio de construção
FROM node:20-alpine as builder

WORKDIR /app

# Copiar arquivos de dependência primeiro (para melhor cache)
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copiar os arquivos construídos
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Instalar serve globalmente (para servir os arquivos estáticos)
RUN npm install -g serve

# Expor a porta do Vite (5173)
EXPOSE 5173

# Comando para iniciar o servidor na porta correta
CMD ["serve", "-s", "dist", "-l", "5173"]