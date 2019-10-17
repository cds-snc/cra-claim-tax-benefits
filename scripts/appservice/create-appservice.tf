variable "location" {
  description = "The Azure location where all resources in this example should be created"
  type = "string"
  default = "canada central"
}

variable "resource_group_name" {
  description = "The Azure resource group where all resources in this example should be created"
  type = "string"
  default = "cdscracollab-innovation-rg"
}

variable "appservice_plan_id" {
  description = "The Azure AppService plan id to use"
  type = "string"
  default = "alphaPlan"
}

variable "appservice_name" {
  description = "The Azure AppService name to use"
  type = "string"
}

variable "docker_image_name" {
  description = "The Docker image name to use for the application"
  type = "string"
  default = "cdssnc/cra-claim-tax-benefits:latest"
}

# Create Azure Application Insights≈y

resource "azurerm_application_insights" "main" {
  name                = "${var.appservice_name}-appinsights"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group_name}"
  application_type    = "web"
}

# Get Azure Application Insights instrumentation key
output "instrumentation_key" {
  value = "${azurerm_application_insights.main.instrumentation_key}"
  description = "The instrumentation key to be used as an environment in the Azure AppService"
  sensitive = true
}

# Create Azure AppService
resource "azurerm_app_service" "main" {
  name                = "${var.appservice_name}"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group_name}"
  app_service_plan_id = "${var.appservice_plan_id}"

  site_config {
    app_command_line = ""
    linux_fx_version = "DOCKER|${var.docker_image_name}"
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://index.docker.io"
    "WEBSITE_HTTPLOGGING_RETENTION_DAYS"  = "90"
    "WEBSITES_PORT"                       = "3005"
    "APPINSIGHTS_INSTRUMENTATIONKEY"      = "${azurerm_application_insights.main.instrumentation_key}"
  }
}

# Display Azure AppService name
output "app_service_name" {
  value = "${azurerm_app_service.main.name}"
}

# Display Azure AppService URL/hostname
output "app_service_default_hostname" {
  value = "https://${azurerm_app_service.main.default_site_hostname}"
}
