import { nextWorkNormal, type MyReactFiberNode } from "@my-react/react-reconciler";

import type { ServerDomDispatch } from "./serverDomDispatch";
import type { LegacyServerStreamDispatch, LatestServerStreamDispatch } from "./serverStreamDispatch";

export const nextWorkCommon = (_fiber: MyReactFiberNode, _dispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch) => {
  nextWorkNormal(_fiber);
};
