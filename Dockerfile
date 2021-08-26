FROM node:alpine as build
RUN apk update
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --only=production
RUN npm install

COPY index.ts ./
RUN npm run build

FROM node:alpine
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

ENV PORT=3000
ENV AUTHELIA=http://authelia:9091/api/verify

EXPOSE 3000
CMD node ./dist/index.js
