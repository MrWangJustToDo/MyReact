import type { ReducerStateAction } from "./reducer";
import type { actionName } from "config/action";
import type { initialPropsReducer, langReducer, loadingReducer, tokenReducer } from "store/reducer/client/action";

export type ClientReducerKey = actionName;

export type ClientReducer = {
  [actionName.currentLang]: ReturnType<typeof langReducer>;
  [actionName.currentToken]: ReturnType<typeof tokenReducer>;
  [actionName.currentLoading]: ReturnType<typeof loadingReducer>;
  [actionName.globalInitialProps]: ReturnType<typeof initialPropsReducer>;
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
