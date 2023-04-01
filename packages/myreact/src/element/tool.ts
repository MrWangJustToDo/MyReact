import { once, TYPEKEY, Element, Consumer, ForwardRef, Memo, Lazy, Provider, Fragment, Suspense } from "@my-react/react-shared";

import { currentRenderPlatform } from "../share";

import type { forwardRef, lazy, memo } from "./feature";
import type {
  MaybeArrayMyReactElementNode,
  MyReactElement,
  MyReactElementNode,
  ArrayMyReactElementNode,
  ArrayMyReactElementChildren,
  MyReactObjectComponent,
} from "./instance";

export const isValidElement = (element?: MyReactElementNode | any): element is MyReactElement => {
  return typeof element === "object" && !Array.isArray(element) && element?.[TYPEKEY] === Element;
};

export const checkValidKey = (children: ArrayMyReactElementNode) => {
  const obj: Record<string, boolean> = {};

  const renderPlatform = currentRenderPlatform.current;

  const onceWarnDuplicate = once(renderPlatform?.log);

  const onceWarnUndefined = once(renderPlatform?.log);

  const validElement = children.filter((c) => isValidElement(c)) as MyReactElement[];

  if (validElement.length > 1) {
    validElement.forEach((c) => {
      if (!c._store["validKey"]) {
        if (typeof c.key === "string") {
          if (obj[c.key]) onceWarnDuplicate({ message: `array child have duplicate key` });

          obj[c.key] = true;
        } else {
          onceWarnUndefined({
            message: "each array child must have a unique key props",
            triggerOnce: true,
          });
        }
        c._store["validKey"] = true;
      }
    });
  }
};

export const checkValidElement = (element: MyReactElementNode) => {
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
        else if (typedRawType[TYPEKEY] === ForwardRef) {
          const CurrentTypedRawType = rawType as ReturnType<typeof forwardRef>;

          const targetRender = CurrentTypedRawType.render;
          if (typeof targetRender !== "function") {
            throw new Error(`invalid render function for 'forwardRef()' element`);
          }
          if (targetRender.prototype?.isMyReactComponent) {
            throw new Error(`invalid render type for 'forwardRef()', expect a render function, but got a element class`);
          }
        }
        // check memo function
        else if (typedRawType[TYPEKEY] === Memo) {
          const CurrentTypedRawType = rawType as ReturnType<typeof memo>;
          if (typeof CurrentTypedRawType.render !== "function") {
            if (isValidElement(CurrentTypedRawType.render)) {
              throw new Error(`look like you are using memo like memo(<Foo />), this is not a support usage, please change to memo(Foo)`);
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Memo) {
              throw new Error(`look like you are using memo like memo(memo(Foo)), please do not wrapper memo more than once`);
            }
            if (CurrentTypedRawType.render[TYPEKEY] === Lazy) {
              throw new Error(`for now, the memo(lazy(loader fun)) is unSupport usage`);
            }
          }
        }
        // check lazy
        else if (typedRawType[TYPEKEY] === Lazy) {
          const CurrentTypedRawType = rawType as ReturnType<typeof lazy>;
          if (typeof CurrentTypedRawType.loader !== "function") {
            throw new Error(`invalid argument for lazy(loader), the loader expect a function, but got a ${CurrentTypedRawType.loader}`);
          }
          if (CurrentTypedRawType.loader.prototype?.isMyReactComponent) {
            throw new Error(`invalid argument for lazy(loader), the loader expect a function, but got a element class`);
          }
        }
        // check invalid
        else if (typedRawType[TYPEKEY] !== Provider) {
          throw new Error(`invalid object element type, current type is: ${typedRawType[TYPEKEY]?.toString()}`);
        }
      }
    }
    element._store["validType"] = true;
  }
};

export const checkValidProps = (element: MyReactElementNode) => {
  const renderPlatform = currentRenderPlatform.current;
  if (isValidElement(element)) {
    if (element.ref) {
      if (typeof element.ref !== "object" && typeof element.ref !== "function") {
        throw new Error("unSupport ref usage, should be a function or a object like `{current: any}`");
      }
    }
    if (element.key && typeof element.key !== "string") {
      throw new Error(`invalid key type, ${element.key}`);
    }
    if (element.type === Fragment) {
      for (const key in element.props) {
        if (key !== "key" && key !== "children" && key !== "wrap") {
          renderPlatform.log({ message: `a Fragment element only support "key" or "children" props`, level: "warn", triggerOnce: true });
        }
      }
    }
    if (element.type === Suspense) {
      for (const key in element.props) {
        if (key !== "key" && key !== "children" && key !== "fallback") {
          renderPlatform.log({ message: `a Suspense element only support "key"、"children" or "fallback" props`, level: "warn", triggerOnce: true });
        }
      }
    }
  }
};

export const checkArrayChildrenKey = (children: ArrayMyReactElementChildren) => {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      checkValidKey(child);
    } else {
      if (isValidElement(child)) child._store["validKey"] = true;
    }
  });
};

export const checkSingleChildrenKey = (children: MaybeArrayMyReactElementNode) => {
  if (Array.isArray(children)) {
    checkValidKey(children);
  } else {
    if (isValidElement(children)) children._store["validKey"] = true;
  }
};
