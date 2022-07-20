export const once = <T extends any[], K = any>(action: (...args: T) => K) => {
  let called = false;
  return (...args: T) => {
    if (called) return;
    called = true;
    action.call(null, ...args);
  };
};
