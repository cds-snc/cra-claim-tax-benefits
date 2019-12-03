resource "aws_kms_key" "ctbkey" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 10
}

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

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = "${aws_kms_key.ctbkey.arn}"
        sse_algorithm     = "aws:kms"
      }
    }
  }

  depends_on = [
    aws_kms_key.ctbkey
  ]
}