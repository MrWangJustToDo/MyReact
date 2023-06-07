/* eslint-disable prefer-rest-params */
import { TYPEKEY, Element } from "@my-react/react-shared";

import { currentComponentFiber } from "../share";

import { checkArrayChildrenKey, checkSingleChildrenKey, checkValidElement, checkValidProps } from "./tool";

import type { createContext, forwardRef, lazy, memo } from "./feature";
import type { MyReactComponent } from "../component";
import type { MyReactInternalInstance } from "../internal";
import type { RenderFiber } from "../renderFiber";
import type { createRef } from "../share";

type MyReactFunctionComponent<P extends Record<string, unknown> = any> = (props: P) => MyReactElementNode;

type MyReactClassComponent<
  P extends Record<string, unknown> = any,
  S extends Record<string, unknown> = any,
  C extends Record<string, unknown> = any
> = typeof MyReactComponent<P, S, C>;

export type MyReactObjectComponent<P extends Record<string, unknown> = any> =
  | ReturnType<typeof createContext<P>>["Consumer"]
  | ReturnType<typeof createContext<P>>["Provider"]
  | ReturnType<typeof forwardRef<P>>
  | ReturnType<typeof memo<P>>
  | ReturnType<typeof lazy>;

export type MixinMyReactObjectComponent<P extends Record<string, unknown> = any> = MyReactObjectComponent<P> & {
  displayName?: string;
  defaultProps?: Record<string, unknown>;
};

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
  | MixinMyReactObjectComponent<P>
  | MixinMyReactClassComponent<P, S, C>
  | MixinMyReactFunctionComponent<P>;

export interface LikeJSX<T extends MyReactElementType<P> = any, P extends Record<string, unknown> = any, Key extends string | number = any> {
  type: T;
  props: P;
  key: Key | null;
  ref?: CreateElementProps["ref"];
  _owner?: CreateElementProps["_owner"];
  _self?: CreateElementProps["_self"];
  _source?: CreateElementProps["_source"];
  _store?: Record<string, unknown>;
}

export type MyReactElement = LikeJSX & {
  [TYPEKEY]?: symbol;
  // createElement
  _legacy?: boolean;
  // jsx runtime
  _jsx?: boolean;
};

export type MyReactElementNode = MyReactElement | ((p: any) => MyReactElementNode) | string | number | boolean | null | undefined;

export type MaybeArrayMyReactElementNode = MyReactElementNode | MyReactElementNode[];

export type ArrayMyReactElementNode = MyReactElementNode[];

export type ArrayMyReactElementChildren = MaybeArrayMyReactElementNode[];

export type Props = {
  [key: string]: unknown;
};

export type CreateElementProps<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any> = {
  type: MyReactElementType<P, S, C>;
  key: string | number | null;
  ref: ReturnType<typeof createRef> | ((node?: { [p: string]: any } | MyReactInternalInstance) => void) | null;
  props: P & Props;
  _self: MyReactInternalInstance | null;
  _source: { fileName: string; lineNumber: string } | null;
  _owner: RenderFiber | null;
};

export type CreateElementConfig<P extends Record<string, unknown> = any> = {
  ref?: CreateElementProps<P>["ref"];
  key?: CreateElementProps<P>["key"];
  __self?: CreateElementProps<P>["_self"];
  __source?: CreateElementProps<P>["_source"];
};

export const createMyReactElement = ({ type, key, ref, props, _self, _source, _owner }: CreateElementProps): MyReactElement => {
  const element: MyReactElement = {
    [TYPEKEY]: Element,
    type,
    key,
    ref,
    props,
    _legacy: true,
  };

  if (__DEV__) {
    element._owner = _owner;

    element._self = _self;

    element._source = _source;

    element._store = {};

    if (typeof Object.freeze === "function") {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

export function createElement<P extends Record<string, unknown> = any>(
  type: string,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: symbol,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: ReturnType<typeof memo<P>>,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: ReturnType<typeof forwardRef<P>>,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: ReturnType<typeof createContext<P>>["Provider"],
  config?: CreateElementConfig<P> & { value: CreateElementProps<P>["props"] },
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: ReturnType<typeof createContext<P>>["Consumer"],
  config?: CreateElementConfig<P> & { children: (props: P) => MyReactElement },
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: MixinMyReactObjectComponent<P>,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any>(
  type: MixinMyReactFunctionComponent<P>,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  type: MixinMyReactClassComponent<P, S, C>,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
  ...children: ArrayMyReactElementChildren
): MyReactElement;

export function createElement<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  type: MyReactElementType<P, S, C>,
  config?: CreateElementConfig<P> & CreateElementProps<P>["props"],
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

    Object.keys(typedType?.defaultProps || {}).forEach((key) => (props[key] = props[key] === undefined ? typedType.defaultProps?.[key] : props[key]));
  }

  const childrenLength = children.length;

  if (childrenLength > 1) {
    if (__DEV__) checkArrayChildrenKey(children as ArrayMyReactElementNode);

    props.children = children as MaybeArrayMyReactElementNode;
  } else if (childrenLength === 1) {
    if (__DEV__) checkSingleChildrenKey(children[0] as MyReactElementNode);

    props.children = children[0];
  }

  const element = createMyReactElement({
    type,
    key,
    ref,
    props,
    _self: self,
    _source: source,
    _owner: currentComponentFiber.current,
  });

  if (__DEV__) checkValidElement(element);

  if (__DEV__) checkValidProps(element);

  return element;
}

export function cloneElement<P extends Record<string, unknown> = any, S extends Record<string, unknown> = any, C extends Record<string, unknown> = any>(
  element: MyReactElementNode,
  config?: CreateElementConfig,
  children?: Props["children"]
) {
  if (element === null || element === undefined) throw new Error("cloneElement(...) need a valid element as params");

  if (typeof element !== "object") return element;

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

    if (_key !== undefined) key = _key + "";

    let defaultProps: Record<string, unknown> | undefined = {};

    if (typeof element.type === "function" || typeof element.type === "object") {
      const typedType = element.type as MixinMyReactClassComponent<P, S, C> | MixinMyReactFunctionComponent<P>;

      defaultProps = typedType?.defaultProps || {};
    }

    Object.keys(resProps).forEach((key) => (props[key] = resProps[key] === undefined ? defaultProps[key] : resProps[key]));
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

  if (__DEV__) clonedElement._store["validType"] = true;

  if (__DEV__) checkValidProps(clonedElement);

  return clonedElement;
}
