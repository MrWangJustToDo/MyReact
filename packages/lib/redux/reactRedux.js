const { Redux } = require("./redux.js");

const React = window.React;

function isNormalEqual(src, target) {
  if (typeof src === "object" && typeof target === "object" && src !== null && target !== null) {
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
  return React.createElement(ReactReduxContext.Provider, { value: store }, children);
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
        return mapStateToProps ? mapStateToProps(this.context.getState(), this.props) : null;
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
