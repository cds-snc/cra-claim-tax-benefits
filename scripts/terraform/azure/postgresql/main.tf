resource "random_password" "password" {
  length = 16
  special = false
}

resource "azurerm_postgresql_server" "postgres" {
  lifecycle {
    prevent_destroy = true
  }

  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags

  sku {
    name     = var.sku_name
    capacity = var.capacity
    tier     = "GeneralPurpose"
    family   = "Gen5"
  }

  storage_profile {
    auto_grow             = var.auto_grow
    storage_mb            = var.storage_mb
    backup_retention_days = var.retention_days
    geo_redundant_backup  = var.backup
  }

  administrator_login          = var.username
  administrator_login_password = random_password.password.result
  version                      = var.pg_version
  ssl_enforcement              = "Enabled"

  depends_on = [
    random_password.password
  ]
}
