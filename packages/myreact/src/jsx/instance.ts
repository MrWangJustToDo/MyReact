import { checkSingleChildrenKey, My_React_Element } from "../element";
import { currentComponentFiber, log } from "../share";

import type { CreateElementProps, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElementType, Props, MyReactElement } from "../element";

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
      checkSingleChildrenKey(children);
      if (!Array.isArray(children)) {
        log({ message: "Static children should always be an array.", level: "warn" });
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
