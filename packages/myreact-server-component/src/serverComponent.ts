import { isValidElement, __my_react_shared__ } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFunctionComponent } from "@my-react/react";

type MyReactServerElementNode = MyReactFunctionComponent | string | number | boolean | null | undefined;

const { getTypeFromElement } = __my_react_shared__;

export const resolveServerComponent = (element: MyReactServerElementNode) => {
  // for server component, we do not need fiber node, just invoke the element
  if (isValidElement(element)) {
    const type = getTypeFromElement(element);
    // todo ? maybe should support all the type
    if (type & NODE_TYPE.__isClassComponent__) {
      throw new Error("@my-react/react-server-component not support serialize type `class` component, pls use `function` component instead");
    }
    if (type & NODE_TYPE.__isReactive__) {
      throw new Error("@my-react/react-server-component not support serialize type `reactive` component, pls use `function` component instead");
    }
    if (type & NODE_TYPE.__isLazy__) {
      throw new Error("@my-react/react-server-component not need use `lazy()` on the server component, pls change it to normal `function` component");
    }
  }
  return null;
};
