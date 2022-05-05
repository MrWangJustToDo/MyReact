const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    action(store.dispatch, store.getState);
  } else {
    next(action);
  }
};

window.thunk = thunkMiddleware;

module.exports.thunkMiddleware = thunkMiddleware;
