FROM node:12

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 8088 8448

CMD [ "yarn", "deploy" ]
