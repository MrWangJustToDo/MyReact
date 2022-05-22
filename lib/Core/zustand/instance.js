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
