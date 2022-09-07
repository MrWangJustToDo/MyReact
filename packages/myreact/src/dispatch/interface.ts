import type { createContext, MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { LinkTreeList } from "../share";

export interface FiberDispatch {
  rootFiber: MyReactFiberNode | null;

  rootContainer: Record<string, unknown>;

  isAppMounted: boolean;

  isAppCrash: boolean;

  suspenseMap: Record<string, MyReactElementNode>;

  effectMap: Record<string, Array<() => void>>;

  layoutEffectMap: Record<string, Array<() => void>>;

  contextMap: Record<string, Record<string, MyReactFiberNode>>;

  unmountMap: Record<string, Array<MyReactFiberNode | MyReactFiberNode[]>>;

  eventMap: Record<string, Record<string, ((...args: any[]) => void) & { cb?: any[] }>>;

  trigger(_fiber: MyReactFiberNode): void;

  resolveLazy(): boolean;

  resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveContextMap(_fiber: MyReactFiberNode): void;

  resolveContextFiber(
    _fiber: MyReactFiberNode,
    _contextObject: ReturnType<typeof createContext> | null
  ): null | MyReactFiberNode;

  resolveComponentQueue(_fiber: MyReactFiberNode): void;

  resolveHookQueue(_fiber: MyReactFiberNode): void;

  // loop to mount/hydrate
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean;

  // loop to update
  reconcileCreate(_list: LinkTreeList<MyReactFiberNode>): void;

  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void;

  beginProgressList(): void;

  endProgressList(): void;

  generateUpdateList(_fiber: MyReactFiberNode): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingContext(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]): void;

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void;

  updateAllSync(): void;

  updateAllAsync(): void;
}
