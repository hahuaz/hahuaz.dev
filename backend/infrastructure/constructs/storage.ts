import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb, aws_s3, aws_s3_deployment, aws_ssm } from 'aws-cdk-lib';

export class StorageConstruct extends Construct {
  public readonly sentenceTable: aws_dynamodb.Table;
  public readonly sentenceTableParam: aws_ssm.StringParameter;

  public readonly audioBucket: aws_s3.Bucket;
  public readonly siteBucket: aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    // const { SENTENCE_TABLE_NAME, SENTENCE_BUCKET_NAME } = props;

    // const BRANCH = this.node.tryGetContext('BRANCH');
    // const { APP_REGION, AZURE_SPEECH_KEY, AZURE_SPEECH_REGION } =
    //   this.node.tryGetContext(BRANCH);

    // TABLES
    this.sentenceTable = new aws_dynamodb.Table(this, 'sentence', {
      partitionKey: {
        name: 'partitionKey',
        type: aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sortKey',
        type: aws_dynamodb.AttributeType.STRING,
      },
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // keep the table on removal from CDK
      pointInTimeRecovery: true,
    });

    // BUCKETS
    this.audioBucket = new aws_s3.Bucket(this, 'audio', {
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [aws_s3.HttpMethods.GET],
          allowedHeaders: ['*'],
        },
      ],
    });
    this.audioBucket.grantPublicAccess('*', 's3:GetObject');

    // ref: https://dev.to/paulallies/deploy-your-static-react-app-to-aws-cloudfront-using-cdk-44hm
    this.siteBucket = new aws_s3.Bucket(this, 'siteBucket', {
      websiteIndexDocument: 'index.html',
      // websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // new aws_s3_deployment.BucketDeployment(this, 'Deployment', {
    //   sources: [aws_s3_deployment.Source.asset('./front-build')],
    //   destinationBucket: this.siteBucket,
    //   // distribution: siteDistribution,
    //   // distributionPaths: ["/*"]
    // });

    this.sentenceTableParam = new aws_ssm.StringParameter(
      this,
      'sentenceTableParam',
      {
        parameterName: 'sentenceTableName',
        description: 'sentence table param that will be used in lambda@edge',
        stringValue: this.sentenceTable.tableName,
        // allowedPattern: '.*',
      }
    );
  }
}
