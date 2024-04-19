import { S3 } from '@aws-sdk/client-s3';
import csv from 'csv-parser';
const s3Client = new S3({region: process.env.REGION});

export const parseCsvFile = async (bucket: string, key: string): Promise<any[]> => {
  console.log(`Parsing file ${key} from bucket ${bucket}`);
  const file = await s3Client.getObject({ Bucket: bucket, Key: key });

  return new Promise((resolve) => {
    const parsedItems: any[] = [];

    file.Body
    .pipe(csv())
    .on('data', (data) => parsedItems.push(data))
    .on('end', () => resolve(parsedItems));
  });
};
