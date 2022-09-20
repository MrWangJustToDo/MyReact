import type { rootReducer } from "./reducer";
import type { CreateClientActionType } from "./reducer/client/type";
import type { CreateServerActionType } from "./reducer/server/type";
import type { AnyAction, Store } from "redux";
import type { Task } from "redux-saga";
import type { ThunkDispatch } from "redux-thunk";

export interface ReducerState<T> {
  readonly data: T;
  readonly error: unknown | Error;
  readonly loading: boolean;
  readonly loaded: boolean;
}

export interface ReducerStateAction<T> extends AnyAction {
  data?: T;
  error?: Error | unknown;
  loadingState?: boolean;
}

export interface ReducerStateActionMapType<T> {
  [props: string]: (state: ReducerState<T>, action: ReducerStateAction<T>) => ReducerState<T>;
}

export type StoreState = ReturnType<typeof rootReducer>;

export interface SagaStore extends Store<StoreState> {
  sagaTask?: Task;
  dispatch: ThunkDispatch<StoreState, null, ReturnType<CreateServerActionType> | ReturnType<CreateClientActionType>>;
}
