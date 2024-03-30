import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getAllItems(tableName: string): Promise<any[]> {
  console.log('Getting all items from table ', tableName);

  const command = new ScanCommand({
    TableName: tableName,
  });

  const response = await docClient.send(command);
  return response.Items;
}
