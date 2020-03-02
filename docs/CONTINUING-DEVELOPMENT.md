# Continuing development

This document describes how to continue development with this codebase — as well as the app structure and the technologies used — to make it easy to revive this project in the future.

Anyone looking to continue development on this repo, there are basically two scenarios that I can foresee.

1. You want to see the app running and see all the pages so that you can rebuild it [in Angular](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/ADR-EXPRESS-VS-ANGULAR.md) (or something else)
2. You want to continue developing this repo specifically

No shade either way, context and priorities and all that. The first scenario is easier to explain, so I'll do it first.

(Note: if there's anything not covered in here, get in touch with [@pcraig3](https://github.com/pcraig3) or [@charlesmorin](https://github.com/charlesmorin).)

## 1. Boot up the app, see all the pages

All you need to do here is run the app and then find all the URLs.

1. First, get it to boot up.
   - Check out "[Build and run](https://github.com/cds-snc/cra-claim-tax-benefits#build-and-run)" in the README.
   - The app will be running at [http://localhost:3005/](http://localhost:3005/).
2. A full list of URLs can be found in [`/config/routes.config.js`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/config/routes.config.js). They're pretty much in order, so you can see them all sequentially.

All good! Get yerself pizza. :pizza:

## 2. Pick up where we left off

Hooray! Welcome to the hippest app in gov!! To pick up development after some arbitrary length of time, you'll want to see the app run, see the tests pass, and then try and update all the npm dependencies before doing anything else.

1. First, get it to boot up.
   - Check out "[Build and run](https://github.com/cds-snc/cra-claim-tax-benefits#build-and-run)" in the README.
   - The app will be running at [http://localhost:3005/](http://localhost:3005/).
2. Second, see if you can run the tests. If they all pass (they should), then all's good in the hood.
   - Go see "[Run tests](https://github.com/cds-snc/cra-claim-tax-benefits#run-tests)" in the README.
3. Update all the dependencies we're using, as many will be out of date.
   - Follow the [Updating dependencies](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/UPDATING-DEPENDENCES.md) process we have
   - Fingers crossed it all works :fingers-crossed:
4. Heck yeah! Get devving!!!

### Repository structure

| Folder                                           | Purpose                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `/.github/workflows | CI/CD pipelines/workflows` |
| `/api`                                           | Domain model (check out `user.json`)                                                             |
| `/bin`                                           | Runtime script for Node.js                                                                       |
| `/config`                                        | Configurations for the npm modules/middleware used                                               |
| `/cypress`                                       | End to end test fixtures and integrations                                                        |
| `/db`                                            | Conceptually, this is our cloud DB with access codes                                             |
| `/docs`                                          | Technical documentation                                                                          |
| `/locales`                                       | Internationalization (i18n) keys to support both English and French official languages           |
| `/public`                                        | Static resources (images, scripts, stylesheets, favicon): all our styling is in `/public/scss`.  |
| `/routes`                                        | Controllers (routes and business logic) and unit tests                                           |
| `/schemas`                                       | Schemas for form validation for our POST routes                                                  |
| `/scripts`                                       | Azure and HashiCorp Terraform scripts for Infrastructure as Code (IaC)                           |
| `/utils`                                         | Utility functions and [express middleware](https://expressjs.com/en/guide/using-middleware.html) |
| `/views`                                         | [Pug](https://pugjs.org/api/getting-started.html) view files that translate to HMTL at runtime   |
| `/xml_output`                                    | Very early attempt at a NETFILE XML template                                                     |

### Technology Choices

#### Development

- Express.js (Node.js)
- Pug (view technology)
- express-validator (form validation)
- SCSS (styles)
- Jest (unit tests)
- Cypress (end to end testing)
- Morgan (HTTP request logger middleware)
- Helmet (Content Security Policy middleware)

#### Continuous Integration & Delivery

- GitHub Actions
- SonarCloud.io (SonarQube)
- Seekret (find secrets in code)
- Snyk (continuous security analysis)
- Semmle/LGTM (continuous security analysis)

#### Cloud

Microsoft Azure is the Cloud Service Provider (CSP)

- Azure AppService (PaaS offering to deploy the app)
- Azure Container Registry
- Azure KeyVault (Secrets)
- Azure Application Insights (Metrics and logging)

#### Deployment

- Azure AppService
- Docker

#### Other topics

- [Build and run the application as a Docker container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#using-docker)
- Deploy the application manually on Azure:
  - [using Azure Container Registry](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md)
  - [using Docker Hub](https://github.com/cds-snc/cra-claim-tax-benefits/blob/faccd2945ea6dee2a7c165041829d4da28b4f91b/DEPLOY.md)
- [Run a SonarQube analysis](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#using-sonarqube)

If there's anything else you need that's not in here, get in touch with [@pcraig3](https://github.com/pcraig3) or [@charlesmorin](https://github.com/charlesmorin).
