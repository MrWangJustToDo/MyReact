export const createRef = <T = any>(value: T) => {
  return { current: value };
};
