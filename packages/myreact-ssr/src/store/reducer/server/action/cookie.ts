import { produce } from "immer";

import { apiName } from "config/api";

import { serverAction } from "../share/action";

import type { Reducer } from "redux";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type ServerCookie = string;

type CurrentState = ReducerState<ServerCookie>;

const initState: CurrentState = { data: "", error: null, loaded: false, loading: false };

const cookieReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<ServerCookie>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<ServerCookie> = {
  [serverAction.GET_DATA_LOADING(apiName.cookie)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.cookie)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || "";
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.cookie)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { cookieReducer };
