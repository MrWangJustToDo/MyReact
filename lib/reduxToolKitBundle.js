
var allModuleName = {...allModuleName, ...{'../redux/toolkit.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/toolkit.js", 
'./log.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/log.js", 
}};
var allModuleContent = {...allModuleContent, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/toolkit.js':function anonymous(require,module,exports
) {
// redux toolkit api

const { log } = require("./log.js");

const Redux = window.Redux;

const thunk = window.thunk;

const immer = window.immer;

const { produce } = immer;

const { createStore, applyMiddleware, combineReducers } = Redux;

const configureStore = ({ reducer, middleware = [] }) => {
  const allMiddleware = Array.isArray(middleware)
    ? [log, thunk].concat(middleware)
    : middleware(() => [log, thunk]);
  return createStore(
    combineReducers(reducer),
    applyMiddleware(...allMiddleware)
  );
};

const createSlice = ({ name, initialState, reducers }) => {
  const reducerMap = Object.keys(reducers).map((key) => ({
    key: `${name}/${key}`,
    action: reducers[key],
  }));
  const generateReducer = () => {
    const reducerObject = reducerMap.reduce(
      (p, c) => ({ ...p, [c.key]: c.action }),
      {}
    );
    return (state = initialState, action) => {
      if (reducerObject[action.type]) {
        const reducer = reducerObject[action.type];
        return produce(state, (proxy) => reducer(proxy, action));
      } else {
        return state;
      }
    };
  };
  const generateAction = () => {
    return Object.keys(reducers)
      .map((key) => ({
        [key]: (payload) => ({ type: `${name}/${key}`, payload }),
      }))
      .reduce((p, c) => ({ ...p, ...c }), {});
  };

  return {
    reducer: generateReducer(),
    actions: generateAction(),
  };
};

window.ReduxToolKit = {
  configureStore,
  createSlice,
};

module.exports.ReduxToolKit = this.ReduxToolKit;

},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/log.js':function anonymous(require,module,exports
) {
const logMiddleware = (store) => (next) => (action) => {
  const beforeState = store.getState();
  next(action);
  const afterState = store.getState();
  console.log({ beforeState, action, afterState });
};

window.log = logMiddleware;

module.exports.log = logMiddleware;

},
}};
var cache = cache || {};
function require(entry) {
  const fullModulePath = allModuleName[entry] || entry;
  if (!(fullModulePath in cache)) {
    const module = {exports: {}};
    cache[fullModulePath] = module;
    allModuleContent[fullModulePath](require, module, module.exports)
  }
  return cache[fullModulePath].exports;
}
// start 
require('../redux/toolkit.js')
    