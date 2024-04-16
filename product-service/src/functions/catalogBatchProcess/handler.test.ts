import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { mockClient } from 'aws-sdk-client-mock';
import * as dbUtils from '../../db/product-commands/create-product-and-stock-in-transaction';
import { catalogBatchProcess } from './handler'
import 'aws-sdk-client-mock-jest';

const snsMock = mockClient(SNSClient);

jest.mock('../../db/product-commands/create-product-and-stock-in-transaction');

describe('catalogBatchProcess', () => {
  const product = {
    title: 'Pie',
    description: 'Lemon pie',
    price: 15,
    count: 5
  };

  const createdProduct = {
    ...product,
    id: 'id-1'
  }

  const event = {
    Records: [{body: JSON.stringify(product)}]
  } as any;

  beforeEach(() => {
    snsMock.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process catalog batch items', async () => {
    jest.spyOn(dbUtils, 'createProductAndStockInTransaction').mockResolvedValue(createdProduct);
    const data = await catalogBatchProcess(event);

    expect(snsMock.calls()).toHaveLength(1);

    expect(snsMock).toHaveReceivedCommandWith(PublishCommand, {
      Subject: 'Products created',
      Message: `Products created in DB: ${JSON.stringify([createdProduct])}`,
      TopicArn: process.env.SNS_ARN,
    });

    expect(data.statusCode).toEqual(200);
    expect(JSON.parse(data.body)).toEqual([createdProduct]);
  })

  it('should throw 500 error', async () => {
    jest.spyOn(dbUtils, 'createProductAndStockInTransaction').mockRejectedValue(new Error());
    const data = await catalogBatchProcess(event);

    expect(data.statusCode).toEqual(500);
  })
})
