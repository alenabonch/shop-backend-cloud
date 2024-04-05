import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, ProductWithStock, Stock } from 'src/models/product';
import { getAllItems } from '../../db/commands/get-all-items';

export const getProductsList = async () => {
  try {
    console.log('Get products list handler');

    const products: Product[] = await getAllItems(process.env.PRODUCTS_TABLE);
    const stocks: Stock[] = await getAllItems(process.env.STOCKS_TABLE);

    const result: ProductWithStock[] = products.map((product) => {
      const stock = stocks.find((stock) => stock.product_id === product.id);
      return {...product, count: stock?.count || 0};
    });

    return formatJSONResponse(result);
  } catch (error) {
    return formatJSONResponse({error}, 500);
  }
};

export const main = middyfy(getProductsList);
