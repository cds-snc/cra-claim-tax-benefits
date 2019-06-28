FROM alpine

LABEL maintainer="SETI Dev Lab."

RUN apk add --update nodejs nodejs-npm

COPY . /src

WORKDIR /src

RUN npm install --quiet

EXPOSE 3000

ENTRYPOINT [ "node", "./bin/www" ]