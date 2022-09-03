
var allModuleName = {...allModuleName, ...{'../zustand/react.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/zustand/react.js", 
'./instance.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/zustand/instance.js", 
}};
var allModuleContent = {...allModuleContent, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/zustand/react.js':function anonymous(require,module,exports
) {
const { useRef, useEffect, useReducer, useLayoutEffect } = window.React;

const { create, log } = require("./instance.js");

const createStore = (action) => {
  const store = create(action);
  const listener = (selector, equalFunction = Object.is) => {
    const [, forceUpdate] = useReducer((p) => p + 1, 0);
    const state = store.getState();
    const stateRef = useRef(state);
    const selectorRef = useRef(selector);
    const equalFunctionRef = useRef(equalFunction);

    const sliceRef = useRef(undefined);

    if (sliceRef.current === undefined) sliceRef.current = selector(state);

    let newSlice = undefined;
    let hasSliceChanged = false;

    if (
      stateRef.current !== state ||
      selectorRef.current !== selector ||
      equalFunctionRef.current !== equalFunction
    ) {
      newSlice = selector(state);
      hasSliceChanged = !equalFunction(newSlice, sliceRef.current);
    }

    useLayoutEffect(() => {
      if (hasSliceChanged) sliceRef.current = newSlice;
      stateRef.current = state;
      selectorRef.current = selector;
      equalFunctionRef.current = equalFunction;
    });

    useLayoutEffect(() => {
      const listener = () => {
        const newSlice = selectorRef.current(store.getState());
        const hasSliceChanged = !equalFunctionRef.current(
          newSlice,
          sliceRef.current
        );
        if (hasSliceChanged) {
          sliceRef.current = newSlice;
          forceUpdate();
        }
      };

      const unsubscribe = store.subscribe(listener);

      return unsubscribe;
    }, []);

    return hasSliceChanged ? newSlice : sliceRef.current;
  };

  return listener;
};

const zustand = {
  log,
  create,
  createStore,
};

window.zustand = zustand;

module.exports.zustand = zustand;

},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/lib/zustand/instance.js':function anonymous(require,module,exports
) {
// 内部使用的创建方法
const create = (action) => {
  let state = null;
  let prevState = null;
  let listeners = new Set();

  const setState = (_state, replace = false) => {
    let newState = typeof _state === "function" ? _state(state) : _state;
    if (!Object.is(newState, state)) {
      let finalState = replace ? newState : Object.assign({}, state, newState);
      prevState = state;
      state = finalState;
      listeners.forEach((n) => n());
    }
  };

  const getState = () => state;

  const subscribe = (n) => {
    listeners.add(n);
    return () => listeners.delete(n);
  };

  const destroy = () => listeners.clear();

  const api = {
    setState,
    getState,
    subscribe,
    destroy,
  };

  // initial
  state = action(setState, getState, api);

  return api;
};

const log = (config) => (set, get, api) =>
  config(
    // 覆盖传入的api的set方法
    (...args) => {
      console.log("  applying", args);
      set(...args);
      console.log("  new state", get());
    },
    get,
    api
  );

module.exports.log = log;
module.exports.create = create;

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
require('../zustand/react.js')
    