workflow "Run tests on push" {
  on = "push"
  resolves = [
    "Update container image in Azure App Service for Containers",
  ]
}

action "Lint Dockerfile" {
  uses = "docker://cdssnc/docker-lint"
}

action "Install npm dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Run JS linter" {
  uses  = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args  = "run lint"
  needs = [
    "Install npm dependencies"
  ]
}

action "Run jest unit tests" {
  uses  = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args  = "test"
  needs = [
    "Install npm dependencies"
  ]
}

action "If master branch" {
  uses = "actions/bin/filter@24a566c2524e05ebedadef0a285f72dc9b631411"
  needs = ["Lint Dockerfile", "Run JS linter", "Run jest unit tests"]
  args = "branch github-actions-2-more-actions"
}

action "Build a Docker container" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["If master branch"]
  args = "build -t base --build-arg GITHUB_SHA_ARG=$GITHUB_SHA ."
}

action "Login to Docker Hub" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["If master branch"]
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Tag :latest" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Build a Docker container"]
  args = "tag base cdssnc/cra-claim-tax-benefits:latest"
}

action "Tag :$GITHUB_SHA" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Tag :latest"]
  args = "tag base cdssnc/cra-claim-tax-benefits:$GITHUB_SHA"
}

action "Push container to Docker Hub" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Login to Docker Hub", "Tag :$GITHUB_SHA"]
  args = "push cdssnc/cra-claim-tax-benefits"
}

action "Login to Azure" {
  uses = "Azure/github-actions/login@d0e5a0afc6b9d8d19c9ade8e2446ef3c20e260d4"
  secrets = ["AZURE_SERVICE_APP_ID", "AZURE_SERVICE_PASSWORD", "AZURE_SERVICE_TENANT"]
  needs = ["Push container to Docker Hub"]
}

action "Update container image in Azure App Service for Containers" {
  uses = "Azure/github-actions/cli@d0e5a0afc6b9d8d19c9ade8e2446ef3c20e260d4"
  needs = ["Login to Azure"]
  env = {
    AZURE_SCRIPT = "az webapp config container set --resource-group cdscracollab-innovation-rg --name claim-tax-benefits --docker-custom-image-name cdssnc/cra-claim-tax-benefits:$GITHUB_SHA"
  }
}
