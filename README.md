![](https://github.com/cds-snc/cra-claim-tax-benefits/workflows/Test,%20build,%20deploy/badge.svg)

# Claim tax benefits / Réclamer des avantages fiscaux

| en                                                                                                                                                                                                         | fr                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| This is a small frontend to trial user flows for a future CRA service that will help Canadians receive the benefits to which they are entitled.                                                            | Voici une petite interface qui nous sert à tester des parcours utilisateur pour un futur service de l'ARC qui aidera les Canadiens à recevoir les prestations auxquelles ils ont droit.                                      |
| It’s a server-side [express](https://expressjs.com/) application using [Pug](https://pugjs.org/api/getting-started.html) templating on the server and schnazzy [SCSS](https://sass-lang.com/) stylesheets. | Il s'agit d'une application [express](https://expressjs.com/) qui utilise les modèles [Pug](https://pugjs.org/api/getting-started.html) sur le serveur ainsi que des chics feuilles de style [SCSS](https://sass-lang.com/). |

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

### Run with local postgres DB

The application can be run with the local postgres database (it falls back on a JSON file), but if you want to run the db just type `docker-compose up` 

Docker Desktop already has compose included, but just in case, installation instructions for docker-compose can be found [here](https://docs.docker.com/compose/install/)

### Run tests

```bash
# run unit tests
npm test

# run linting
npm run lint

# run end-to-end tests
npm run cypress
npm run cypress:cli # these don't open a browser
```

#### Using Cypress

[Cypress](https://www.cypress.io/) is what we use to write our end-to-end tests. It can run in a browser or in headless mode (ie, on the command line) to step through one or more flows. By running our end-to-end tests frequently, we are making sure sure that new changes to the code don't existing user journies.

### Using SonarQube

[SonarQube](https://www.sonarqube.org/) is an open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on 20+ programming languages. SonarQube is also used to track test coverage percentage and other value-added metrics.

#### Run a SonarQube analysis

SonarQube can be executed in two main ways: when pushing to GitHub remote repository, which will trigger a new GitHub Actions execution. The second way to trigger a SonarQube analysis is to invoke the `sonar-scanner` command locally. Install Sonar Scanner using the following procedure: https://brewinstall.org/Install-sonar-scanner-on-Mac-with-Brew/

Configuration file for SonarQube is named `sonar-project.properties`, and is located at the root of the project.

## Using Docker

### [Install `docker`](https://docs.docker.com/install/)

A docker container allows a developer to package up an application and all of its parts. This means we can build an app in any language, in any stack, and then run it anywhere — whether locally or on a server.

### Build and run as a Docker container

```bash
# build an image locally
docker build -t claimtaxbenefits.azurecr.io/cra-claim-tax-benefits .

# run the container
docker run -it -p 3005:3005 claimtaxbenefits.azurecr.io/cra-claim-tax-benefits
```

The container should be running at [http://localhost:3005/](http://localhost:3005/).

On a Mac, press `Control` + `C` to quit the running docker container.

## Deploying the app

This application is deployed continuously using [Github Actions](https://github.com/features/actions).

However, it’s still a beta service so it might not be 100% reliable. If anything goes wrong, [follow the manual deployment instructions](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md).
