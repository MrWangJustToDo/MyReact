import type { createContext, MyReactElementNode, Props } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { CreateHookParams, MyReactHookNode } from "../hook";
import type { RenderScope } from "../scope";
import type { LinkTreeList } from "@my-react/react-shared";

export interface FiberDispatch {
  suspenseMap: Record<string, MyReactElementNode>;

  strictMap: Record<string, boolean>;

  keepLiveMap: Record<string, MyReactFiberNode[]>;

  effectMap: Record<string, Array<() => void>>;

  layoutEffectMap: Record<string, Array<() => void>>;

  contextMap: Record<string, Record<string, MyReactFiberNode>>;

  unmountMap: Record<string, Array<MyReactFiberNode | MyReactFiberNode[]>>;

  eventMap: Record<string, Record<string, ((...args: any[]) => void) & { cb?: any[] }>>;

  trigger(_fiber: MyReactFiberNode): void;

  resolveLazy(): boolean;

  resolveRef(_fiber: MyReactFiberNode): void;

  resolveKeepLiveMap(_fiber: MyReactFiberNode): void;

  resolveKeepLive(_fiber: MyReactFiberNode, _element: MyReactElementNode): MyReactFiberNode | null;

  resolveHook(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): MyReactHookNode | null;

  resolveStrictMap(_fiber: MyReactFiberNode): void;

  resolveStrictValue(_fiber: MyReactFiberNode): boolean;

  resolveMemorizeProps(_fiber: MyReactFiberNode): Props;

  resolveSuspenseMap(_fiber: MyReactFiberNode): void;

  resolveSuspenseElement(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveContextMap(_fiber: MyReactFiberNode): void;

  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): null | MyReactFiberNode;

  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null;

  resolveComponentQueue(_fiber: MyReactFiberNode): void;

  resolveHookQueue(_fiber: MyReactFiberNode): void;

  // loop to mount/hydrate
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean;

  // loop to update
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void;

  beginProgressList(_scope: RenderScope): void;

  endProgressList(_scope: RenderScope): void;

  generateUpdateList(_fiber: MyReactFiberNode, _scope: RenderScope): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingContext(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingDeactivate(_fiber: MyReactFiberNode): void;

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]): void;

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void;

  removeFiber(_fiber: MyReactFiberNode): void;
}