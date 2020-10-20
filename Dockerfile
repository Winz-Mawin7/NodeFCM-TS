FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 8088 8448

CMD [ "yarn", "deploy" ]
