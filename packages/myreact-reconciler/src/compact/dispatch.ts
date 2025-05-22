/* eslint-disable @typescript-eslint/no-this-alias */
import { exclude, include, PATCH_TYPE, remove, STATE_TYPE } from "@my-react/react-shared";

import { CustomRenderDispatch, listenerMap } from "../renderDispatch";
import { NODE_TYPE, safeCall } from "../share";

import { append, insertBefore, setRef, unsetRef } from "./api";
import { getInsertBeforeNodeFromSiblingAndParent, getValidParentFiberWithNode, initialMap, unmountMap } from "./dispatchMap";
import { defaultDispatchMount } from "./dispatchMount";

import type { MyReactFiberContainer, MyReactFiberNode, MyReactFiberRoot } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

const initialRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__,
};

export const createDispatch = (rootNode: any, rootFiber: MyReactFiberRoot, rootElement: MyReactElementNode, config: any) => {
  class ReconcilerDispatch extends CustomRenderDispatch {
    enableUpdate = true;

    runtimeDom = {
      hostContextMap: new WeakMap<MyReactFiberNode, any>(),
      elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    };

    runtimeRef = initialRef;

    commitCreate(_fiber: MyReactFiberNode): void {
      if (!include(_fiber.patch, PATCH_TYPE.__create__)) return;

      const type = _fiber.elementType;

      const props = _fiber.pendingProps;

      const rootContainerInstance = config.getPublicInstance(rootNode);

      const hostContext = this.runtimeDom.hostContextMap.get(_fiber.parent || _fiber);

      // TODO
      if (include(_fiber.type, NODE_TYPE.__text__)) {
        _fiber.nativeNode = config.createTextInstance(type, rootContainerInstance, hostContext, _fiber);
      } else if (include(_fiber.type, NODE_TYPE.__plain__)) {
        _fiber.nativeNode = config.createInstance(type, props, rootContainerInstance, hostContext, _fiber);
      } else if (include(_fiber.type, NODE_TYPE.__portal__)) {
        const fiberContainer = _fiber as MyReactFiberContainer;

        const containerNode = _fiber.pendingProps["container"] as Element;

        config.preparePortalMount?.(containerNode);

        fiberContainer.containerNode = containerNode;

        if (__DEV__) containerNode.setAttribute?.("portal", "@my-react");
      } else {
        throw new Error("current type node not supported");
      }

      _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__create__);
    }

    commitUpdate(_fiber: MyReactFiberNode): void {
      if (!include(_fiber.patch, PATCH_TYPE.__update__)) return;

      const node = config.getPublicInstance(_fiber.nativeNode);

      const type = _fiber.elementType;

      const oldProps = _fiber.memoizedProps;

      const newProps = _fiber.pendingProps;

      const rootContainerInstance = config.getPublicInstance(rootNode);

      const hostContext = this.runtimeDom.hostContextMap.get(_fiber.parent || _fiber);

      if (include(_fiber.type, NODE_TYPE.__text__)) {
        config.commitTextUpdate?.(node, _fiber.memoizedText, _fiber.pendingText);
      } else if (include(_fiber.type, NODE_TYPE.__plain__)) {
        if (typeof config.prepareUpdate === "function") {
          const updatePayload = config.prepareUpdate(node, type, oldProps, newProps, rootContainerInstance, hostContext, _fiber);

          if (updatePayload) {
            config.commitUpdate(node, updatePayload, type, oldProps, newProps, rootContainerInstance, hostContext, _fiber);
          }
        } else {
          config.commitUpdate(node, type, oldProps, newProps, rootContainerInstance, hostContext, _fiber);
        }
      }

      _fiber.memoizedProps = _fiber.pendingProps;

      _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__update__);
    }

    commitAppend(_fiber: MyReactFiberNode): void {
      if (!include(_fiber.patch, PATCH_TYPE.__append__)) return;

      const isRender = !this.isAppMounted;

      const parentFiberWithNode = getValidParentFiberWithNode(_fiber, this);

      const mayFiberContainer = parentFiberWithNode as MyReactFiberContainer;

      if (!_fiber.nativeNode) throw new Error(`append error, current render node not have a native node`);

      const parentNode = config.getPublicInstance(parentFiberWithNode?.nativeNode || mayFiberContainer?.containerNode);

      const rootNode = config.getPublicInstance(this.rootNode);

      const currentNode = config.getPublicInstance(_fiber.nativeNode);

      if (isRender) {
        if (!parentNode) {
          if (config.appendInContainer) {
            config.appendInContainer?.(rootNode, currentNode, _fiber);
          } else {
            config.appendInitialChild?.(rootNode, currentNode, _fiber);
          }
        } else {
          config.appendInitialChild?.(parentNode, currentNode, _fiber);
        }
      } else {
        if (!parentNode) {
          if (config.appendChildToContainer) {
            config.appendChildToContainer?.(rootNode, currentNode, _fiber);
          } else {
            config.appendChild?.(rootNode, currentNode, _fiber);
          }
        } else {
          config.appendChild?.(parentNode, currentNode, _fiber);
        }
      }

      _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__append__);
    }

    commitPosition(_fiber: MyReactFiberNode): void {
      if (!include(_fiber.patch, PATCH_TYPE.__position__)) return;

      const rootFiber = this.rootFiber;

      const parentFiberWithNode = getValidParentFiberWithNode(_fiber, this);

      const beforeFiberWithNode = getInsertBeforeNodeFromSiblingAndParent(_fiber, parentFiberWithNode || rootFiber);

      if (beforeFiberWithNode && exclude(beforeFiberWithNode.patch, PATCH_TYPE.__append__ | PATCH_TYPE.__position__)) {
        insertBefore(_fiber, beforeFiberWithNode, parentFiberWithNode, this, config);
      } else {
        append(_fiber, parentFiberWithNode, this, config);
      }

      _fiber.patch = remove(_fiber.patch, PATCH_TYPE.__position__);
    }

    commitSetRef(_fiber: MyReactFiberNode): void {
      setRef(_fiber, config);
    }

    commitUnsetRef(_fiber: MyReactFiberNode): void {
      unsetRef(_fiber);
    }

    commitClear(_fiber: MyReactFiberNode): void {
      if (include(_fiber.state, STATE_TYPE.__unmount__)) return;

      if (!_fiber.nativeNode) return;

      const parentFiberWithNode = getValidParentFiberWithNode(_fiber, this);

      const mayFiberContainer = parentFiberWithNode as MyReactFiberContainer;

      const parentNode = config.getPublicInstance(parentFiberWithNode?.nativeNode || mayFiberContainer?.containerNode);

      const rootNode = config.getPublicInstance(this.rootNode);

      const currentNode = config.getPublicInstance(_fiber.nativeNode);

      if (!parentNode) {
        config.removeChildFromContainer?.(rootNode, currentNode, _fiber);
      } else {
        config.removeChild?.(parentNode, currentNode, _fiber);
      }
    }

    reconcileCommit(_fiber: MyReactFiberNode): void {
      config.prepareForCommit?.(rootNode);

      const instance = this;

      safeCall(function safeCallBeforeCommit() {
        instance.beforeCommit?.();
      });

      safeCall(function safeCallBeforeCommitListener() {
        listenerMap.get(instance).beforeCommit.forEach((cb) => cb());
      });

      defaultDispatchMount(_fiber, this, config);

      safeCall(function safeCallAfterCommitListener() {
        listenerMap.get(instance).afterCommit.forEach((cb) => cb());
      });

      safeCall(function safeCallAfterCommit() {
        instance.afterCommit?.();
      });

      config.resetAfterCommit?.(rootNode);
    }

    reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
      config.prepareForCommit?.(rootNode);

      super.reconcileUpdate(_list);

      config.resetAfterCommit?.(rootNode);
    }

    patchToFiberInitial(_fiber: MyReactFiberNode): void {
      initialMap(_fiber, this, config);
    }

    patchToFiberUnmount(_fiber: MyReactFiberNode): void {
      unmountMap(_fiber, this);
    }
  }

  return new ReconcilerDispatch(rootNode, rootFiber, rootElement);
};

export type ReconcilerDispatch = ReturnType<typeof createDispatch>;
