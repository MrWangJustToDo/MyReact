var allModuleName = {
  ...allModuleName,
  ...{
    "../redux/toolkit.js": "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/toolkit.js",
    "./log.js": "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/log.js",
  },
};
var allModuleContent = {
  ...allModuleContent,
  ...{
    "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/toolkit.js": function anonymous(require, module, exports) {
      // redux toolkit api

      const { log } = require("./log.js");

      const Redux = window.Redux;

      const thunk = window.thunk;

      const immer = window.immer;

      const { produce } = immer;

      const { createStore, applyMiddleware, combineReducers } = Redux;

      const configureStore = ({ reducer, middleware = [], preloadedState }) => {
        const allMiddleware = Array.isArray(middleware) ? [log, thunk].concat(middleware) : middleware(() => [log, thunk]);
        return createStore(combineReducers(reducer), preloadedState, applyMiddleware(...allMiddleware));
      };

      const createAction = (key, prepare) => {
        const action = (payload) => ({
          type: key,
          payload: typeof prepare === "function" ? prepare(payload).payload : payload,
        });
        action.type = key;
        action.toString = () => key;
        return action;
      };

      const createReducer = (initialState, builderFunction) => {
        let reducerMap = {};

        const builder = {
          addCase: (action, reducer) => {
            reducerMap[typeof action === "string" ? action : action.type] = reducer;
            return builder;
          },
        };

        if (typeof builderFunction === "function") {
          // generate reducer map
          builderFunction(builder);
        } else {
          reducerMap = builderFunction;
        }

        const reducer = (state = typeof initialState === "function" ? initialState() : initialState, action) => {
          if (reducerMap[action.type]) {
            const reducer = reducerMap[action.type];
            return produce(state, (proxy) => reducer(proxy, action));
          } else {
            return state;
          }
        };

        return reducer;
      };

      const createSlice = ({ name, initialState, reducers }) => {
        const keyArray = Object.keys(reducers).map((key) => ({
          key,
          type: `${name}/${key}`,
          reducer: reducers[key],
        }));

        const generateAction = () => {
          return keyArray
            .map(({ key, type, reducer }) => {
              if (typeof reducer === "object") {
                return { [key]: createAction(type, reducer.prepare) };
              } else {
                return { [key]: createAction(type) };
              }
            })
            .reduce((p, c) => ({ ...p, ...c }), {});
        };

        const generateReducer = () => {
          return createReducer(
            initialState,
            keyArray
              .map(({ type, reducer }) => ({
                [type]: typeof reducer === "object" ? reducer.reducer : reducer,
              }))
              .reduce((p, c) => ({ ...p, ...c }), {})
          );
        };

        return {
          reducer: generateReducer(),
          actions: generateAction(),
        };
      };

      window.ReduxToolKit = {
        configureStore,
        createSlice,
        createAction,
        createReducer,
      };

      module.exports.ReduxToolKit = this.ReduxToolKit;
    },
    "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/redux/log.js": function anonymous(require, module, exports) {
      const logMiddleware = (store) => (next) => (action) => {
        const beforeState = store.getState();
        next(action);
        const afterState = store.getState();
        console.log({ beforeState, action, afterState });
      };

      window.log = logMiddleware;

      module.exports.log = logMiddleware;
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
require("../redux/toolkit.js");
