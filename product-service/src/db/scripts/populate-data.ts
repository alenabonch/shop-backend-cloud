import { readFileSync } from "fs";
import { batchWrite } from '../commands/batch-write';

const data: { tableName: string, filePath: string }[] = [
  {tableName: 'products', filePath: 'src/db/data/products.json'},
  {tableName: 'stocks', filePath: 'src/db/data/stocks.json'},
];

const populateData = async (tableName: string, filePath: string) => {
  console.log('Populating table from file: ', tableName, filePath);

  const file = readFileSync(filePath);
  const items = JSON.parse(file.toString());

  await batchWrite(tableName, items)
};

Promise.all(data.map(({tableName, filePath}) => populateData(tableName, filePath)))
.then(() => {
  console.log('All tables successfully populated');
}).catch((e) => {
  console.log('Error populating tables', e);
});
