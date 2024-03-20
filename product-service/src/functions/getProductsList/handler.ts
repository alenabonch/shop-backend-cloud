import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from '../../mocks/products';

const getProductsList = async () => {
  try {
    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse({error});
  }
};

export const main = middyfy(getProductsList);
