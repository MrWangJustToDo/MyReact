import type { ReducerStateAction } from "./reducer";
import type { apiName } from "config/api";
import type { Dispatch } from "redux";
import type { homeReducer, blogReducer, langReducer, cookieReducer } from "store/reducer/server/action";

export type ServerReducerKey = apiName;

export type ServerReducer = {
  [apiName.home]: ReturnType<typeof homeReducer>;
  [apiName.blog]: ReturnType<typeof blogReducer>;
  [apiName.lang]: ReturnType<typeof langReducer>;
  [apiName.cookie]: ReturnType<typeof cookieReducer>;
};

export interface ServerActionType {
  GET_DATA_LOADING: (name: ServerReducerKey) => string;
  GET_DATA_ACTION: (name: ServerReducerKey) => string;
  GET_DATA_SUCCESS: (name: ServerReducerKey) => string;
  GET_DATA_FAIL: (name: ServerReducerKey) => string;
}

export type CreateServerActionProps<T, K> = {
  name: ServerReducerKey;
  data?: T;
  error?: unknown | Error;
} & K;

export interface CreateServerActionType {
  <T, K = unknown>(props: CreateServerActionProps<T, K>): ReducerStateAction<T>;
}

export interface CreateServerActionWithDispatchType {
  <T, K = unknown>(props: CreateServerActionProps<T, K>): (dispatch: Dispatch) => Promise<void>;
}
