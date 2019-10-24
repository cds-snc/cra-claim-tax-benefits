variable "location" {
  description = "The Azure location where this resource should be created"
  type = "string"
  default = "canada central"
}

variable "resource_group_name" {
  description = "The Azure resource group where this should be created"
  type = "string"
  default = "cdscracollab-innovation-rg"
}

variable "azure_container_registry_name" {
  description = "Name of the container registry"
  type = "string"
}

variable "sku" {
  description = "SKU to use for the container registry"
  type = "string"
  default = "Basic"
}

variable "admin_enabled" {
  description = "Use the registry name as username and admin user access key as password to docker login to the container registry"
  type = "string"
  default = "true"
}

resource "azurerm_container_registry" "main" {
  name                     = "${var.azure_container_registry_name}"
  resource_group_name      = "${var.resource_group_name}"
  location                 = "${var.location}"
  sku                      = "${var.sku}"
  admin_enabled            = "${var.admin_enabled}"
}

# Display Azure Container Registry URL/hostname
output "acr_login_server" {
  value = "https://${azurerm_container_registry.main.login_server}"
}