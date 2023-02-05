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
          <span className="text-sm text-github-white-comment">2023-02-01</span>
          <h1 className=" text-3xl text-github-white-link pb-2 font-semibold">
            Lambda Authorizer: A Guide to Secure Your AWS API Gateway
          </h1>
          <img
            className=""
            src="/article/lambda-authorizer-a-guide-to-secure-your-aws-api-gateway/lambda-authorizer.png"
            alt="lambda authorizer"
          />
          <p>
            A Lambda Authorizer is a custom authorizer that uses an AWS Lambda
            function to control access to an API. The Lambda function acts as a
            middleware, taking the incoming request and returning either an
            allow or deny policy.
          </p>
          <p>
            The completed project can be found{' '}
            <a
              className="text-blue-400"
              target="_blank"
              href="https://github.com/hahuaz/cdk-examples/tree/dev/lambda-authorizer"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              Why Use a Lambda Authorizer?
            </h5>
            <p>
              With a Lambda function, you have full control over the
              authorization logic, enabling you to use custom authentication
              mechanisms like OAuth, JWT, or custom tokens.
            </p>
            <ul className="list-disc list-inside">
              <li>
                Flexibility: A Lambda Authorizer gives you complete control over
                the authorization logic, allowing you to use custom
                authentication mechanisms. This enables you to build and
                implement a security strategy that fits your specific needs and
                requirements.
              </li>
              <li>
                Scalability: Lambda functions automatically scale to handle any
                number of requests, making it easy to handle high levels of
                traffic without any manual intervention. This ensures that your
                APIs remain available and responsive even under heavy traffic
                conditions.
              </li>
              <li>Easy Integration with other AWS Services</li>
              <li>
                Serverless Architecture: A Lambda Authorizer is a serverless
                function, which means that you don't have to worry about
                managing servers or infrastructure. This allows you to focus on
                writing and deploying your authorization logic, without worrying
                about server management and maintenance.
              </li>
              <li>
                Pay per use: If an incoming request doesn't have the required
                authorization header, it will be dropped by the API Gateway
                without reaching the Lambda Authroizer. This means you won't pay
                for Lambda call but only for API request.
              </li>
              <li>
                Maintainability: By separating the authorization code from the
                application code, you can improve the structure and
                maintainability of your codebase. This helps to keep your code
                organized and makes it easier to manage and update your
                authorization logic in the future. Additionally, separating the
                authorization code helps to reduce the risk of security
                vulnerabilities, as it makes it easier to identify and fix
                security issues in your authorization logic.
              </li>
            </ul>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # Implement a Lambda authorizer by using CDK
            </h3>
            <p>
              This blog post assumes you know the basics of creating and
              deploying CDK apps. <br /> We will first create infrastructure and
              then lambda handler code.
            </p>
            <h5 className="text-xl text-github-white-link mt-2">
              Create the CDK Stack
            </h5>
            <p>App stack will include two custom constructs, Api and Lambda.</p>
            <pre>
              <code className={`language-javascript`}>
                {`export default class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { lambdaAuthorizer, helloWorldLambda } = new Lambda(
      this,
      'lambda',
      {}
    );

    // api depends on lambda
    new Api(this, 'api', { lambdaAuthorizer, helloWorldLambda } as ApiProps);
  }
}
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                The Lambda construct will create two lambda resources and each
                of them will be used by the Api construct. Thus, the Api
                construct depends on the Lambda construct creation.
              </li>
              <li>
                As your application grows and adds more services over time, it
                can become challenging to manage the codebase and keep it
                organized. To mitigate this issue, it's recommended to separate
                the application logic into distinct constructs, such as a
                compute, storage, lambda and api. This will greatly benefit you
                in terms of code maintainability and organization, allowing you
                to more easily update and manage your codebase.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              Create the Lambda Construct
            </h5>

            <pre>
              <code className={`language-javascript`}>
                {`export class Lambda extends Construct {
  public readonly lambdaAuthorizer: aws_lambda_nodejs.NodejsFunction;
  public readonly helloWorldLambda: aws_lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    // const {  } = props;

    const BRANCH = this.node.tryGetContext('BRANCH');
    const { APP_REGION } = this.node.tryGetContext(BRANCH);

    this.lambdaAuthorizer = new aws_lambda_nodejs.NodejsFunction(
      this,
      'lambdaAuthorizer',
      {
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: path.join(__dirname, '/../../lambdas/lambda-authorizer.ts'),
        environment: {
          APP_REGION,
        },
      }
    );
    this.helloWorldLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'helloWorldLambda',
      {
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: path.join(__dirname, '/../../lambdas/hello-world.ts'),
        environment: {
          APP_REGION,
        },
      }
    );

  }
}
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                The lambda construct will output two straightforward lambda
                functions.
              </li>
              <li>
                Authorizer lambda will include the handler code to authorize
                incoming request.
              </li>
              <li>Hello world lambda will return simle JSON output.</li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              Create Rest API (v1)
            </h5>
            <p>
              As 2023-02-01,{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigatewayv2-readme.html"
                rel="noreferrer"
              >
                aws-apigatewayv2-alpha
              </a>{' '}
              L2 construct is in the alpha stage. We will use v1 but if you're
              going for your app's next release, check the difference between
              REST API and HTTP API. AWS takes action to phase out REST API.
            </p>
            <pre>
              <code className={`language-javascript`}>
                {`this.api = new aws_apigateway.RestApi(this, 'api', {
  defaultCorsPreflightOptions: {
    allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
    allowMethods: aws_apigateway.Cors.ALL_METHODS,
    allowHeaders: [
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
      'X-Requested-With',
    ],
  },
});
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                We allow CORS for all origins and methods but you can easily
                pass an array to restrict some domain or method. Defining the
                CORS option in the root will affect every route for your API,
                which removes the burden to define CORS on every route. If you
                want to fine-tune some routes individually after, you definitely
                can.
              </li>
              <li>
                We allow some headers that request can consist. You can change
                some of them but be sure to include "Authorization" header.{' '}
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              Define Token Authorizer:
            </h5>
            <p>
              You can think this resource as wrapper for your Lambda function.
              It wraps your lambda function so you can pass it in your API
              resource definition.
            </p>
            <pre>
              <code className={`language-javascript`}>
                {`const tokenAuthorizer = new aws_apigateway.TokenAuthorizer(
  this,
  'tokenAuthorizer',
  {
    handler: lambdaAuthorizer,
    resultsCacheTtl: cdk.Duration.seconds(0),
  }
);
`}
              </code>
            </pre>
            <ul className="list-disc list-inside"></ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              Add root proxy to API
            </h5>
            <p>
              To maintain a manageable API Gateway resource definition, I
              frequently use proxy in API Gateway because I don't want to endup
              having 1000 line API Gateway resource definition. <br /> Then as
              requirements arise, I will define route logic in lambda handler.
              It's all about personel choice and trade-offs.
            </p>
            <pre>
              <code className={`language-javascript`}>
                {`this.api.root.addProxy({
  anyMethod: true,
  defaultIntegration: new aws_apigateway.LambdaIntegration(
    helloWorldLambda
  ),
  defaultMethodOptions: {
    authorizer: tokenAuthorizer,
  },
});
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>We enable every CRUD operation on proxy.</li>
              <li>
                As default integration, we pass the "helloWorldLambda", which we
                will define in Lambda construct.
              </li>
              <li>
                We use the custom token authorizer for authorizer option. It
                also accepts IAM and cognito types.
              </li>
            </ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              Allow CORS on UNAUTHORIZED response
            </h5>

            <pre>
              <code className={`language-javascript`}>
                {`this.api.addGatewayResponse('403', {
  type: aws_apigateway.ResponseType.UNAUTHORIZED,
  statusCode: '403',
  responseHeaders: {
    'Access-Control-Allow-Origin': "'*'",
  },
});
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                API Gateway has default responses that it returns the client if
                the request doesn't apply to defined criteria.
              </li>
              <li>
                There are bunch of default responses API Gateway returns to
                client. Some of them are UNAUTHORIZED, THROTTLED,
                BAD_REQUEST_BODY, ACCESS_DENIED. When lamda authorizer returns
                deny policy, API Gateway will send the UNAUTHORIZED response
                type to the client. By default, it won't allow any CORS header
                so we won't be able to see error message. We change this
                behaviour with above code snippet.
              </li>
            </ul>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # Lambda handler
            </h3>

            <h5 className="text-xl text-github-white-link mt-2">
              Hello-world dot ts
            </h5>

            <pre>
              <code className={`language-javascript`}>
                {`import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async function (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  console.log('INCOMING_EVENT\n', event);

  return {
    statusCode: 200,
    headers: {
      'access-control-allow-origin': '*',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ message: 'hello world!' }),
  };
};
`}
              </code>
            </pre>
            <ul className="list-disc list-inside"></ul>
          </section>
          <section>
            <h5 className="text-xl text-github-white-link mt-2">
              lambda-authorizer dot ts
            </h5>
            <p>
              The blog post only aims how to utilize Lambda Authorizer in CDK
              App and doesn't dictate any logic on authorization flow. In
              general, you would verify a JWT token here by using well known
              libraries. But to keep things simple, I directly check the bearer
              token whether it's equal to my value.
              <br />
              You need to return IAM policies to tell API Gateway whether
              incoming request passes the authorization or not.
            </p>
            <pre>
              <code className={`language-javascript`}>
                {`const defaultDenyAllPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'execute-api:Invoke',
      Effect: 'Deny',
      Resource: '*',
    },
  ],
};

