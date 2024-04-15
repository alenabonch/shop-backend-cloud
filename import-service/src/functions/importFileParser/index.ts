import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${self:provider.environment.IMPORT_BUCKET}',
        event: 's3:ObjectCreated:*',
        rules: [
            {
              prefix: 'uploaded/',
            }
        ],
        existing: true,
        forceDeploy: true,
      },
    }
  ],
};
