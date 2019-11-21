output "id" {
  description = "ID of Postgresql server"
  value       = azurerm_postgresql_server.main.id
}

output "name" {
  description = "Name of Postgresql server"
  value       = azurerm_postgresql_server.main.name
}
