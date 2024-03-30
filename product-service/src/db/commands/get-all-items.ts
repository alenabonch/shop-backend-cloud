import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbDocumentClient } from '../index';

export async function getAllItems(tableName: string): Promise<any[]> {
  console.log('Getting all items from table', tableName);

  const command = new ScanCommand({
    TableName: tableName,
  });

  const response = await getDynamoDbDocumentClient().send(command);
  const items = response.Items;
  console.log('Returned items count', items.length);

  return items;
}
