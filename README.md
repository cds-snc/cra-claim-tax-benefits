[La version française suit.](#réclamation-davantages-fiscaux)

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

### Automated tests

All new pull requests have a suite of automated tests run against them.

- [Jest](https://jestjs.io/): Unit tests to verify correct internal logic for components
- [ESLint](https://eslint.org/): JavaScript linter that ensures uniform JS throughout the app
- [Cypress](https://www.cypress.io/): End-to-end behaviour-driven tests that run through desired user flows
  - [cypress-axe](https://github.com/avanslaars/cypress-axe): We run an accessibility scan per page (using [`axe`](https://www.deque.com/axe/)) to check for violations in the markup

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

# Réclamation d’avantages fiscaux

L’application _Réclamation d’avantages fiscaux_ n’est pas autonome et nécessite un niveau élevé d’intégration de la part de l’ARC. Ce produit extrait les données sur l’individu à partir de la base de données de l’ARC, puis les affiche au déclarant. La communication entre le produit et la base de données de l’ARC se fait par l’intermédiaire d’une interface de programmation d’application (API). Cette technologie permet à un système de communiquer avec un autre système.

Une fois que le déclarant s’est authentifié, l’API envoie les données à l’application. Celle-ci demande ensuite au déclarant de confirmer que l’information affichée est exacte. La déclaration de revenus est ensuite produite au moyen de l’API IMPÔTNET, c’est-à-dire la même que celle utilisée par les logiciels payants.

Étant donné que l’ARC utilise des technologies héritées, il existe un degré de risque. Ce risque est atténué par le fait que le produit en ligne est hébergé sur une technologie en nuage, de sorte qu’il est séparé de la base de données. Cette séparation nous a permis de réaliser plusieurs prototypes pour différentes versions, sans mettre en péril les données de l’ARC. Si le produit était devenu un service fonctionnel, nous aurions pu continuer à modifier le service en fonction des commentaires des utilisateurs.

## Table des matières

- [Aperçu technique](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#aperçu-technique)
  - [Utilisation de services tiers](https://crazee-docs.netlify.com/aperçu-technique/#utilisation-de-services-tiers)
  - [Tests automatisés](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#tests-automatisés)
  - [Continuer le développement](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#continuer-le-développement)
- [Construire et exécuter l’application](https://crazee-docs.netlify.com/aperçu-technique/#construire-et-exécuter-lapplication)

## Aperçu technique

L’application Réclamation d’avantages fiscaux (RAF) est une application [express](https://expressjs.com/fr/) côté serveur qui utilise les langages [Pug](https://pugjs.org/api/getting-started.html) pour les gabarits et [SCSS](https://sass-lang.com/) pour les feuilles de styles. L’échafaudage de l’application vient du [générateur d’applications Express](https://expressjs.com/fr/starter/generator.html). Il suppose l’existence d’une API backend (qui reçoit les données de l’utilisateur) et d’une base de données infonuagique (qui stocke les codes d’accès), bien que tous deux soient simulés afin que l’application puisse fonctionner de façon isolée pour le développement.

[Le compte-rendu de la décision d’opter pour Express](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/ADR-EXPRESS-VS-ANGULAR.md) (anglais seulement) est conservé pour la postérité.

Comme il est mentionné dans l’introduction, l’application RAF met en œuvre plusieurs pratiques recommandées pour le développement de services Web modernes.

- L’application représente un parcours utilisateur complet
- Elle prend en exemple les meilleures [pratiques d’accessibilité pour les formulaires Web](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post/)
- Elle a plusieurs fonctions de sécurité, comme des [en-têtes HTTP pour la sécurité](https://helmetjs.github.io/), la [protection CSRF](https://github.com/expressjs/csurf) et la [validation de formulaire](https://express-validator.github.io/docs/)
- Elle est testée de fond en comble, notamment par des tests [cypress](https://www.cypress.io/) bout-en-bout avec des [balayages d’accessibilité intégrés](https://github.com/avanslaars/cypress-axe)
- Elle comprend une pipeline d’intégration et de déploiement continus (CI/CD) compatible avec les [Actions Github](https://github.com/features/actions)
- Elle peut s’exécuter en tant qu’application Node sur un \*nix OS ou comme conteneur [Docker](https://docs.docker.com/install/)
- Elle comprend les [scripts Terraform](https://github.com/cds-snc/cra-claim-tax-benefits/tree/master/scripts) pour les déploiements vers Azure ou AWS

### Utilisation de services tiers

Nous utilisons plusieurs services tiers pour améliorer le déroulement du développement et de la sécurité continue.

- [GitHub](https://github.com/) est un service infonuagique qui stocke notre code source, suit les changements au code et facilite les revues de code.
- [Actions GitHub](https://github.com/features/actions) est un service d’intégration et de déploiement continus (CI/CD) qui nous permet de [tester et déployer notre code](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) directement à partir de GitHub
  - Il y a beaucoup de services CI/CD, mais nous avons choisi Actions GitHub car il est très facile à installer, et il serait facile de s’en départir en raison de sa configuration de base yml
- [Heroku](https://www.heroku.com/home) est une plateforme comme service (PaaS) complètement gérée. Nous utilisons [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) de Heroku pour construire des applications jetables à chaque demande de tirage, ce qui facilite la revue de code.
- [Snyk](https://snyk.io/) est un logiciel comme service qui passe à travers nos dépendances pour voir s’il y a des problèmes. Nous recevons des alertes lorsque la version d’un progiciel a des vulnérabilités connues.
- [LGTM](https://lgtm.com/) est un logiciel comme service qui effectue l’analyse continue de la sécurité. Il fait une analyse à chaque demande de tirage pour trouver les vulnérabilités de sécurité potentielles.

### Tests automatisés

Chaque demande de tirage subit une suite de tests automatisés.

- [Jest](https://jestjs.io/) : Tests unitaires servant à vérifier la logique interne des composants
- [ESLint](https://eslint.org/) : Linter JavaScript qui assure une uniformité du code JavaScript dans toute l’application
- [Cypress](https://www.cypress.io/) : Tests basés sur le comportement qui s’exécutent pour vérifier les étapes des parcours utilisateur
  - [cypress-axe](https://github.com/avanslaars/cypress-axe) : Nous effectuons un balayage de chaque page afin de vérifier les violations d’accessibilité dans le code

### Continuer le développement

[Guide pour continuer le développement du produit](https://crazee-docs.netlify.com/continuer-le-d%C3%A9veloppement/) : Ce guide est là pour vous aider si vous voulez reconstruire le service avec une nouvelle technologie ou si vous voulez développer et déployer le code.

## Construire et exécuter l’application

Veuillez vous référer à la page [README](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md) afin d’obtenir les instructions détaillées pour construire et exécuter l’application.

- [Guide de démarrage](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#getting-started-npm) (anglais seulement)
  - [Construire et exécuter l'application](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#build-and-run) (anglais seulement)
  - [Exécuter les tests](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#run-tests) (anglais seulement)
- [Utilisation de Docker](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#using-docker) (anglais seulement)
- [Déploiement de l’application](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md#ex%C3%A9cuter-un-d%C3%A9ploiement-manuel)
