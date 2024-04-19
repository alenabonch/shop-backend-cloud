import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({region: process.env.REGION});

export const copyObject = async (bucket: string, key: string, copyDestination: string) => {
  try {
    const copySource = `${bucket}/${key}`;
    await s3Client.send(new CopyObjectCommand({
          Bucket: bucket,
          CopySource: copySource,
          Key: copyDestination,
        }),
    );
    console.log(`Copied file from ${copySource} to ${copyDestination} in bucket ${bucket}`);
  } catch (e) {
    console.log('Copy error', e)
  }
};

export const deleteObject = async (bucket: string, key: string) => {
  try {
    await s3Client.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
    )
    console.log(`Deleted file ${key} from ${bucket}`);
  } catch (e) {
    console.log('Delete error', e)
  }
};
