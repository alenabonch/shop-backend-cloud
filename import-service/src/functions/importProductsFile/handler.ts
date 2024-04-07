import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

export const importProductsFile = async (event) => {
  try {
    console.log('Import products file handler', event);
    const client = new S3Client({region: 'us-east-1'});
    const fileName = event.queryStringParameters.name;
    const catalogPath = `uploaded/${fileName}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: catalogPath,
    }
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(client, command, {expiresIn: 60});
    return formatJSONResponse(url);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(importProductsFile);
