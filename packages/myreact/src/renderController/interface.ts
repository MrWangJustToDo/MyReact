import type { MyReactFiberNode } from "../fiber";
import type { RenderScope } from "../renderScope";

interface DefaultRenderController {
  renderScope: RenderScope;

  shouldYield(): boolean;

  hasNext(): boolean;

  doesPause(): boolean;

  generateUpdateList(_fiber: MyReactFiberNode): void;

  getTopLevelFiber(): MyReactFiberNode | null;

  setTopLevelFiber(_fiber: MyReactFiberNode): void;

  getNextFiber(): MyReactFiberNode | null;

  setYieldFiber(_fiber: MyReactFiberNode | null): void;

  performToNextFiber(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  performToNextFiberAsync(_fiber: MyReactFiberNode): Promise<MyReactFiberNode | null>;

  performToNextArray(_fiber: MyReactFiberNode): MyReactFiberNode[];

  performToNextArrayAsync(_fiber: MyReactFiberNode): Promise<MyReactFiberNode[]>;

  performToNextArrayOnError(_fiber: MyReactFiberNode, _error: Error, _targetFiber: MyReactFiberNode): MyReactFiberNode[];

  performToNextFiberOnError(_fiber: MyReactFiberNode, _error: Error, _targetFiber: MyReactFiberNode): MyReactFiberNode | null;

  reset(): void;
}

export type RenderController<T = Record<string, any>> = DefaultRenderController & T;
