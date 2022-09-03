import { combineReducers } from "redux";

import { apiName } from "config/api";

import { blogReducer, cookieReducer, homeReducer, langReducer } from "./action";

export const server = combineReducers({
  [apiName.lang]: langReducer,
  [apiName.blog]: blogReducer,
  [apiName.home]: homeReducer,
  [apiName.cookie]: cookieReducer,
});
