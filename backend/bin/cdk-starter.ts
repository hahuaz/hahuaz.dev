#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AppStack } from '../infrastructure/app-stack';

const app = new cdk.App();

const branch = app.node.tryGetContext('branch');
const { account, region, appName } = app.node.tryGetContext(branch);

new AppStack(app, `${branch}-${appName}`, {
  env: {
    region,
    account,
  },
});

app.synth();
