if (!window.React) {
  throw new Error("can not found React package");
}

const {
  createContext,
  createElement,
  useReducer,
  useEffect,
  useContext,
  useRef,
} = React;

const ReactReduxContext = createContext();

const Provider = ({ store, children }) => {
  return createElement(ReactReduxContext.Provider, { value: store }, children);
};

const useStore = () => useContext(ReactReduxContext);

const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((a) => a + 1, 0);
  return forceUpdate;
};

const useDispatch = () => {
  const store = useStore();
  return store.dispatch;
};

const useSelector = (selector) => {
  const store = useStore();
  const forceUpdate = useForceUpdate();
  const previousSelectedStateRef = useRef(selector(store.getState()));

  useEffect(() => {
    const unSubscribe = store.subscribe(forceUpdate);

    return unSubscribe;
  }, [store]);

  useEffect(() => {
    const newSelectedState = selector(store.getState());
    if (previousSelectedStateRef.current !== newSelectedState) {
      previousSelectedStateRef.current = newSelectedState;
      forceUpdate();
    }
  });

  return previousSelectedStateRef.current;
};

module.exports.Provider = Provider;
module.exports.useStore = useStore;
module.exports.useDispatch = useDispatch;
module.exports.useSelector = useSelector;
