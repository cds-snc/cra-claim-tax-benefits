resource "aws_secretsmanager_secret" "ctb_secrets" {
  name = "${var.resource_prefix}-secrets-manager"
}