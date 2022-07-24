import { currentRunningFiber, enableAllCheck, isAppCrash } from './env';

import type { MyReactFiberNode } from '../fiber';
import type { MixinClassComponent, MixinFunctionComponent } from '../vdom';

export const getTrackDevLog = (fiber: MyReactFiberNode) => {
  if (!enableAllCheck.current) return '';
  const vdom = fiber.element;
  const source = typeof vdom === 'object' ? vdom?._source : null;
  const owner = typeof vdom === 'object' ? vdom?._owner : null;
  let preString = '';
  if (source) {
    const { fileName, lineNumber } = source;
    preString = `${preString} (${fileName}:${lineNumber})`;
  }
  if (
    owner &&
    !fiber.__isDynamicNode__ &&
    typeof owner.element === 'object' &&
    typeof owner.element?.type === 'function'
  ) {
    const typedType = owner.element.type as
      | MixinClassComponent
      | MixinFunctionComponent;
    const name = typedType.displayName || owner.element.type.name;
    preString = `${preString} (render dy ${name})`;
  }
  return preString;
};

export const getFiberNodeName = (fiber: MyReactFiberNode) => {
  if (fiber.__isMemo__) return `<Memo />${getTrackDevLog(fiber)}`;
  if (fiber.__isLazy__) return `<Lazy />${getTrackDevLog(fiber)}`;
  if (fiber.__isPortal__) return `<Portal />${getTrackDevLog(fiber)}`;
  if (fiber.__isEmptyNode__) return `<Empty />${getTrackDevLog(fiber)}`;
  if (fiber.__isStrictNode__) return `<Strict />${getTrackDevLog(fiber)}`;
  if (fiber.__isSuspense__) return `<Suspense />${getTrackDevLog(fiber)}`;
  if (fiber.__isForwardRef__) return `<ForwardRef />${getTrackDevLog(fiber)}`;
  if (fiber.__isFragmentNode__) return `<Fragment />${getTrackDevLog(fiber)}`;
  if (fiber.__isContextProvider__)
    return `<Provider />${getTrackDevLog(fiber)}`;
  if (fiber.__isContextConsumer__)
    return `<Consumer />${getTrackDevLog(fiber)}`;
  if (typeof fiber.element === 'object') {
    if (fiber.__isPlainNode__ && typeof fiber.element?.type === 'string') {
      return `<${fiber.element.type} />${getTrackDevLog(fiber)}`;
    }
    if (fiber.__isDynamicNode__ && typeof fiber.element?.type === 'function') {
      const typedType = fiber.element.type as
        | MixinClassComponent
        | MixinFunctionComponent;
      let name =
        typedType.displayName || fiber.element.type.name || 'anonymous';
      name = fiber.__root__ ? `${name} (root)` : name;
      return `<${name}* />${getTrackDevLog(fiber)}`;
    }
    return `<unknown />${getTrackDevLog(fiber)}`;
  } else {
    return `<text - (${fiber.element?.toString()}) />${getTrackDevLog(fiber)}`;
  }
};

export const getFiberTree = (fiber?: MyReactFiberNode | null) => {
  if (fiber) {
    const preString = ''.padEnd(4) + 'at'.padEnd(4);
    let parent = fiber.parent;
    let res = `${preString}${getFiberNodeName(fiber)}`;
    while (parent) {
      res = `${preString}${getFiberNodeName(parent)}\n${res}`;
      parent = parent.parent;
    }
    return `\n${res}`;
  }
  return '';
};

export const getHookTree = (
  hookType: MyReactFiberNode['hookType'],
  newType: MyReactFiberNode['hookType']
) => {
  let re =
    '\n' +
    ''.padEnd(6) +
    'Prev render:'.padEnd(20) +
    'Next render:'.padEnd(10) +
    '\n';
  for (const key in hookType) {
    const c = hookType[key];
    const n = newType[key];
    re +=
      (+key + 1).toString().padEnd(6) + c?.padEnd(20) + n?.padEnd(10) + '\n';
  }
  re += ''.padEnd(6) + '^'.repeat(30) + '\n';

  return re;
};

const cache: Record<string, boolean> = {};

type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: 'warn' | 'error';
};

export const log = ({
  fiber,
  message,
  level = 'warn',
  triggerOnce = false,
}: LogProps) => {
  const tree = getFiberTree(fiber || currentRunningFiber.current);
  if (triggerOnce) {
    if (cache[tree]) return;
    cache[tree] = true;
  }
  console[level](
    `[${level}]:`,
    '\n-----------------------------------------\n',
    `${
      typeof message === 'string' ? message : message.stack || message.message
    }`,
    '\n-----------------------------------------\n',
    'Render Tree:',
    tree
  );
};

export const safeCall = <T extends any[] = any[], K = any>(
  action: (...args: T) => K,
  ...args: T
) => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    log({ message: e as Error, level: 'error' });
    isAppCrash.current = true;
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
    log({ message: e as Error, level: 'error', fiber });
    isAppCrash.current = true;
    throw new Error((e as Error).message);
  }
};

export const debugWithDOM = (fiber: MyReactFiberNode) => {
  if (fiber.dom) {
    const debugDOM = fiber.dom as Element & {
      __fiber__: MyReactFiberNode;
      __vdom__: MyReactFiberNode['element'];
      __children__: MyReactFiberNode['children'];
    };
    debugDOM['__fiber__'] = fiber;
    debugDOM['__vdom__'] = fiber.element;
    debugDOM['__children__'] = fiber.children;
  }
};
