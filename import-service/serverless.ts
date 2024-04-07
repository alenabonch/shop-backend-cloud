import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: 'sls-live-app-import-service-bucket'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: 'arn:aws:s3:::*:${self:provider.environment.BUCKET_NAME}',
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: 'arn:aws:s3:::*:${self:provider.environment.BUCKET_NAME}/*',
          }
        ],
      },
    },
  },
  // import the function via paths
  functions: {importProductsFile},
  package: {individually: true},
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      apiType: 'http',
      basePath: '/${sls:stage}',
      // typefiles: ['./src/models/product.ts'],
    }
  },
};

module.exports = serverlessConfiguration;
