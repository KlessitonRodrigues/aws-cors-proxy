import * as cdk from 'aws-cdk-lib';
import * as gateway from 'aws-cdk-lib/aws-apigateway';

import { Lambdas } from '../@types/lambdas';
import { APIRootGateway } from '../lib/gateway/apiRoot';
import { CorsProxy } from '../lib/lambdas/proxy/corsProxy/lambda';
import { addCorsPreflight } from '../utils/api/addCors';

export class NodeTemplateStack extends cdk.Stack {
  constructor(scope: cdk.App, props?: cdk.StackProps) {
    super(scope, 'CorsProxyAPI', props);

    const lambdaProps: Lambdas.LambdasProps = {};

    // Lambdas
    const corsProxy = new CorsProxy(this, lambdaProps);

    // API Gateway
    const apiRoot = new APIRootGateway(this);

    // ...proxy/
    const corsProxyApi = apiRoot.root.addResource('proxy');
    corsProxyApi.addMethod('GET', new gateway.LambdaIntegration(corsProxy));

    // CORS Preflight
    addCorsPreflight(corsProxyApi);
  }
}
