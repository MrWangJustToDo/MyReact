export const safeData = <T extends Record<string, unknown>>(data: T, key?: string): T => {
  if (key) {
    const cacheData = data[key];
    Object.defineProperty(data, key, {
      get: function () {
        return cacheData;
      },
      configurable: false,
    });
    return data;
  } else {
    Object.keys(data).forEach((key) => {
      const cacheData = data[key];
      Object.defineProperty(data, key, {
        get: function () {
          return cacheData;
        },
        configurable: false,
      });
    });
    return data;
  }
};
