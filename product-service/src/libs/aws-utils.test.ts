import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getJsonFromS3 } from '@libs/aws-utils';
import { sdkStreamMixin } from '@smithy/util-stream';
import { mockClient } from 'aws-sdk-client-mock';
import * as fs from 'fs';
import { products } from '../mocks/products';

const mockS3Client = mockClient(S3Client);

describe('getJsonFromS3', () => {
  beforeEach(() => {
    mockS3Client.reset();
  });

  it('should return JSON from s3', async () => {
    mockS3Client.on(GetObjectCommand).resolves({
      Body: sdkStreamMixin(fs.createReadStream('src/mocks/products.json')),
    });
    const result = await getJsonFromS3('bucket', 'products.json');
    expect(result).toEqual(products);
  })
})
