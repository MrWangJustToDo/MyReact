const logMiddleware = (store) => (next) => (action) => {
  const beforeState = store.getState();
  next(action);
  const afterState = store.getState();
  console.log({ beforeState, action, afterState });
};

window.log = logMiddleware;

module.exports.log = logMiddleware;
