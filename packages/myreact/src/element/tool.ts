import { once, TYPEKEY, Element } from "@my-react/react-shared";

import { currentRunningFiber } from "../share";

import type { MaybeArrayMyReactElementNode, MyReactElement, MyReactElementNode, ArrayMyReactElementNode, ArrayMyReactElementChildren } from "./instance";

export function isValidElement(element?: MyReactElementNode | any): element is MyReactElement {
  return typeof element === "object" && !Array.isArray(element) && element?.[TYPEKEY] === Element;
}

export const checkValidKey = (children: ArrayMyReactElementNode) => {
  const obj: Record<string, boolean> = {};
  const fiber = currentRunningFiber.current;
  const onceWarnDuplicate = once(fiber?.root.renderPlatform.log);
  const onceWarnUndefined = once(fiber?.root.renderPlatform.log);
  const validElement = children.filter((c) => isValidElement(c)) as MyReactElement[];
  if (validElement.length > 1) {
    validElement.forEach((c) => {
      if (!c._store["validKey"]) {
        if (typeof c.key === "string") {
          if (obj[c.key]) {
            onceWarnDuplicate({ message: `array child have duplicate key` });
          }
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
