import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createItem } from 'src/db/commands/create-item';
import { v4 as uuidv4 } from 'uuid';

import { Schema, z } from 'zod';
import { Product, ProductRequest, Stock } from '../../models/product';

const ProductRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  count: z.optional(z.number()),
});

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event) => {
  try {
    console.log('Create product handler', event);
    const body = event.body as ProductRequest;
    const parsedBody = ProductRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return formatJSONResponse({error: 'Product is not valid'}, 400);
    }

    const productId = uuidv4();

    const product: Product = {
      id: productId,
      title: body.title,
      description: body.description,
      price: body.price,
    };

    const stock: Stock =  {
      product_id: productId,
      count: body.count || 0,
    }

    await createItem(process.env.PRODUCTS_TABLE, product);
    await createItem(process.env.STOCKS_TABLE, stock);

    return formatJSONResponse(productId);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(createProduct);
