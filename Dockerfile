FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

EXPOSE 8088

COPY . .

CMD [ "node", "./build/index.js" ]
