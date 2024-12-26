import { nextWorkNormal, type MyReactFiberNode } from "@my-react/react-reconciler";

import type { ClientDomDispatch } from "./instance";

export const nextWorkCommon = (_fiber: MyReactFiberNode, _dispatch: ClientDomDispatch) => {
  nextWorkNormal(_fiber);
};
