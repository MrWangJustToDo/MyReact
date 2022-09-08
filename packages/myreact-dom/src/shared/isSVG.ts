import type { MyReactFiberNode } from "@my-react/react";

export const getIsSVGFromMap = (_fiber: MyReactFiberNode, map: Record<string, boolean>) => {
  let _isSVG = _fiber.parent ? map[_fiber.parent.uid] : false;

  if (!_isSVG) {
    const element = _fiber.element;
    if (typeof element === "object" && element?.type === "svg") {
      _isSVG = true;
    }
  }

  map[_fiber.uid] = _isSVG;

  return _isSVG;
};
