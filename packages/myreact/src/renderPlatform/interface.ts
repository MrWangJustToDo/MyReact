import type { MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { MyReactHookNode } from "../hook";
import type { ListTreeNode } from "@my-react/react-shared";

export type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

interface DefaultRenderPlatform {
  name: string;

  log(props: LogProps): void;

  microTask(task: () => void): void;

  macroTask(task: () => void): void;

  yieldTask(task: () => void): void;

  getFiberTree(fiber: MyReactFiberNode): string;

  getHookTree(treeHookNode: ListTreeNode<MyReactHookNode>, errorType: { lastRender: MyReactHookNode["type"]; nextRender: MyReactHookNode["type"] }): string;

  resolveLazy(fiber: MyReactFiberNode): MyReactElementNode;

  resolveLazyAsync(fiber: MyReactFiberNode): Promise<MyReactElementNode>;
}

export type RenderPlatform<T = Record<string, any>> = DefaultRenderPlatform & T;
