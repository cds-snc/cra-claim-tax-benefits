output "bucket" {
  value = format("\"%s\"", aws_s3_bucket.storage_bucket.id)
}

output "key" {
  value = format("\"%s\"", "terraform.tfstate")
}

output "region" {
  value = format("\"%s\"", "ca-central-1")
}

output "shared_credentials_file" {
  value = format("\"%s\"", "../credentials")
}

output "domain" {
  value = format("\"%s\"", var.domain)
}

output "az_count" { 
  value = format("\"%s\"", 2)
}

output "multi_az" { 
  value = format("\"%s\"", true)
}