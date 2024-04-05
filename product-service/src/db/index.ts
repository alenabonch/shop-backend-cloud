import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export function getDynamoDbClient(): DynamoDBClient {
  return client;
}

export function getDynamoDbDocumentClient(): DynamoDBDocumentClient {
  return docClient;
}
