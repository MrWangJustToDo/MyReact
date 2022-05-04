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
