import { enableHydrateWarn, log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { DomNode, DomElement} from "@my-react-dom-shared";


/**
 * @internal
 */
export const setTextContent = (fiber: MyReactFiberNode) => {
  if (!fiber.nativeNode) throw new Error("[@my-react/react-dom] update error, dom not exist");

  const node = fiber.nativeNode as Text;

  node.textContent = fiber.elementType as string;
}

/**
 * @internal
 */
export const hydrateTextContent = (fiber: MyReactFiberNode) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  if (node.textContent !== String(fiber.elementType)) {
    if (node.textContent === " " && fiber.elementType === "") {
      node.textContent = "";
    } else {
      if (enableHydrateWarn.current) {
        log(fiber, "warn", `hydrate warning, dom 'text' not match from server. server: ${node.textContent}, client: ${fiber.elementType?.toString()}`);
      }
      node.textContent = fiber.elementType as string;
    }
  }
}