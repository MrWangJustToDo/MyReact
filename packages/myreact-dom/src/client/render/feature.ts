import { createRender } from "@my-react/react-reconciler";

import { append, context, create, effect, fallback, layoutEffect, position, unmount, update } from "@my-react-dom-client";
import { triggerError, triggerUpdate } from "@my-react-dom-client/update";
import { safeCallWithFiber, setRef, shouldPauseAsyncUpdate } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";

const elementTypeMap = new WeakMap<MyReactFiberNode, boolean>();

export const { CustomRenderScope, CustomRenderController, CustomRenderDispatch } = createRender({
  patchToFiberInitial(_fiber) {
    let isSVG = _fiber.parent ? elementTypeMap.get(_fiber.parent) : false;
    if (!isSVG && _fiber.elementType === "svg") {
      isSVG = true;
    }
    elementTypeMap.set(_fiber, isSVG);
  },
  reconcileUpdate(_list) {
    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        const _isSVG = elementTypeMap.get(_fiber);
        safeCallWithFiber({
          fiber: _fiber,
          action: () => create(_fiber, false, _fiber, _isSVG),
        });

        safeCallWithFiber({
          fiber: _fiber,
          action: () => update(_fiber, false, _isSVG),
        });

        safeCallWithFiber({
          fiber: _fiber,
          action: () => unmount(_fiber),
        });

        safeCallWithFiber({ fiber: _fiber, action: () => context(_fiber) });
      }
    });

    _list.listToHead((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => position(_fiber),
        });
      }
    });

    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => append(_fiber),
        });
      }
    });

    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => setRef(_fiber),
        });

        safeCallWithFiber({
          fiber: _fiber,
          action: () => layoutEffect(_fiber),
        });

        Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));
      }
    });
  },
  reconcileCommit(_fiber, _hydrate) {
    const mountLoop = (_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode) => {
      const _isSVG = elementTypeMap.get(_fiber);

      const _result = safeCallWithFiber({
        fiber: _fiber,
        action: () => create(_fiber, _hydrate, _parentFiberWithDom, _isSVG),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => update(_fiber, _result, _isSVG),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => append(_fiber, _parentFiberWithDom),
      });

      let _final = _hydrate;

      if (_fiber.child) {
        _final = mountLoop(_fiber.child, _result, _fiber.node ? _fiber : _parentFiberWithDom);
        if (_hydrate) fallback(_fiber);
      }

      safeCallWithFiber({ fiber: _fiber, action: () => setRef(_fiber) });

      safeCallWithFiber({ fiber: _fiber, action: () => layoutEffect(_fiber) });

      Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));

      if (_fiber.sibling) {
        mountLoop(_fiber.sibling, _fiber.node ? _result : _final, _parentFiberWithDom);
      }

      if (_fiber.node) {
        return _result;
      } else {
        return _final;
      }
    };

    mountLoop(_fiber, _hydrate, _fiber);
  },
  shouldYield() {
    return shouldPauseAsyncUpdate();
  },
  triggerUpdate(_fiber) {
    triggerUpdate(_fiber);
  },
  triggerError(_fiber, _error) {
    triggerError(_fiber, _error);
  },
});
