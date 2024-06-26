import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['${self:provider.environment.CATALOG_ITEMS_QUEUE}', 'Arn']
        },
      },
    },
  ],
};
