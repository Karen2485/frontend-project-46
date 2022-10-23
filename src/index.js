import fs from 'fs';
import path from 'path';
import compareData from './compareData.js';
import diff from './formatters/stylish.js';
import parse from './parsers.js';

const getAbsolutPath = (filepath) => path.resolve(process.cwd(), filepath);
const readFile = (filepath) => fs.readFileSync(getAbsolutPath(filepath), 'utf-8');
const getFormat = (filename) => path.extname(filename);

const genDiff = (file1, file2) => {
  const data1 = readFile(file1);
  const data2 = readFile(file2);
  const parsed1 = parse(data1, getFormat(file1));
  const parsed2 = parse(data2, getFormat(file2));
  const data = compareData(parsed1, parsed2);

  return diff(data);
};

export default genDiff;
