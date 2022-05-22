const {
  useRef,
  useEffect,
  useReducer,
  useLayoutEffect,
} = require("../lib/hook.js");
const { create, log } = require("./instance.js");

const createStore = (action) => {
  const store = create(action);
  const listener = (selector, equalFunction = Object.is) => {
    const [, forceUpdate] = useReducer((p) => p + 1, 0);
    const state = store.getState();
    const stateRef = useRef(state);
    const selectorRef = useRef(selector);
    const equalFunctionRef = useRef(equalFunction);

    const sliceRef = useRef(undefined);

    if (sliceRef.current === undefined) sliceRef.current = selector(state);

    let newSlice = undefined;
    let hasSliceChanged = false;

    if (
      stateRef.current !== state ||
      selectorRef.current !== selector ||
      equalFunctionRef.current !== equalFunction
    ) {
      newSlice = selector(state);
      hasSliceChanged = !equalFunction(newSlice, sliceRef.current);
    }

    useLayoutEffect(() => {
      if (hasSliceChanged) sliceRef.current = newSlice;
      stateRef.current = state;
      selectorRef.current = selector;
      equalFunctionRef.current = equalFunction;
    });

    useLayoutEffect(() => {
      const listener = () => {
        const newSlice = selectorRef.current(store.getState());
        const hasSliceChanged = !equalFunctionRef.current(
          newSlice,
          sliceRef.current
        );
        if (hasSliceChanged) {
          sliceRef.current = newSlice;
          forceUpdate();
        }
      };

      const unsubscribe = store.subscribe(listener);

      return unsubscribe;
    }, []);

    return hasSliceChanged ? newSlice : sliceRef.current;
  };

  return listener;
};

const zustand = {
  log,
  create,
  createStore,
};

window.zustand = zustand;

module.exports.zustand = zustand;
