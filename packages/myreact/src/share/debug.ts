import { NODE_TYPE } from "../fiber";

import { currentRunningFiber, globalDispatch } from "./env";

import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent } from "../element";
import type { MyReactFiberNode } from "../fiber";

const getTrackDevLog = (fiber: MyReactFiberNode) => {
  if (!__DEV__) return "";
  const element = fiber.element;
  const source = typeof element === "object" ? element?._source : null;
  const owner = typeof element === "object" ? element?._owner : null;
  let preString = "";
  if (source) {
    const { fileName, lineNumber } = source;
    preString = `${preString} (${fileName}:${lineNumber})`;
  }
  if (
    owner &&
    !(fiber.type & NODE_TYPE.__isDynamicNode__) &&
    typeof owner.element === "object" &&
    typeof owner.element?.type === "function"
  ) {
    const typedType = owner.element.type as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
    const name = typedType.displayName || owner.element.type.name;
    preString = `${preString} (render dy ${name})`;
  }
  return preString;
};

const getElementName = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isMemo__) return `<Memo />`;
  if (fiber.type & NODE_TYPE.__isLazy__) return `<Lazy />`;
  if (fiber.type & NODE_TYPE.__isPortal__) return `<Portal />`;
  if (fiber.type & NODE_TYPE.__isNullNode__) return `<Null />`;
  if (fiber.type & NODE_TYPE.__isEmptyNode__) return `<Empty />`;
  if (fiber.type & NODE_TYPE.__isSuspense__) return `<Suspense />`;
  if (fiber.type & NODE_TYPE.__isStrictNode__) return `<Strict />`;
  if (fiber.type & NODE_TYPE.__isForwardRef__) return `<ForwardRef />`;
  if (fiber.type & NODE_TYPE.__isContextProvider__) return `<Provider />`;
  if (fiber.type & NODE_TYPE.__isContextConsumer__) return `<Consumer />`;
  if (typeof fiber.element === "object" && fiber.element !== null) {
    if (typeof fiber.element.type === "string") {
      return `<${fiber.element.type} />`;
    }
    if (typeof fiber.element.type === "function") {
      const typedType = fiber.element.type as MixinMyReactClassComponent | MixinMyReactFunctionComponent;
      let name = typedType.displayName || fiber.element.type.name || "anonymous";
      name = fiber.root === fiber ? `${name} (root)` : name;
      return `<${name}* />`;
    }
    return `<unknown* />`;
  } else {
    return `<text (${fiber.element?.toString()}) />`;
  }
};

export const getFiberNodeName = (fiber: MyReactFiberNode) => `${getElementName(fiber)}${getTrackDevLog(fiber)}`;

export const getFiberTree = (fiber?: MyReactFiberNode | null) => {
  if (fiber) {
    const preString = "".padEnd(4) + "at".padEnd(4);
    let parent = fiber.parent;
    let res = `${preString}${getFiberNodeName(fiber)}`;
    while (parent) {
      res = `${preString}${getFiberNodeName(parent)}\n${res}`;
      parent = parent.parent;
    }
    return `\n${res}`;
  }
  return "";
};

export const getHookTree = (
  hookType: MyReactFiberNode["hookTypeArray"],
  newType: MyReactFiberNode["hookTypeArray"]
) => {
  let re = "\n" + "".padEnd(6) + "Prev render:".padEnd(20) + "Next render:".padEnd(10) + "\n";
  for (const key in hookType) {
    const c = hookType[key];
    const n = newType[key];
    re += (+key + 1).toString().padEnd(6) + c?.padEnd(20) + n?.padEnd(10) + "\n";
  }
  re += "".padEnd(6) + "^".repeat(30) + "\n";

  return re;
};

const cache: Record<string, boolean> = {};

type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

export const log = ({ fiber, message, level = "warn", triggerOnce = false }: LogProps) => {
  const tree = getFiberTree(fiber || currentRunningFiber.current);
  if (triggerOnce) {
    if (cache[tree]) return;
    cache[tree] = true;
  }
  console[level](
    `[${level}]:`,
    "\n-----------------------------------------\n",
    `${typeof message === "string" ? message : message.stack || message.message}`,
    "\n-----------------------------------------\n",
    "Render Tree:",
    tree
  );
};

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    log({ message: e as Error, level: "error" });
    globalDispatch.current.isAppCrash = true;
    throw new Error((e as Error).message);
  }
};

export const safeCallWithFiber = <T extends any[] = any[], K = any>(
  { action, fiber }: { action: (...args: T) => K; fiber: MyReactFiberNode },
  ...args: T
) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    log({ message: e as Error, level: "error", fiber });
    globalDispatch.current.isAppCrash = true;
    throw new Error((e as Error).message);
  }
};
