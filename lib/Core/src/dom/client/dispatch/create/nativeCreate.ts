import type { Children } from '../../../../element';
import type { MyReactFiberNode } from '../../../../fiber';

export const nativeCreate = (fiber: MyReactFiberNode) => {
  if (fiber.__isTextNode__) {
    fiber.dom = document.createTextNode(fiber.element as string);
  } else if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as Children;
    if (fiber.nameSpace) {
      fiber.dom = document.createElementNS(
        fiber.nameSpace,
        typedElement.type as string
      );
    } else {
      fiber.dom = document.createElement(typedElement.type as string);
    }
  } else {
    fiber.dom = fiber.__props__.container as Element;
  }
};
