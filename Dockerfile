FROM node:20.5.1-alpine3.18

RUN apk update
RUN apk add openssl
RUN apk add bash

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["bin/sh", "-c", "node_modules/.bin/ts-node -r dotenv/config -r tsconfig-paths/register --transpile-only src/index.ts"]