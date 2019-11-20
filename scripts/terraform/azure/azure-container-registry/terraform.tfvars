location = "Canada Central"

resource_group_name = "cdscracollab-innovation-rg"
azure_container_registry_name = "claimtaxbenefits" 

# All SKUs provide the same programmatic capabilities. Choosing a higher SKU will provide more performance and scale.
# Available choices: Basic, Standard or Premium
# More info: https://azure.microsoft.com/en-us/pricing/details/container-registry/
sku = "Basic" 

# If enabled, you can use the registry name as username and admin user access key as password to docker login to your container registry.
# In our case, we want our CD pipeline to tag, push and deploy the container to production, so this is required.
admin_enabled = "true"