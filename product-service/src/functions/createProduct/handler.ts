import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuidv4 } from 'uuid';

import { Schema, z } from 'zod';
import { getDynamoDbClient } from '../../db';
import { ProductRequest } from '../../models/product';

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

    const input = {
      TransactItems: [
        {
          Put: {
            Item: {
              id: {S: productId},
              title: {S: body.title},
              description: {S: body.description},
              price: {N: body.price.toString()},
            },
            TableName: process.env.PRODUCTS_TABLE,
          },
        },
        {
          Put: {
            Item: {
              product_id: {S: productId},
              count: {N: (body.count || 0).toString()}
            },
            TableName: process.env.STOCKS_TABLE,
          },
        },
      ],
    };

    const command = new TransactWriteItemsCommand(input);
    await getDynamoDbClient().send(command);

    return formatJSONResponse(productId);
  } catch (error) {
    console.error(error);
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(createProduct);
