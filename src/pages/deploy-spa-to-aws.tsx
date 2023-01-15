import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  gradientDark as terminalStyle,
  vs2015 as codeStyle,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function Article() {
  return (
    <>
      <main className="max-w-screen-xl mx-auto  py-9">
        <div className="max-w-screen-md [&>.code]:max-w-screen-md space-y-3">
          <span className="text-sm text-github-white-comment"> 2023-01-16</span>
          <h1 className=" text-3xl text-github-white-link pb-2 font-semibold">
            Deploy SPA to AWS
          </h1>
          <p>
            Deploying a Single Page Application (SPA) to Amazon Web Services
            (AWS) is a flexible and scalable way to host your web application.
            AWS offers a variety of services that can be used to deploy and host
            SPAs, including Amazon S3, Amazon CloudFront.
          </p>{' '}
          <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
            # What will we be doing?
          </h3>
          <p>
            To deploy our SPA to AWS, we need to create an S3 bucket and upload
            our SPA files to the bucket. Then we will use CloudFront (CDN) to
            distribute the content globally. Only thing that can be tricky is
            configuring CloudFront in such a way that it will serve index.html
            for every route we have in our application. <br></br>
            The completed project can be found in{' '}
            <a
              className="text-blue-400"
              target="_blank"
              href="https://github.com/hahuaz/cdk-examples/tree/dev/deploy-spa-to-aws"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
          <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
            # Prerequisites
          </h3>
          <ul className="list-disc list-inside">
            <li>
              Having{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://aws.amazon.com/cli/"
                rel="noreferrer"
              >
                AWS CLI
              </a>{' '}
              and{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://docs.aws.amazon.com/cdk/v2/guide/cli.html"
                rel="noreferrer"
              >
                AWS CDK CLI
              </a>{' '}
              installed on your machine and being familiar with them.
            </li>
            <li>
              The build files of SPA. As long as your entry point is index.html,
              it doesn't matter which framework or frontend tooling you've used
              to create them.{' '}
            </li>
          </ul>
          <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
            # Start a new CDK project
          </h3>
          <p>Open up your terminal in empty directory and execute:</p>
          <SyntaxHighlighter
            language="javascript"
            style={terminalStyle}
            className="code"
            wrapLines={true}
          >
            {`cdk init app --language typescript`}
          </SyntaxHighlighter>
          <p>
            Head over your CDK starter file that is in the "bin" directory and
            populate it with your environment variables.
          </p>
          <SyntaxHighlighter
            language="typescript"
            style={codeStyle}
            className="code"
            wrapLines={true}
          >
            {`new DeploySpaToAwsStack(app, 'DeploySpaToAwsStack', {
  env: { account: '725077116981', region: 'us-west-2' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});`}
          </SyntaxHighlighter>
          <p>
            Deploy empty stack to your account but first you need to configure
            your AWS CLI to work with profiles. Learn more about named profiles
            in{' '}
            <a
              className="text-blue-400"
              target="_blank"
              href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
          <SyntaxHighlighter
            language="javascript"
            style={terminalStyle}
            className="code"
            wrapLines={true}
          >
            {`cdk deploy --profile <yours>`}
          </SyntaxHighlighter>
          <p>
            After a successful deployment, you should see output similar to the
            following in the terminal:{' '}
          </p>
          <img
            src="/article/deploy-spa-to-aws/deploy-success.png"
            alt="deploy-success"
          />
          <h3 className="text-2xl font-semibold text-github-white-link !mt-12">
            # Create necessary resources
          </h3>
          <h5 className="text-xl text-github-white-link ">
            Create S3 bucket for site:
          </h5>
          <SyntaxHighlighter
            language="typescript"
            style={codeStyle}
            className="code"
            wrapLines={true}
          >
            {`const siteBucket = new aws_s3.Bucket(this, 'siteBucket', {
  websiteIndexDocument: 'index.html',
  publicReadAccess: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});`}
          </SyntaxHighlighter>
          <ul className="list-disc list-inside">
            <li>
              We mark the bucket as public. Thanks to CDK, it can be done by
              single prop but I encourage you to check this{' '}
              <a
                className="text-blue-400"
                target="_blank"
                href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html"
                rel="noreferrer"
              >
                document
              </a>
              .
            </li>
            <li>
              We are also enabling static website hosting for the bucket by
              specifying websiteIndexDocument prop.{' '}
            </li>
          </ul>
          <h5 className="text-xl text-github-white-link">
            Create CloudFront resource for site distribution:
          </h5>
          <p>
            First, we need to define our CloudFront cache policy. While doing
            continuous integration, I always keep the numbers zero. It basically
            disables the cache and you always get fresh content from your
            origin. You need to increase the numbers for prod environment.
          </p>
          <SyntaxHighlighter
            language="typescript"
            style={codeStyle}
            className="code"
            wrapLines={true}
          >
            {`const cachePolicy = new aws_cloudfront.CachePolicy(this, 'cachePolicy', {
  defaultTtl: cdk.Duration.days(0),
  minTtl: cdk.Duration.minutes(0),
  maxTtl: cdk.Duration.days(0),
});
`}
          </SyntaxHighlighter>
          <p>
            Secondly, we define our CloudFront response header policy. We enable
            CORS for HEAD, GET and OPTION methods. This will be helpful if you
            somehow need to use your website inside an iframe. <br /> You also
            can enable browser cache before going production by defining custom
            headers.
          </p>
          <SyntaxHighlighter
            language="typescript"
            style={codeStyle}
            className="code"
            wrapLines={true}
          >
            {`const responsePolicy = new aws_cloudfront.ResponseHeadersPolicy(
  this,
  'responsePolicy',
  {
    // TODO activate browser cache
    // customHeadersBehavior: {
    //   customHeaders: [
    //     {
    //       header: 'Cache-Control',
    //       value: 'max-age=2592000',
    //       override: true,
    //     },
    //   ],
    // },
    corsBehavior: {
      accessControlAllowOrigins: ['*'],
      accessControlAllowMethods: ['HEAD', 'GET', 'OPTIONS'],
      accessControlAllowHeaders: ['*'],
      originOverride: true,
      accessControlAllowCredentials: false,
    },
  }
);
`}
          </SyntaxHighlighter>
          <p>
            Lastly, we create our CloudFront distribution whose origin is the
            siteBucket.
          </p>
          <SyntaxHighlighter
            language="typescript"
            style={codeStyle}
            className="code"
            wrapLines={true}
          >
            {`const siteBucketOrigin = new aws_cloudfront_origins.S3Origin(siteBucket);

const siteBucketDist = new aws_cloudfront.Distribution(
  this,
  'siteBucketDist',
  {
    defaultBehavior: {
      origin: siteBucketOrigin,
      viewerProtocolPolicy:
        aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachePolicy: cachePolicy,
      responseHeadersPolicy: responsePolicy,
    },
    additionalBehaviors: {},
    errorResponses: [
      {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
    ],
  }
);

// CFN OUTPUTS
new cdk.CfnOutput(this, 'siteBucketDistDomain', {
  value: siteBucketDist.distributionDomainName,
  description: 'The domain name of siteBucketDist',
});
`}
          </SyntaxHighlighter>
          <p>
            It will be wiser to explain viewer and origin concepts for any given
            CDN at this point.
          </p>
          <img
            src="/article/deploy-spa-to-aws/cloudfront-request-life-span.png"
            alt="cloudfront-request-life-span"
          />
          <p>
            <span className="italic">Viewer request</span> refers to a request
            made by an user to access a specific resource or file that is stored
            on a CloudFront distribution. This request can be made through a web
            browser or any other application that is capable of making HTTP
            requests. <br /> <span className="italic">Origin request</span>{' '}
            refers to a request made by CloudFront to the origin server (such as
            an S3 bucket or an EC2 instance) to retrieve the requested resource
            or file. The origin server will then return the requested resource
            to CloudFront, which will then pass it on to the viewer.
          </p>
          <p>
            For our distribution, we're configuring the viewer response behavior
            on errorResponses prop. <br /> This configuration is important for
            SPA because when a request page is different than root (/), for
            example https://yours.com/about, CloudFront won't find it on the
            origin (siteBucket) because it doesn't exist. When this occurs it
            will serve the index.html instead of returning 404. On the client
            side, javascript will take over and will show the requested page by
            looking up the URL.
          </p>
          <p>Deploy the stack again to create newly defined resources:</p>
          <SyntaxHighlighter
            language="javascript"
            style={terminalStyle}
            className="code"
            wrapLines={true}
          >
            {`cdk deploy --profile <yours>`}
          </SyntaxHighlighter>
          <p>
            Terminal will print S3 URL for the site bucket and domain for the
            distribution:
          </p>
          <img
            src="/article/deploy-spa-to-aws/distribution-domain.png"
            alt="distribution-domain"
            className=""
          />
          <p>
            Before using the distribution domain we need to deploy build files
            of SPA to S3. Head over to your build directory and run:
          </p>
          <SyntaxHighlighter
            language="javascript"
            style={terminalStyle}
            className="code"
            wrapLines={true}
          >
            {`aws s3 cp . <your-s3-url> --recursive --profile <yours>`}
          </SyntaxHighlighter>
          <p>
            Now, you can view your app in the browser by visiting distribution
            domain.
          </p>
          <p>Clean up your account by destroying the stack:</p>
          <SyntaxHighlighter
            language="javascript"
            style={terminalStyle}
            className="code"
            wrapLines={true}
          >
            {`cdk destroy --profile <yours>`}
          </SyntaxHighlighter>
        </div>
      </main>
    </>
  );
}
