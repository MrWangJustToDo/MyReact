import type { MyReactFiberNode } from "@my-react/react";

export type DomElement = Element & {
  __fiber__?: MyReactFiberNode;
  __element__?: MyReactFiberNode["element"];
  __children__?: MyReactFiberNode["children"];
};

export type DomNode = Node & {
  __fiber__?: MyReactFiberNode;
  __element__?: MyReactFiberNode["element"];
};

export type DomComment = Comment & {
  __fiber__?: MyReactFiberNode;
  __element__?: MyReactFiberNode["element"];
};
