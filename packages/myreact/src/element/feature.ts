import { Consumer, Context, ForwardRef, isNormalEquals, Lazy, Memo, Provider, TYPEKEY } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";
import { lazyLoaded } from "../share";

import type { CreateElementConfig, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement } from "./instance";
import type { RenderFiber } from "../renderFiber";

let contextId = 0;

const defaultObject = { [TYPEKEY]: Context, contextId: 0, displayName: "" };

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
  const objectType: {
    [TYPEKEY]: symbol;
    prototype?: any;
    displayName?: string;
    defaultProps?: Record<string, unknown>;
    render: (props: P, ref?: T) => MyReactElement;
  } = {
    [TYPEKEY]: ForwardRef,
    render,
  };

  return objectType;
};

/**
 * @public
 */
export const memo = <P extends Record<string, unknown> = any>(
  render: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> | ReturnType<typeof forwardRef<P>> | { [TYPEKEY]: symbol; [p: string]: unknown },
  compare?: typeof defaultCompare<P>
) => {
  const objectType: {
    [TYPEKEY]: symbol;
    prototype?: any;
    displayName?: string;
    defaultProps?: Record<string, unknown>;
    compare?: typeof defaultCompare<P>;
    render: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> | ReturnType<typeof forwardRef<P>> | { [TYPEKEY]: symbol; [p: string]: unknown };
  } = {
    [TYPEKEY]: Memo,
    render,
    compare,
  };

  return objectType;
};

/**
 * @public
 */
export const lazy = (
  loader: () => Promise<{ default: MixinMyReactFunctionComponent | MixinMyReactClassComponent } | MixinMyReactFunctionComponent | MixinMyReactClassComponent>
) => {
  const config = {
    [TYPEKEY]: Lazy,
    loader,
    _loading: false,
    _loaded: false,
    _update: lazyLoaded,
    render: null,
  };
  return config as {
    [TYPEKEY]: symbol;
    loader: () => Promise<{ default: MixinMyReactFunctionComponent | MixinMyReactClassComponent } | MixinMyReactFunctionComponent | MixinMyReactClassComponent>;
    _loading: boolean;
    _loaded: boolean;
    _update: (fiber: RenderFiber, loaded: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent) => void;
    render: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent;
  };
};
