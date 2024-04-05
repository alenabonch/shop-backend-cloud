import { QueryCommand, } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbDocumentClient } from '../index';

export async function getItemByKey(tableName: string, key: string, value: string): Promise<any> {
  console.log('Getting item from table', tableName, key, value);

  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: `${key} = :${key}`,
    ExpressionAttributeValues: {
      [`:${key}`]: value
    },
  });

  const response = await getDynamoDbDocumentClient().send(command);
  const item = response.Items[0];
  console.log('Found item:', item);

  return item;
}
