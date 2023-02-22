
import type { clientLangReducer, clientPropsReducer } from "./action";
import type { clientActionName } from "@shared/store/action";
import type { ReducerStateAction } from "@shared/store/type";

export type ClientReducerKey = clientActionName;

export type ClientReducer = {
  [clientActionName.clientLang]: ReturnType<typeof clientLangReducer>;
  [clientActionName.clientProps]: ReturnType<typeof clientPropsReducer>;
};

export interface ClientActionType {
  SET_DATA_LOADING: (name: ClientReducerKey) => string;
  SET_DATA_ACTION: (name: ClientReducerKey) => string;
  SET_DATA_SUCCESS: (name: ClientReducerKey) => string;
  SET_DATA_FAIL: (name: ClientReducerKey) => string;
}
export interface CreateClientActionProps<T> {
  name: ClientReducerKey;
  data?: T;
  error?: unknown | Error;
}
export interface CreateClientActionType {
  <T>(props: CreateClientActionProps<T>): ReducerStateAction<T>;
}
