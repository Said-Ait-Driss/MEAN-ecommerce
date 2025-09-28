FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY  ./ ./

RUN npm install -g prisma@5.17.0
RUN prisma generate

RUN npm run build


FROM node:20-alpine
ENV NODE_ENV production

WORKDIR /app

COPY --from=builder  /app/package.json /app/prisma ./
COPY --from=builder  /app/node_modules/ ./node_modules/
COPY --from=builder  /app/dist/ ./dist/

EXPOSE 8001
CMD ["npm", "run", "migrate:start:prod"]
