import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

const generatePolicy = (principalId: string, resource: string, effect: Effect) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        }
      ]
    }
  }
}

const basicAuthorizer = (event: APIGatewayTokenAuthorizerEvent, _, callback) => {
  console.log('Basic Authorizer lambda handler', JSON.stringify(event));

  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const {authorizationToken, methodArn} = event;
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    const storedUserPassword = process.env[username];
    const effect = !storedUserPassword || storedUserPassword !== password ? Effect.DENY : Effect.ALLOW;
    const policy = generatePolicy(username, methodArn, effect);

    return callback(null, policy);
  } catch (e) {
    callback(`Unauthorized: ${e.message}`)
  }
};

export const main = basicAuthorizer;
