import type { CreateServerActionProps, CreateServerActionType, CreateServerActionWithDispatchType, ServerActionType } from "../type";

const serverAction: ServerActionType = {
  GET_DATA_ACTION: (name) => `@server_action_${name}_startWithSaga`,
  GET_DATA_LOADING: (name) => `@server_action_${name}_loading`,
  GET_DATA_SUCCESS: (name) => `@server_action_${name}_success`,
  GET_DATA_FAIL: (name) => `@server_action_${name}_fail`,
};

// support a usage like await dispatch(getDataAction_Server({name})) compose redux-saga & redux-thunk
const getDataAction_Server: CreateServerActionWithDispatchType =
  ({ name, ...resProps }) =>
  (dispatch) => {
    let done: null | (() => void) = null;
    const temp = new Promise<void>((r) => {
      done = r;
    });
    dispatch({ type: serverAction.GET_DATA_ACTION(name), done, ...resProps });
    return temp;
  };

const getDataLoading_server: CreateServerActionType = ({ name }) => ({ type: serverAction.GET_DATA_LOADING(name), loadingState: true });

const getDataSuccess_Server: CreateServerActionType = <T>({ name, data }: CreateServerActionProps<T, unknown>) => ({
  type: serverAction.GET_DATA_SUCCESS(name),
  data,
  loadingState: false,
});

const getDataFail_Server: CreateServerActionType = <T>({ name, error }: CreateServerActionProps<T, unknown>) => ({
  type: serverAction.GET_DATA_FAIL(name),
  error,
  loadingState: false,
});

export { serverAction, getDataLoading_server, getDataAction_Server, getDataSuccess_Server, getDataFail_Server };
