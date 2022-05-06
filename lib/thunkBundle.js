
const appEntry_a9f94ae79758f = '/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/thunk.js';
var allModuleName = {...allModuleName, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/thunk.js':"d2b0e48fbfee6", 
}};
var allModuleContent = {...allModuleContent, ...{'d2b0e48fbfee6':function anonymous(require,module,exports
) {
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    action(store.dispatch, store.getState);
  } else {
    next(action);
  }
};

window.thunk = thunkMiddleware;

module.exports.thunkMiddleware = thunkMiddleware;

},
}};
var fullPathToModuleId = {...fullPathToModuleId, ...{}};
var cache = cache || {};
function require(entry) {
  const targetEntry = fullPathToModuleId[entry] || entry;
  const hashId = allModuleName[targetEntry];
  if (!(hashId in cache)) {
    const module = {exports: {}};
    cache[hashId] = module;
    allModuleContent[hashId](require, module, module.exports)
  }
  return cache[hashId].exports;
}
// start 
require(appEntry_a9f94ae79758f)
    