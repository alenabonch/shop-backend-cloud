import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { ProductRequest } from '../../models/product';
import { v4 as uuidv4 } from 'uuid';
import { getDynamoDbClient } from '../index';

export async function createProductAndStockInTransaction(product: ProductRequest): Promise<string> {
  const productId = uuidv4();
  console.log('Creating product and stock in transaction with product id', productId);

  const input = {
    TransactItems: [
      {
        Put: {
          Item: {
            id: {S: productId},
            title: {S: product.title},
            description: {S: product.description},
            price: {N: product.price.toString()},
          },
          TableName: process.env.PRODUCTS_TABLE,
        },
      },
      {
        Put: {
          Item: {
            product_id: {S: productId},
            count: {N: (product.count || 0).toString()}
          },
          TableName: process.env.STOCKS_TABLE,
        },
      },
    ],
  };

  const command = new TransactWriteItemsCommand(input);
  await getDynamoDbClient().send(command);

  return productId;
}
