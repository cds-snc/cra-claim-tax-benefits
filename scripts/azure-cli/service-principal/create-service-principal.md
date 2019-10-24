
This script requires manual interventions. It was checked in to
track the required steps to create a service principal in Azure.
Reference: https://www.terraform.io/docs/providers/azurerm/auth/service_principal_client_secret.html#creating-a-service-principal-using-the-azure-cli

### Authenticating with Azure
`az login`

### Finding subscription
`az account list`

### Set subscription
`az account set --subscription="SUBSCRIPTION_ID"` SUBSCRIPTION_ID can be found in the `id` attribute from previous command

### Create Azure Service Principal
`az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/fdf5725d-ea40-468e-81dd-aa1220910f75/resourceGroups/cdscracollab-innovation-rg"`

