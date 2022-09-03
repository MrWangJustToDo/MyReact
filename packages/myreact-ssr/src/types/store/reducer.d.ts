import type { AnyAction } from "redux";

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
