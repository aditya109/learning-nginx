#  docker container run --env APPID=2222 -p 2222:9999 nodeapp

FROM alpine:3

WORKDIR /usr/src/app

RUN apk --no-cache add nodejs npm 

COPY package*.json ./

RUN npm install

COPY . .

ENV APPID=2000

EXPOSE 9999/tcp

CMD [ "node","server.js"]