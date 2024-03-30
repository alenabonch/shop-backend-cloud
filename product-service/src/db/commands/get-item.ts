import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getItemByKey(tableName: string, key: string, value: string): Promise<any> {
  console.log('Getting item from table ', tableName);

  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: `${key} = :${key}`,
    ExpressionAttributeValues: {
      [`:${key}`]: value
    },
  });

  const response = await docClient.send(command);
  const firstItem = response.Items[0];

  console.log('First found item:', firstItem);
  return firstItem;
}
