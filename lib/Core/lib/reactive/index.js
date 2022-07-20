const { currentFunctionFiber } = require("../lib/env.js");

const createReactive = (data) => {
  if (typeof data !== "object") {
    throw new Error("can not reactive a plain data");
  }

  return defineReactive(data);
};

const defineReactive = (data) => {
  if (typeof data === "object") {
    if (!Object.prototype.hasOwnProperty.call(data, "__reactive__")) {
      if (Array.isArray(data)) {
        // TODO
      } else {
        for (const key in data) {
          let listener = [];
          let originalValue = data[key];
          originalValue =
            typeof originalValue === "object"
              ? defineReactive(originalValue)
              : originalValue;
          Object.defineProperty(data, key, {
            get() {
              listener = listener.filter((n) => n && n.mount);
              currentFunctionFiber.current &&
                listener.every((n) => n !== currentFunctionFiber.current) &&
                listener.push(currentFunctionFiber.current);
              return originalValue;
            },
            set(val) {
              if (!Object.is(originalValue, val)) {
                val = typeof val === "object" ? defineReactive(val) : val;
                Promise.resolve().then(() => {
                  listener.forEach((n) => {
                    if (n.mount) n.update();
                  });
                });
                originalValue = val;
              }
            },
          });
        }
      }
      Object.defineProperty(data, "__reactive__", {
        value: data,
        enumerable: false,
        configurable: false,
      });
    }
    return data;
  }
};

window.createReactive = createReactive;

module.exports.createReactive = createReactive;
