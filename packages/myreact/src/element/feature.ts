import { Consumer, Context, ForwardRef, isNormalEquals, Lazy, Memo, Provider, TYPEKEY } from "@my-react/react-shared";

import { MyReactInternalInstance } from "../internal";
import { currentRenderPlatform, currentRunningFiber } from "../share";

import type { CreateElementConfig, MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElement } from "./instance";

let contextId = 0;

const defaultObject = { [TYPEKEY]: Context, contextId: 0 };

const defaultCompare = <P extends Record<string, unknown>>(oldProps: P, newProps: P) => isNormalEquals(oldProps, newProps);

type ContextObjectType<T, K> = {
  displayName?: string;
  [TYPEKEY]: symbol;
  contextId: number;
  Provider: T;
  Consumer: K;
};

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

export const forwardRef = <P extends Record<string, unknown> = any, T extends CreateElementConfig["ref"] = any>(
  render: (props: P, ref?: T) => MyReactElement
) => {
  return {
    [TYPEKEY]: ForwardRef,
    render,
  };
};

export const memo = <P extends Record<string, unknown> = any>(
  render: MixinMyReactFunctionComponent<P> | MixinMyReactClassComponent<P> | ReturnType<typeof forwardRef<P>> | { [TYPEKEY]: symbol; [p: string]: unknown },
  compare = defaultCompare<P>
) => {
  return { [TYPEKEY]: Memo, render, compare };
};

const wrapperLoader = (config: ReturnType<typeof lazy>, loader: Parameters<typeof lazy>[0]) => {
  const asyncLoader = async () => {
    const renderPlatform = currentRenderPlatform.current;
    config._loading = true;
    try {
      const res = await loader();
      return res;
    } catch (e) {
      renderPlatform.log({ fiber: currentRunningFiber.current, level: "warn", message: `[@my-react/react] failed to load lazy component` });
    } finally {
      config._loading = false;
      config._loaded = true;
    }
  };

  config.loader = asyncLoader;
};

export const lazy = (
  loader: () => Promise<{ default: MixinMyReactFunctionComponent | MixinMyReactClassComponent } | MixinMyReactFunctionComponent | MixinMyReactClassComponent>
) => {
  const config = {
    [TYPEKEY]: Lazy,
    loader,
    _loading: false,
    _loaded: false,
    render: null,
  };
  wrapperLoader(config, loader);
  return config as {
    [TYPEKEY]: symbol;
    loader: () => Promise<{ default: MixinMyReactFunctionComponent | MixinMyReactClassComponent } | MixinMyReactFunctionComponent | MixinMyReactClassComponent>;
    _loading: boolean;
    _loaded: boolean;
    render: null | MixinMyReactFunctionComponent | MixinMyReactClassComponent | { [TYPEKEY]: symbol; [p: string]: unknown };
  };
};
