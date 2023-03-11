import { Consumer, Context, ForwardRef, Lazy, Memo, Provider, TYPEKEY } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";

import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent } from "./instance";
import type { createReactive } from "../reactive";

let contextId = 0;

const defaultObject = { [TYPEKEY]: Context, contextId: 0 };

export const createContext = <T = any>(value: T) => {
  const ContextObject = {
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

export const forwardRef = (render: MixinMyReactFunctionComponent) => {
  return {
    [TYPEKEY]: ForwardRef,
    render,
  };
};

export const memo = (
  render:
    | MixinMyReactFunctionComponent
    | MixinMyReactClassComponent
    | ReturnType<typeof forwardRef>
    | ReturnType<typeof createReactive>
    | { [TYPEKEY]: symbol; [p: string]: unknown }
) => {
  return { [TYPEKEY]: Memo, render };
};

export const lazy = (loader: () => Promise<{ default: MixinMyReactFunctionComponent | MixinMyReactClassComponent }>) => {
  return {
    [TYPEKEY]: Lazy,
    loader,
    _loading: false,
    _loaded: false,
    render: null,
  } as {
    [TYPEKEY]: symbol;
    loader: () => Promise<{ default: MixinMyReactFunctionComponent | MixinMyReactClassComponent } | MixinMyReactFunctionComponent | MixinMyReactClassComponent>;
    _loading: boolean;
    _loaded: boolean;
    render: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent | { [TYPEKEY]: symbol; [p: string]: unknown };
  };
};
