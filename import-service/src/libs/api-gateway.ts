import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: any, statusCode = 200) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  if (typeof response !== 'string') {
    headers['Content-Type'] = 'application/json';
  }
  return {
    headers,
    statusCode,
    body: JSON.stringify(response)
  }
}
