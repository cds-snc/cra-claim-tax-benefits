# Running a manual deployment

Our app is pretty simple by design and we are keeping it that way as long as is justifiable. Accordingly, our deployment pipeline is pretty simple.

To deploy the app, you need to update the running container on our Azure App Service instance. (We’re using [Web App for Containers](https://azure.microsoft.com/en-ca/services/app-service/containers/): check out [the Docker Quickstart](https://docs.microsoft.com/en-us/azure/app-service/containers/quickstart-docker-go) if you want to get familiar).

Before we can update our container on Azure, we first need to upload a container somewhere. By default, App Service looks for containers on [Docker Hub](https://hub.docker.com/), so that’s where we upload them.

## Prerequisites to manually deploy

Before you can update the live app, you’ll need to be set up on Docker Hub and CRA’s Azure portal. Once you have accounts on both, you can deploy at will! (But probably you shouldn’t.)

### Get access to CDS’ Docker Hub

You’ll need access to CDS’ Docker Hub to upload any container you build locally. If you haven’t signed up yet, get in touch with Dave Samojlenko or Sean Boots. If they can’t get you access, they’ll know who can.

### Get access to CRA’s Azure portal

You’ll need access to CRA’s Azure instance to update the container running at [https://claim-tax-benefits.azurewebsites.net/](https://claim-tax-benefits.azurewebsites.net/).

If you don’t have access, ask Paul Craig.

## Steps to manually deploy

These are the steps from the point that you have a local version of the app on your laptop that you want to deploy.

The steps are:

1. [build a container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#build-a-container)
2. [tag your container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#tag-your-container)
3. [upload your container](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#upload-your-container)
4. [update Azure App Service](https://github.com/cds-snc/cra-claim-tax-benefits/blob/master/DEPLOY.md#update-azure-app-service)

Our [`main.workflow`](https://raw.githubusercontent.com/cds-snc/cra-claim-tax-benefits/master/.github/main.workflow) file goes through the deployment steps, so you can reverse engineer our deployment from that file, but let’s go through each one in more detail.

### Build a container

When you have a working version of the code on your laptop that you would like to deploy, you have to package it up as a container.

Make sure you have the [docker command line interface](https://docs.docker.com/engine/reference/commandline/cli/) installed.

First, run `docker build` and pass in an optional `GITHUB_SHA_ARG`.

```
docker build -t base --build-arg GITHUB_SHA_ARG=codename_cobra .
```

#### Optional env var

If a `GITHUB_SHA_ARG` is passed to the container when building, it will show up as a `<meta>` tag in the `<head>` of the HTML on every page. This makes it easy to verify the currently-running version of the app by inspecting the HTML.

I would highly recommend passing a variable in – it makes it dead easy to know when your new version is running in prod.

### Tag your container

Once built, tag your container before uploading it. The Docker Hub repo we’re uploading to is `cdssnc/cra-claim-tax-benefits`, so you have to start the tag with that string. Tag it whatever you want — preferrably pick a unique tag, but it doesn’t really matter. Our automated deploys tag the containers with the current git SHA, but you’ll have to type it in a few times, so it’s better to pick something more memorable.

If you passed in a `GITHUB_SHA_ARG`, you should probably tag the container with the same string just to make it easy.

```
docker tag base cdssnc/cra-claim-tax-benefits:codename_cobra
```

#### Run your container locally

While not strictly necessary, running your container locally before uploading is recommended so that you can make sure the container you just built works the way you expect.

To run locally, use the `docker run` command.

```
docker run -it -p 3005:3005 cdssnc/cra-claim-tax-benefits:codename_cobra
```

Kill it with `ctrl+c` like you would with npm.

### Upload your container

Once you have built, tagged, (and hopefully booted up) your container, it’s time to upload it to Docker Hub.

```
docker push cdssnc/cra-claim-tax-benefits:codename_cobra
```

Our container repository is [cdssnc/cra-claim-tax-benefits](https://cloud.docker.com/u/cdssnc/repository/docker/cdssnc/cra-claim-tax-benefits), so that’s where you’ll find your newly-uploaded container.

### Update Azure App Service

You can update the app on Azure either from your terminal using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) tool, or by logging into the online portal and updating it in the Azure GUI.

### Update Azure App Service through the CLI

Again, the command to update our app is the last step in the [`main.workflow`](https://raw.githubusercontent.com/cds-snc/cra-claim-tax-benefits/master/.github/main.workflow) file, so if you are logged-in with Azure CLI, you should be able to update it with one line.

```
az webapp config container set --resource-group cdscracollab-innovation-rg --name claim-tax-benefits --docker-custom-image-name cdssnc/cra-claim-tax-benefits:codename_cobra
```

It’ll spend about a minute thinking about it and then return

- a big fat JSON response if everything worked out
- an error message if something is wrong

Usually takes about 2-4 minutes for the live app to switch over. If you built the container with a `GITHUB_SHA_ARG`, you can check the page `<head>` to see the currently running version. If you didn’t — well, you should have.

### Update Azure App Service through the online portal

You can also update the app by using the user interface. For a one-off update, this is probably easier.

1. Visit [https://portal.azure.com/](https://portal.azure.com/)
2. In the lefthand menu, click `App Services`
3. Once you see the App Services table, click `claim-tax-benefits`
4. Under the `Settings` heading, click `Container settings`
5. Locate the `Image and optional tag (eg 'image:tag')`. You should see a text field with the currently-running image (eg, `cdssnc/cra-claim-tax-benefits:{tag_name}`)
6. Update the tag name to your newly-uploaded tag (eg, `cdssnc/cra-claim-tax-benefits:codename_cobra`)
7. Press the `Save` button
8. Wait for it to say `Settings updated successfully`

Usually takes about 2-4 minutes for the live app to switch over. If you built the container with a `GITHUB_SHA_ARG`, you can check the page `<head>` to see the currently running version. If you didn’t — well, you should have.

### Creating a new Azure App Service for testing purposes

In case you don't want to override the live version of the app, you can spin a new instance of App Service for testing purposes by using the following command:

`az webapp create --resource-group cdscracollab-innovation-rg --plan alphaPlan --name claim-tax-benefits-{tag_name} --deployment-container-image-name cdssnc/cra-claim-tax-benefits:{tag_name}`

You can then find the URL in the JSON response or in the Azure portal. URL should nornmally be `https://claim-tax-benefits-{tag_name}.azurewebsites.net`

When finished testing, you can delete the Azure App Service webapp using the following command:

`az webapp delete --resource-group cracdscollaborationrg --name claim-tax-benefits-{tag_name}`

### All done!

You did it! 🍕🍻🎉

Congratulations, you are now a unicorn!

