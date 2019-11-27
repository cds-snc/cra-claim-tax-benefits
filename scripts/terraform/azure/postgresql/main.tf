
# Generates a random password for the server admin account
resource "random_password" "admin" {
  length  = 16
  special = false
}

# Creates a new PostgreSQL server
resource "azurerm_postgresql_server" "main" {
  lifecycle {
    prevent_destroy = true
  }

  name                = "${var.server_name}"
  location            = "${var.location}"
  resource_group_name = "${var.resource_group_name}"
  tags                = "${var.tags}"

  sku {
    name     = "${var.sku_name}"
    capacity = "${var.capacity}"
    tier     = "GeneralPurpose"
    family   = "Gen5"
  }

  storage_profile {
    auto_grow             = "${var.auto_grow}"
    storage_mb            = "${var.storage_mb}"
    backup_retention_days = "${var.retention_days}"
    geo_redundant_backup  = "${var.backup}"
  }

  administrator_login          = "${var.admin_username}"
  administrator_login_password = "${random_password.admin.result}"
  version                      = "${var.pg_version}"
  ssl_enforcement              = "Enabled"

  depends_on = [
    "${random_password.admin}"
  ]
}

# Create a database within the server
resource "azurerm_postgresql_database" "main" {
  name                = "${var.database_name}"
  resource_group_name = "${var.resource_group_name}"
  server_name         = "${azurerm_postgresql_server.main.name}"
  charset             = "UTF8"
  collation           = "English_United States.1252"
  depends_on = [
    "${azurerm_postgresql_server.main}"
  ]
}
