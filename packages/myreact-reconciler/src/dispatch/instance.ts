import { __my_react_shared__ } from "@my-react/react";
import { NODE_TYPE, PATCH_TYPE, UniqueArray, ListTree } from "@my-react/react-shared";

import { defaultGenerateContextMap, defaultGetContextValue } from "../context";
import { defaultInitialFiberNode, defaultUpdateFiberNode } from "../fiber";
import { performToNextFiber } from "../generate";
import { processHookNode } from "../hook";
import { defaultResolveLazyElement, defaultResolveLazyElementAsync } from "../lazy";
import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../queue";
import { defaultGenerateErrorBoundariesMap, defaultGenerateScopeMap, defaultGenerateStrictMap, defaultGenerateSuspenseMap } from "../share";
import { defaultGenerateUnmountArrayMap } from "../unmount";

import type { RenderDispatch } from "./interface";
import type {
  MyReactFiberNode,
  MyReactElementNode,
  RenderScope,
  CreateHookParams,
  createContext,
  MyReactFiberNodeRoot,
  RenderController,
} from "@my-react/react";

type CustomRenderConfig = {
  patchToFiberInitial?: (_fiber: MyReactFiberNode) => void;
  patchToFiberUpdate?: (_fiber: MyReactFiberNode) => void;
  reconcileCommit: RenderDispatch["reconcileCommit"];
  reconcileUpdate: RenderDispatch["reconcileUpdate"];
  triggerUpdate: RenderDispatch["triggerUpdate"];
  triggerError: RenderDispatch["triggerError"];
  shouldYield?: () => boolean;
};

const { enableStrictLifeCycle } = __my_react_shared__;

