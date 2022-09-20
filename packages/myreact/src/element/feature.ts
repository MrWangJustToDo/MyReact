import { MyReactInternalInstance } from "../internal";

import { My_React_Consumer, My_React_Context, My_React_ForwardRef, My_React_Lazy, My_React_Memo, My_React_Provider } from "./symbol";

import type { MyReactClassComponent, MyReactFunctionComponent } from "./instance";

let contextId = 0;

export const createContext = <T = any>(value: T) => {
  const ContextObject = {
    ["$$typeof"]: My_React_Context,
    id: contextId++,
    Provider: {} as typeof Provider,
    Consumer: {} as typeof Consumer,
  };

  const Provider = {
    ["$$typeof"]: My_React_Provider,
    value,
    Context: { id: 0 },
  };

  const Consumer = {
    ["$$typeof"]: My_React_Consumer,
    Internal: MyReactInternalInstance,
    Context: { id: 0 },
  };

  Object.defineProperty(Provider, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(Consumer, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  ContextObject.Provider = Provider;
  ContextObject.Consumer = Consumer;

  return ContextObject;
};

export const forwardRef = (render: MyReactFunctionComponent | { ["$$typeof"]: symbol; [p: string]: unknown }) => {
  return {
    ["$$typeof"]: My_React_ForwardRef,
    render,
  };
};

export const memo = (
  render:
    | MyReactFunctionComponent
    | MyReactClassComponent
    | {
        ["$$typeof"]: symbol;
        render: MyReactFunctionComponent | MyReactClassComponent;
        [p: string]: unknown;
      }
) => {
  return { ["$$typeof"]: My_React_Memo, render };
};

export const lazy = (loader: () => Promise<{ default: MyReactFunctionComponent | MyReactClassComponent }>) => {
  return {
    ["$$typeof"]: My_React_Lazy,
    loader,
    _loading: false,
    _loaded: false,
    render: null,
  } as {
    ["$$typeof"]: typeof My_React_Lazy;
    loader: () => Promise<{ default: MyReactFunctionComponent | MyReactClassComponent } | MyReactFunctionComponent | MyReactClassComponent>;
    _loading: boolean;
    _loaded: boolean;
    render: null | MyReactFunctionComponent | MyReactClassComponent | { ["$$typeof"]: symbol; [p: string]: unknown };
  };
};
