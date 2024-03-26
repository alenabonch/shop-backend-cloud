import * as utils from '@libs/aws-utils';
import { products } from '../../mocks/products';
import { getProductsList } from './handler';

jest.mock('@libs/aws-utils');

describe('getProductsList', () => {
  it('should return products list', async () => {
    jest.spyOn(utils, 'getJsonFromS3').mockResolvedValue(products);
    const data = await getProductsList();
    expect(data.statusCode).toEqual(200);
    expect(JSON.parse(data.body)).toEqual(products);
  })

  it('should throw 500 error', async () => {
    jest.spyOn(utils, 'getJsonFromS3').mockRejectedValue(new Error());
    const data = await getProductsList();
    expect(data.statusCode).toEqual(500);
  })
})
