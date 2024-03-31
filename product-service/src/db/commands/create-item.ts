import { PutCommand, } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbDocumentClient } from '../index';

export async function createItem(tableName: string, item: any): Promise<any> {
  console.log('Creating item in table', tableName, item);

  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  await getDynamoDbDocumentClient().send(command);
  return item;
}
