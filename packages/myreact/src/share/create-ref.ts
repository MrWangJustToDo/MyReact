/**
 * @public
 */
export const createRef = <T = any>(value: T) => {
  const refValue = { current: value };

  if (__DEV__ && typeof Object.seal === "function") Object.seal(refValue);

  return refValue;
};

/**
 * @internal
 */
export const createReadonlyRef = <T = any>(value: T) => {
  const refValue = { current: value, readonly: true };

  if (typeof Object.freeze === "function") Object.freeze(refValue);

  return refValue;
};