export const createRender = ({
  reconcileCommit,
  reconcileUpdate,
  triggerError,
  triggerUpdate,
  patchToFiberInitial,
  patchToFiberUpdate,
  shouldYield = () => false,
}: CustomRenderConfig) => {
  const MyWeakMap = typeof WeakMap !== "undefined" ? WeakMap : Map;

  const beginCommitFiberList = (scope: RenderScope) => {
    if (scope.pendingCommitFiberList?.length) {
      scope.pendingCommitFiberListArray.push(scope.pendingCommitFiberList);
    }
    scope.pendingCommitFiberList = new ListTree();
  };

  const endCommitFiberList = (scope: RenderScope) => {
    if (scope.pendingCommitFiberList?.length) {
      scope.pendingCommitFiberListArray.push(scope.pendingCommitFiberList);
    }
    scope.pendingCommitFiberList = null;
  };

  const generatePendingCommitFiberList = (fiber: MyReactFiberNode) => {
    if (fiber && fiber.isMounted) {
      const renderScope = fiber.root.renderScope;

      const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

      renderScope.pendingCommitFiberList = renderScope.pendingCommitFiberList || new ListTree();

      if (
        fiber.patch & PATCH_TYPE.__pendingRef__ ||
        fiber.patch & PATCH_TYPE.__pendingCreate__ ||
        fiber.patch & PATCH_TYPE.__pendingUpdate__ ||
        fiber.patch & PATCH_TYPE.__pendingAppend__ ||
        fiber.patch & PATCH_TYPE.__pendingContext__ ||
        fiber.patch & PATCH_TYPE.__pendingUnmount__ ||
        fiber.patch & PATCH_TYPE.__pendingPosition__
      ) {
        renderScope.pendingCommitFiberList.append(fiber);
      } else if (
        renderDispatch.effectMap.get(fiber)?.length ||
        renderDispatch.unmountMap.get(fiber)?.length ||
        renderDispatch.layoutEffectMap.get(fiber)?.length
      ) {
        renderScope.pendingCommitFiberList.append(fiber);
      }
    }
  };

  class CustomRenderScope
    implements
      RenderScope<{
        isServerRender: boolean;
        isHydrateRender: boolean;
        renderTime: number | null;
        hydrateTime: number | null;
      }>
  {
    rootFiber: MyReactFiberNodeRoot;

    yieldFiber: MyReactFiberNode | null;

    rootContainer: { [p: string]: any };

    isAppMounted = false;

    isAppCrashed = false;

    isServerRender = false;

    isHydrateRender = false;

    renderTime: number | null;

    hydrateTime: number | null;

    modifyFiberRoot: MyReactFiberNode | null = null;

    pendingProcessFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray();

    pendingCommitFiberListArray: ListTree<MyReactFiberNode>[] = [];

    pendingCommitFiberList: ListTree<MyReactFiberNode> | null = null;

    constructor(fiber: MyReactFiberNodeRoot, container: any) {
      this.rootFiber = fiber;
      this.rootContainer = container;
    }
  }

  class CustomRenderController implements RenderController {
    renderScope: RenderScope;

    constructor(scope: CustomRenderScope) {
      this.renderScope = scope;
    }

    hasNext() {
      if (this.renderScope.isAppCrashed) return false;

      if (this.renderScope.yieldFiber !== null) return true;

      this.renderScope.modifyFiberRoot = null;

      return this.renderScope.pendingProcessFiberArray.length > 0;
    }

    getNext() {
      const renderScope = this.renderScope;

      if (renderScope.isAppCrashed) return null;

      const yieldFiber = renderScope.yieldFiber;

      renderScope.yieldFiber = null;

      if (yieldFiber) return yieldFiber;

      renderScope.modifyFiberRoot = null;

      while (renderScope.pendingProcessFiberArray.length) {
        const nextProcessFiber = renderScope.pendingProcessFiberArray.shift();

        if (nextProcessFiber?.isMounted) {
          nextProcessFiber.triggerUpdate();

          beginCommitFiberList(renderScope);

          renderScope.modifyFiberRoot = nextProcessFiber;

          return nextProcessFiber;
        }
      }

      return null;
    }

    doesPause() {
      return this.renderScope.yieldFiber !== null;
    }

    getTopLevel() {
      return this.renderScope.modifyFiberRoot;
    }

    setYield(_fiber: MyReactFiberNode | null) {
      if (_fiber) {
        this.renderScope.yieldFiber = _fiber;
      } else {
        this.renderScope.yieldFiber = null;

        endCommitFiberList(this.renderScope);
      }
    }

    shouldYield(): boolean {
      return shouldYield();
    }

    getUpdateList(_fiber: MyReactFiberNode) {
      if (_fiber.root.renderScope !== this.renderScope) {
        throw new Error("runtime error for @my-react");
      }
      generatePendingCommitFiberList(_fiber);
    }

    performToNextFiber(_fiber: MyReactFiberNode): MyReactFiberNode | null {
      if (_fiber.root.renderScope !== this.renderScope) {
        throw new Error("runtime error for @my-react");
      }
      return performToNextFiber(_fiber);
    }
  }

  class CustomRenderDispatch implements RenderDispatch {
    suspenseMap: WeakMap<MyReactFiberNode, MyReactElementNode> = new MyWeakMap();

    strictMap: WeakMap<MyReactFiberNode, boolean> = new MyWeakMap();

    scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

    errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

    effectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

    layoutEffectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

    contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>> = new MyWeakMap();

    unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>[]> = new MyWeakMap();

    eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any[] }>> = new MyWeakMap();

    resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
      return defaultResolveLazyElement(_fiber);
    }
    resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
      return defaultResolveLazyElementAsync(_fiber);
    }
    resolveStrictMap(_fiber: MyReactFiberNode): void {
      defaultGenerateStrictMap(_fiber, this.strictMap);
    }
    resolveStrict(_fiber: MyReactFiberNode): boolean {
      return (enableStrictLifeCycle.current && this.strictMap.get(_fiber)) || false;
    }
    resolveScopeMap(_fiber: MyReactFiberNode): void {
      defaultGenerateScopeMap(_fiber, this.scopeMap);
    }
    resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null {
      return this.scopeMap.get(_fiber) || null;
    }
    resolveSuspenseMap(_fiber: MyReactFiberNode): void {
      defaultGenerateSuspenseMap(_fiber, this.suspenseMap);
    }
    resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode {
      return this.suspenseMap.get(_fiber) || null;
    }
    resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void {
      defaultGenerateErrorBoundariesMap(_fiber, this.errorBoundariesMap);
    }
    resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
      return this.errorBoundariesMap.get(_fiber) || null;
    }
    resolveContextMap(_fiber: MyReactFiberNode): void {
      defaultGenerateContextMap(_fiber, this.contextMap);
    }
    resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode {
      if (_contextObject) {
        const contextMap = this.contextMap.get(_fiber);
        return contextMap?.[_contextObject.contextId] || null;
      } else {
        return null;
      }
    }
    resolveContextValue(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
      return defaultGetContextValue(_fiber, _contextObject);
    }
    processFiberUpdate(_fiber: MyReactFiberNode): void {
      defaultUpdateFiberNode(_fiber);
      patchToFiberUpdate?.(_fiber);
    }
    processFiberInitial(_fiber: MyReactFiberNode): void {
      defaultInitialFiberNode(_fiber);
      patchToFiberInitial?.(_fiber);
    }
    reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): void {
      reconcileCommit(_fiber, _hydrate);
    }
    reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
      reconcileUpdate(_list);
    }
    pendingCreate(_fiber: MyReactFiberNode): void {
      if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isPortal__ | NODE_TYPE.__isCommentNode__)) {
        _fiber.patch |= PATCH_TYPE.__pendingCreate__;
      }
    }
    pendingUpdate(_fiber: MyReactFiberNode): void {
      if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
        _fiber.patch |= PATCH_TYPE.__pendingUpdate__;
      } else {
        _fiber.applyProps();
      }
    }
    pendingAppend(_fiber: MyReactFiberNode): void {
      if (_fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__)) {
        _fiber.patch |= PATCH_TYPE.__pendingAppend__;
      }
    }
    pendingContext(_fiber: MyReactFiberNode): void {
      _fiber.patch |= PATCH_TYPE.__pendingContext__;
    }
    pendingPosition(_fiber: MyReactFiberNode): void {
      _fiber.patch |= PATCH_TYPE.__pendingPosition__;
    }
    pendingRef(_fiber: MyReactFiberNode): void {
      if (_fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
        _fiber.patch |= PATCH_TYPE.__pendingRef__;
      }
    }
    pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
      defaultGenerateUnmountArrayMap(_fiber, _pendingUnmount, this.unmountMap);
    }
    pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
      const exist = this.effectMap.get(_fiber) || [];
      exist.push(_effect);
      this.effectMap.set(_fiber, exist);
    }
    pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
      const exist = this.layoutEffectMap.get(_fiber) || [];
      exist.push(_layoutEffect);
      this.layoutEffectMap.set(_fiber, exist);
    }
    triggerUpdate(_fiber: MyReactFiberNode): void {
      triggerUpdate(_fiber);
    }
    triggerError(_fiber: MyReactFiberNode, _error: Error): void {
      triggerError(_fiber, _error);
    }
    initialFiberNode(_fiber: MyReactFiberNode): void {
      defaultInitialFiberNode(_fiber);
    }
    updateFiberNode(_fiber: MyReactFiberNode): void {
      defaultUpdateFiberNode(_fiber);
    }
    resolveHookNode(_fiber: MyReactFiberNode, _hookParams: CreateHookParams) {
      return processHookNode(_fiber, _hookParams);
    }
    processClassComponentQueue(_fiber: MyReactFiberNode): void {
      const needUpdate = processClassComponentUpdateQueue(_fiber);

      if (needUpdate) _fiber.update();
    }
    processFunctionComponentQueue(_fiber: MyReactFiberNode): void {
      const needUpdate = processFunctionComponentUpdateQueue(_fiber);

      if (needUpdate) _fiber.update();
    }
  }

  return {
    CustomRenderController,
    CustomRenderDispatch,
    CustomRenderScope,
  };
};
