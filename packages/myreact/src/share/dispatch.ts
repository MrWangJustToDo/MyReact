import { createRef } from "./createRef";
import {
  useCallbackHook,
  useContextHook,
  useDebugValueHook,
  useDeferredValueHook,
  useEffectHook,
  useIdHook,
  useImperativeHandleHook,
  useInsertionEffectHook,
  useLayoutEffectHook,
  useMemoHook,
  useReducerHook,
  useRefHook,
  useStateHook,
  useSyncExternalStoreHook,
  useTransitionHook,
  useSignalHook,
  useFunc,
  useOptimisticHook,
} from "./hook";

const Dispatch = {
  readContext: useFunc,
  use: useFunc,
  useCallback: useCallbackHook,
  useContext: useContextHook,
  useDebugValue: useDebugValueHook,
  useDeferredValue: useDeferredValueHook,
  useEffect: useEffectHook,
  useId: useIdHook,
  useImperativeHandle: useImperativeHandleHook,
  useInsertionEffect: useInsertionEffectHook,
  useLayoutEffect: useLayoutEffectHook,
  useMemo: useMemoHook,
  useReducer: useReducerHook,
  useRef: useRefHook,
  useState: useStateHook,
  useSignal: useSignalHook,
  useSyncExternalStore: useSyncExternalStoreHook,
  useTransition: useTransitionHook,
  useOptimistic: useOptimisticHook,
};

export const Dispatcher = createRef({
  ...Dispatch,
  proxy: null as typeof Dispatch | null,
});

export const resolveDispatcher = () => {
  if (Dispatcher.current?.proxy) {
    return Dispatcher.current.proxy;
  } else {
    return Dispatcher.current;
  }
};
