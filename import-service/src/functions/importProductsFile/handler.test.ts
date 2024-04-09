jest.mock('@aws-sdk/s3-request-presigner');
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { importProductsFile } from './handler';

jest.mock('@aws-sdk/client-s3');

describe('importProductsFile', () => {
  const getSignedUrlMock: jest.Mock = getSignedUrl as any;

  it('should status 200 with signed url', async () => {
    const event = {queryStringParameters: {name: 'test.csv'}} as any;
    getSignedUrlMock.mockResolvedValue('example-url.com');
    const expectedInput = {
      Bucket: process.env.IMPORT_BUCKET,
      Key: 'uploaded/test.csv',
    };
    const response = await importProductsFile(event);

    expect(PutObjectCommand).toHaveBeenCalledWith(expectedInput);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual('example-url.com');
  })

  it('should throw 500 error', async () => {
    getSignedUrlMock.mockRejectedValue(new Error());
    const data = await importProductsFile(null);
    expect(data.statusCode).toEqual(500);
  })
})
