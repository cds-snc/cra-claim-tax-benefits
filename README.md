# Claim tax benefits

This is a small frontend to trial user flows for a future CRA service that will help Canadians receive the benefits to which they are entitled.

It’s a server-side [express](https://expressjs.com/) application using [Pug](https://pugjs.org/api/getting-started.html) templating on the server and a dash of [Pure CSS](https://purecss.io/).

## Getting started (npm)

### [Install `npm`](https://www.npmjs.com/get-npm)

`npm` is a javascript package manager. It downloads project dependencies and runs node applications.

`npm` will complain if you’re not on node version `v10.15.0` or higher when you boot up the app.

### .env file (optional)

It’s possible to bootstrap this application with no `/.env` file — but if you want one, go nuts.

<details>
  <summary>Example `.env` file</summary>

```
# environment
NODE_ENV=development
PORT=4300

# winston
winston_file_handleExecptions=true
winston_file_json=false
winston_file_maxsize=5242880
winston_file_maxFiles=5
winston_file_colorize=false
winston_console_level=debug
winston_console_handleExceptions=true
winston_console_json=false
winston_console_colorize=true
```

</details>

### Build and run

Guess what? There is **no build step**. Just install the dependencies and run it.

Pretty slick. 😎

```bash
# install dependencies
npm install

# run application in 'dev' mode
npm run dev

# run application in 'prod' mode
npm start
```

The app should be running at [http://localhost:3005/](http://localhost:3005/). With `npm run dev`, saving a file will restart the server automatically.

On a Mac, press `Control` + `C` to quit the running application.

### Run tests

```bash
# run unit tests
npm test

# run linting
npm run lint
```

## Using Docker

### [Install `docker`](https://docs.docker.com/install/)

A docker container allows a developer to package up an application and all of its parts. This means we can build an app in any language, in any stack, and then run it anywhere — whether locally or on a server.

### Build and run as a Docker container

```bash
# build an image locally
docker build -t cdssnc/cra-claim-tax-benefits .

# run the container
docker run -it -p 3005:3005 cdssnc/cra-claim-tax-benefits
```

The container should be running at [http://localhost:3005/](http://localhost:3005/).

On a Mac, press `Control` + `C` to quit the running docker container.

## Deploying the app

This application is deployed continuously using [Github Actions](https://github.com/features/actions).

However, it’s still a beta service so it might not be 100% reliable. If anything goes wrong, [follow the manual deployment instructions](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md).
