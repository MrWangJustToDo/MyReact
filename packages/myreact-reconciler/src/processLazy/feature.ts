import { __my_react_internal__, type lazy } from "@my-react/react";
import { STATE_TYPE, include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRenderPlatform } = __my_react_internal__;

export const processLazy = async (_fiber: MyReactFiberNode) => {
  if (include(_fiber.type, NODE_TYPE.__lazy__)) {
    const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

    if (typedElementType._loaded) return;

    try {
      const loaded = await typedElementType.loader();

      const render = typeof loaded === "object" && (typeof loaded?.default === "function" || typeof loaded?.default === "object") ? loaded.default : loaded;

      typedElementType.render = render as ReturnType<typeof lazy>["render"];

      _fiber.state = STATE_TYPE.__create__;

      typedElementType._loaded = true;
    } catch (e) {
      currentRenderPlatform.current.dispatchError?.({ fiber: _fiber, error: e });
    } finally {
      typedElementType._loading = false;
    }
  }
};
