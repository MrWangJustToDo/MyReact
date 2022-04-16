import { MyReactPureComponent } from "./component.js";
import { MyReactInstance } from "./share.js";
import { Context, Portal, Provider, Consumer, ForwardRef } from "./tools.js";
import { createElement } from "./vdom.js";

function createPortal(element, container) {
  return createElement({ type: Portal }, { container }, element);
}

function createContext(value) {
  const ContextObject = {
    type: Context,
  };

  const ProviderObject = {
    type: Provider,
    value,
  };

  const ConsumerObject = {
    type: Consumer,
    Internal: MyReactInstance,
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
  class Memo extends MyReactPureComponent {
    get isMyReactMemoComponent() {
      return true;
    }

    get isMyReactForwardRefRender() {
      return typeof MemoRender === "object" && MemoRender.type === ForwardRef;
    }

    render() {
      return createElement(MemoRender, this.props);
    }
  }

  return Memo;
}

export { createPortal, createContext, forwardRef, memo };
