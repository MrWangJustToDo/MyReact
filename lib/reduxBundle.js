const appEntry_b3cebe9e3716a =
  "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/index.js";
var allModuleName = {
  ...allModuleName,
  ...{
    "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/index.js":
      "a2a32ec86d144",
    "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/createSore.js":
      "241a4e6aefad4",
    "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/reactRedux.js":
      "3a64cb79bbd11",
  },
};
var allModuleContent = {
  ...allModuleContent,
  ...{
    a2a32ec86d144: function anonymous(require, module, exports) {
      const {
        createStore,
        applyMiddleware,
        combineReducers,
      } = require("./createSore.js");

      const {
        Provider,
        useStore,
        useSelector,
        useDispatch,
      } = require("./reactRedux.js");

      window.Redux = { createStore, applyMiddleware, combineReducers };
      window.ReactRedux = { Provider, useSelector, useStore, useDispatch };
    },
    "241a4e6aefad4": function anonymous(require, module, exports) {
      const INIT_ACTION = "_myRedux_init_action_";

      class Store {
        listeners = [];

        constructor(initialState, reducers) {
          this.reducers = reducers;
          this.initialState = initialState;
          this._init();
        }

        _init() {
          this.state = undefined;
          this.dispatch({ type: INIT_ACTION });
        }

        dispatch = (action) => {
          const newState = runReducers(
            this.reducers,
            this.state || this.initialState,
            action
          );
          if (newState === null || newState === undefined) {
            throw new Error("get a invalid state");
          }
          this.state = newState;
          this._updateAll();
        };

        getState = () => {
          return this.state;
        };

        subscribe = (node) => {
          this.listeners.push(node);

          return () => {
            this.listeners = this.listeners.filter((n) => n !== node);
          };
        };

        _updateAll() {
          this.listeners.forEach((n) => n());
        }

        replaceReducer = (newReducers) => {
          this.reducers = newReducers;
          this._init();
        };
      }

      const runReducers = (reducers, previousState, action) => {
        let re = {};
        if (typeof reducers === "object") {
          for (let key in reducers) {
            re[key] = runReducers(
              reducers[key],
              previousState ? previousState[key] : undefined,
              action
            );
          }
        } else {
          re = reducers(previousState, action);
        }

        return re;
      };

      // middleware (store) => (next) => (action) => {}

      const applyMiddleware =
        (middleware = []) =>
        (store) =>
          middleware.map((m) => m(store));

      const createStore = (reducers, initialState, middleware) => {
        let targetInitialState =
          typeof initialState !== "function" ? initialState : null;

        const store = new Store(targetInitialState, reducers);

        middleware = middleware ? middleware(store) : [];

        const originalDispatch = store.dispatch;

        const dispatch = middleware.length
          ? middleware.reduce((p, c) => p(c))(originalDispatch)
          : originalDispatch;

        store.dispatch = dispatch;

        return store;
      };

      const combineReducers = (reducers) => reducers;

      module.exports.createStore = createStore;
      module.exports.applyMiddleware = applyMiddleware;
      module.exports.combineReducers = combineReducers;
    },
    "3a64cb79bbd11": function anonymous(require, module, exports) {
      if (!window.React) {
        throw new Error("can not found React package");
      }

      const {
        createContext,
        createElement,
        useReducer,
        useEffect,
        useContext,
        useRef,
      } = React;

      const ReactReduxContext = createContext();

      const Provider = ({ store, children }) => {
        return createElement(
          ReactReduxContext.Provider,
          { value: store },
          children
        );
      };

      const useStore = () => useContext(ReactReduxContext);

      const useForceUpdate = () => {
        const [, forceUpdate] = useReducer((a) => a + 1, 0);
        return forceUpdate;
      };

      const useDispatch = () => {
        const store = useStore();
        return store.dispatch;
      };

      const useSelector = (selector) => {
        const store = useStore();
        const forceUpdate = useForceUpdate();
        const previousSelectedStateRef = useRef(selector(store.getState()));

        useEffect(() => {
          const unSubscribe = store.subscribe(forceUpdate);

          return unSubscribe;
        }, [store]);

        useEffect(() => {
          const newSelectedState = selector(store.getState());
          if (previousSelectedStateRef.current !== newSelectedState) {
            previousSelectedStateRef.current = newSelectedState;
            forceUpdate();
          }
        });

        return previousSelectedStateRef.current;
      };

      module.exports.Provider = Provider;
      module.exports.useStore = useStore;
      module.exports.useDispatch = useDispatch;
      module.exports.useSelector = useSelector;
    },
  },
};
var fullPathToModuleId = {
  ...fullPathToModuleId,
  ...{
    "./createSore.js":
      "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/createSore.js",
    "./reactRedux.js":
      "/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/reactRedux.js",
  },
};
var cache = cache || {};
function require(entry) {
  const targetEntry = fullPathToModuleId[entry] || entry;
  const hashId = allModuleName[targetEntry];
  if (!(hashId in cache)) {
    const module = { exports: {} };
    cache[hashId] = module;
    allModuleContent[hashId](require, module, module.exports);
  }
  return cache[hashId].exports;
}
// start
require(appEntry_b3cebe9e3716a);
