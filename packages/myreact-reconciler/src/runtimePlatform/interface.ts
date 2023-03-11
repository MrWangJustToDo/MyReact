import type { NODE_TYPE } from "../share";
import type { MyReactFiberNode, RenderPlatform as OriginalRenderPlatform } from "@my-react/react";

export type RenderPlatform = OriginalRenderPlatform<{
  refType: NODE_TYPE;

  createType: NODE_TYPE;

  updateType: NODE_TYPE;

  appendType: NODE_TYPE;

  hasNodeType: NODE_TYPE;

  patchToFiberInitial?: (_fiber: MyReactFiberNode) => void;

  patchToFiberUpdate?: (_fiber: MyReactFiberNode) => void;

  patchToFiberUnmount?: (_fiber: MyReactFiberNode) => void;

  create(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean;

  update(_fiber: MyReactFiberNode, _hydrate?: boolean): void;

  append(_fiber: MyReactFiberNode): void;

  position(_fiber: MyReactFiberNode): void;

  setRef(_fiber: MyReactFiberNode): void;

  unsetRef(_fiber: MyReactFiberNode): void;

  clearNode(_fiber: MyReactFiberNode): void;
}>;
