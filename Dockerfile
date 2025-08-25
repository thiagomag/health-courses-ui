# Estágio 1: Build da Aplicação Vue.js
# Usamos uma imagem Node.js para instalar as dependências e compilar o projeto.
# A versão 22-alpine é leve e corresponde ao que está no seu package.json
FROM node:22-alpine AS build-stage

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Executa o script de build para gerar os arquivos de produção
RUN npm run build

# Estágio 2: Servidor de Produção com Nginx
# Usamos uma imagem leve do Nginx para servir os arquivos estáticos gerados no estágio anterior.
FROM nginx:stable-alpine AS production-stage

# Copia os arquivos compilados do estágio de build para o diretório padrão do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx (vamos criá-lo a seguir)
# Este arquivo é essencial para que o Vue Router funcione corretamente
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 para permitir o acesso ao servidor Nginx
EXPOSE 80

# Comando para iniciar o Nginx quando o container for executado
CMD ["nginx", "-g", "daemon off;"]