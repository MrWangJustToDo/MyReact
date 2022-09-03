import { produce } from "immer";

import { actionName } from "config/action";

import { clientAction } from "../share/action";

import type { Reducer } from "redux";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type CurrentState = ReducerState<boolean>;

const initState: CurrentState = { data: false, error: null, loaded: false, loading: false };

const loadingReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<boolean>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<boolean> = {
  [clientAction.SET_DATA_LOADING(actionName.currentLoading)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentLoading)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || false;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentLoading)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = false;
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { loadingReducer };
