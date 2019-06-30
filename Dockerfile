FROM node:lts-alpine
LABEL maintainer="paul.craig@cds-snc.ca"

COPY . /src

WORKDIR /src

RUN npm install --quiet --production

EXPOSE 3005

ENTRYPOINT [ "npm", "start" ]