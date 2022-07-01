
var allModuleName = {...allModuleName, ...{'../redux/reactRedux.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/reactRedux.js", 
'./redux.js':"/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/redux.js", 
}};
var allModuleContent = {...allModuleContent, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/reactRedux.js':function anonymous(require,module,exports
) {
const { Redux } = require("./redux.js");

const React = window.React;

function isNormalEqual(src, target) {
  if (
    typeof src === "object" &&
    typeof target === "object" &&
    src !== null &&
    target !== null
  ) {
    let flag = true;
    flag = flag && Object.keys(src).length === Object.keys(target).length;
    for (let key in src) {
      flag = flag && Object.is(src[key], target[key]);
      if (!flag) {
        return flag;
      }
    }
    return flag;
  }
  return Object.is(src, target);
}

const ReactReduxContext = React.createContext();

const Provider = ({ store, children }) => {
  return React.createElement(
    ReactReduxContext.Provider,
    { value: store },
    children
  );
};

const useStore = () => React.useContext(ReactReduxContext);

const useForceUpdate = () => {
  const [, forceUpdate] = React.useReducer((a) => a + 1, 0);
  return forceUpdate;
};

const useDispatch = () => {
  const store = useStore();
  return store.dispatch;
};

const useSelector = (selector) => {
  const store = useStore();
  const forceUpdate = useForceUpdate();
  const selectorRef = React.useRef(selector);
  const previousSelectedStateRef = React.useRef(selector(store.getState()));

  selectorRef.current = selector;

  React.useEffect(() => {
    const update = () => {
      const newSelectedState = selectorRef.current(store.getState());
      if (previousSelectedStateRef.current !== newSelectedState) {
        previousSelectedStateRef.current = newSelectedState;
        forceUpdate();
      }
    };
    const unSubscribe = store.subscribe(update);
    return unSubscribe;
  }, [store]);

  return previousSelectedStateRef.current;
};

const connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
  const generateConnectComponent = (Render) => {
    class ConnectComponent extends React.PureComponent {
      static contextType = ReactReduxContext;
      constructor(p, c) {
        super(p, c);
        this.state = {
          ...this._mapStateToProps(),
          ...this._mapDispatchToProps(),
          dispatch: c.dispatch,
        };
      }

      _mapStateToProps = () => {
        return mapStateToProps
          ? mapStateToProps(this.context.getState(), this.props)
          : null;
      };

      _mapDispatchToProps = () => {
        return typeof mapDispatchToProps === "function"
          ? mapDispatchToProps(this.context.dispatch, this.props)
          : Redux.bindActionCreators(mapDispatchToProps, this.context.dispatch);
      };

      update = () => {
        const newState = {
          ...this._mapStateToProps(),
          dispatch: this.context.dispatch,
        };
        if (!isNormalEqual(newState, this.state)) {
          this.setState(newState);
        }
      };

      componentDidMount() {
        this.unSubscribe = this.context.subscribe(this.update);
      }

      componentWillUnmount() {
        this.unSubscribe();
      }

      render() {
        return React.createElement(Render, { ...this.props, ...this.state });
      }
    }

    return ConnectComponent;
  };
  return generateConnectComponent(Component);
};

const ReactRedux = {
  connect,
  Provider,
  useStore,
  useDispatch,
  useSelector,
};

window.ReactRedux = ReactRedux;

module.exports.ReactRedux = ReactRedux;

},
'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/redux.js':function anonymous(require,module,exports
) {
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
    ? targetMiddleware.reduce((p, c) => c(p), originalDispatch)
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
require('../redux/reactRedux.js')
    