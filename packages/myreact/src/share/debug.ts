import { Activity, Consumer, Context, Fragment, Lazy, Portal, Profiler, Provider, Strict, Suspense, TYPEKEY } from "@my-react/react-shared";

import { isValidElement } from "../element";

import type {
  MyReactElementNode,
  MixinMyReactObjectComponent,
  MixinMyReactClassComponent,
  MixinMyReactFunctionComponent,
  memo,
  forwardRef,
  MyReactElementType,
  MixinMyReactFunctionComponentWithRef,
} from "../element";

export const getMyReactElementName = (element: MyReactElementNode) => {
  if (isValidElement(element)) {
    return getMyReactElementTypeName(element.type);
  } else {
    if (typeof element === "object" && element !== null) {
      return "empty";
    }
    if (element === null || element === undefined || typeof element === "function" || typeof element === "boolean" || element === "") {
      return "null";
    }
    return "text";
  }
};

export const getMyReactElementTypeName = (type: MyReactElementType) => {
  const typedType = type;
  let name = "";
  if (typeof typedType === "object" && typedType !== null) {
    const typedObjectType = typedType as MixinMyReactObjectComponent;
    name = name || typedObjectType.displayName;
    let render = (typedObjectType as ReturnType<typeof memo> | ReturnType<typeof forwardRef>)?.render;
    name = name || (render as MixinMyReactClassComponent)?.displayName || (render as MixinMyReactFunctionComponent)?.name;
    while (typeof render === "object") {
      render = (render as ReturnType<typeof forwardRef>).render;
      name = name || (render as MixinMyReactFunctionComponentWithRef).displayName || (render as MixinMyReactFunctionComponentWithRef)?.name;
    }
    if (typedObjectType[TYPEKEY] === Lazy) {
      name = name || "Lazy";
    }
    if (typedObjectType[TYPEKEY] === Context) {
      name = name || "Context";
    }
    if (typedObjectType[TYPEKEY] === Provider) {
      name = name || "Context.Provider";
    }
    if (typedObjectType[TYPEKEY] === Consumer) {
      name = name || "Context.Consumer";
    }
  }
  if (typeof typedType === "function") {
    name = name || typedType.displayName || typedType.name;
  }
  switch (typedType) {
    case Fragment:
      name = "Fragment";
      break;
    case Profiler:
      name = "Profiler";
      break;
    case Strict:
      name = "Strict";
      break;
    case Suspense:
      name = "Suspense";
      break;
    case Activity:
      name = "Activity";
      break;
    case Portal:
      name = "Portal";
      break;
  }
  return name;
};
