import type { createContext, MyReactElement } from "../element";
import type { MyReactFiberNode } from "./instance";

export const getContextValue = (
  fiber: MyReactFiberNode | null,
  ContextObject?: ReturnType<typeof createContext> | null
) => {
  if (fiber) {
    const typedElement = fiber.element as MyReactElement;
    return (typedElement.props["value"] as Record<string, unknown>) || null;
  } else {
    return (ContextObject?.Provider["value"] as Record<string, unknown>) || null;
  }
};
