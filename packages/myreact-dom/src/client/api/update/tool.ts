/**
 * @internal
 */
export const getAllKeys = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
  const oldKeys = Object.keys(obj1);
  const newKeys = Object.keys(obj2);
  const allKeys = new Set([...oldKeys, ...newKeys]);
  return allKeys;
};
