import { produce } from "immer";

import { apiName } from "config/api";

import { serverAction } from "../share/action";

import type { Reducer } from "redux";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

type LangObject = { [props: string]: any };

type CurrentState = ReducerState<LangObject>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const langReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<LangObject>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<LangObject> = {
  [serverAction.GET_DATA_LOADING(apiName.lang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.lang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = { ...proxy.data, ...action.data };
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.lang)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { langReducer };
