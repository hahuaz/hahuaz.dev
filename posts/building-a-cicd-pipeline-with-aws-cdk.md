---
title: "Building a CI/CD Pipeline with AWS CDK"
summary: "Learn how to use AWS CDK to automate your application's deployment and create a reliable and scalable pipeline."
createdAt: "2023-02-18"
tags: ['cdk', 'devops']
image: '/images/posts/general/aws-codepipeline.jpg'
---
If you're looking to automate your application deployment process,
then building a CI/CD pipeline is a must. In this blog post, we'll
walk you through the process of creating a pipeline using AWS CDK
that will streamline your deployment and ensure a consistent and
reliable release process.

The completed project can be found [here](https://github.com/hahuaz/cdk-examples/tree/dev/ci-cd-pipeline-ts).

## What is the flow?

The deployment of our application involves the creation of two CloudFormation stacks: pipeline-stack and app-stack.

The pipeline-stack is the first stack that needs to be deployed, and we can do this by running a command from the terminal. The pipeline-stack is responsible for creating the CodePipeline resource that will be used to deploy our app-stack.

The app-stack contains all the resources required for our application, and it will be created and managed by the CodePipeline. This includes creating all the necessary AWS resources, such as Lambda functions, API Gateway, and other resources required for our application to function correctly.

This approach allows us to automate the entire deployment process of our application and also makes it easier to maintain the infrastructure. Any changes that we make to the application code will be automatically deployed to the cloud using the CodePipeline, and the app-stack will be updated accordingly. Overall, the use of two CloudFormation stacks (pipeline-stack and app-stack) and CodePipeline simplifies the deployment process and makes it more efficient.

### Diving into infrastructure as code

#### cdk-starter.ts

The "cdk-starter.ts" is the main entry point for defining any CDK App.

```ts
#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../infrastructure/pipeline-stack';

const app = new cdk.App();

const branch = app.node.tryGetContext('branch');
const { account, region, appName } = app.node.tryGetContext(branch);

new PipelineStack(app, \`\${branch}-\${appName}-pipelineStack\`, {
  env: {
    region,
    account,
  },
});

app.synth();
```

- We retrieve some context variables from cdk.json to configure the app.
- The PipelineStack class, which is defined in a separate file `pipeline-stack.ts`. This class represents the pipeline stack and defines all the necessary resources and stages required to build and deploy an application. The PipelineStack constructor takes in the app instance, a unique name for the stack, and an environment object that includes the region and account ID.

#### pipeline-stack.ts

The `pipeline-stack.ts` is the core file that creates the CodePipeline in AWS CDK. The file imports the necessary modules and creates an instance of the PipelineStack class, which extends cdk.Stack.

```ts
import * as cdk from 'aws-cdk-lib';
import { pipelines, aws_codecommit } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppStack } from './app-stack';

/**
 * Stage may consist of one or more stacks according to your app's need. Here we use one stack.
 */
class AppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const branch = this.node.tryGetContext('branch');
    const { appName } = this.node.tryGetContext(branch);

    new AppStack(this, appName);
  }
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const branch = this.node.tryGetContext('branch');
    const { repoName } = this.node.tryGetContext(branch);

    const repo = aws_codecommit.Repository.fromRepositoryName(
      this,
      'CodeCommitRepo',
      repoName
    );

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      crossAccountKeys: false,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.codeCommit(repo, branch),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    if (branch !== 'prod') {
      /**
       * A CloudFormation stack will be deployed for your app.
       * Stack name will be AppStage.id+AppStack.id and
       * names of all deployed resources will have this naming pattern: AppStage.id+AppStack.id+Resource.id
       */
      pipeline.addStage(new AppStage(this, branch));
    } else {
      pipeline.addStage(new AppStage(this, 'preProd'));

      // TODO add testing after preProd

      pipeline.addStage(new AppStage(this, 'prod'));
    }
  }
}
```

- In the constructor, `PipelineStack` creates an instance of `aws_codecommit.Repository` using the repository name that is passed from the `cdk.json` file.
- The `PipelineStack` then creates a new `pipelines.CodePipeline` with the `ShellStep` action, which is responsible for the creation of the CodePipeline.
- The `commands` section is a part of the synth step in the CodePipeline constructor, and it specifies the commands that are executed when the pipeline starts its deployment process.
  - The `npm ci` command installs the exact dependencies required by the application, ensuring that the same versions of packages are installed every time.
  - The `npm run build` command builds the application by compiling and packaging the source code into a deployable format.
  - The `npx cdk synth` command synthesizes the AWS CloudFormation template for the application by running the AWS CDK toolkit. This produces an AWS CloudFormation template that can be used to deploy the application.
- `AppStage` is a class that extends `cdk.Stage`. If multiple stacks are required for an app, `AppStage` can be modified to handle that use case. In our example, we used only one stack.
- An application is added to the pipeline by calling `addStage()` with instances of `Stage`. Depending on the branch, the pipeline may deploy multiple instances of the `AppStage`. In the case of a prod branch, additional stages are added to the pipeline to facilitate testing and deployment to the production environment.

#### app-stack.ts

The `app-stack` is responsible for creating the resources for our application in AWS. The CodePipeline service is responsible for deploying the `app-stack` after it has been initialized, and it also automatically deploys the stack every time there is a code check-in. This ensures that the latest version of the application is always deployed and available.

```ts
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const branch = this.node.tryGetContext('branch');
    const { region } = this.node.tryGetContext(branch);

    const myFunction = new NodejsFunction(this, 'my-function', {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main',
      entry: path.join(__dirname, '/../src/lambdas/example/index.ts'),
      bundling: {
        minify: true,
      },
      environment: {
        APP_REGION: region,
      },
    });
  }
}
```
- The `app-stack` is straightforward and includes a Lambda function. The function is written in TypeScript and is bundled using esbuild before it is deployed.

#### cdk.json

The `cdk.json` file is an important configuration file in the AWS CDK application. It provides the necessary configuration information for deploying the application with the required settings.

```json
{
  "app": "npx ts-node --prefer-ts-exts bin/cdk-starter.ts",
  "context": {
    "branch": "dev",
    "dev": {
      "account": "501613675539",
      "region": "us-west-2",
      "repoName": "cdk-ts",
      "appName": "testApp"
    }
  }
}
```
- In the `cdk.json` file, we have the `context` property that is used to pass runtime context to the application.
- The `branch` key is used to specify the branch where the application is deployed. In this case, the branch is set to `dev`. In addition, the `dev` key contains an object with the necessary configuration settings for the dev environment. These settings include the AWS account, region, the name of the repository, and the name of the application.
- This setup allows us to have different configuration settings for different environments. We can easily change the `branch` value in the `cdk.json` file to `prod` to deploy a new version of the application with different properties that suit the production environment.

## Deploy and observe the flow on AWS console

Before we can deploy the app, we need to put our repository to CodeCommit, since CodePipeline will look there to find the source code of the application.

```bash
aws codecommit create-repository --repository-name ci-cd-pipeline-ts --profile <your-profile>
git remote add origin ssh://git-codecommit.us-west-2.amazonaws.com/v1/repos/ci-cd-pipeline-ts
git push origin dev
```

After a successful push, we can deploy the pipeline. If it's your first time deploying in the region, you need to bootstrap the region. More info can be found [here](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html).

```bash
cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile <your-profile> --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
npm install
cdk deploy --profile <your-profile>
```

Check the deployed pipeline-stack template on CloudFormation:

![aws pipeline stack](/images/posts/building-a-cicd-pipeline-with-aws-cdk/pipeline-stack.png)

Check CodePipeline service is deploying the app-stack:

![aws codepipeline image](/images/posts/building-a-cicd-pipeline-with-aws-cdk/CodePipeline.png)

Finally, see the app-stack template on CloudFormation:

![aws cloudformation dashboard](/images/posts/building-a-cicd-pipeline-with-aws-cdk/app-stack.png)

#### Check in the code to update services

When you need to make changes to the lambda or the infrastructure code, you can simply modify the code and then check it in. Once checked in, the pipeline will detect the changes and automatically run to update the necessary services.

#### The pipeline itself is self mutating

The pipeline itself is designed to be self-mutating. This means that you can modify the pipeline configuration, and when you check in the updated code, the pipeline will update itself with the new configuration. This allows you to make changes to your deployment process and see the results immediately, without having to manually update the pipeline.
