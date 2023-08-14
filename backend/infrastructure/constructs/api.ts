import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ApiConstruct extends Construct {
  public readonly api: apigateway.RestApi;
  public readonly sentenceProxy: apigateway.ProxyResource;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    this.api = new apigateway.RestApi(this, id, {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
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

    // catch /sentence
    const sentenceResource = this.api.root.addResource('sentence', {
      // removes the burden that we have to declare same integration for every method
      defaultIntegration: new apigateway.LambdaIntegration(
        props.sentenceProxyFunction
      ),
    });
    sentenceResource.addMethod('GET');

    // catch /word
    const wordResource = this.api.root.addResource('word', {
      // removes the burden that we have to declare same integration for every method
      defaultIntegration: new apigateway.LambdaIntegration(
        props.sentenceProxyFunction
      ),
    });
    wordResource.addMethod('GET');

    // catch /search
    const searchResource = this.api.root.addResource('search', {
      // removes the burden that we have to declare same integration for every method
      defaultIntegration: new apigateway.LambdaIntegration(
        props.sentenceProxyFunction
      ),
    });
    searchResource.addMethod('GET');

    // catch /sentence/[proxy]
    this.sentenceProxy = sentenceResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(
        props.sentenceProxyFunction
      ),
      // you can't use anymethod with authorizer because it effects OPTIONS method. you should explicitly define methods that uses authorizer
      // anyMethod: false,
      // defaultMethodOptions: {
      //   authorizer: token
      // }
    });
  }
}
