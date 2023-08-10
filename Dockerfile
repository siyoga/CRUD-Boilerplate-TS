# LOCAL BUILD

FROM node:18-alpine AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN rm -rf ./node_modules && yarn install

COPY --chown=node:node . .

# USER node

CMD yarn start:dev

# PRODUCTION BUILD

FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV prod

RUN rm -rf ./node_modules yarn install --production

USER node


# PRODUCTION

FROM node:18-alpine AS prod

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]