import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDbDocumentClient } from '../index';

export async function batchWrite(tableName: string, items: any[]) {
  console.log('Batch write operation');

  const putRequests = items.map((item) => ({
    PutRequest: {
      Item: item,
    },
  }));

  const command = new BatchWriteCommand({
    RequestItems: {
      [tableName]: putRequests,
    },
  });

  await getDynamoDbDocumentClient().send(command);
}
