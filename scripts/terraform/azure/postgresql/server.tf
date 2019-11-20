resource "azurerm_postgresql_server" "ctb" {
  name                = "${var.database_server_name}"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group_name}"

  sku {
    name     = "${var.sku_name}"
    capacity = "${var.sku_capacity}"
    tier     = "${var.sku_tier}"
    family   = "${var.sku_family}"
  }

  storage_profile {
    storage_mb            = 5120
    backup_retention_days = 7
    geo_redundant_backup  = "Disabled"
  }

  administrator_login          = "${var.admin_username}"
  administrator_login_password = "${var.admin_password}"
  version                      = "${var.database_version}"
  ssl_enforcement              = "${var.ssl_enforcement}"
}