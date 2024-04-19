import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { isValidProductRequest } from '@libs/validate-product';

import { Schema } from 'zod';
import { createProductAndStockInTransaction } from '../../db/product-commands/create-product-and-stock-in-transaction';
import { ProductRequest } from '../../models/product';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event) => {
  try {
    console.log('Create product handler', event);
    const productRequest = event.body as ProductRequest;

    if (!isValidProductRequest(productRequest)) {
      return formatJSONResponse({error: 'Product is not valid'}, 400);
    }

    const product = await createProductAndStockInTransaction(productRequest);

    return formatJSONResponse(product);
  } catch (error) {
    console.error(error);
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(createProduct);
