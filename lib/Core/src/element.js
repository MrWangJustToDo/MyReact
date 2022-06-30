import { MyReactInternalInstance } from "./share.js";
import {
  Context,
  Portal,
  Provider,
  Consumer,
  ForwardRef,
  Memo,
  Lazy,
} from "./symbol.js";
import { createElement } from "./vdom/index.js";

function createPortal(element, container) {
  return createElement({ type: Portal }, { container }, element);
}

let contextId = 0;

function createContext(value) {
  const ContextObject = {
    type: Context,
    id: contextId++,
  };

  const ProviderObject = {
    type: Provider,
    value,
  };

  const ConsumerObject = {
    type: Consumer,
    Internal: MyReactInternalInstance,
  };

  Object.defineProperty(ConsumerObject, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(ProviderObject, "Context", {
    get() {
      return ContextObject;
    },
    enumerable: false,
    configurable: false,
  });

  ContextObject.Provider = ProviderObject;
  ContextObject.Consumer = ConsumerObject;

  return ContextObject;
}

function forwardRef(ForwardRefRender) {
  return {
    type: ForwardRef,
    render: ForwardRefRender,
  };
}

function memo(MemoRender) {
  const MemoObject = {
    type: Memo,
    render: MemoRender,
  };

  Object.defineProperty(MemoObject, "isMyReactMemoComponent", {
    get() {
      return true;
    },
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(MemoObject, "isMyReactForwardRefRender", {
    get() {
      return typeof MemoRender === "object" && MemoRender.type === ForwardRef;
    },
    enumerable: false,
    configurable: false,
  });

  return MemoObject;
}

function lazy(loader) {
  const LazyObject = {
    type: Lazy,
    loader: loader,
    _initial: true,
    _loaded: false,
    _result: null,
  };

  Object.defineProperty(LazyObject, "isMyReactLazyComponent", {
    get() {
      return true;
    },
    enumerable: false,
    configurable: false,
  });

  return LazyObject;
}

export { createPortal, createContext, forwardRef, memo, lazy };
