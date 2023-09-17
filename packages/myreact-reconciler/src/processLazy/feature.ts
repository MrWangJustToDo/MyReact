import { STATE_TYPE, include } from "@my-react/react-shared";

import { triggerError } from "../renderUpdate";
import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { lazy } from "@my-react/react";

export const processLazy = async (_fiber: MyReactFiberNode) => {
  if (include(_fiber.type, NODE_TYPE.__lazy__)) {
    const typedElementType = _fiber.elementType as ReturnType<typeof lazy>;

    if (typedElementType._loaded) return;

    try {
      const loaded = await typedElementType.loader();

      const render = typeof loaded === "object" && typeof loaded?.default === "function" ? loaded.default : loaded;

      typedElementType.render = render as ReturnType<typeof lazy>["render"];

      _fiber.state = STATE_TYPE.__create__;

      typedElementType._loaded = true;
    } catch (e) {
      triggerError(_fiber, e);
    } finally {
      typedElementType._loading = false;
    }
  }
};
