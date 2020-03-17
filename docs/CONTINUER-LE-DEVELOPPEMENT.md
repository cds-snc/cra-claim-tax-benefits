# Continuing development

Ce document décrit comment poursuivre le développement avec cette base de code source, en plus de la structure et des technologies utilisées, pour faciliter la remise en vie de ce projet dans le futur.

Il y a principalement deux scénarios envisageabls pour continuer les travaux sur ce *repository*.

1. Vous voulez déployer l'application et voir l'entièreté de son contenu, pour que vous puissiez la réécrire dans une autre technologie. 
2. Vous voulez continuer le développement.

En faisant abstraction du contexte et des priorités, le premier scénario est le plus facile à expliquer, alors nous débuterons avec celui-ci. 

(Note: si des détails manquent dans ce document, contactez [@pcraig3](https://github.com/pcraig3) ou [@charlesmorin](https://github.com/charlesmorin).)

## 1. Déployez l'application, et voyez toutes les pages.

All you need to do here is run the app and then find all the URLs.
Tout ce dont vous devez faire est de déployer l'application et trouver toutes les adresses (URLs).

1. Premièrement, déployez l'application.
   - Consultez la page "[Construire et déployer](https://github.com/cds-snc/cra-claim-tax-benefits#build-and-run)" dans le `README`.
   - L'application sera disponible à l'adresse [http://localhost:3005/](http://localhost:3005/).
2. Une liste complète des adresses est disponible dans le fichier [`/config/routes.config.js`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/config/routes.config.js). L'ordre des adresses correspond à l'ordre d'exécution logique dans l'application.

Tout est bon! Allez vous chercher de la pizza. :pizza:

## 2. Reprenons là où nous nous sommes arrêtés.

Houra! Bienvenue dans l'application la plus branchée du Gouvernement!! Pour poursuivre le développement, vous voulez vous assurer que l'application tourne rondement et que les tests passent. Ensuite, vous devez obligatoirement mettre à jour les dépendances pour demeurer le plus sécuritaire possible.

1. Premièrement, déployez l'application.
   - Consultez la page "[Construire et déployer](https://github.com/cds-snc/cra-claim-tax-benefits#build-and-run)" dans le `README`.
   - L'application sera disponible à l'adresse [http://localhost:3005/](http://localhost:3005/).
2. Deuxièmement, exécutez les tests. Si les résultats sont bons, cela veut dire que l'application est en bon état. 
   - Voir "[Exécuter les tests](https://github.com/cds-snc/cra-claim-tax-benefits#run-tests)" dans le `README`.
3. Mettez à jour toutes les dépendances de l'application puisqu'elles ne seront définitivement plus à jour.
   - Consultez le [processus de mise à jour des dépendances](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/UPDATING-DEPENDENCES.md) 
   - Croisez-vous les doigts et espérez que ça fonctionne :fingers-crossed:
4. Super! Démarrez le développement!!

### Structure du *repository*

| Répertoire                                           | Usage                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `/.github/workflows`                      | Pipelines d'intégration et livraison continue 
| `/api`                                           | Modèle (voir `user.json`)                                                             |
| `/bin`                                           | Script d'exécution pour Node.js                                                                      |
| `/config`                                        | Configurations des modules / middleware npm utilisés                                             |
| `/cypress`                                       | Tests et intégrations de bout en bout                                                        |
| `/db`                                            | Conceptuellement, il s'agit de notre base de données cloud avec des codes d'accès                                           |
| `/docs`                                          | Documentation technique                                                                         |
| `/locales`                                       | Fichiers de traductions pour les langues officielles (français et anglais)           |
| `/public`                                        | Ressources statiques (images, scripts, feuilles de styles, icône de favori): tous les styles sont sous `/public/scss`.  |
| `/routes`                                        | Controlleurs (routes and logique métier) et tests unitaires                                           |
| `/schemas`                                       | Schémas pour la validation des soumissons de formulaires (`HTTP POST`)                                                 |
| `/scripts`                                       | Scripts Azure et HashiCorp Terraform scripts pour  *Infrastructure as Code (IaC)*                           |
| `/utils`                                         | Fonctions utilitaires et [middleware express](https://expressjs.com/en/guide/using-middleware.html) |
| `/views`                                         | Fichiers de vue [Pug](https://pugjs.org/api/getting-started.html) qui se transpose en HMTL à l'exécution   |
| `/xml_output`                                    | Tentative très précoce d'un modèle XML IMPÔTNET                                           |

### Choix technologiques

#### Développement

- Express.js (Node.js)
- Pug (technologie de vue)
- express-validator (validation des formulaires)
- SCSS (styles)
- Jest (tests unitaires)
- Cypress (tests de bout en bout)
- Morgan (*logger* middleware pour les requêtes HTTP)
- Helmet (middleware pour le *Content Security Policy*)

#### Intégration et livraison continue 

- GitHub Actions
- SonarCloud.io (SonarQube)
- Seekret (trouver des données sensibles dans le code source)
- Snyk (analyse continue de sécurité)
- Semmle/LGTM (analyse continue de sécurité)

#### Cloud

Microsoft Azure est le Fournisseur de services Cloud

- Azure AppService (Offre PaaS pour déployer l'application)
- Azure Container Registry (Entrepôt pour images Docker)
- Azure KeyVault (Entrepôt pour données sensibles)
- Azure Application Insights (Métriques and journalisation)

#### Déploiement

- Azure AppService
- Docker

#### Autres sujets

- [Builder et déployer l'application dans un conteneur Docker](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#using-docker)
- Déployer l'application manuellement dans Azure:
  - [à travers Azure Container Registry](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/docs/DEPLOY.md)
  - [à travers Docker Hub](https://github.com/cds-snc/cra-claim-tax-benefits/blob/faccd2945ea6dee2a7c165041829d4da28b4f91b/DEPLOY.md)
- [Exécuter une analyse SonarQube](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/README.md#using-sonarqube)

S'il y a autre chose dont vous avez besoin qui ne fait pas partie de cette documentation, contactez [@pcraig3](https://github.com/pcraig3) ou [@charlesmorin](https://github.com/charlesmorin).
