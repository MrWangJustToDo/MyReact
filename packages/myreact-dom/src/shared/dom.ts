import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export type DomElement = Element & {
  __fiber__?: MyReactFiberNode;
  __element__?: MyReactFiberNode["element"];
  __children__?: MyReactFiberNode["children"];
};

export type DomNode = Node & {
  __fiber__?: MyReactFiberNode;
  __element__?: MyReactFiberNode["element"];
};

export type DomFiberNode = ReturnType<typeof createDomNode>;

export const createDomNode = (element: DomElement | DomNode): { memoizedProps: MyReactElement["props"]; element: DomElement | DomNode } => ({
  memoizedProps: {},
  element,
});
