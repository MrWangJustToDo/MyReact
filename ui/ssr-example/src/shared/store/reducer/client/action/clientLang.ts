import { produce } from "immer";

import { clientActionName } from "@shared/store/action";

import { clientAction } from "../share/action";

import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "@shared/store/type";
import type { Reducer } from "redux";

type CurrentState = ReducerState<string>;

const initState: CurrentState = { data: "", error: null, loaded: false, loading: false };

const clientLangReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<string>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<string> = {
  [clientAction.SET_DATA_LOADING(clientActionName.clientLang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(clientActionName.clientLang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || "";
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(clientActionName.clientLang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { clientLangReducer };
