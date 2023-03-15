import { isValidElement } from "@my-react/react";
import { Consumer, ForwardRef, HOOK_TYPE, Lazy, Memo, Reactive, TYPEKEY } from "@my-react/react-shared";

import type { forwardRef, memo, MyReactElementNode, MyReactHookNode, MyReactObjectComponent, lazy, MyReactFiberNode } from "@my-react/react";
import type { createReactive } from "@my-react/react-reactive";

export const checkElementValid = (element: MyReactElementNode) => {
  if (isValidElement(element)) {
    if (!element._store["validType"]) {
      const rawType = element.type;
      if (typeof rawType === "object") {
        const typedRawType = rawType as MyReactObjectComponent;
        // check <Consumer /> usage
        if (typedRawType[TYPEKEY] === Consumer) {
          if (typeof element.props.children !== "function") {
            throw new Error(`@my-react <Consumer /> need a render function as children`);
          }
        }
        // check forward function
        if (typedRawType[TYPEKEY] === ForwardRef) {
          const CurrentTypedRawType = rawType as ReturnType<typeof forwardRef>;
          const targetRender = CurrentTypedRawType.render;
          if (typeof targetRender !== "function") {
            throw new Error(`invalid render function 'forwardRef()' element`);
          }
          if (targetRender.prototype?.isMyReactComponent) {
            throw new Error(`invalid render type for 'forwardRef()', expect a render function, but got a element class`);
          }
        }
        // check memo function
        if (typedRawType[TYPEKEY] === Memo) {
          const CurrentTypedRawType = rawType as ReturnType<typeof memo>;
          if (typeof CurrentTypedRawType.render !== "function") {
            if (isValidElement(CurrentTypedRawType.render)) {
              throw new Error(`look like you are using memo like memo(<Foo />), this is not a support usage, pls change to memo(Foo)`);
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Memo) {
              throw new Error(`look like you are using like memo(memo(<Foo />)), pls do not wrapper memo more than once`);
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Lazy) {
              throw new Error(`for now, the memo(lazy(loader fun)) is unSupport usage`);
            }
          }
        }
        // check createReactive
        if (typedRawType[TYPEKEY] === Reactive) {
          const CurrentTypedRawType = rawType as ReturnType<typeof createReactive>;
          if (element.props.children && typeof element.props.children !== "function") {
            throw new Error("invalid type of children for <Reactive /> element");
          }
          if (CurrentTypedRawType.render && CurrentTypedRawType.render?.prototype.isMyReactComponent) {
            throw new Error(`invalid render type for 'createReactive()', expect a render function, bug got a Element class`);
          }
        }
        // check lazy
        if (typedRawType[TYPEKEY] === Lazy) {
          const CurrentTypedRawType = rawType as ReturnType<typeof lazy>;
          if (typeof CurrentTypedRawType.loader !== "function") {
            throw new Error(`invalid argument for lazy(loader), the loader expect a function, but got a ${CurrentTypedRawType.loader}`);
          }
          if (CurrentTypedRawType.loader.prototype?.isMyReactComponent) {
            throw new Error(`invalid argument for lazy(loader), the loader expect a function, but got a element class`);
          }
        }
      }
      if (element.ref) {
        if (typeof element.ref !== "object" && typeof element.ref !== "function") {
          throw new Error("unSupport ref usage, should be a function or a object like `{current: any}`");
        }
      }
      if (element.key && typeof element.key !== "string") {
        throw new Error(`invalid key type, ${element.key}`);
      }
      if (element.props.children && element.props["dangerouslySetInnerHTML"]) {
        throw new Error("can not render contain `children` and `dangerouslySetInnerHTML` for current element");
      }
      if (element.props["dangerouslySetInnerHTML"]) {
        if (
          typeof element.props["dangerouslySetInnerHTML"] !== "object" ||
          !Object.prototype.hasOwnProperty.call(element.props["dangerouslySetInnerHTML"], "__html")
        ) {
          throw new Error("invalid dangerouslySetInnerHTML props, should like {__html: string}");
        }
      }
    }
    element._store["validType"] = true;
  }
};

export const checkHookValid = (hookNode: MyReactHookNode) => {
  if (
    hookNode.hookType === HOOK_TYPE.useMemo ||
    hookNode.hookType === HOOK_TYPE.useEffect ||
    hookNode.hookType === HOOK_TYPE.useCallback ||
    hookNode.hookType === HOOK_TYPE.useLayoutEffect
  ) {
    if (typeof hookNode.value !== "function") {
      throw new Error(`${hookNode.hookType} initial error`);
    }
  }
  if (hookNode.hookType === HOOK_TYPE.useContext) {
    if (typeof hookNode.value !== "object" || hookNode.value === null) {
      throw new Error(`${hookNode.hookType} initial error`);
    }
  }
};

export const debugWithNode = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    const node = fiber.node as any;
    node.__fiber__ = fiber;
    node.__element__ = fiber.element;
    node.__children__ = fiber.children;
  }
};
