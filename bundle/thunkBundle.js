var allModuleName = { ...allModuleName, ...{ "../redux/thunk.js": "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/thunk.js" } };
var allModuleContent = {
  ...allModuleContent,
  ...{
    "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/thunk.js": function anonymous(require, module, exports) {
      const thunkMiddleware = (store) => (next) => (action) => {
        if (typeof action === "function") {
          action(store.dispatch, store);
        } else {
          next(action);
        }
      };

      window.thunk = thunkMiddleware;

      module.exports.thunkMiddleware = thunkMiddleware;
    },
  },
};
var cache = cache || {};
function require(entry) {
  const fullModulePath = allModuleName[entry] || entry;
  if (!(fullModulePath in cache)) {
    const module = { exports: {} };
    cache[fullModulePath] = module;
    allModuleContent[fullModulePath](require, module, module.exports);
  }
  return cache[fullModulePath].exports;
}
// start
require("../redux/thunk.js");
