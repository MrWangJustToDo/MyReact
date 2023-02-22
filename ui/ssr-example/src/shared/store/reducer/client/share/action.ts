import type { ClientActionType, CreateClientActionProps, CreateClientActionType } from "../type";

const clientAction: ClientActionType = {
  SET_DATA_ACTION: (name) => `@client_action_${name}_start`,
  SET_DATA_LOADING: (name) => `@client_action_${name}_loading`,
  SET_DATA_SUCCESS: (name) => `@client_action_${name}_success`,
  SET_DATA_FAIL: (name) => `@client_action_${name}_fail`,
};

const setDataLoading_client: CreateClientActionType = ({ name }) => ({ type: clientAction.SET_DATA_LOADING(name), loadingState: true });

// not need
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
