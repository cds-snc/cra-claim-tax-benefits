terraform {
  # Defines a backend (S3 bucket) where to store the Terraform state. 
  backend "s3" {
      bucket = "ctb-terraform-state-bucket"
      key = "terraform.tfstate"
      acl = "private"
  }
}