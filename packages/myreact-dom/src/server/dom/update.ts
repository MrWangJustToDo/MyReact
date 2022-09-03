import { isProperty, isStyle, IS_UNIT_LESS_NUMBER } from "@ReactDOM_shared";

import type { MyReactFiberNode } from "@my-react/react";

export const update = (fiber: MyReactFiberNode) => {
  if (fiber.__pendingUpdate__) {
    if (fiber.__isPlainNode__) {
      const dom = fiber.dom as HTMLElement;
      const props = fiber.__props__ || {};
      Object.keys(props)
        .filter(isProperty)
        .forEach((key) => {
          if (key === "className") {
            dom[key] = props[key] as string;
          } else {
            dom.setAttribute(key, props[key] as string);
          }
        });
      Object.keys(props)
        .filter(isStyle)
        .forEach((styleKey) => {
          const typedProps = (props[styleKey] as Record<string, unknown>) || {};
          Object.keys(typedProps).forEach((styleName) => {
            if (
              !Object.prototype.hasOwnProperty.call(IS_UNIT_LESS_NUMBER, styleName) &&
              typeof typedProps[styleName] === "number"
            ) {
              (dom as any)[styleKey][styleName] = `${typedProps[styleName]}px`;
              return;
            }
            (dom as any)[styleKey][styleName] = typedProps[styleName];
          });
        });
      if (props["dangerouslySetInnerHTML"]) {
        const typedProps = props["dangerouslySetInnerHTML"] as Record<string, unknown>;
        dom.append(typedProps.__html as string);
      }
    }
    fiber.__pendingUpdate__ = false;
  }
};
