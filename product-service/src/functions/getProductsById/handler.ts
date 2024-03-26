import { formatJSONResponse } from '@libs/api-gateway';
import { getJsonFromS3 } from '@libs/aws-utils';
import { middyfy } from '@libs/lambda';

export const getProductsById = async (event: any) => {
  try {
    const productId = event.pathParameters.productId;
    const products = await getJsonFromS3('my-first-live-app', 'products.json');
    const product = products.find((product) => product.id === productId);

    if (!product) {
      return formatJSONResponse({error: 'Product not found'}, 404);
    }
    return formatJSONResponse(product);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(getProductsById);
