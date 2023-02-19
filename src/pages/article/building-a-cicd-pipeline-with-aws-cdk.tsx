import { useEffect } from 'react';

import Prism from 'prismjs';
// import 'prismjs/themes/prism-okaidia.css';
import 'prism-themes/themes/prism-vsc-dark-plus.css';

export default function Article() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <main className="max-w-screen-xl mx-auto  py-9">
        <div className="max-w-screen-md [&>.code]:max-w-screen-md space-y-3">
          <span className="text-sm text-github-white-comment">2023-02-18</span>
          <h1 className=" text-3xl text-github-white-link pb-2 font-semibold">
            Building a CI/CD Pipeline with AWS CDK
          </h1>

          <p>
            If you're looking to automate your application deployment process,
            then building a CI/CD pipeline is a must. In this blog post, we'll
            walk you through the process of creating a pipeline using AWS CDK
            that will streamline your deployment and ensure a consistent and
            reliable release process.
          </p>
          <p>
            The completed project can be found{' '}
            <a
              className="text-blue-400"
              target="_blank"
              href="https://github.com/hahuaz/cdk-examples/tree/dev/ci-cd-pipeline-ts"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
          <section className="[&>p]:mt-2">
            <h5 className="text-xl text-github-white-link mt-2">
              What is the flow?
            </h5>
            <p>
              The deployment of our application involves the creation of two
              CloudFormation stacks: pipeline-stack and app-stack.
            </p>
            <p>
              The pipeline-stack is the first stack that needs to be deployed,
              and we can do this by running a command from the terminal. The
              pipeline-stack is responsible for creating the CodePipeline
              resource that will be used to deploy our app-stack.
            </p>
            <p>
              {' '}
              The app-stack contains all the resources required for our
              application, and it will be created and managed by the
              CodePipeline. This includes creating all the necessary AWS
              resources, such as Lambda functions, API Gateway, and other
              resources required for our application to function correctly.
            </p>
            <p>
              This approach allows us to automate the entire deployment process
              of our application and also makes it easier to maintain the
              infrastructure. Any changes that we make to the application code
              will be automatically deployed to the cloud using the
              CodePipeline, and the app-stack will be updated accordingly.
              Overall, the use of two CloudFormation stacks (pipeline-stack and
              app-stack) and CodePipeline simplifies the deployment process and
              makes it more efficient.
            </p>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # Diving into infrastructure as code
            </h3>

            <h5 className="text-xl text-github-white-link mt-2">
              cdk-starter.ts
            </h5>
            <p>
              The "cdk-starter.ts" is the main entry point for defining any CDK
              App.
            </p>
            <pre>
              <code className={`language-javascript`}>
                {`#!/usr/bin/env node
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
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                We retrieve some context variables from cdk.json to configure
                the app.
              </li>
              <li>
                The PipelineStack class, which is defined in a separate file
                pipeline-stack.ts. This class represents the pipeline stack and
                defines all the necessary resources and stages required to build
                and deploy an application. The PipelineStack constructor takes
                in the app instance, a unique name for the stack, and an
                environment object that includes the region and account ID.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              pipeline-stack.ts
            </h5>
            <p>
              The pipeline-stack.ts is the core file that creates the
              CodePipeline in AWS CDK. The file imports the necessary modules
              and creates an instance of the PipelineStack class, which extends
              cdk.Stack.
            </p>

            <pre>
              <code className={`language-javascript`}>
                {`import * as cdk from 'aws-cdk-lib';
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
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                In the constructor, PipelineStack creates an instance of
                aws_codecommit.Repository using the repository name that is
                passed from the cdk.json file.
              </li>
              <li>
                The PipelineStack then creates a new pipelines.CodePipeline with
                the ShellStep action, which is responsible for the creation of
                the CodePipeline.
              </li>
              <li>
                The commands section is a part of the synth step in the
                CodePipeline constructor, and it specifies the commands that are
                executed when the pipeline starts its deployment process.
                <br />
                The npm ci command installs the exact dependencies required by
                the application, ensuring that the same versions of packages are
                installed every time.
                <br />
                The npm run build command builds the application by compiling
                and packaging the source code into a deployable format.
                <br />
                The npx cdk synth command synthesizes the AWS CloudFormation
                template for the application by running the AWS CDK toolkit.
                This produces an AWS CloudFormation template that can be used to
                deploy the application.
              </li>
              <li>
                AppStage is a class that extends cdk.Stage. If multiple stacks
                are required for an app, AppStage can be modified to handle that
                use case. In our example, we used only one stack.
              </li>
              <li>
                An application is added to the pipeline by calling addStage()
                with instances of Stage. Depending on the branch, the pipeline
                may deploy multiple instances of the AppStage. In the case of a
                prod branch, additional stages are added to the pipeline to
                facilitate testing and deployment to the production environment.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              app-stack.ts
            </h5>
            <p>
              The app-stack is responsible for creating the resources for our
              application in AWS.
              <br />
              The CodePipeline service is responsible for deploying the
              app-stack after it has been initialized, and it also automatically
              deploys the stack every time there is a code check-in. This
              ensures that the latest version of the application is always
              deployed and available.
            </p>

            <pre>
              <code className={`language-javascript`}>
                {`import * as path from 'path';
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
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                The app-stack is straightforward and includes a Lambda function.
                The function is written in TypeScript and is bundled using
                esbuild before it is deployed.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">cdk.json</h5>
            <p>
              The cdk.json file is an important configuration file in the AWS
              CDK application. It provides the necessary configuration
              information for deploying the application with the required
              settings.
            </p>
            <pre>
              <code className={`language-javascript`}>
                {`{
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
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                In the cdk.json file, we have the context property that is used
                to pass runtime context to the application.
              </li>
              <li>
                The branch key is used to specify the branch where the
                application is deployed. In this case, the branch is set to dev.
                In addition, the dev key contains an object with the necessary
                configuration settings for the dev environment. These settings
                include the AWS account, region, the name of the repository, and
                the name of the application.
                <br />
                This setup allows us to have different configuration settings
                for different environments. We can easily change the branch
                value in the cdk.json file to prod to deploy a new version of
                the application with different properties that suit the
                production environment.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # Deploy and observe the flow on AWS console
            </h3>
            <p>
              Before we can deploy the app, we need to put our repository to
              CodeCommit, since CodePipeline will look there to find the source
              code of the application.
            </p>

            <div className="bash rounded-md overflow-hidden my-2">
              <div className=" bg-[#1e1e1e] border-b border-gray-500 px-2 py-1 font-medium ">
                bash
              </div>
              <pre className="!my-0">
                <code className="language-bash before:content-['$'] before:text-green-500 before:mr-2 block">
                  aws codecommit create-repository --repository-name
                  ci-cd-pipeline-ts --profile {'{your-named-profile}'}
                </code>
                <code className="language-bash before:content-['$'] before:text-green-500 before:mr-2 block">
                  git remote add origin
                  ssh://git-codecommit.us-west-2.amazonaws.com/v1/repos/ci-cd-pipeline-ts
                </code>
                <code className="language-bash before:content-['$'] before:text-green-500 before:mr-2 block">
                  git push origin dev
                </code>
              </pre>
              <ul className="list-disc list-inside"></ul>
            </div>

            <p>
              After successfull push, we can deploy the pipeline. If it's your
              first time deployment on the region, you need to bootstrap the
              region. More info can be found{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html"
                rel="noreferrer"
              >
                here
              </a>
              .
            </p>
            <div className="bash rounded-md overflow-hidden my-2">
              <div className=" bg-[#1e1e1e] border-b border-gray-500 px-2 py-1 font-medium ">
                bash
              </div>
              <pre className="!my-0">
                <code className="language-bash before:content-['$'] before:text-green-500 before:mr-2 block">
                  cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile{' '}
                  {'{your-named-profile}'} --cloudformation-execution-policies
                  arn:aws:iam::aws:policy/AdministratorAccess
                </code>
                <code className="language-bash before:content-['$'] before:text-green-500 before:mr-2 block">
                  npm install
                </code>
                <code className="language-bash before:content-['$'] before:text-green-500 before:mr-2 block">
                  cdk deploy --profile {'{your-named-profile}'}
                </code>
              </pre>
              <ul className="list-disc list-inside"></ul>
            </div>

            <div className="my-12">
              <p>
                Check the deployed pipeline-stack template on CloudFormation:
              </p>
              <div className="mt-4 mb-12">
                <img
                  src="/article/building-a-cicd-pipeline-with-aws-cdk/pipeline-stack.png"
                  alt="aws pipeline stack"
                />
              </div>
            </div>
            <div className="my-12">
              <p>Check CodePipeline service is deploying the app-stack:</p>

              <div className="mt-4 mb-12">
                <img
                  src="/article/building-a-cicd-pipeline-with-aws-cdk/CodePipeline.png"
                  alt="aws codepipeline image"
                />
              </div>
            </div>

            <div className="my-12">
              <p>Finally, see the app-stack template on CloudFormation:</p>

              <div className="mt-4 mb-12">
                <img
                  src="/article/building-a-cicd-pipeline-with-aws-cdk/app-stack.png"
                  alt="aws cloudformation dashboard"
                />
              </div>
            </div>

            <h5 className="text-xl text-github-white-link mt-2">
              Check in the code to update services
            </h5>
            <p>
              When you need to make changes to the lambda or the infrastructure
              code, you can simply modify the code and then check it in. Once
              checked in, the pipeline will detect the changes and automatically
              run to update the necessary services.
            </p>
            <h5 className="text-xl text-github-white-link mt-2">
              The pipeline itself is self mutating
            </h5>

            <p>
              The pipeline itself also is designed to be self-mutating. This
              means that you can modify the pipeline configuration, and when you
              check in the updated code, the pipeline will update itself with
              the new configuration. This allows you to make changes to your
              deployment process and see the results immediately, without having
              to manually update the pipeline.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
