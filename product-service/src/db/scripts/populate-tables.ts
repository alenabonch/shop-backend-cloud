import { readFileSync } from "fs";
import { batchWrite } from '../commands/batch-write';

const tablesToPopulate: { tableName: string, filePath: string }[] = [
  {tableName: 'Products', filePath: 'src/db/data/products.json'},
  {tableName: 'Stocks', filePath: 'src/db/data/stocks.json'},
];

const populateTable = async (tableName: string, filePath: string) => {
  console.log('Populating table from file: ', tableName, filePath);

  const file = readFileSync(filePath);
  const items = JSON.parse(file.toString());

  await batchWrite(tableName, items)
};

Promise.all(tablesToPopulate.map(({tableName, filePath}) => populateTable(tableName, filePath)))
.then(() => {
  console.log('All tables successfully populated');
}).catch((e) => {
  console.log('Error populating tables', e);
});
