import { processHookNode } from "../dispatchHook";
import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../dispatchQueue";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { LogProps, RenderHook, RenderPlatform } from "@my-react/react";
import type { ListTreeNode, HOOK_TYPE } from "@my-react/react-shared";

export class CustomRenderPlatform implements RenderPlatform {
  log(_props: LogProps): void {
    void 0;
  }
  microTask(_task: () => void): void {
    void 0;
  }
  macroTask(_task: () => void): void {
    void 0;
  }
  yieldTask(_task: () => void): void {
    void 0;
  }
  getFiberTree(_fiber: MyReactFiberNode): string {
    return "";
  }
  getHookTree(_treeHookNode: ListTreeNode<MyReactHookNode>, _errorType: { lastRender: HOOK_TYPE; nextRender: HOOK_TYPE }): string {
    return "";
  }
  dispatchHook(_params: RenderHook<Record<string, any>>): unknown {
    return processHookNode(_params);
  }
  triggerClassComponent(_fiber: MyReactFiberNode): void {
    const needUpdate = processClassComponentUpdateQueue(_fiber);

    if (needUpdate) _fiber._update();
  }
  triggerFunctionComponent(_fiber: MyReactFiberNode): void {
    const needUpdate = processFunctionComponentUpdateQueue(_fiber);

    if (needUpdate) _fiber._update();
  }
}
