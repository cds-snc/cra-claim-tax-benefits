![](https://github.com/cds-snc/cra-claim-tax-benefits/workflows/Test,%20build,%20deploy/badge.svg)

[La version française suit.](#continuer-le-développement)

# Claim tax benefits / Déclaration de revenus pour un accès aux prestations

This is a demo of a service to make tax filing faster and easier for a preselected group of eligible low-income Canadians. This service was designed and developed by the [Canadian Digital Service (CDS)](https://digital.canada.ca/) in partnership with the [Canada Revenue Agency (CRA)](https://www.canada.ca/en/revenue-agency.html).

CRA already has most of the information that tax-filers include in their returns. At the same time, low-confidence tax filers are very worried about making mistakes when submitting a tax return. Using this information, we aimed to design a service that provides a wizard-like tax filing experience: rather than requiring tax-filers to enter their information, the service presents information that the CRA already has, then asks tax-filers to confirm the information is correct.

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

## ---------------------------------------------------------------------

# Déclaration de revenus pour un accès aux prestations

L’application pour produire une déclaration afin d’obtenir des avantages n’est pas une application autonome et requiert un niveau d’intégration avec l’ARC assez élevé. Les données sur l’individu sont prises dans la base de données de l’ARC pour ensuite lui être fournies qu’il puisse produire ses impôts. La communication entre l’application et la base de données de l’ARC se fait par l’entremise d’un API (application programming interface). Cette technologie permet à un système de communiquer avec un autre.

Lorsque la personne qui produit ses impôts s’authentifie, l’API communique ses données à l’application. L’application demande ensuite à la personne de confirmer que ses informations soient exactes. Le retour d’impôts est ensuite soumis par l’application par l’entremise de l’API NETFILE, le même qui est utilisé par les solutions provenant de l’industrie.

Les risques sont élevés dû au fait que la base de données de l’ARC utilise des technologies désuètes. Ces risques sont atténués par le fait que la solution soit hébergée sur les technologies infonuagiques et séparée de la base de données. Cette séparation nous a permis de tester plusieurs versions de prototypes et ce, sans mettre les données de l’ARC en péril. Si l’application était devenu un service en direct, nous aurions pu continuer à changer le service basé sur la rétroaction des personnes qui l’utilisent.

## Table des matières

- [Aperçu technique](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#aperçu-technique)
  - [L’utilisation de services de tierce partie](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#lutilisation-de-services-de-tierce-partie)
  - [Tests automatisés](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#tests-automatisés)
  - [Continuer le développement](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#continuer-le-développement)
- [Bâtir et exécuter l’application](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#bâtir-et-exécuter-lapplication)

## Aperçu technique

L’application Déclaration de revenus pour un accès aux prestations (DRAP) est une application [express](https://expressjs.com/fr/) du côté serveur qui utilise le langage [Pug](https://pugjs.org/api/getting-started.html) pour les gabarits et [SCSS](https://sass-lang.com/) pour les feuilles de styles. L'échafaudage de l’application vient du [Générateur d’applications Express](https://expressjs.com/fr/starter/generator.html). Il assume l’existence d’un API (backend) pour recevoir les données de l’utilisateur et d’une base de données infonuagique pour y stocker les codes d’accès, tous deux écrasés afin que l’application puisse fonctionner de façon isolée pour le développement.

L’application (DRAP) met en oeuvre plusieurs pratiques recommandées pour le développement d’applications modernes.

- L’application représente le parcours utilisateur au complet
- Elle prend pour exemples les meilleures [pratiques d'accessibilité pour les formulaires internet](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post/)
- Elle a plusieurs fonctions de sécurité comme [security-minded HTTP headers](https://helmetjs.github.io/), [CSRF protection](https://github.com/expressjs/csurf), et [form validation](https://express-validator.github.io/docs/)
- Testé de fond en comble, incluant des tests [cypress](https://www.cypress.io/) bout-à-bout avec des [balayages d’accessibilité intégrés](https://github.com/avanslaars/cypress-axe)
- Inclus une pipeline d’intégration et déploiement continue (CI/CD) compatible avec les [GitHub Actions](https://github.com/features/actions)
- Peut exécuter en tant qu’application Node sur un \*nix OS ou comme conteneur [Docker](https://docs.docker.com/install/)
- Inclue le [scripts Terraform](https://github.com/cds-snc/cra-claim-tax-benefits/tree/master/scripts) pour déployer vers Azure ou AWS

### L’utilisation de services de tierce partie

Nous utilisons plus services de tierce partie pour améliorer les étapes du développement et de la sécurité continue.

- [GitHub](https://github.com/) est un service infonuagique qui stocke notre code source, suit les changements au code et facilite les revues de code.
- [GitHub Actions](https://github.com/features/actions) est un service d’intégration et déploiement continue (CI/CD) qui nous permet de [tester et déployer notre code](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) directement de GitHub
  - Il y a beaucoup de services CI/CD, mais nous avons choisis GitHub Actions car il est très facile à installer et avec sa configuration de base yml il devient facile de s’en départir
- [Heroku](https://www.heroku.com/home) est une plateforme de service complètement gérée. Nous utilisons Heroku [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) pour bâtir des applications jetables à chaque demande de tirage, ce qui facilite la revue de code.
- [Snyk](https://snyk.io/) est un logiciel de service qui passe à travers nos dépendances pour voir s’il y a des problèmes. Nous recevons des alertes lorsque la version d’un progiciel a des vulnérabilités connues.
- [LGTM](https://lgtm.com/) est un logiciel de service qui effectue l’analyse de sécurité continuelle. Il fait une analyse à chaque demande de tirage pour des vulnérabilités potentielles de sécurité.
- [SonarQube](https://www.sonarqube.org/) est un logiciel de service pour l’analyse de qualité du code. Il analyse chaque demande de tirage pour identifier des anomalie, des failles de sécurité ou des bogues afin d’assurer un bonne pratiques de codage.

### Tests automatisés

Chaques demandes de tirage subit une suite de tests automatisés.

- [Jest](https://jestjs.io/) : Tests unitaires pour vérifier la logique interne des composants
- [ESLint](https://eslint.org/) : Linter JavaScript qui assure une uniformité du code JavaScript au travers de l’application
- [Cypress](https://www.cypress.io/) : Tests basé sur le comportement qui s’exécutent pour vérifier les étapes des parcours d’utilisateur
  - [cypress-axe](https://github.com/avanslaars/cypress-axe) : Nous effectuons un balayage de chaque page afin de vérifier les violations d’accessibilité dans le code
- [SonarQube](https://www.sonarqube.org/) : Il analyse chaque demande de tirage pour identifier des anomalie, des failles de sécurité ou des bogues afin d’assurer un bonne pratiques de codage.

### Continuer le développement

[Guide pour continuer le développement du produit](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/CONTINUING-DEVELOPMENT.md#continuer-le-d%C3%A9veloppement) : Ce guide pour vous aider si vous désirez re-bâtir le service avec un nouvelle technologie ou développer et déployer le code.

## Bâtir et exécuter l’application

Veuillez vous référer à la page [README](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md) afin d’obtenir les instructions détaillées pour bâtir et exécuter l’application.

- [Pour débuter](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#getting-started-npm) (anglais seulement)
- - [Bâtir et exécuter](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#build-and-run) (anglais seulement)
  - [Exécuter les tests](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#run-tests) (anglais seulement)
- [Utiliser Docker](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#using-docker) (anglais seulement)

**[Deployer l’application](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md#ex%C3%A9cuter-un-d%C3%A9ploiement-manuel)**
