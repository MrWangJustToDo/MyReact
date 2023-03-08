import type { MyReactFiberNode } from "../fiber";
import type { RenderScope } from "../renderScope";

interface DefaultRenderController {
  renderScope: RenderScope;

  getNext(): MyReactFiberNode | null;

  shouldYield(): boolean;

  setYield(_fiber: MyReactFiberNode | null): void;

  getUpdateList(_fiber: MyReactFiberNode): void;

  hasNext(): boolean;

  doesPause(): boolean;

  getTopLevel(): MyReactFiberNode | null;

  setTopLevel(_fiber: MyReactFiberNode): void;

  reset(): void;
}

export type RenderController<T = Record<string, any>> = DefaultRenderController & T;
