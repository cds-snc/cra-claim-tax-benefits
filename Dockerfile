FROM node:lts-alpine
LABEL maintainer="paul.craig@cds-snc.ca"

ARG GITHUB_SHA_ARG
ENV GITHUB_SHA=$GITHUB_SHA_ARG

ARG CTBS_SERVICE_URL_ARG
ENV CTBS_SERVICE_URL=$CTBS_SERVICE_URL_ARG

COPY . /src

WORKDIR /src

RUN npm install --quiet --production

EXPOSE 3005

ENTRYPOINT [ "npm", "start" ]