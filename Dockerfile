FROM node:16

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY prisma/schema.prisma prisma/

RUN npx prisma generate

COPY . .

EXPOSE 9090

CMD ["node", "index.js"]