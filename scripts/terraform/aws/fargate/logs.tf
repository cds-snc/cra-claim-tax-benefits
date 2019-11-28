# Set up CloudWatch group and log stream, which is a group of log 
# streams that share the same retention, monitoring, and access 
# control settings
resource "aws_cloudwatch_log_group" "ctb_log_group" {
  name              = "/ecs/${var.resource_prefix}-app"
  retention_in_days = 30

  tags = {
    Name = "${var.resource_prefix}-log-group"
  }
}

# Provides a CloudWatch Log Stream resource, which is a sequence 
# of log events that share the same source.
resource "aws_cloudwatch_log_stream" "ctb_log_stream" {
  name           = "${var.resource_prefix}-log-stream"
  log_group_name = aws_cloudwatch_log_group.ctb_log_group.name
}

