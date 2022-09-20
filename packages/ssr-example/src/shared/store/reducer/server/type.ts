import type { serverLangReducer } from "./action";
import type { serverActionName } from "@shared/store/action";
import type { ReducerStateAction } from "@shared/store/type";
import type { Dispatch } from "redux";

export type ServerReducerKey = serverActionName;

export type ServerReducer = {
  [serverActionName.serverLang]: ReturnType<typeof serverLangReducer>;
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
