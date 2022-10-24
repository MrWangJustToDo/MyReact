export const once = <T extends any[], K = any>(action: (...args: T) => K) => {
  let called = false;
  return (...args: T) => {
    if (called) return;
    called = true;
    if (typeof action === "function") {
      action.call(null, ...args);
    }
  };
};
