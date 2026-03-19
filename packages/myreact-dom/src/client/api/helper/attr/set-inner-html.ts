import { isSameInnerHTML } from "@my-react-dom-client/api";
import { enableHydrateWarn, log, type DomElement, type DomNode } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const setInnerHtml = (fiber: MyReactFiberNode) => {
  const node = fiber.nativeNode as DomElement | DomNode;

  const dom = node as HTMLElement;

  const oldProps = fiber.memoizedProps || {};

  const newProps = fiber.pendingProps || {};

  if (oldProps["dangerouslySetInnerHTML"] && !newProps["dangerouslySetInnerHTML"]) {
    dom.innerHTML = "";
  } else if (
    newProps["dangerouslySetInnerHTML"] &&
    newProps["dangerouslySetInnerHTML"] !== oldProps["dangerouslySetInnerHTML"] &&
    newProps["dangerouslySetInnerHTML"].__html !== oldProps["dangerouslySetInnerHTML"]?.__html
  ) {
    const typedProps = newProps["dangerouslySetInnerHTML"] as Record<string, unknown>;
    dom.innerHTML = typedProps.__html as string;
  }
};

/**
 * @internal
 */
export const hydrateInnerHtml = (fiber: MyReactFiberNode) => {
  const props = fiber.pendingProps;

  if (props["dangerouslySetInnerHTML"]) {
    const typedDOM = fiber.nativeNode as Element;

    const typedProps = props["dangerouslySetInnerHTML"] as Record<string, unknown>;

    const incomingInnerHTML = typedProps.__html as string;

    const ignoreWarn = props["suppressHydrationWarning"] || !enableHydrateWarn.current;

    if (!isSameInnerHTML(typedDOM, incomingInnerHTML)) {
      if (!ignoreWarn) {
        log(fiber, "warn", `hydrate error, 'innerHTML' not match from server.`);
      }

      typedDOM.innerHTML = typedProps.__html as string;
    }
  }
};
