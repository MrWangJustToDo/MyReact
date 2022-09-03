import { combineReducers } from "redux";

import { actionName } from "config/action";

import { langReducer, tokenReducer, loadingReducer, initialPropsReducer } from "./action";

export const client = combineReducers({
  [actionName.currentToken]: tokenReducer,
  [actionName.currentLang]: langReducer,
  [actionName.currentLoading]: loadingReducer,
  [actionName.globalInitialProps]: initialPropsReducer,
});
