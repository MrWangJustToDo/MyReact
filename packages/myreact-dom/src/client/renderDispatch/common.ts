import { nextWorkNormal, type MyReactFiberNode } from "@my-react/react-reconciler";

import type { ClientDomDispatch } from "./instance";

export const nextWorkCommon = (_dispatch: ClientDomDispatch, _fiber: MyReactFiberNode) => {
  nextWorkNormal(_dispatch, _fiber);
};
