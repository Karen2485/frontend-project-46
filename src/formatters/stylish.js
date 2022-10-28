import _ from 'lodash';

const makeIndent = (depth) => {
  const str = ' ';
  return str.repeat(depth * 4 - 2);
};

const stringify = (value, depth = 1) => {
  if (!_.isObject(value)) {
    return value;
  }
  const valueKeys = Object.keys(value);
  const mapKeys = valueKeys.map((key) => `${makeIndent(depth + 1)}  ${key}: ${stringify(value[key], depth + 1)}`);
  return `{\n${mapKeys.join('\n')}\n  ${makeIndent(depth)}}`;
};

const stylish = (innerTree) => {
  const iter = (tree, depth) => tree.map((node) => {
    const getValue = (value, sign) => `${makeIndent(depth)}${sign} ${node.key}: ${stringify(value, depth)}\n`;
    switch (node.type) {
      case 'added':
        return getValue(node.value, '+');
      case 'removed':
        return getValue(node.value, '-');
      case 'unchanged':
        return getValue(node.value, ' ');
      case 'changed':
        return `${getValue(node.oldValue, '-')}${getValue(node.value, '+')}`;
      case 'nested':
        return `${makeIndent(depth)}  ${node.key}: {\n${iter(node.children, depth + 1).join('')}${makeIndent(depth)}  }\n`;
      default:
        throw new Error(`This type does not exist: ${node.type}`);
    }
  });
  return `{\n${iter(innerTree, 1).join('')}}`;
};

export default stylish;
