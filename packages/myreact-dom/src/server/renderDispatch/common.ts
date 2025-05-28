import { nextWorkNormal, type MyReactFiberNode } from "@my-react/react-reconciler";

import type { ServerDomDispatch } from "./serverDomDispatch";
import type { LegacyServerStreamDispatch, LatestServerStreamDispatch } from "./serverStreamDispatch";

export const nextWorkCommon = (_dispatch: ServerDomDispatch | LegacyServerStreamDispatch | LatestServerStreamDispatch, _fiber: MyReactFiberNode) => {
  nextWorkNormal(_dispatch, _fiber);
};
