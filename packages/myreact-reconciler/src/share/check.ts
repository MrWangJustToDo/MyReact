import { isValidElement } from "@my-react/react";
import { HOOK_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "./fiberType";

import type { forwardRef, memo, MyReactElementNode, MyReactFiberNode, MyReactHookNode } from "@my-react/react";

export const checkFiberElement = (_fiber: MyReactFiberNode, _element: MyReactElementNode) => {
  if (isValidElement(_element)) {
    const typedElement = _element;
    if (!typedElement._store["validType"]) {
      if (_fiber.type & NODE_TYPE.__isContextConsumer__) {
        if (typeof typedElement.props.children !== "function") {
          throw new Error(`Consumer need a function children`);
        }
      }
      if (_fiber.type & (NODE_TYPE.__isMemo__ | NODE_TYPE.__isForwardRef__)) {
        const typedType = typedElement.type as ReturnType<typeof forwardRef> | ReturnType<typeof memo>;
        if (typeof typedType.render !== "function" && typeof typedType.render !== "object") {
          throw new Error("invalid render type");
        }
        if (_fiber.type & NODE_TYPE.__isForwardRef__ && typeof typedType.render !== "function") {
          throw new Error("forwardRef() need a function component");
        }
      }
      if (_fiber.type & NODE_TYPE.__isKeepLiveNode__) {
        if (Array.isArray(_element.props.children)) throw new Error("<KeepLive /> expected to receive a single MyReact _element child");
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
        throw new Error("can not render contain `children` and `dangerouslySetInnerHTML` for current _element");
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

export const checkHook = (_hookNode: MyReactHookNode) => {
  if (
    _hookNode.hookType === HOOK_TYPE.useMemo ||
    _hookNode.hookType === HOOK_TYPE.useEffect ||
    _hookNode.hookType === HOOK_TYPE.useCallback ||
    _hookNode.hookType === HOOK_TYPE.useLayoutEffect
  ) {
    if (typeof _hookNode.value !== "function") {
      throw new Error(`${_hookNode.hookType} initial error`);
    }
  }
  if (_hookNode.hookType === HOOK_TYPE.useContext) {
    if (typeof _hookNode.value !== "object" || _hookNode.value === null) {
      throw new Error(`${_hookNode.hookType} initial error`);
    }
  }
};
