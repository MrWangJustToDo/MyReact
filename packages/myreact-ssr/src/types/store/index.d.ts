import type { ClientReducer, ClientReducerKey } from "./client";
import type { ServerReducer, ServerReducerKey } from "./server";
import type { Store } from "redux";
import type { Task } from "redux-saga";
import type { ThunkDispatch } from "redux-thunk";

export interface StoreState {
  server: { [T in ServerReducerKey]: ServerReducer[T] };
  client: { [T in ClientReducerKey]: ClientReducer[T] };
}

export interface SagaStore extends Store<StoreState> {
  sagaTask?: Task;
  dispatch: ThunkDispatch;
}
