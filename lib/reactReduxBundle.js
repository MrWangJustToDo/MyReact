
const appEntry_0ca2287fa6df8 = '/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/reactRedux.js';
var allModuleName = {...allModuleName, ...{'/home/mrwang/Documents/Web/Code/D_React/MyReact/lib/Core/redux/reactRedux.js':"3a66129c4c976", 
}};
var allModuleContent = {...allModuleContent, ...{'3a66129c4c976':function anonymous(require,module,exports
) {
if (!window.React) {
  throw new Error("can not found React package");
}

if (!window.Redux) {
  throw new Error("can not found Redux package");
}

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
    class ConnectComponent extends React.Component {
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
          ...this._mapDispatchToProps(),
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

window.ReactRedux = {
  connect,
  Provider,
  useStore,
  useDispatch,
  useSelector,
};

},
}};
var fullPathToModuleId = {...fullPathToModuleId, ...{}};
var cache = cache || {};
function require(entry) {
  const targetEntry = fullPathToModuleId[entry] || entry;
  const hashId = allModuleName[targetEntry];
  if (!(hashId in cache)) {
    const module = {exports: {}};
    cache[hashId] = module;
    allModuleContent[hashId](require, module, module.exports)
  }
  return cache[hashId].exports;
}
// start 
require(appEntry_0ca2287fa6df8)
    