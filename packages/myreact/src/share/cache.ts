// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const cache = <T extends Function>(fn: T) => {
  return fn();
};

export const cacheSignal = () => null;
