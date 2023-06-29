import * as cdk from 'aws-cdk-lib';
import {
  aws_s3,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_certificatemanager,
  aws_route53,
  aws_route53_targets,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { LambdaConstruct } from './constructs/lambda';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const branch = this.node.tryGetContext('branch');
    const { region, DOMAIN_NAME, DOMAIN_CERTIFICATE } =
      this.node.tryGetContext(branch);

    const siteBucket = new aws_s3.Bucket(this, 'siteBucket', {
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: aws_s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    // CUSTOM CONSTRUCTS
    // const { sentenceTable, audioBucket, siteBucket, sentenceTableParam } =
    // new StorageConstruct(this, `storage`, {});

    // lamba, depends on storage
    const { postMapper } = new LambdaConstruct(this, `lambda`, {});

    // api, depends on lambda
    // const { api: _api, sentenceProxy: _sentenceProxy } = new ApiConstruct(
    //   this,
    //   `api`,
    //   {
    //     sentenceProxyFunction,
    //   }
    // );

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
        additionalBehaviors: {
          'posts/*': {
            origin: siteBucketOrigin,
            edgeLambdas: [
              {
                functionVersion: postMapper.currentVersion,
                eventType: aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
              },
            ],
          },
        },
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
          },
        ],
        domainNames: [DOMAIN_NAME],
        /**
         * CF distribution only accept certificates that is created on us-east-1.
         * Certificate will be created manually on the console because it requires manuel DNS
         * validation on registrar, which is usually Google, and force us to create new stack
         * on us-east-1 just to declare certificate resource
         */
        certificate: aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          'DOMAIN_CERTIFICATE',
          DOMAIN_CERTIFICATE
        ),
      }
    );

    // DNS records of the domain should be configured to point NS of hosted zone.
    const hostedZone = new aws_route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: DOMAIN_NAME,
    });

    const aliasRecord = new aws_route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: DOMAIN_NAME,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.CloudFrontTarget(siteBucketDist)
      ),
    });

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
