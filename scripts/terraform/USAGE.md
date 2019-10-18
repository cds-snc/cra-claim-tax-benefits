# Background 
Terraform allows for writing Infrastructure as Code (IaC) in a Cloud provider agnostic way. CRA is opting for an hybrid Cloud approach (Azure and AWS), so coding our IaC with Terraform is a no brainer. Terraform allows to easily pivot scripts from a Cloud provider to another due to its abstract configuration language.

# What this script does

This script creates a new Azure AppService along with an Azure Application Insights resource.

The Azure Application Insights instrumentation key is linked to the Azure AppService through an environment variable.

This script can also be used to destroy an existing Azure AppService and Azure Application Insights.

# Variables
Variables can be defined in the `create-appservice.tfvars` file. Defaults are also defined in `create-appservice.tf`

# Usage

## Create a new Azure AppService
Edit `create-appservice.tfvars` to suit your needs and run `terraform plan -var-file=create-appservice.tfvars` to have an overview of the changes to be applied. 

Then, run `terraform apply -var-file=create-appservice.tfvars` to deploy the new changes.

Terraform will ask for a confirmation. Type `yes` to proceed.

If you omit to pass the `-var-file` argument, Terraform will prompt you for each variable within the script.

## Delete an existing AppService
Review `create-appservice.tfvars` since this is what is going to be targeted for the `destroy` operation.

Simply run `terraform destroy -var-file=create-appservice.tfvars` to remove/delete/destroy any existing Azure App Service. 

Terraform will ask for a confirmation. Type `yes` to proceed.

If you omit to pass the `-var-file` argument, Terraform will prompt you for each variable within the script.

# Known errors
If you got the following error message, that means the version of the azure provider you're using is outdated:

`Failed to instantiate provider "azure" to obtain schema: Incompatible API version with plugin. Plugin version: 4, Client versions: [5]`

Run this command to upgrade the azure provider: `terraform init -upgrade`