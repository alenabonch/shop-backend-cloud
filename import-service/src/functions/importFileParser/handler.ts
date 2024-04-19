import { formatJSONResponse } from '@libs/api-gateway';
import { parseCsvFile } from '@libs/parse-csv-file';
import { copyObject, deleteObject } from '@libs/s3-utils';
import { sendProductsToCatalogItemsQueue } from '@libs/sqs-utils';
import { S3Event } from 'aws-lambda';

const importFileParser = async (event: S3Event) => {
  try {
    console.log('Import file parser handler', JSON.stringify(event));
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    const products = await parseCsvFile(bucket, key);
    await sendProductsToCatalogItemsQueue(products);

    await copyObject(bucket, key, key.replace('uploaded', 'parsed'));
    await deleteObject(bucket, key);

    return formatJSONResponse({products});
  } catch (error) {
    console.log('Error', error)
    return formatJSONResponse({error}, 500);
  }
};

export const main = importFileParser;
