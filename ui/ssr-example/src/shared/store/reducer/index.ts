import { combineReducers } from "redux";

import { client } from "./client";
import { server } from "./server";

export const rootReducer = combineReducers({
  client,
  server,
});

export * from "./client";

export * from "./server";
