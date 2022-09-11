import { isValidElement } from "../element";
import { HOOK_TYPE } from "../hook";

import { NODE_TYPE } from "./symbol";

import type { forwardRef, memo } from "../element";
import type { MyReactHookNode } from "../hook";
import type { MyReactFiberNode } from "./instance";

export const checkFiberElement = (fiber: MyReactFiberNode) => {
  const element = fiber.element;
  if (isValidElement(element)) {
    const typedElement = element;
    if (!typedElement._store["validType"]) {
      if (fiber.type & NODE_TYPE.__isContextConsumer__) {
        if (typeof typedElement.props.children !== "function") {
          throw new Error(`Consumer need a function children`);
        }
      }
      if (fiber.type & (NODE_TYPE.__isMemo__ | NODE_TYPE.__isForwardRef__)) {
        const typedType = typedElement.type as ReturnType<typeof forwardRef> | ReturnType<typeof memo>;
        if (typeof typedType.render !== "function" && typeof typedType.render !== "object") {
          throw new Error("invalid render type");
        }
        if (fiber.type & NODE_TYPE.__isForwardRef__ && typeof typedType.render !== "function") {
          throw new Error("forwardRef() need a function component");
        }
      }
      if (typedElement.ref) {
        if (typeof typedElement.ref !== "object" && typeof typedElement.ref !== "function") {
          throw new Error("unSupport ref usage, should be a function or a object like `{current: any}`");
        }
      }
      if (typedElement.key && typeof typedElement.key !== "string") {
        throw new Error(`invalid key type, ${typedElement.key}`);
      }
      if (typedElement.props.children && typedElement.props["dangerouslySetInnerHTML"]) {
        throw new Error("can not render contain `children` and `dangerouslySetInnerHTML` for current element");
      }
      if (typedElement.props["dangerouslySetInnerHTML"]) {
        if (
          typeof typedElement.props["dangerouslySetInnerHTML"] !== "object" ||
          !Object.prototype.hasOwnProperty.call(typedElement.props["dangerouslySetInnerHTML"], "__html")
        ) {
          throw new Error("invalid dangerouslySetInnerHTML props, should like {__html: string}");
        }
      }
      typedElement._store["validType"] = true;
    }
  }
};

export const checkFiberHook = (fiber: MyReactFiberNode) => {
  const hookNode = fiber.hookListFoot as MyReactHookNode;
  if (
    hookNode.hookType === HOOK_TYPE.useMemo ||
    hookNode.hookType === HOOK_TYPE.useEffect ||
    hookNode.hookType === HOOK_TYPE.useCallback ||
    hookNode.hookType === HOOK_TYPE.useLayoutEffect
  ) {
    if (typeof hookNode.value !== "function") {
      throw new Error(`${hookNode.hookType} initial error`);
    }
  }
  if (hookNode.hookType === HOOK_TYPE.useContext) {
    if (typeof hookNode.value !== "object" || hookNode.value === null) {
      throw new Error(`${hookNode.hookType} initial error`);
    }
  }
};

export const checkFiberInstance = (_fiber: MyReactFiberNode) => {
  void 0;
};
