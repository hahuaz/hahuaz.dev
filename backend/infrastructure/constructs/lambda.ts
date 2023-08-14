import * as path from 'path';

import * as cdk from 'aws-cdk-lib';
import { aws_lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class LambdaConstruct extends Construct {
  public readonly postMapper: NodejsFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    // const { SENTENCE_TABLE_NAME, SENTENCE_BUCKET_NAME } = props;

    this.postMapper = new NodejsFunction(this, 'postMapper', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: aws_lambda.Runtime.NODEJS_16_X,
      handler: 'postMapper',
      entry: path.join(__dirname, `/../../lambdas/site-dist-mapper/index.ts`),
    });

    // this.testFunction = new NodejsFunction(this, 'testFunction', {
    //   memorySize: 128,
    //   timeout: cdk.Duration.seconds(5),
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   handler: 'sitemapMapper',
    //   entry: path.join(__dirname, `/../../lambda/test.ts`),
    //   bundling: {
    //     minify: false,
    //   },
    // });
  }
}
