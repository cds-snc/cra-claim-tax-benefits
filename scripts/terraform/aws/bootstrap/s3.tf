resource "aws_s3_bucket" "storage_bucket" {
  bucket = "ctb-terraform-state-bucket"
  acl    = "private"
  versioning {
      enabled = true
  }
  tags = {
    Name        = "Terraform State Bucket"
    Environment = "Dev"
  }
}