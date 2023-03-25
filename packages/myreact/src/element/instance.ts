/* eslint-disable prefer-rest-params */

import { TYPEKEY, Element } from "@my-react/react-shared";

import { currentComponentFiber } from "../share";

import { checkArrayChildrenKey, checkSingleChildrenKey } from "./tool";

import type { createContext, forwardRef, lazy, memo } from "./feature";
import type { MyReactComponent } from "../component";
import type { MyReactFiberNode } from "../fiber";
import type { MyReactInternalInstance } from "../internal";
import type { createRef } from "../share";

type MyReactFunctionComponent<P extends Record<string, unknown> = any> = (props: P) => MyReactElementNode;

type MyReactClassComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> = typeof MyReactComponent<P, S, C>;

export type MyReactObjectComponent =
  | ReturnType<typeof createContext>["Consumer"]
  | ReturnType<typeof createContext>["Provider"]
  // type error
  | ReturnType<typeof forwardRef>
  | ReturnType<typeof memo>
  | ReturnType<typeof lazy>
  | { [TYPEKEY]: symbol; [p: string]: unknown };

export type MixinMyReactClassComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> = MyReactClassComponent<P, S, C> & {
  displayName?: string;
  defaultProps?: Record<string, unknown>;
};

export type MixinMyReactFunctionComponent<P extends Record<string, unknown> = any> = MyReactFunctionComponent<P> & {
  displayName?: string;
  defaultProps?: Record<string, unknown>;
};

export type MyReactElementType<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any> =
  | symbol
  | string
  | MyReactObjectComponent
  | MixinMyReactClassComponent<P, S, C>
  | MixinMyReactFunctionComponent<P>;

export interface LikeJSX<T extends MyReactElementType = any, P extends Record<string, unknown> = any, Key extends string | number = any> {
  type: T;
  props: P;
  key: Key | null;
  ref?: CreateElementProps["ref"];
  _owner?: CreateElementProps["_owner"];
  _self?: CreateElementProps["_self"];
  _source?: CreateElementProps["_source"];
  _store?: Record<string, unknown>;
}

export type MyReactElement = LikeJSX & { [TYPEKEY]: symbol };

export type MyReactElementNode = MyReactElement | ((p: any) => MyReactElementNode) | string | number | boolean | null | undefined;

export type MaybeArrayMyReactElementNode = MyReactElementNode | MyReactElementNode[];

export type ArrayMyReactElementNode = MyReactElementNode[];

export type ArrayMyReactElementChildren = MaybeArrayMyReactElementNode[];

export type Props = {
  children?: MaybeArrayMyReactElementNode;
  [key: string]: unknown;
};

export type CreateElementProps<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any> = {
  type: MyReactElementType<P, S, C>;
  key: string | null;
  ref: ReturnType<typeof createRef> | ((node?: { [p: string]: any } | MyReactInternalInstance) => void) | null;
  props: Props;
  _self: MyReactInternalInstance | null;
  _source: { fileName: string; lineNumber: string } | null;
  _owner: MyReactFiberNode | null;
};

export type CreateElementConfig = {
  ref?: CreateElementProps["ref"];
  key?: CreateElementProps["key"];
  __self?: CreateElementProps["_self"];
  __source?: CreateElementProps["_source"];
  [key: string]: unknown;
};

export const createMyReactElement = ({ type, key, ref, props, _self, _source, _owner }: CreateElementProps): MyReactElement => {
  if (__DEV__) {
    const element = {
      [TYPEKEY]: Element,
      type,
      key,
      ref,
      props,

      _owner,
      _self,
      _source,
      _store: {} as Record<string, unknown>,
    };

    if (typeof Object.freeze === "function") {
      Object.freeze(element.props);
      Object.freeze(element);
    }

    return element;
  } else {
    const element = {
      [TYPEKEY]: Element,
      type,
      key,
      ref,
      props,
    };

    return element;
  }
};

export function createElement<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  type: CreateElementProps<P, S, C>["type"],
  config?: CreateElementConfig,
  ...children: ArrayMyReactElementChildren
) {
  let key: CreateElementProps["key"] = null;
  let ref: CreateElementProps["ref"] = null;
  let self: CreateElementProps["_self"] = null;
  let source: CreateElementProps["_source"] = null;

  const props: CreateElementProps["props"] = {};

  if (config !== null && config !== undefined) {
    const { ref: _ref, key: _key, __self, __source, ...resProps } = config;
    ref = _ref === undefined ? null : _ref;
    key = _key === undefined ? null : _key + "";
    self = __self === undefined ? null : __self;
    source = __source === undefined ? null : __source;
    Object.keys(resProps).forEach((key) => (props[key] = resProps[key]));
  }

  if (typeof type === "function" || typeof type === "object") {
    const typedType = type as MixinMyReactClassComponent<P, S, C> | MixinMyReactFunctionComponent<P>;
    Object.keys(typedType?.defaultProps || {}).forEach((key) => {
      props[key] = props[key] === undefined ? typedType.defaultProps?.[key] : props[key];
    });
  }

  // const childrenLength = arguments.length - 2;

  const childrenLength = children.length;

  if (childrenLength > 1) {
    // children = Array.from(arguments).slice(2);
    if (__DEV__) {
      checkArrayChildrenKey(children as ArrayMyReactElementNode);
    }
    props.children = children as MaybeArrayMyReactElementNode;
  } else if (childrenLength === 1) {
    if (__DEV__) {
      checkSingleChildrenKey(children[0] as MyReactElementNode);
    }
    props.children = children[0];
  }

  return createMyReactElement({
    type,
    key,
    ref,
    props,
    _self: self,
    _source: source,
    _owner: currentComponentFiber.current,
  });
}

export function cloneElement<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  element: MyReactElementNode,
  config?: CreateElementConfig,
  children?: Props["children"]
) {
  if (element === null || element === undefined) {
    throw new Error("cloneElement(...) need a valid element as params");
  }
  if (typeof element !== "object") return element;
  // from react source code
  element = element as MyReactElement;
  const props = Object.assign({}, element.props);
  let key = element.key;
  let ref = element.ref;
  const type = element.type;
  const self = element._self;
  const source = element._source;
  let owner = element._owner;
  if (config !== null && config !== undefined) {
    const { ref: _ref, key: _key, __self, __source, ...resProps } = config;

    if (_ref !== undefined) {
      ref = _ref;
      owner = currentComponentFiber.current;
    }

    if (_key !== undefined) {
      key = _key + "";
    }

    let defaultProps: Record<string, unknown> | undefined = {};

    if (typeof element.type === "function" || typeof element.type === "object") {
      const typedType = element.type as MixinMyReactClassComponent<P, S, C> | MixinMyReactFunctionComponent<P>;

      defaultProps = typedType?.defaultProps;
    }

    for (const key in resProps) {
      if (Object.prototype.hasOwnProperty.call(resProps, key)) {
        if (resProps[key] === undefined && defaultProps) {
          props[key] = defaultProps[key];
        } else {
          props[key] = resProps[key];
        }
      }
    }
  }

  const childrenLength = arguments.length - 2;

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);

    if (__DEV__) checkArrayChildrenKey(children as ArrayMyReactElementNode);

    props.children = children;
  } else if (childrenLength === 1) {
    if (__DEV__) checkSingleChildrenKey(children as MyReactElementNode);

    props.children = children;
  }

  const clonedElement = createMyReactElement({
    type,
    key,
    ref,
    props,
    _self: self,
    _source: source,
    _owner: owner,
  });

  if (__DEV__) clonedElement._store["clonedEle"] = true;

  return clonedElement;
}
