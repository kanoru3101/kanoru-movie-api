FROM node:16.13.1-alpine3.14

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run"]