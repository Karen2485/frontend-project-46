import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value) && value !== null) {
    return '[complex value]';
  }
  if (_.isString(value) && value !== null) {
    return `'${value}'`;
  }
  return value;
};

const plain = (innerTree) => {
  const format = (nodes, parent) => nodes
    .filter((node) => node.type !== 'unchanged')
    .map((node) => {
      const property = parent ? `${parent}.${node.key}` : node.key;
      switch (node.type) {
        case 'added':
          return `Property '${property}' was added with value: ${stringify(node.value)}`;
        case 'removed':
          return `Property '${property}' was removed`;
        case 'changed':
          return `Property '${property}' was updated. From ${stringify(node.oldValue)} to ${stringify(node.value)}`;
        case 'nested':
          return `${format(node.children, property)}`;
        default:
          throw new Error(`This type does not exist: ${node.type}`);
      }
    }).join('\n');
  return format(innerTree, 0);
};
export default plain;
