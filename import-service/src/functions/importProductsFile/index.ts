import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:339712912682:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
          name: 'basicAuthorizer',
          resultTtlInSeconds: 0,
          type: 'token',
        },
      },
    },
  ],
};
