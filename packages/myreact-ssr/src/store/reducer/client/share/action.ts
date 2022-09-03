import type { ClientActionType, CreateClientActionProps, CreateClientActionType } from "types/store/client";

const clientAction: ClientActionType = {
  SET_DATA_LOADING: (name) => `setDataAction_client_${name}`,
  SET_DATA_ACTION: (name) => `setDataAction_client_${name}`,
  SET_DATA_SUCCESS: (name) => `setDataSuccess_client_${name}`,
  SET_DATA_FAIL: (name) => `setDataFail_client_${name}`,
};

const setDataLoading_client: CreateClientActionType = ({ name }) => ({ type: clientAction.SET_DATA_LOADING(name), loadingState: true });

const setDataAction_client: CreateClientActionType = ({ name }) => ({ type: clientAction.SET_DATA_ACTION(name), loadingState: true });

const setDataSuccess_client: CreateClientActionType = <T>({ name, data }: CreateClientActionProps<T>) => ({
  type: clientAction.SET_DATA_SUCCESS(name),
  data,
  loadingState: false,
});

const setDataFail_client: CreateClientActionType = <T>({ name, error }: CreateClientActionProps<T>) => ({
  type: clientAction.SET_DATA_FAIL(name),
  error,
  loadingState: false,
});

export { clientAction, setDataLoading_client, setDataAction_client, setDataSuccess_client, setDataFail_client };
