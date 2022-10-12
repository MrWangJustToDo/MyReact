import { __my_react_shared__ } from "@my-react/react";
import { once } from "@my-react/react-shared";

import { My_React_Element } from "./symbol";

import type { MyReactElementNode, MyReactElement, MaybeArrayMyReactElementNode } from "@my-react/react";

const { log } = __my_react_shared__;

export function isValidElement(element?: MyReactElementNode): element is MyReactElement {
  return typeof element === "object" && !Array.isArray(element) && element?.$$typeof === My_React_Element;
}

export const checkValidKey = (children: MyReactElementNode[]) => {
  const obj: Record<string, boolean> = {};

  const onceWarnDuplicate = once(log);

  const onceWarnUndefined = once(log);

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

export const checkSingleChildrenKey = (children: MaybeArrayMyReactElementNode) => {
  if (Array.isArray(children)) {
    checkValidKey(children);
  } else {
    if (isValidElement(children)) children._store["validKey"] = true;
  }
};
