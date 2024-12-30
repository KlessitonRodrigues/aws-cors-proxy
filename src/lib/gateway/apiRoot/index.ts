import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

export class APIRootGateway extends gateway.RestApi {
  constructor(scope: cdk.Stack) {
    const params: gateway.RestApiProps = {
      restApiName: 'Proxy API Gateway',
    };

    super(scope, 'ProxyAPIRoot', params);
  }
}