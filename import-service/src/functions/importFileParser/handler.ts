import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { formatJSONResponse } from '@libs/api-gateway';
import { logCloudWatch } from '@libs/log-cloud-watch';
import { S3Event } from 'aws-lambda';
import csvParser from "csv-parser";

const s3Client = new S3Client({});

const importFileParser = async (event: S3Event) => {
  try {
    console.log('Import file parser handler', event);
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    await logCloudWatch(`Parsing ${key} from ${bucket}`);

    for (const record of event.Records) {
      const command = new GetObjectCommand({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      });
      const result = await s3Client.send(command);

      new Promise<void>((resolve, reject) => {
        result.Body.pipe(csvParser())
        .on('data', (data) => console.log('Data: ', data))
        .on('error', (error) => reject(error))
        .on('end', async () => {
          const copySource = `${bucket}/${key}`;
          const copyDestination = key.replace('uploaded', 'parsed');

          await s3Client.send(new CopyObjectCommand({
                Bucket: bucket,
                CopySource: copySource,
                Key: copyDestination,
              }),
          )
          console.log(`Copied file from ${copySource} from ${copyDestination}`);

          await s3Client.send(new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
              }),
          )
          console.log(`Deleted file ${key} from ${bucket}`);

          resolve();
        })
      });
    }

    return formatJSONResponse({bucket, key});
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = importFileParser;
