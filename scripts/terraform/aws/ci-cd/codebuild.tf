resource "aws_codebuild_project" "codebuild_docker_image" {
  name         = "codebuild_docker_image"
  description  = "build docker images"
  build_timeout      = "300"
  service_role = "${aws_iam_role.iam_code_build_role.arn}"

  artifacts {
    type = "CODEPIPELINE"
  }
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/docker:17.09.0"
    type         = "LINUX_CONTAINER"
    privileged_mode = true

    environment_variable {
      "name"  = "AWS_DEFAULT_REGION"
      "value" = "${data.aws_region.current.name}"
    }
    environment_variable {
      "name"  = "AWS_ACCOUNT_ID"
      "value" = "${data.aws_caller_identity.current.account_id}"
    }
    environment_variable {
      "name"  = "IMAGE_REPO_NAME"
      "value" = "${aws_ecr_repository.ecr_flask_app.name}"
    }
  }

  source {
    type            = "CODEPIPELINE"
    buildspec       = "web/buildspec.yml"
  }

}