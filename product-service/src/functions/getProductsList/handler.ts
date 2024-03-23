import { formatJSONResponse } from '@libs/api-gateway';
import { getJsonFromS3 } from '@libs/aws-utils';
import { middyfy } from '@libs/lambda';

export const getProductsList = async () => {
  try {
    const products = await getJsonFromS3('my-first-live-app', 'products.json');
    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(getProductsList);
