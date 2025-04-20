import { __my_react_shared__ } from "@my-react/react";
import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";

const { enableDebugFiled } = __my_react_shared__;

export const defaultGenerateStrict = (fiber: MyReactFiberNode): boolean => {
  if (__DEV__) {
    const parent = fiber.parent;

    let isStrict = false;

    const typedParent = parent as MyReactFiberNodeDev;

    if (parent) {
      if (include(parent.type, NODE_TYPE.__strict__)) {
        isStrict = true;
      }
      if (typedParent._debugStrict) {
        isStrict = true;
      }
    }

    if (__DEV__ && enableDebugFiled.current) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugStrict = isStrict;
    }

    return isStrict;
  }

  return false;
};
