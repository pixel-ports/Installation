FROM node:10.16.0-alpine
WORKDIR /api


ADD . /api

RUN npm i

RUN npm run build

#ADD dist /api/dist
#ADD node_modules /api/dist/node_modules

WORKDIR /api/dist

EXPOSE 3000/tcp

ENV NODE_ENV production

CMD ["node", "index.js"]

LABEL MAINTAINER jmartinez@prodevelop.es 