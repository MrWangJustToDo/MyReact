import { produce } from "immer";

import { apiName } from "config/api";

import { serverAction } from "../share/action";

import type { Reducer } from "redux";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "types/store/reducer";

export type HomeProps = Array<string>;

type CurrentState = ReducerState<HomeProps>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const homeReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<HomeProps>) => {
  const actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<HomeProps> = {
  [serverAction.GET_DATA_LOADING(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      console.log("home loading");
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      console.log("home loaded");
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { homeReducer };
