import {
  log,
  once,
  enableAllCheck,
  My_React_Consumer,
  My_React_Element,
  My_React_ForwardRef,
  My_React_Fragment,
  My_React_Lazy,
  My_React_Memo,
  My_React_Portal,
  My_React_Provider,
  My_React_Strict,
  My_React_Suspense,
} from '../share';

import type { NODE_TYPE_KEY } from '../share';
import type {
  Children,
  ChildrenNode,
  DynamicChildrenNode,
  MaybeArrayChildrenNode,
} from './instance';

export function isValidElement(
  element?: MaybeArrayChildrenNode | null
): element is Children {
  return (
    typeof element === 'object' &&
    !Array.isArray(element) &&
    element?.$$typeof === My_React_Element
  );
}

export function getTypeFromVDom(element: DynamicChildrenNode) {
  const nodeType: { [key in typeof NODE_TYPE_KEY[number]]?: boolean } = {};
  if (isValidElement(element)) {
    const rawType = element.type;
    if (typeof rawType === 'object') {
      nodeType.__isObjectNode__ = true;
      const typedRawType = rawType as { ['$$typeof']: symbol };
      switch (typedRawType['$$typeof']) {
        case My_React_Provider:
          nodeType.__isContextProvider__ = true;
          break;
        case My_React_Consumer:
          nodeType.__isContextConsumer__ = true;
          break;
        case My_React_Portal:
          nodeType.__isPortal__ = true;
          break;
        case My_React_Memo:
          nodeType.__isMemo__ = true;
          break;
        case My_React_ForwardRef:
          nodeType.__isForwardRef__ = true;
          break;
        case My_React_Lazy:
          nodeType.__isLazy__ = true;
          break;
        default:
          throw new Error(
            `invalid object element type ${typedRawType['$$typeof'].toString()}`
          );
      }
    } else if (typeof rawType === 'function') {
      nodeType.__isDynamicNode__ = true;
      if (rawType.prototype?.isMyReactComponent) {
        nodeType.__isClassComponent__ = true;
      } else {
        nodeType.__isFunctionComponent__ = true;
      }
    } else if (typeof rawType === 'symbol') {
      switch (rawType) {
        case My_React_Fragment:
          nodeType.__isFragmentNode__ = true;
          break;
        case My_React_Strict:
          nodeType.__isStrictNode__ = true;
          break;
        case My_React_Suspense:
          nodeType.__isSuspense__ = true;
          break;
        default:
          throw new Error(`invalid symbol element type ${rawType.toString()}`);
      }
    } else if (typeof rawType === 'string') {
      nodeType.__isPlainNode__ = true;
    } else {
      throw new Error(`invalid element type ${rawType}`);
    }
  } else {
    if (typeof element === 'object' && element !== null) {
      nodeType.__isEmptyNode__ = true;
    } else if (element === null || element === undefined || element === false) {
      nodeType.__isNullNode__ = true;
    } else {
      nodeType.__isTextNode__ = true;
    }
  }
  return nodeType;
}

export const checkValidKey = (children: ChildrenNode[]) => {
  const obj: Record<string, boolean> = {};
  const onceWarnDuplicate = once(log);
  const onceWarnUndefined = once(log);
  children.forEach((c) => {
    if (isValidElement(c) && !c._store['validKey']) {
      if (typeof c.key === 'string') {
        if (obj[c.key]) {
          onceWarnDuplicate({ message: 'array child have duplicate key' });
        }
        obj[c.key] = true;
      } else {
        onceWarnUndefined({
          message: 'each array child must have a unique key props',
          triggerOnce: true,
        });
      }
      c._store['validKey'] = true;
    }
  });
};

export const checkArrayChildrenKey = (children: ChildrenNode[]) => {
  if (enableAllCheck.current) {
    children.forEach((child) => {
      if (Array.isArray(child)) {
        checkValidKey(child);
      } else {
        if (isValidElement(child)) child._store['validKey'] = true;
      }
    });
  }
};

export const checkSingleChildrenKey = (children: ChildrenNode) => {
  if (enableAllCheck.current) {
    if (Array.isArray(children)) {
      checkValidKey(children);
    } else {
      if (isValidElement(children)) children._store['validKey'] = true;
    }
  }
};