const _defaultAllowAllPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: 'arn:aws:execute-api:{APP_REGION}:{ACCOUNT_ID}:{API_ID}/stage/method/resource/*',
    },
  ],
};

function generateAllowPolicy(arn: string) {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: arn,
      },
    ],
  };
}

export const handler = async function (event: any) {
  console.log('INCOMING_EVENT\\n', event);

  let policyDocument;

  const token = event.authorizationToken.replace('Bearer ', '');
  if (token === 'myawesometoken') {
    policyDocument = generateAllowPolicy(event.methodArn);
  } else {
    policyDocument = defaultDenyAllPolicy;
  }

  return {
    policyDocument,
    context: {
      callerIdentity: 'placeholder',
    },
  };
};
`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                Downstream will have access to context via
                event.requestContext.authorizer. You can use this context to
                pass variables such as, callerIdentity.
              </li>
              <li>
                It's straightforward IAM policy either denies or allows the
                "execute-api:Invoke" action.
              </li>
              <li>
                You can check the CloudWatch console to see the INCOMING_EVENT
                but here is the example of JSON structure:
                <pre>
                  <code className={`language-javascript`}>
                    {`{
  type: 'TOKEN',
  methodArn: 'arn:aws:execute-api:us-west-2:725077116981:a5imcmrll0/prod/POST/mysource',
  authorizationToken: 'Bearer myawesometoken1'
}
`}
                  </code>
                </pre>
                The arn is the resource client tries to acesss, which is an API
                Gateway resource, and you should include it in your allow IAM
                statement.
              </li>
            </ul>

            <p className="mt-4">
              That is it for the CDK side. Let's move on to the next section and
              check the functionality.
            </p>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
              # The client
            </h3>
            <p>
              The client will send an ajax request to our backend URL. First, we
              will test the reject state by sending a wrong token, then the
              accept state by sending the right token.
              <br />
              You need to change the api_url value that is inside of index.html
              with yours. CDK will print the API URL of your app at the end of
              app deployment.
            </p>

            <h5 className="text-xl text-github-white-link mt-2">
              index dot html
            </h5>

            <pre>
              <code className={`language-javascript`}>
                {`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <p>check the console!</p>

    <script>
      const api_url =
        'https://a5imcmrll0.execute-api.us-west-2.amazonaws.com/prod/';

      async function getData() {
        const data = await fetch(\`\${api_url}mysource\`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer wrongtoken',
          },
          body: JSON.stringify({
            message: 'Can I get what I want?',
          }),
        });
        const json = await data.json();
        console.log(json);
      }
      getData();
    </script>
  </body>
</html>

`}
              </code>
            </pre>
            <ul className="list-disc list-inside">
              <li>
                When you send the request with wrong token, API Gateway will
                respond with 403 status code and message will say "User is not
                authorized to access this resource with an explicit deny".
              </li>
              <li>
                If you change the bearer token to "myawesometoken" and send the
                request again, Lambda authorizer will allow the request to pass
                to HelloWorld lambda and you will get nice hello world message.
              </li>
            </ul>
            <p className="mt-4">
              As always, do not forget the cleanup your AWS account by
              destroying the stack.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
