import type { MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { MyReactHookNode } from "../hook";

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

  getFiberTree(fiber: MyReactFiberNode): string;

  getHookTree(hook: MyReactHookNode[], currentIndex: number, newHookType: MyReactHookNode["hookType"]): string;

  resolveLazy(fiber: MyReactFiberNode): MyReactElementNode;

  resolveLazyAsync(fiber: MyReactFiberNode): Promise<MyReactElementNode>;
}

export type RenderPlatform<T = Record<string, any>> = DefaultRenderPlatform & T;
