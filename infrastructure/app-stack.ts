import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import {
  aws_s3,
  aws_cloudfront,
  aws_lambda_nodejs,
  aws_lambda,
  aws_cloudfront_origins,
  aws_certificatemanager,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const branch = this.node.tryGetContext('branch');
    const { region } = this.node.tryGetContext(branch);

    const siteBucket = new aws_s3.Bucket(this, 'siteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const customCachePolicy = new aws_cloudfront.CachePolicy(
      this,
      'cachePolicy',
      {
        defaultTtl: cdk.Duration.days(0),
        minTtl: cdk.Duration.minutes(0),
        maxTtl: cdk.Duration.days(0),
      }
    );

    const customResponsePolicy = new aws_cloudfront.ResponseHeadersPolicy(
      this,
      'customResponsePolicy2',
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

    const siteBucketOrigin = new aws_cloudfront_origins.S3Origin(siteBucket);

    const siteBucketDist = new aws_cloudfront.Distribution(
      this,
      'siteBucketDist',
      {
        defaultBehavior: {
          origin: siteBucketOrigin,
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachePolicy: customCachePolicy,
          responseHeadersPolicy: customResponsePolicy,
        },
        additionalBehaviors: {},
        // defaultRootObject: '/index.html', // if it's SPA
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
        ],
        //   domainNames: [DOMAIN_NAME],
        //   // CF distribution only accept certificates that is on us-east-1
        //   certificate: aws_certificatemanager.Certificate.fromCertificateArn(
        //     this,
        //     'DOMAIN_CERTIFICATE',
        //     DOMAIN_CERTIFICATE
        //   ),
      }
    );

    const myFunction = new aws_lambda_nodejs.NodejsFunction(
      this,
      'my-function',
      {
        memorySize: 1024,
        timeout: cdk.Duration.seconds(5),
        runtime: aws_lambda.Runtime.NODEJS_16_X,
        handler: 'main',
        entry: path.join(__dirname, `/../src/lambdas/example/index.ts`),
        bundling: {
          minify: true,
        },
        environment: {
          APP_REGION: region,
        },
      }
    );

    // CFN OUTPUTS
    new cdk.CfnOutput(this, 'siteBucketUrl', {
      value: siteBucket.s3UrlForObject(),
      description: 'The siteBucket S3 URL',
    });
    new cdk.CfnOutput(this, 'siteBucketDistDomain', {
      value: siteBucketDist.distributionDomainName,
      description: 'The domain name of siteBucketDist',
    });
  }
}
