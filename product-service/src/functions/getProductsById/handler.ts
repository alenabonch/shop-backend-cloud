import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from '../../mocks/products';

const getProductsList = async (event: any) => {
  const productId = event['pathParameters']['productId'];

  try {
    const product = products.find((product) => product.id === productId);
    if (!product) {
      return formatJSONResponse({error: 'Product not found'});
    }
    return formatJSONResponse(product);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(getProductsList);
