import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { processHookNode, enableFiberForLog } from "@my-react/react-reconciler";

import { NoopDomPlatform } from "./instance";

import type { RenderPlatform} from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

let lastPlatform: RenderPlatform | null = null;

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  enableFiberForLog.current = false;

  const MyReactNoopDomPlatform = new NoopDomPlatform();

  if (!currentRenderPlatform.current || currentRenderPlatform.current instanceof NoopDomPlatform) {
    throw new Error("invalid environment for current render platform");
  }

  lastPlatform = currentRenderPlatform.current;

  initRenderPlatform(MyReactNoopDomPlatform);
};

const dispatchError = ({ error }: { fiber: MyReactFiberNode; error: Error }) => {
  throw error
};

/**
 * @internal
 */
export const beforeNoopRender = () => {
  initGlobalRenderPlatform();

  enableDebugFiled.current = false;

  enableScopeTreeLog.current = false;

  const renderPlatform = currentRenderPlatform.current as NoopDomPlatform;

  renderPlatform.dispatchState = () => void 0;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = dispatchError;
};

/**
 * @internal
 */
export const afterNoopRender = () => {
  initRenderPlatform(lastPlatform);
}
