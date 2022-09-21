import { combineReducers } from "redux";

import { clientActionName } from "@shared/store/action";

import { clientLangReducer, clientPropsReducer } from "./action";

export const client = combineReducers({
  [clientActionName.clientLang]: clientLangReducer,
  [clientActionName.clientProps]: clientPropsReducer,
});

export * from "./share/action";
