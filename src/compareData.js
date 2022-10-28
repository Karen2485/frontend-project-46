import _ from 'lodash';

const compareData = (obj1, obj2) => {
  const keys = [obj1, obj2].flatMap(Object.keys);
  const unionKeys = _.sortBy(_.union(keys));
  const nodes = unionKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return {
        key,
        type: 'nested',
        children: compareData(value1, value2),
      };
    }
    if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) return { key, type: 'added', value: value2 };
    if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) return { key, type: 'removed', value: value1 };
    if (value1 === value2) return { key, type: 'unchanged', value: value1 };
    return {
      key, type: 'changed', value: value2, oldValue: value1,
    };
  });
  return nodes;
};

export default compareData;
