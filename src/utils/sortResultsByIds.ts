import _ from 'lodash';
export const sortItemsByIds= <T, I>(
  ids: Array<T>,
  items: Array<I>,
  idSelector: (item: I) => T
): Array<I> => {
  return _.sortBy(items, (obj) => {
    const index = ids.indexOf(idSelector(obj));
    return index === -1 ? Infinity : index;
  });
}
