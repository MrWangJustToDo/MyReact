import { produce } from "immer";

import { serverActionName } from "@shared/store/action";

import { serverAction } from "../share/action";

import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "@shared/store/type";
import type { Reducer } from "redux";

type LangObject = { [props: string]: Record<string, string> };

type CurrentState = ReducerState<LangObject>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const serverLangReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<LangObject>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<LangObject> = {
  [serverAction.GET_DATA_LOADING(serverActionName.serverLang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(serverActionName.serverLang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = { ...proxy.data, ...action.data };
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(serverActionName.serverLang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { serverLangReducer };
