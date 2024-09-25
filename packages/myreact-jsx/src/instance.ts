import { __my_react_internal__ } from "@my-react/react";
import { TYPEKEY, Element } from "@my-react/react-shared";

import { checkArrayChildrenKey, checkSingleChildrenKey, checkValidElement } from "./check";

import type {
  CreateElementProps,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
  MyReactElement,
  MyReactElementType,
  Props,
  MaybeArrayMyReactElementNode,
} from "@my-react/react";

const { currentComponentFiber } = __my_react_internal__;

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

export { Fragment } from "@my-react/react-shared";

/**
 * @public
 */
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
  if (config?.key !== undefined) {
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

  const element: MyReactElement = {
    [TYPEKEY]: Element,
    type,
    key,
    ref,
    props,
  };

  if (__DEV__) {
    element._jsx = true;

    element._owner = currentComponentFiber.current;

    element._self = self;

    element._source = source;

    element._store = {};

    if (typeof Object.freeze === "function") {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * @public
 */
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
    const children = config.children as MaybeArrayMyReactElementNode;

    if (isStaticChildren) {
      if (Array.isArray(children)) {
        checkArrayChildrenKey(children);

        Object.freeze(children);
      } else {
        console.warn(`[@my-react/react] static children should always be an array`);
      }
      if (!Array.isArray(children)) {
        console.warn(`[@my-react/react] static children should always be an array.`);
      }
    } else {
      checkSingleChildrenKey(children);
    }
  }

  checkValidElement(element);

  return element;
};

/**
 * @public
 */
export const jsxs = (type: MyReactElementType, config: Props, key: string | null, source: CreateElementProps["_source"], self: CreateElementProps["_self"]) => {
  if (__DEV__) {
    return jsxDEV(type, config, key, true, source, self);
  } else {
    return jsx(type, config, key, source, self);
  }
};
