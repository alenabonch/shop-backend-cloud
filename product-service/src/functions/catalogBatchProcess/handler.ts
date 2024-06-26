import { formatJSONResponse } from '@libs/api-gateway';
import { sendProductsCreatedNotification } from '@libs/sns-utils';
import { SQSEvent } from 'aws-lambda';
import { createProductAndStockInTransaction } from '../../db/product-commands/create-product-and-stock-in-transaction';
import { ProductRequest } from '../../models/product';

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    console.log('Catalog batch product handler', JSON.stringify(event));
    const createdProducts = [];

    for (const record of event.Records) {
      const parsedBody = JSON.parse(record.body);
      const product: ProductRequest = {...parsedBody, count: Number(parsedBody.count), price: Number(parsedBody.price)};
      const createdProduct = await createProductAndStockInTransaction(product);
      createdProducts.push(createdProduct);
    }

    await sendProductsCreatedNotification(createdProducts);

    return formatJSONResponse(createdProducts);
  } catch (error) {
    console.error(error);
    return formatJSONResponse({error}, 500);
  }
};

export const main = catalogBatchProcess;
