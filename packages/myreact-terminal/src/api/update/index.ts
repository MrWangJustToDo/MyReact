import { NODE_TYPE } from "@my-react/react-reconciler";

import { isGone, isNew, isProperty, isStyle, isUnitlessNumber, propsToAttrMap } from "../../shared";
import { appendChildNode, setTextNodeValue, TextElement } from "../native";

import type { PlainElement } from "../native";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const update = (fiber: MyReactFiberNode) => {
  if (!fiber.nativeNode) throw new Error("update error, dom not exist");

  const node = fiber.nativeNode as PlainElement | TextElement;

  if (fiber.type & NODE_TYPE.__text__) {
    const typeNode = node as TextElement;
    setTextNodeValue(typeNode, fiber.element as string);
  } else if (fiber.type & NODE_TYPE.__plain__) {
    const dom = node as PlainElement;

    const oldProps = fiber.memoizedProps || {};

    const newProps = fiber.pendingProps || {};

    Object.keys(oldProps)
      .filter((key) => isGone(newProps)(key) || isNew(oldProps, newProps)(key))
      .forEach((key) => {
        if (isProperty(key)) {
          if (newProps[key] === null || newProps[key] === undefined) {
            const attrKey = propsToAttrMap[key] || key;
            dom.setAttribute(attrKey, newProps[key]);
          }
        }
      });
      
    Object.keys(newProps)
      .filter(isNew(oldProps, newProps))
      .filter((key) => {
        if (isProperty(key)) {
          if (newProps[key] !== null && newProps[key] !== undefined) {
            const attrKey = propsToAttrMap[key] || key;
            dom.setAttribute(attrKey, newProps[key]);
          }
        } else if (isStyle(key)) {
          const typedNewProps = newProps[key] as Record<string, unknown>;

          const typedOldProps = oldProps[key] as Record<string, unknown>;

          Object.keys(typedNewProps || {})
            .filter(isNew(typedOldProps || {}, typedNewProps))
            .forEach((styleName) => {
              if (!isUnitlessNumber[styleName] && typeof typedNewProps[styleName] === "number") {
                dom[key][styleName] = `${typedNewProps[styleName]}px`;
                return;
              }
              if (typedNewProps[styleName] !== null && typedNewProps[styleName] !== undefined) {
                dom[key][styleName] = typedNewProps[styleName];
              } else {
                dom[key][styleName] = "";
              }
            });
        }
      });
    if (
      newProps["dangerouslySetInnerHTML"] &&
      newProps["dangerouslySetInnerHTML"] !== oldProps["dangerouslySetInnerHTML"] &&
      newProps["dangerouslySetInnerHTML"].__html !== oldProps["dangerouslySetInnerHTML"]?.__html
    ) {
      const typedProps = newProps["dangerouslySetInnerHTML"] as Record<string, unknown>;
      if (typedProps.__html) {
        appendChildNode(dom, new TextElement(typedProps.__html as string));
      }
    }
  }
};
