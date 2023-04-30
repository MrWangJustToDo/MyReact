import { __my_react_internal__ } from "@my-react/react";
import { effect, insertionEffect, layoutEffect } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";

const { currentRenderPlatform } = __my_react_internal__;

// TODO
export const clientDispatchMount = (_dispatch: ClientDomDispatch, _fiber: MyReactFiberNode, _hydrate?: boolean) => {
  const mountInsertionEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountInsertionEffect(_fiber.child);

    insertionEffect(_fiber);

    if (_fiber.sibling) mountInsertionEffect(_fiber.sibling);
  };

  const mountLayoutEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountLayoutEffect(_fiber.child);

    layoutEffect(_fiber);

    if (_fiber.sibling) mountLayoutEffect(_fiber.sibling);
  };

  const mountEffect = (_fiber: MyReactFiberNode) => {
    if (_fiber.child) mountEffect(_fiber.child);

    effect(_fiber);

    if (_fiber.sibling) mountEffect(_fiber.sibling);
  };

  // const mountCommit = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
  //   const _result = safeCallWithFiber({
  //     fiber: _fiber,
  //     action: () => _dispatch.commitCreate(_fiber, _hydrate),
  //   });

  //   safeCallWithFiber({
  //     fiber: _fiber,
  //     action: () => _dispatch.commitUpdate(_fiber, _result),
  //   });

  //   safeCallWithFiber({
  //     fiber: _fiber,
  //     action: () => _dispatch.commitAppend(_fiber),
  //   });

  //   let _final = _hydrate;

  //   let innerNode: Element | null = null;

  //   if (_fiber.child) {
  //     const { dom, hydrate } = mountCommit(_fiber.child, _fiber.nativeNode ? null : _previousDom, _result);

  //     _final = hydrate;

  //     innerNode = dom;
  //   }

  //   safeCallWithFiber({ fiber: _fiber, action: () => _dispatch.commitSetRef(_fiber) });

  //   if (_fiber.sibling) {
  //     const { dom } = mountCommit(_fiber.sibling, _fiber.nativeNode ? (_fiber.nativeNode as ChildNode) : innerNode, _fiber.nativeNode ? _result : _final);

  //     innerNode = dom;
  //   } else {
  //     // fallback(null, (_fiber.nativeNode as ChildNode) || _previousDom);
  //   }

  //   if (_fiber.nativeNode) {
  //     return { dom: _fiber.nativeNode as Element, hydrate: _result };
  //   } else {
  //     return { dom: innerNode, hydrate: _final };
  //   }
  // };

  const mountLoop = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
    mountInsertionEffect(_fiber);

    // const re = mountCommit(_fiber, null, _hydrate);

    mountLayoutEffect(_fiber);

    currentRenderPlatform.current.microTask(() => mountEffect(_fiber));

    // return re;
  };

  return mountLoop(_fiber, _hydrate);
};
