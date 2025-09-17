FROM node:20-alpine

WORKDIR /app

# アクセスログ格納用ディレクトリの作成
RUN mkdir log/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-server
RUN npm run build-client

EXPOSE 3000

CMD ["node", "/app/server.js"]
