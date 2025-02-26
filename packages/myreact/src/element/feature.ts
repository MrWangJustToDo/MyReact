import { Consumer, Context, ForwardRef, isNormalEquals, Lazy, Memo, Provider, TYPEKEY } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";
import { lazyLoaded } from "../share";

import type { CreateElementConfig, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement } from "./instance";
import type { RenderFiber } from "../renderFiber";

let contextId = 0;

const defaultObject = { [TYPEKEY]: Context, contextId: 0, displayName: "" };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultCompare = <P extends Record<string, unknown>>(oldProps: P, newProps: P) => isNormalEquals(oldProps, newProps);

/**
 * @public
 */
export type ContextObjectType<T, K> = {
  displayName?: string;
  [TYPEKEY]: symbol;
  contextId: number;
  Provider: T;
  Consumer: K;
};

/**
 * @public
 */
export const createContext = <T = any>(value: T) => {
  const ContextObject: ContextObjectType<typeof ProviderObject, typeof ConsumerObject> = {
    [TYPEKEY]: Context,
    contextId: contextId++,
    Provider: {} as typeof ProviderObject,
    Consumer: {} as typeof ConsumerObject,
  };

  const ProviderObject = {
    [TYPEKEY]: Provider,
    value,
    Context: defaultObject,
  };

  const ConsumerObject = {
    [TYPEKEY]: Consumer,
    Internal: MyReactInternalInstance,
    Context: defaultObject,
  };

  Object.defineProperty(ProviderObject, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(ConsumerObject, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  ContextObject.Provider = ProviderObject;

  ContextObject.Consumer = ConsumerObject;

  return ContextObject;
};

/**
 * @public
 */
export const forwardRef = <P extends Record<string, unknown> = any, T extends CreateElementConfig<P>["ref"] = any>(
  render: (props: P, ref?: T) => MyReactElement
) => {
  const objectType = {
    [TYPEKEY]: ForwardRef,
    render,
  };

  return objectType as {
    [TYPEKEY]: symbol;
    prototype?: any;
    displayName?: string;
    defaultProps?: Record<string, unknown>;
    render: (props: P, ref?: T) => MyReactElement;
  };
};

export type ForwardRefType<P extends Record<string, unknown>, T extends CreateElementConfig<P>["ref"]> = {
  [TYPEKEY]: symbol;
  prototype?: any;
  displayName?: string;
  defaultProps?: Record<string, unknown>;
  render: (props: P, ref?: T) => MyReactElement;
};

/**
 * @public
 */
export const memo = <P extends Record<string, unknown> = any>(
  render: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> | ReturnType<typeof forwardRef<P>> | { [TYPEKEY]: symbol; [p: string]: unknown },
  compare?: typeof defaultCompare<P>
) => {
  const objectType = {
    [TYPEKEY]: Memo,
    render,
    compare,
  };

  return objectType as {
    [TYPEKEY]: symbol;
    prototype?: any;
    displayName?: string;
    defaultProps?: Record<string, unknown>;
    compare?: typeof defaultCompare<P>;
    render: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> | ReturnType<typeof forwardRef<P>> | { [TYPEKEY]: symbol; [p: string]: unknown };
  };
};

export type MemoType<P extends Record<string, unknown>> = {
  [TYPEKEY]: symbol;
  prototype?: any;
  displayName?: string;
  defaultProps?: Record<string, unknown>;
  compare?: typeof defaultCompare<P>;
  render: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> | ReturnType<typeof forwardRef<P>> | { [TYPEKEY]: symbol; [p: string]: unknown };
};

/**
 * @public
 */
export const lazy = <P extends Record<string, unknown> = any>(
  loader: () => Promise<
    { default: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> } | MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P>
  >
) => {
  const config = {
    [TYPEKEY]: Lazy,
    loader,
    _loading: false,
    _loaded: false,
    render: null,
  };
  return config as {
    [TYPEKEY]: symbol;
    loader: () => Promise<
      { default: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> } | MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P>
    >;
    _loading: boolean;
    _loaded: boolean;
    render: null | MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P>;
  };
};

lazy._updater = lazyLoaded;

export type LazyType<P extends Record<string, unknown>> = {
  [TYPEKEY]: symbol;
  loader: () => Promise<
    { default: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> } | MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P>
  >;
  _loading: boolean;
  _loaded: boolean;
  _update: (fiber: RenderFiber, loaded: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent) => void;
  render: null | MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P>;
};
