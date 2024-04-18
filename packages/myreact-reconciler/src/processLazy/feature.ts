import { __my_react_internal__, type lazy } from "@my-react/react";
import { STATE_TYPE, include, isPromise } from "@my-react/react-shared";

import { NODE_TYPE, devWarnWithFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRenderPlatform } = __my_react_internal__;

export const processLazy = async (_fiber: MyReactFiberNode) => {
  if (include(_fiber.type, NODE_TYPE.__lazy__)) {
    const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

    if (typedElementType._loaded) return;

    try {
      const loadedPromise = typedElementType.loader();

      if (__DEV__ && !isPromise(loadedPromise)) {
        devWarnWithFiber(_fiber, `@my-react lazy() must return a promise`);
      }

      const loaded = await loadedPromise;

      const render = typeof loaded === "object" && (typeof loaded?.default === "function" || typeof loaded?.default === "object") ? loaded.default : loaded;

      typedElementType.render = render as ReturnType<typeof lazy>["render"];

      _fiber.state = STATE_TYPE.__create__;

      typedElementType._loaded = true;
    } catch (e) {
      const renderPlatform = currentRenderPlatform.current;

      renderPlatform.dispatchError?.({ fiber: _fiber, error: e });
    } finally {
      typedElementType._loading = false;
    }
  }
};
