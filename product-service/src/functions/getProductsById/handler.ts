import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getItemByKey } from '../../db/commands/get-item';
import { Product, ProductWithStock, Stock } from '../../models/product';

export const getProductsById = async (event: any) => {
  try {
    console.log('Get product by id handler', event);
    const productId = event.pathParameters.productId;

    const product: Product = await getItemByKey(process.env.PRODUCTS_TABLE, 'id', productId);
    if (!product) {
      return formatJSONResponse({error: 'Product not found'}, 404);
    }

    const stock: Stock = await getItemByKey(process.env.STOCKS_TABLE, 'product_id', productId);
    const result: ProductWithStock = {...product, count: stock?.count || 0};

    return formatJSONResponse(result);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(getProductsById);
