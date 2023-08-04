import { __my_react_internal__ } from "@my-react/react";
import { HOOK_TYPE, ListTree } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MixinMyReactFunctionComponent} from "@my-react/react";

const { currentHookNodeIndex } = __my_react_internal__;

const isFiberWithUseId = (fiber: MyReactFiberNode) => {
  let withUseId = false;
  if (fiber.type & NODE_TYPE.__function__) {
    fiber.hookList?.listToFoot((h) => {
      if (h.type === HOOK_TYPE.useId) {
        withUseId = true;
      }
    });
  }
  return withUseId;
};

// TODO
export const defaultGenerateUseIdMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>) => {
  const parent = fiber.parent;

  if (parent) {
    let parentMap = map.get(parent);

    if (isFiberWithUseId(parent)) {
      parentMap = parentMap || new ListTree();
      parentMap = parentMap.clone();
      parentMap.push(parent);
    }

    if (parentMap) {
      map.set(fiber, parentMap);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const config = map.get(fiber);

    config && (typedFiber._debugIdTree = config);
  }
};

export const defaultGetCurrentId = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>) => {
  const config = map.get(fiber);

  const typedElementType = fiber.elementType as MixinMyReactFunctionComponent;

  const componentName = typedElementType.displayName;

  if (config) {
    return `${componentName}--${config.length}--${currentHookNodeIndex.current}`;
  } else {
    return `${componentName}--0--${currentHookNodeIndex.current}`;
  }
};
