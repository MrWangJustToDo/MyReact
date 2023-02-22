import { combineReducers } from "redux";

import { serverActionName } from "@shared/store/action";

import { serverLangReducer } from "./action";

export const server = combineReducers({
  [serverActionName.serverLang]: serverLangReducer,
});

export * from "./share/action";
