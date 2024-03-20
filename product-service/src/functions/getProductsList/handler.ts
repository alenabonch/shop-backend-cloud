import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getJsonFromS3 } from '../../utils/get-json-from-s3';

const getProductsList = async () => {
  try {
    const products = await getJsonFromS3('my-first-live-app', 'products.json');
    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse({error});
  }
};

export const main = middyfy(getProductsList);
