import { useDispatch, useSelector } from "react-redux";
import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import thunkMiddleware from "redux-thunk";

import { rootReducer } from "./reducer";
import { rootSaga } from "./saga";
import { SagaManager } from "./saga/utils";

import type { SagaStore } from "./type";
import type { TypedUseSelectorHook } from "react-redux";
import type { Middleware, PreloadedState } from "redux";

type CreateStoreProps = {
  preloadedState?: PreloadedState<ReturnType<typeof rootReducer>>;
  middleware?: Middleware[];
};

const devTools =
  __CLIENT__ && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsDenylist: [] });

const composeEnhancers = devTools || compose;

export const createUniversalStore = (props: CreateStoreProps = {}): SagaStore => {
  const { preloadedState, middleware = [] } = props;
  const sagaMiddleware = createSagaMiddleware();
  const allMiddleware = [thunkMiddleware, sagaMiddleware, ...middleware];
  const store = createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...allMiddleware))) as SagaStore;
  store.sagaTask = SagaManager.startSagas(rootSaga, sagaMiddleware);

  // Enable Webpack hot module
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("./reducer", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { rootReducer: nextRootReducer } = require("./reducer");
      store.replaceReducer(nextRootReducer);
    });

    module.hot.accept("./saga", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { rootSaga: nextRootSaga } = require("./saga");
      SagaManager.cancelSagas(store);
      store.sagaTask = SagaManager.startSagas(nextRootSaga, sagaMiddleware);
    });
  }

  return store;
};

export type RootState = ReturnType<typeof rootReducer>;

export type RootStore = ReturnType<typeof createUniversalStore>;

export type AppDispatch = ReturnType<typeof createUniversalStore>["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
