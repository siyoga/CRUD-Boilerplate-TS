FROM node:18.12-alpine AS dev

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --omit=dev

COPY . .

FROM node:18.12-alpine AS prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci

COPY . .


RUN npm run build
CMD [ "npm", "run", "start:prod" ]