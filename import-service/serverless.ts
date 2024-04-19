import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

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
      REGION: '${self:provider.region}',
      IMPORT_BUCKET: 'sls-live-app-import-service-bucket',
      CLOUDWATCH_LOG_GROUP: 'import-file-logs',
      CLOUDWATCH_LOG_STREAM: 'import-file-stream',
      CATALOG_ITEMS_QUEUE: 'catalogItemsQueue',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: 'arn:aws:s3:::${self:provider.environment.IMPORT_BUCKET}',
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: 'arn:aws:s3:::${self:provider.environment.IMPORT_BUCKET}/*',
      },
      {
        Effect: 'Allow',
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        Resource: '*'
      },
      {
        Effect: "Allow",
        Action: ["sqs:SendMessage", "sqs:GetQueueUrl"],
        Resource: "*",
      },
    ],
  },
  // import the function via paths
  functions: {
    importProductsFile,
    importFileParser,
  },
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
      generateSwaggerOnDeploy: false,
    }
  },
};

module.exports = serverlessConfiguration;
