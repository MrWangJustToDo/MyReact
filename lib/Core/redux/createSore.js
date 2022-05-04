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
