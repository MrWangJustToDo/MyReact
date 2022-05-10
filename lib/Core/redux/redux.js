const INIT_ACTION = "_myRedux_init_action_";

class Store {
  listeners = [];

  constructor(initialState, reducers) {
    this.reducers = reducers;
    this.initialState = initialState;
  }

  init = () => {
    this.state = undefined;
    this.dispatch({ type: INIT_ACTION });
  };

  dispatch = (action) => {
    if (typeof action === "object") {
      if (!action.type) {
        throw new Error("redux action must have a type field");
      }
      const newState = runReducers(
        this.reducers,
        this.state || this.initialState,
        action
      );
      if (newState === null || newState === undefined) {
        throw new Error("get a invalid state");
      }
      this.state = newState;
      // ignore initial
      if (action.type !== INIT_ACTION) {
        this._updateAll();
      }
    } else {
      throw new Error("redux action must a object");
    }
  };

  getState = () => {
    return this.state;
  };

  subscribe = (node) => {
    this.unSubscribe(node);
    this.listeners.push(node);

    return () => {
      this.unSubscribe(node);
    };
  };

  unSubscribe = (node) => {
    this.listeners = this.listeners.filter((n) => n !== node);
  };

  _updateAll() {
    this.listeners.forEach((n) => n());
  }

  replaceReducer = (newReducers) => {
    this.reducers = newReducers;
    this.init();
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
  (...middleware) =>
  (store) =>
    middleware.map((m) => m(store));

const createStore = (reducers, initialState, middleware) => {
  let targetInitialState =
    typeof initialState !== "function" ? initialState : null;

  let targetMiddleware =
    typeof initialState === "function" ? initialState : middleware;

  const store = new Store(targetInitialState, reducers);

  let dispatch = store.dispatch;

  const middlewareApi = {
    getState: store.getState,
    dispatch: (...args) => dispatch.call(null, ...args),
  };

  targetMiddleware = targetMiddleware ? targetMiddleware(middlewareApi) : [];

  const originalDispatch = store.dispatch;

  dispatch = targetMiddleware.length
    ? targetMiddleware.reduce((p, c) => p(c))(originalDispatch)
    : originalDispatch;

  store.dispatch = dispatch;

  store.init();

  return store;
};

const combineReducers = (reducers) => reducers;

const bindActionCreators = (actionCreator, dispatch) => {
  if (typeof actionCreator === "function") {
    return (...args) => {
      return dispatch(actionCreator.call(null, ...args));
    };
  } else {
    let assignActionCreator = { ...actionCreator };
    for (let key in assignActionCreator) {
      assignActionCreator[key] = bindActionCreators(
        assignActionCreator[key],
        dispatch
      );
    }
    return assignActionCreator;
  }
};

const Redux = {
  createStore,
  applyMiddleware,
  combineReducers,
  bindActionCreators,
};

window.Redux = Redux;

module.exports.Redux = Redux;
