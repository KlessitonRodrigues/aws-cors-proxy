import * as cdk from 'aws-cdk-lib';

import '../config/dotenv';
import { NodeTemplateStack } from './NodeStack';

const app = new cdk.App();

new NodeTemplateStack(app);
