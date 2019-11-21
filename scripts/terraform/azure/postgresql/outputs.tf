output "id" {
  description = "ID of Postgresql server"
  value       = azurerm_postgresql_server.postgres.id
}

output "name" {
  description = "Name of Postgresql server"
  value       = azurerm_postgresql_server.postgres.name
}
