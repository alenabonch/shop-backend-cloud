import * as utils from '@libs/aws-utils';
import { products } from '../../mocks/products';
import { getProductsById } from './handler'

jest.mock('@libs/aws-utils');

describe('getProductsById', () => {
  it('should return product found by id', async () => {
    jest.spyOn(utils, 'getJsonFromS3').mockResolvedValue(products);
    const data = await getProductsById({
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
      },
    });
    expect(data.statusCode).toEqual(200);
    expect(JSON.parse(data.body)).toEqual(products[1]);
  })

  it('should throw 404 product not found error', async () => {
    jest.spyOn(utils, 'getJsonFromS3').mockResolvedValue(products);
    const data = await getProductsById({
      pathParameters: {
        productId: 'unknown-id',
      },
    });
    expect(data.statusCode).toEqual(404);
    expect(JSON.parse(data.body)).toEqual({error: 'Product not found'});
  })

  it('should throw 500 error', async () => {
    jest.spyOn(utils, 'getJsonFromS3').mockRejectedValue(new Error());
    const data = await getProductsById({
      pathParameters: {
        productId: 'some-id',
      },
    });
    expect(data.statusCode).toEqual(500);
  })
})
