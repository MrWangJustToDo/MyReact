// redux toolkit api

const { log } = require('./log.js');

const Redux = window.Redux;

const thunk = window.thunk;

const immer = window.immer;

const { produce } = immer;

const { createStore, applyMiddleware, combineReducers } = Redux;

const configureStore = ({ reducer, middleware = [], preloadedState }) => {
  const allMiddleware = Array.isArray(middleware)
    ? [log, thunk].concat(middleware)
    : middleware(() => [log, thunk]);
  return createStore(
    combineReducers(reducer),
    preloadedState,
    applyMiddleware(...allMiddleware)
  );
};

const createAction = (key, prepare) => {
  const action = (payload) => ({
    type: key,
    payload: typeof prepare === 'function' ? prepare(payload).payload : payload,
  });
  action.type = key;
  action.toString = () => key;
  return action;
};

const createReducer = (initialState, builderFunction) => {
  let reducerMap = {};

  const builder = {
    addCase: (action, reducer) => {
      reducerMap[typeof action === 'string' ? action : action.type] = reducer;
      return builder;
    },
  };

  if (typeof builderFunction === 'function') {
    // generate reducer map
    builderFunction(builder);
  } else {
    reducerMap = builderFunction;
  }

  const reducer = (
    state = typeof initialState === 'function' ? initialState() : initialState,
    action
  ) => {
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
        if (typeof reducer === 'object') {
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
          [type]: typeof reducer === 'object' ? reducer.reducer : reducer,
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
