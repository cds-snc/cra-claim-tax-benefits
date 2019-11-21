output "database_server_id" {
  description = "ID of Postgresql server"
  value       = azurerm_postgresql_server.main.id
}

output "database_server_fqdn" {
  description = "FQDN of the Postgresql server"
  value       = azurerm_postgresql_server.main.fqdn
}

output "database_server_name" {
  description = "Name of Postgresql server"
  value       = azurerm_postgresql_server.main.name
}

output "database_name" {
  description = "Name of Postgresql server"
  value       = azurerm_postgresql_database.main.name
}
