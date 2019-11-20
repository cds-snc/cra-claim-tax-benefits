resource "aws_codebuild_project" "codebuild_deploy_on_ecs" {
  name         = "codebuild_deploy_on_ecs"
  description  = "Code Build Deploy ECS"
  build_timeout      = "300"
  service_role = "${aws_iam_role.iam_code_build_role.arn}"

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/ubuntu-base:14.04"
    type         = "LINUX_CONTAINER"
    privileged_mode = true

    environment_variable {
      "name"  = "AWS_REGION"
      "value" = "${data.aws_region.current.name}"
    }
    environment_variable {
      "name"  = "AWS_ACCOUNT_ID"
      "value" = "${data.aws_caller_identity.current.account_id}"
    }
    environment_variable {
      "name"  = "ECS_CLUSTER"
      "value" = "${aws_ecs_cluster.ecs_cluster_name.name}"
    }
    environment_variable {
      "name"  = "IMAGE_NAME"
      "value" = "flask_app"
    }

  }

  source {
    type            = "CODEPIPELINE"
    buildspec = <<EOF
version: 0.2

phases:
  install:
    commands:
      - apt-get update -y
      - apt-get install jq -y
  build:
    commands:
      - cd web
      - echo "Create/update on the ECS cluster."
      - bash deploy.sh
EOF
  }

}