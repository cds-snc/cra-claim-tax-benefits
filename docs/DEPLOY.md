[La version française suit.](#---------------------------------------------------------------------)

# Running a manual deployment
Our app is pretty simple by design and we are keeping it that way as long as is justifiable. Accordingly, our deployment pipeline is pretty simple.

To deploy the app, you need to update the running container on our Azure App Service instance. (We’re using [Web App for Containers](https://azure.microsoft.com/en-ca/services/app-service/containers/): check out [the Docker Quickstart](https://docs.microsoft.com/en-us/azure/app-service/containers/quickstart-docker-go) if you want to get familiar).

Before we can update our container on Azure, we first need to upload a container somewhere. By default, App Service looks for containers on [Docker Hub](https://hub.docker.com/), but in our case, our Docker image is stored in [Azure Container Registry](https://portal.azure.com/#@122gc.onmicrosoft.com/resource/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg/providers/Microsoft.ContainerRegistry/registries/claimtaxbenefits/repository).

## Prerequisites to manually deploy
Before you can update the live app, you’ll need to be set up onCRA’s Azure portal and Azure Container Registry (ACR). Once you have accounts in Azure and access to ACR, you can deploy at will! (But probably you shouldn’t.)

### Get access to CDS’ Azure Container Registry (ACR)
You’ll need access to CDS’ Azure Container Registry (ACR) to upload any container you build locally. If you haven’t signed up yet, get in touch with Paul Craig.

### Get access to CRA’s Azure portal
You’ll need access to CRA’s Azure instance to update the container running at [https://claim-tax-benefits.azurewebsites.net/](https://claim-tax-benefits.azurewebsites.net/).

If you don’t have access — again, ask Paul Craig.

## Steps to manually deploy
These are the steps from the point that you have a local version of the app on your laptop that you want to deploy.

The steps are:

1. [build a container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#build-a-container)
2. [tag your container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#tag-your-container)
3. [upload your container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#upload-your-container)
4. [update Azure App Service](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#update-azure-app-service)

Our [`testBuildDeploy.yml`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) file goes through the deployment steps, so you can reverse engineer our deployment from that file, but let’s go through each one in more detail.

### Build a container
When you have a working version of the code on your laptop that you would like to deploy, you have to package it up as a container.

Make sure you have the [docker command line interface](https://docs.docker.com/engine/reference/commandline/cli/) installed.

First, run `docker build` and pass in an optional `GITHUB_SHA_ARG`.

```
docker build -t base --build-arg GITHUB_SHA_ARG=<desired tag name> .
```

#### Optional env var
If a `GITHUB_SHA_ARG` is passed to the container when building, it will show up as a `<meta>` tag in the `<head>` of the HTML on every page. This makes it easy to verify the currently-running version of the app by inspecting the HTML.

I would highly recommend passing a variable in – it makes it dead easy to know when your new version is running in prod.

### Tag your container
Once built, tag your container before uploading it. The Azure Container Registry repo we’re uploading to is [`claimtaxbenefits.azurecr.io/cra-claim-tax-benefits`](https://portal.azure.com/#@122gc.onmicrosoft.com/resource/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg/providers/Microsoft.ContainerRegistry/registries/claimtaxbenefits/repository), so you have to start the tag with that string. Tag it whatever you want — preferably pick a unique tag, but it doesn’t really matter. Our automated deploys tag the containers with the current git SHA, but you’ll have to type it in a few times, so it’s better to pick something more memorable.

[If you passed in a `GITHUB_SHA_ARG`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#optional-env-var), you should probably tag the container with the same string.

```
docker tag base claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<desired tag name>
```

#### Run your container locally
While not strictly necessary, running your container locally before uploading is a good sense-check to make sure the container you just built works the way you expect.

To run locally, use the `docker run` command.

```
docker run -it -p 3005:3005 claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<desired tag name>
```

Kill it with `ctrl+c` like you would with npm.

You can also run it in the background like so:

```
docker run -p 3005:3005 claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<desired tag name>
```

### Upload your container
Once you have built, tagged, (and hopefully booted up) your container, it’s time to upload it to Azure Container Registry (ACR).

```
docker push claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<desired tag name>
```

Our container repository is [claimtaxbenefits.azurecr.io/cra-claim-tax-benefits](https://portal.azure.com/#@122gc.onmicrosoft.com/resource/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg/providers/Microsoft.ContainerRegistry/registries/claimtaxbenefits/repository), so that’s where you’ll find your newly-uploaded container.

### Update Azure App Service

You can update the app on Azure either from your terminal using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) tool, or by logging into the online portal and updating it in the Azure GUI.

### Update Azure App Service through the CLI

Again, the command to update our app is the last step in the [`testBuildDeploy.yml`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) file, so if you are logged-in with Azure CLI, you should be able to update it with one line.

```
az webapp config container set --resource-group cdscracollab-innovation-rg --name claim-tax-benefits --docker-custom-image-name claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<desired tag name>
```

It’ll spend about a minute thinking about it and then return

- a big fat JSON response if everything worked out
- an error message if something is wrong

Usually takes about 2-4 minutes for the live app to switch over. If you built the container with a `GITHUB_SHA_ARG`, you can check the page `<head>` to see the currently running version. If you didn’t — well, you should have.

### Update Azure App Service through the online portal

You can also update the app by using the user interface. For a one-off update, this is probably easier.

1. Visit [https://portal.azure.com/](https://portal.azure.com/)
2. In the lefthand menu, click `App Services`
3. Once you see the App Services table, click `claim-tax-benefits`
4. Under the `Settings` heading, click `Container settings`
5. Locate the `Image and optional tag (eg 'image:tag')`. You should see a text field with the currently-running image (eg, `claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:{tag_name}`)
6. Update the tag name to your newly-uploaded tag (eg, `claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<desired tag name>`)
7. Press the `Save` button
8. Wait for it to say `Settings updated successfully`

Usually takes about 2-4 minutes for the live app to switch over. If you built the container with a `GITHUB_SHA_ARG`, you can check the page `<head>` to see the currently running version. If you didn’t — well, you should have.

### Creating a new Azure App Service for testing purposes

In case you don't want to override the live version of the app, you can spin a new instance of App Service for testing purposes by using the following command:

`az webapp create --resource-group cdscracollab-innovation-rg --plan alphaPlan --name claim-tax-benefits-{tag_name} --deployment-container-image-name claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:{tag_name}`

You can then find the URL in the JSON response or in the Azure portal. URL should normally be `https://claim-tax-benefits-{tag_name}.azurewebsites.net`

When finished testing, you can delete the Azure App Service webapp using the following command:

`az webapp delete --resource-group cdscracollab-innovation-rg --name claim-tax-benefits-{tag_name}`

### All done!

You did it! 🍕🍻🎉

Congratulations, you are now a unicorn! :unicorn:

## ---------------------------------------------------------------------

# Exécuter un déploiement manuel
Notre application est relativement simple et nous nous efforçons de la conserver simple. Notre processus de déploiement l'est tout autant.

Pour déployer l'application, vous devez mettre à jour le conteneur dans Azure App Service. (Nous utilisons [Web App for Containers](https://azure.microsoft.com/en-ca/services/app-service/containers/): voir [the Docker Quickstart](https://docs.microsoft.com/en-us/azure/app-service/containers/quickstart-docker-go) si vous voulez vous familiariser avec cet outil).

Avant de pouvoir mettre à jour le conteneur dans Azure, nous devons envoyer notre image quelque part. Par défault, App Service puise les images Docker Hub](https://hub.docker.com/), mais dans notre cas, nos images sont entreposées dans [Azure Container Registry](https://portal.azure.com/#@122gc.onmicrosoft.com/resource/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg/providers/Microsoft.ContainerRegistry/registries/claimtaxbenefits/repository).

## Prérequis pour déployer manuellement
Avant de pouvoir modifier l'application de production, vous devez avoir accès au Azure portal et à Azure Container Registry (ACR). Une fois que vous avez accès, vous pouvez déployer (vous ne devriez peut-être pas.).

Si vous êtes incertain ou incapable d'y accéder, demandez à Paul Craig ou Charles Morin.

## Étapes pour déployer manuellement
Ces étapes assument que vous avez une version fonctionne sur votre machine, dans un état prêt à déployer.

Les étapes sont : 

1. [construire l'image](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#build-a-container)
2. [émettre un tag pour la nouvelle image](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#tag-your-container)
3. [téléverser l'image](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#upload-your-container)
4. [mettre à jour Azure App Service](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#update-azure-app-service)

Notre fichier [`testBuildDeploy.yml`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml) effectue un déploiement, donc vous pouvez faire de la rétro-ingénierie à partir de ce fichier. Allons davantage dans les détails.

### Construire une image Docker
Lorsque vous avez une version fonctionnelle du code sur votre machine, et que vous aimeriez la déployer, vous devez l'empaqueter comme une image Docker pour qu'elle puisse rouler dans un conteneur.

Assurez-vous d'avoir Docker [docker command line interface](https://docs.docker.com/engine/reference/commandline/cli/) installé sur votre machine.

Premièrement, exécutez `docker build` et passez un argument optionnel `GITHUB_SHA_ARG`.

```
docker build -t base --build-arg GITHUB_SHA_ARG=<nom tag désiré> .
```

#### Variable d'environnement optionnelle
Si un argument `GITHUB_SHA_ARG` est passé à Docker pendant la construction, cela permettra de mettre le numéro hashage de Git dans une balise `<meta>` dans le rendu HTML de chaque page. Ceci permet de faciliter le diagnostic en cas de problême.

### Créer un tag sur l'image
Une fois construite, créez un tag avant de téléverser l'image. Le *repository* dans Azure Container Registry est [`claimtaxbenefits.azurecr.io/cra-claim-tax-benefits`](https://portal.azure.com/#@122gc.onmicrosoft.com/resource/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg/providers/Microsoft.ContainerRegistry/registries/claimtaxbenefits/repository), donc vous devez ajouter cette chaine de caractères avant le nom du tag. Le nom du tag est à votre discrétion — préférablement un nom unique et représentatif. Nos déploiements automatisés font cette même recette. Par contre, lors d'un déploiement manuel, vous allez devez réécrire ce tag quelques fois, alors il vaut utilser un nom facile à retenir.

[Si vous avez passé un `GITHUB_SHA_ARG`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#optional-env-var), vous devriez probablement utiliser la même chose pour le nom du tag.

```
docker tag base claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<nom tag désiré>
```

#### Exécutez le conteneur localement
Quoique non absolument nécessaire, rouler le conteneur sur votre machine va vous permettre de faire un test rapide et vous assurez que ce que vous avez construit représente vraiment ce que vous vous attendez de voir.

Pour rouler le conteneur localement, utiliser la commande `docker run`.

```
docker run -it -p 3005:3005 claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<nom tag désiré>
```

Terminez l'exécution en faisant `ctrl+c` comme dans `npm`.

Vous pouvez également le rouler en arrière-plan comme suit:

```
docker run -p 3005:3005 claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<nom tag désiré>
```

### Téléversez votre image

Une fois l'image construite, identifiée via un tag, (et idéalement déployée sur votre machine), c'est le temps de la téléverser dans Azure Container Registry (ACR).

```
docker push claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<nom tag désiré>
```

Notre *repository* est [claimtaxbenefits.azurecr.io/cra-claim-tax-benefits](https://portal.azure.com/#@122gc.onmicrosoft.com/resource/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg/providers/Microsoft.ContainerRegistry/registries/claimtaxbenefits/repository), donc c'est à cet endroit que vos nouvelles images seront déposées.

### Mettre à jour Azure App Service

Vous pouvez mettre à jour l'application via [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest), ou via l'interface Web du Azure Portal.

### Via Azure CLI

Encore une fois, cette commande fait partie de notre *pipeline* dans le fichier [`testBuildDeploy.yml`](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/.github/workflows/testBuildDeploy.yml), donc si vous êtes connecté via Azure CLI, vous devriez pouvoir mettre à jour l'application via une seule ligne de commande.

```
az webapp config container set --resource-group cdscracollab-innovation-rg --name claim-tax-benefits --docker-custom-image-name claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<nom tag désiré>
```

Cela prendra environ une minute, pour ensuite retourner

- une réponse JSON en cas de succès
- un message d'erreur en cas d'échec

Cela prend environ 2-4 minutes pour que l'application soit entièrement changée. Vous pouvez voir quel Git commit a été déployé dans la portion `<head>` du code HTML.

### Via le Azure Portal

Les étapes sont : 

1. Visitez [https://portal.azure.com/](https://portal.azure.com/)
2. Dans le menu de gauche, cliquez sur `App Services`. Si vous ne le trouvez pas, vous pouvez également faire une recherche sur `claim-tax-benefits`.
3. Cliquez sur `claim-tax-benefits` dans le tableau.
4. Sous `Settings`, cliquez sur `Container settings`
5. Identifiez `Image and optional tag (eg 'image:tag')`. Vous devriez voir un champ de saisie avec le nom de l'image actuellement déployée (ex : `claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:{nom_du_tag_actuel}`)
6. Mettez à jour le nom du tag avec le nouveau nom (ex : `claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:<nom_du_nouveau_tag>`)
7. Cliquez sur le bouton `Save`
8. Attendez de voir le message `Settings updated successfully`

Cela prend environ 2-4 minutes pour que l'application soit entièrement changée. Vous pouvez voir quel Git commit a été déployé dans la portion `<head>` du code HTML.

### Créer un déploiement pour fins de tests

Si par exemple vous aimeriez tester quelque chose sans nécessairement écraser la version de production, vous pouvez créer un nouveau App Service temporaire via la commande suivante : 

`az webapp create --resource-group cdscracollab-innovation-rg --plan alphaPlan --name claim-tax-benefits-{nom_du_tag} --deployment-container-image-name claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:{nom_du_tag}`

Vous allez donc recevoir l'URL de votre App Service dans la réponse JSON suivant l'exécution de la commande. L'URL devrait normalement être `https://claim-tax-benefits-{nom_du_tag}.azurewebsites.net`

Lorsque vous avez terminé de tester, vous pouvez supprimer le Azure App Service webapp via la commande : 

`az webapp delete --resource-group cdscracollab-innovation-rg --name claim-tax-benefits-{nom_du_tag}`

### C'est terminé!

Vous avez réussi! 🍕🍻🎉
Félicitations, vous êtes maintenant une licorne! :unicorn:
