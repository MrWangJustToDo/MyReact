import { __my_react_internal__ } from "@my-react/react";

import { checkSingleChildrenKey } from "./check";
import { My_React_Element, My_React_Fragment } from "./symbol";

import type { CreateElementProps, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement, MyReactElementType, Props } from "@my-react/react";

export const Fragment = My_React_Fragment;

const { currentComponentFiber, currentRunningFiber } = __my_react_internal__;

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

type JSXMyReactElement = MyReactElement & {
  _jsx: boolean;
};

// todo
export const jsx = (
  type: MyReactElementType,
  config: Props,
  maybeKey: string | null,
  source: CreateElementProps["_source"],
  self: CreateElementProps["_self"]
) => {
  const props: Props = {};

  let key: string | null = null;
  let ref: CreateElementProps["ref"] = null;

  if (maybeKey !== undefined) {
    key = "" + maybeKey;
  }

  // <div {...props} /> we can not make sure this usage will contain `key` of not
  if (config?.key) {
    key = "" + config.key;
  }

  if (config?.ref) {
    ref = config.ref as CreateElementProps["ref"];
  }

  for (const propsName in config) {
    if (Object.prototype.hasOwnProperty.call(config, propsName) && !Object.prototype.hasOwnProperty.call(RESERVED_PROPS, propsName)) {
      props[propsName] = config[propsName];
    }
  }

  if (type && (typeof type === "function" || typeof type === "object")) {
    const typedType = type as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    Object.keys(typedType?.defaultProps || {}).forEach((key) => {
      props[key] = props[key] === undefined ? typedType.defaultProps?.[key] : props[key];
    });
  }

  const element: JSXMyReactElement = {
    ["$$typeof"]: My_React_Element,
    type,
    key,
    ref,
    props,
    _jsx: true,
    _self: self,
    _source: source,
    _owner: currentComponentFiber.current,
    _store: {} as Record<string, unknown>,
  };

  if (__DEV__ && typeof Object.freeze === "function") {
    Object.freeze(element.props);
    Object.freeze(element);
  }

  return element;
};

export const jsxDEV = (
  type: MyReactElementType,
  config: Props,
  key: string | null,
  isStaticChildren: boolean,
  source: CreateElementProps["_source"],
  self: CreateElementProps["_self"]
) => {
  const element = jsx(type, config, key, source, self);

  if (config.children) {
    const children = config.children;

    if (isStaticChildren) {
      if (Array.isArray(children)) {
        children.forEach((c) => checkSingleChildrenKey(c));

        if (__DEV__) Object.freeze(children);
      } else {
        const fiber = currentRunningFiber.current;
        fiber?.root.globalPlatform.log({ message: "Static children should always be an array.", level: "warn" });
      }
      if (!Array.isArray(children)) {
        const fiber = currentRunningFiber.current;
        fiber?.root.globalPlatform.log({ message: "Static children should always be an array.", level: "warn" });
      }
    } else {
      checkSingleChildrenKey(children);
    }
  }

  return element;
};

export const jsxs = (type: MyReactElementType, config: Props, key: string | null, source: CreateElementProps["_source"], self: CreateElementProps["_self"]) => {
  return jsxDEV(type, config, key, true, source, self);
};
