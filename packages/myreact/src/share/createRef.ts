export const createRef = <T = any>(value: T) => {
  const refValue = { current: value };

  if (__DEV__ && typeof Object.seal === "function") Object.seal(refValue);

  return refValue;
};
