resource "azurerm_postgresql_database" "ctb" {
  name                = "${var.database_name}"
  resource_group_name = "${var.resource_group_name}"
  server_name         = "${azurerm_postgresql_server.ctb.name}"
  charset             = "${var.database_charset}"
  collation           = "${var.database_collation}"
  depends_on = [
    azurerm_postgresql_server.ctb
  ]
}