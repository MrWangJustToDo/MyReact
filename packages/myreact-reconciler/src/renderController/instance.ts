import { ListTree, PATCH_TYPE, UniqueArray, UPDATE_TYPE } from "@my-react/react-shared";

import {
  performToNextArray,
  performToNextArrayAsync,
  performToNextArrayOnError,
  performToNextFiber,
  performToNextFiberAsync,
  performToNextFiberOnError,
} from "../renderNextWork";

import type { MyReactFiberNode, RenderController, RenderScope } from "@my-react/react";

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

const nextProcessFiber = (scope: RenderScope) => {
  if (scope.isAppCrashed) return null;

  const yieldFiber = scope.yieldFiber;

  scope.yieldFiber = null;

  if (yieldFiber) return yieldFiber;

  scope.modifyFiberRoot = null;

  while (scope.pendingProcessFiberArray.length) {
    const nextProcessFiber = scope.pendingProcessFiberArray.uniShift();

    // current fiber has updated, skip
    if (!nextProcessFiber.isMounted || nextProcessFiber.mode === UPDATE_TYPE.__initial__) continue;

    beginCommitFiberList(scope);

    scope.modifyFiberRoot = nextProcessFiber;

    return nextProcessFiber;
  }

  return null;
};

const generatePendingCommitFiberList = (fiber: MyReactFiberNode) => {
  if (fiber && fiber.isMounted) {
    const renderScope = fiber.root.renderScope;

    renderScope.pendingCommitFiberList = renderScope.pendingCommitFiberList || new ListTree();

    if (fiber.patch & PATCH_TYPE.__pendingGenerateUpdateList__) {
      renderScope.pendingCommitFiberList.append(fiber);
    }
  }
};

export class CustomRenderController implements RenderController {
  renderScope: RenderScope;

  constructor(scope: RenderScope) {
    this.renderScope = scope;
  }

  shouldYield(): boolean {
    return false;
  }

  hasNext(): boolean {
    if (this.renderScope.isAppCrashed) return false;

    if (this.renderScope.yieldFiber !== null) return true;

    this.renderScope.modifyFiberRoot = null;

    return this.renderScope.pendingProcessFiberArray.length > 0;
  }

  doesPause(): boolean {
    return this.renderScope.yieldFiber !== null;
  }

  generateUpdateList(_fiber: MyReactFiberNode): void {
    if (__DEV__ && _fiber.root.renderScope !== this.renderScope) {
      throw new Error("runtime error for @my-react");
    }

    generatePendingCommitFiberList(_fiber);
  }

  getTopLevelFiber(): MyReactFiberNode {
    return this.renderScope.modifyFiberRoot;
  }

  setTopLevelFiber(_fiber: MyReactFiberNode): void {
    if (__DEV__ && _fiber.root.renderScope !== this.renderScope) {
      throw new Error("runtime error for @my-react");
    }

    this.renderScope.modifyFiberRoot = _fiber;
  }

  getNextFiber(): MyReactFiberNode {
    return nextProcessFiber(this.renderScope);
  }

  setYieldFiber(_fiber: MyReactFiberNode): void {
    if (_fiber) {
      if (__DEV__ && _fiber.root.renderScope !== this.renderScope) {
        throw new Error("runtime error for @my-react");
      }

      this.renderScope.yieldFiber = _fiber;
    } else {
      this.renderScope.yieldFiber = null;

      endCommitFiberList(this.renderScope);
    }
  }

  performToNextFiber(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return performToNextFiber(_fiber);
  }

  performToNextFiberAsync(_fiber: MyReactFiberNode): Promise<MyReactFiberNode | null> {
    return performToNextFiberAsync(_fiber);
  }

  performToNextArray(_fiber: MyReactFiberNode): MyReactFiberNode[] {
    return performToNextArray(_fiber);
  }

  performToNextArrayAsync(_fiber: MyReactFiberNode): Promise<MyReactFiberNode[]> {
    return performToNextArrayAsync(_fiber);
  }

  performToNextArrayOnError(_fiber: MyReactFiberNode, _error: Error, _targetFiber: MyReactFiberNode): MyReactFiberNode[] {
    return performToNextArrayOnError(_fiber, _error, _targetFiber);
  }

  performToNextFiberOnError(_fiber: MyReactFiberNode, _error: Error, _targetFiber: MyReactFiberNode): MyReactFiberNode | null {
    return performToNextFiberOnError(_fiber, _error, _targetFiber);
  }

  reset(): void {
    const renderScope = this.renderScope;

    renderScope.isAppCrashed = false;

    renderScope.yieldFiber = null;

    renderScope.modifyFiberRoot = null;

    renderScope.pendingCommitFiberList = null;

    renderScope.pendingCommitFiberListArray = [];

    renderScope.pendingProcessFiberArray = new UniqueArray();
  }
}
