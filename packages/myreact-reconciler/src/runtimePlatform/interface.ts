import type { MyReactFiberNode, RenderPlatform as OriginalRenderPlatform } from "@my-react/react";
import type { NODE_TYPE } from "@my-react/react-shared";

export type RenderPlatform = OriginalRenderPlatform<{
  refType: NODE_TYPE;

  createType: NODE_TYPE;

  updateType: NODE_TYPE;

  appendType: NODE_TYPE;

  hasNodeType: NODE_TYPE;

  create(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean;

  update(_fiber: MyReactFiberNode, _hydrate?: boolean): void;

  append(_fiber: MyReactFiberNode): void;

  unmount(_fiber: MyReactFiberNode): void;

  position(_fiber: MyReactFiberNode): void;

  setRef(_fiber: MyReactFiberNode): void;

  unsetRef(_fiber: MyReactFiberNode): void;
}>;
