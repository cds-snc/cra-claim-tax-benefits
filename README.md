![](https://github.com/cds-snc/cra-claim-tax-benefits/workflows/Test,%20build,%20deploy/badge.svg)

# Claim tax benefits / Réclamer des avantages fiscaux

This is a demo of a service to make tax filing faster and easier for a preselected group of eligible low-income Canadians. This service was designed and developed by the [Canadian Digital Service (CDS)](https://digital.canada.ca/) in partnership with the [Canada Revenue Agency (CRA)](https://www.canada.ca/en/revenue-agency.html).

Much of the information needed to file a tax return is already known to CRA. At the same time, low-confidence tax filers are very worried about making mistakes when submitting a tax return. The concept behind this demo application is to provide a wizard-like tax filing experience: presenting the tax filer with information that CRA already has about them and asking them to confirm it rather than having them type everything in.

| Demo user 1   | Demo user 2       |
| ------------- | ----------------- |
| Gabrielle Roy | Monique Corriveau |
| `A5G98S4K1`   | `A5G98S4K3`       |
| `540 739 869` | `435 073 143`     |
| `09 09 1977`  | `03 03 1947`      |

[While this repository is no longer actively maintained](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/CONTINUING-DEVELOPMENT.md), the code is open and available for demonstration purposes or reuse. In addition to an end-to-end flow, it is an example of best-practice development for an API-driven, cloud-native frontend application.

## Table of contents

- [Technical overview](#technical-overview)
  - [Use of third-party services](#use-of-third-party-services)
  - [Automated tests](#automated-tests)
  - [Development workflow](#development-workflow)
  - [Continuing development](#continuing-development)
- [Getting started](#getting-started-npm)
  - [Build and run](#build-and-run)
  - [Run tests](#run-tests)
- [Using Docker](#using-docker)
- [Deploying the app](#deploying-the-app)

## Technical overview

The Claim Tax Benefits (CTB) application is a server-side [express](https://expressjs.com/) application using [Pug](https://pugjs.org/api/getting-started.html) templating on the server and schnazzy [SCSS](https://sass-lang.com/) stylesheets. The application scaffolding comes from [the express generator](https://expressjs.com/en/starter/generator.html). It assumes the existence of a backend API (to receive user data) and a cloud database (for storing access codes), although both are stubbed out so the application can run in isolation for development purposes.

[There is a record of the decision to go for Express](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/ADR-EXPRESS-VS-ANGULAR.md), for posterity.

As mentioned in the introduction, the CTB application implements many recommended practices for a modern web service.

- It represents the complete online user journey
- It exemplifies best-practice [web form accessibility](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post/)
- It has various security features, such as [security-minded HTTP headers](https://helmetjs.github.io/), [CSRF protection](https://github.com/expressjs/csurf), and [form validation](https://express-validator.github.io/docs/)
- It is copiously tested, including end-to-end [cypress](https://www.cypress.io/) tests with [integrated accessibility scans](https://github.com/avanslaars/cypress-axe)
- It includes a Continuous Integration and Deployment (CI/CD) pipeline, compatible with [GitHub Actions](https://github.com/features/actions)
- It can run as a node app on a \*nix OS or as a [Docker](https://docs.docker.com/install/) container
- It includes [terraform scripts](https://github.com/cds-snc/cra-claim-tax-benefits/tree/master/scripts) for deploying either to Azure or AWS

### Use of third-party services

We use several third-party services for an improved development workflow and continuous security.

- [GitHub](https://github.com/) is a cloud-based service that stores our source code, tracks code changes and facilitates code reviews
- [GitHub Actions](https://github.com/features/actions) is a Continuous Integration and Deployment (CI/CD) service that allows us to [test and deploy our code](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) right from GitHub
  - CI/CD services abound, but we used GitHub Actions because it was easy to set up, and with its yml-based configuration it would be easy to move away from
- [Heroku](https://www.heroku.com/home) is a fully-managed platform as a service. We use Heroku [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) to build disposable applications per pull request, facilitating code reviews.
- [Snyk](https://snyk.io/) is a software as a service product that scans through our dependencies for packages with known issues. It alerts us when a version of a package we’re using has a known exploit.
- [LGTM](https://lgtm.com/) is a software as a service product for continuous security analysis. It analyzes each pull request for potential security vulnerabilities.
- [SonarQube](https://www.sonarqube.org/) is a software as a service product for code quality analysis. It analyzes each pull request for code smells, potential security holes, or bugs to ensure better coding practice.

### Automated tests

All new pull requests have a suite of automated tests run against them.

- [Jest](https://jestjs.io/): Unit tests to verify correct internal logic for components
- [ESLint](https://eslint.org/): JavaScript linter that ensures uniform JS throughout the app
- [Cypress](https://www.cypress.io/): End-to-end behaviour-driven tests that run through desired user flows
  - [cypress-axe](https://github.com/avanslaars/cypress-axe): We run an accessibility scan per page (using [`axe`](https://www.deque.com/axe/)) to check for violations in the markup
- [SonarQube](https://www.sonarqube.org/) does a quality analysis gate looking for code smells, diminished code coverage, or bugs.

### Development workflow

- [Our agile development workflow](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEVELOPMENT-WORKFLOW.md)
- [Guidance on code reviews](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/CODE-REVIEW-GUIDELINES.md)

### Continuing development

[A walkthrough on how to continue development on this project](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/CONTINUING-DEVELOPMENT.md): whether your aim is to rebuild the service in a new technology or to develop and release this codebase specifically.

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

The application can be run with a local postgres database (otherwise, it falls back on a JSON file).

To start the app in development mode, alongside the postgres db type `docker-compose up`

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

[Cypress](https://www.cypress.io/) is what we use to write our end-to-end tests. It can run in a browser or in headless mode (ie, on the command line) to step through one or more flows. By running our end-to-end tests frequently, we are making sure that new changes to the code don't break existing user journeys.

### Using SonarQube

[SonarQube](https://www.sonarqube.org/) is an open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on more than 20 programming languages. SonarQube is also used to track test coverage percentage and other value-added metrics.

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

However, it’s still a beta service so it might not be 100% reliable. If anything goes wrong, [follow the manual deployment instructions](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md).
