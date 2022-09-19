import { produce } from "immer";

import { clientActionName } from "@shared/store/action";

import { clientAction } from "../share/action";

import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "@shared/store/type";
import type { Reducer } from "redux";

type State = Record<string, Record<string, unknown>>;

type CurrentState = ReducerState<State>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const clientPropsReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<State>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<State> = {
  [clientAction.SET_DATA_LOADING(clientActionName.clientProps)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(clientActionName.clientProps)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(clientActionName.clientProps)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { clientPropsReducer };
