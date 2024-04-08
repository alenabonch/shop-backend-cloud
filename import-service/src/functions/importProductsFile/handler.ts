import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as process from 'process';

export const importProductsFile = async (event) => {
  try {
    console.log('Import products file handler', event);
    const client = new S3Client({region: process.env.REGION});
    const fileName = event.queryStringParameters.name;
    const params = {
      Bucket: process.env.IMPORT_BUCKET,
      Key: `uploaded/${fileName}`,
    }
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(client, command, {expiresIn: 60});
    return formatJSONResponse(url);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(importProductsFile);
