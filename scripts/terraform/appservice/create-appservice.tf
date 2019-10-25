variable "location" {
  description = "The Azure location where this resource should be created"
  type = "string"
  default = "Canada Central"
}

variable "resource_group_name" {
  description = "The Azure resource group where this should be created"
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
  default = "claimtaxbenefits.azurecr.io/cra-claim-tax-benefits:latest"
}

variable "appservice_port" {
  description = "The port number to use for the appservice"
  type = "string"
  default = "3000" # Default port for Express application 
}

variable "appservice_log_retention_days" {
  description = "The number of days to keep the logs"
  type = "string"
  default = "90" # Default value in Azure AppService
}

# Create Azure Application Insights≈y

resource "azurerm_application_insights" "main" {
  name                = "${var.appservice_name}-appinsights"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group_name}"
  application_type    = "web"
}

# Create Azure AppService
resource "azurerm_app_service" "main" {
  name                = "${var.appservice_name}"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group_name}"
  app_service_plan_id = "${var.appservice_plan_id}"
  https_only          = true

  site_config {
    app_command_line = ""
    linux_fx_version = "DOCKER|${var.docker_image_name}"
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://index.docker.io"
    "WEBSITE_HTTPLOGGING_RETENTION_DAYS"  = "${var.appservice_log_retention_days}"
    "WEBSITES_PORT"                       = "${var.appservice_port}"
    "APPINSIGHTS_INSTRUMENTATIONKEY"      = "${azurerm_application_insights.main.instrumentation_key}"
  }
}

# Display Azure AppService URL/hostname
output "app_service_default_hostname" {
  value = "https://${azurerm_app_service.main.default_site_hostname}"
}