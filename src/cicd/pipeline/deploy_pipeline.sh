#!/bin/bash
set -ueo pipefail

###
# Deploy the codepipeline for BioCollect PWA site
# You must have AWS CLI authentication for this to run. 

# must be called with first arg "prod" to launch in production
ENV="${1:-notprod}"

# get the branch
branch=$(git branch --show-current)
echo branch: $branch

# check that any changes are commited and pushed
if [ -n "$(git status --porcelain)" ] ; then
  echo "changes must be committed and pushed before deploying"
  exit 1;
fi

if [ -n "$(git diff $branch origin/$branch)" ] ; then
  echo "changes must be committed and pushed before deploying"
  exit 1;
fi

# get the clean version of the branch
clean_branch=$(./clean_branch.sh $branch)
echo clean branch: $clean_branch

# get the commit_id
commit_id=$(git rev-parse HEAD)
echo commit_id: $commit_id

# get the environment based on the branch
environment=$(./branch_2_env.py --branch $branch --env $ENV)
echo environment: $environment

# load environment vars
./gen_env_vars.py --env $environment > env.txt --clean-branch $clean_branch --conf ../config.ini > env.txt
source env.txt
rm env.txt

# deploy/update the template
echo "Deploying the pipeline template"
aws cloudformation deploy \
    --template-file pipeline.yaml \
    --stack-name $PIPELINE_STACK_NAME \
    --tags product=$PRODUCT_NAME component=cicd environment=$environment branch=$branch version=$commit_id \
    --region $REGION \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides \
        pAppStackName=$APP_STACK_NAME \
        pApSe2ArtifactsBucket=$AP_SE_2_ARTIFACTS_BUCKET \
        pAutoDeploy=$AUTO_DEPLOY \
        pCloudFormationServiceRole=$CLOUDFORMATION_SERVICE_ROLE \
        pCodeBuildServiceRole=$CODEBUILD_SERVICE_ROLE \
        pCodePipelineServiceRole=$CODEPIPELINE_SERVICE_ROLE \
        pCodestarConnection=$CODESTAR_CONNECTION \
        pCleanBranch=$clean_branch \
        pEnvironment=$environment \
        pGitHubBranch=$branch \
        pGitHubOwner=$GITHUB_OWNER \
        pGitHubRepositoryName=$GITHUB_REPO_NAME \
        pProductComponent=$PRODUCT_COMPONENT \
        pProductName=$PRODUCT_NAME \
        pUsE1ArtifactsBucket=$US_E_1_ARTIFACTS_BUCKET \
        pWafStackName=$WAF_STACK_NAME


