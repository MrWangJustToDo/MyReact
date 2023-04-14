import type { HydrateDOM } from "../create/getHydrateDom";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const fallback = (fiber: MyReactFiberNode) => {
  const pendingDeleteArray: Element[] = [];

  const clearHydrate = (dom: HydrateDOM) => {
    if (dom.__skipChildren__) {
      delete dom.__skipChildren__;
      return;
    }

    const children = Array.from(dom.childNodes);

    children.forEach((node) => {
      const typedNode = node as HydrateDOM;

      if (!typedNode.__hydrate__) {
        pendingDeleteArray.push(typedNode);
      } else {
        delete typedNode["__hydrate__"];
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        clearHydrate(node as HydrateDOM);
      }
    });
  };

  const renderContainer = fiber.renderContainer;

  const container = renderContainer.rootNode as HTMLElement;

  Array.from(container.childNodes).forEach(clearHydrate);

  pendingDeleteArray.forEach((d) => d?.remove());
};
