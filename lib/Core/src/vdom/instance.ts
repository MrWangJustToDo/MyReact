/* eslint-disable prefer-rest-params */
import { currentFunctionFiber, My_React_Element } from '../share';

import {
  checkArrayChildrenKey,
  checkSingleChildrenKey,
  isValidElement,
} from './tool';

import type { MyReactComponent } from '../component';
import type { createContext, forwardRef, lazy, memo } from '../element';
import type { MyReactFiberNode } from '../fiber';
import type { createRef, MyReactInternalInstance } from '../share';

export type FunctionComponent<T extends any[] = any[]> = (
  ...args: T
) => Children;

export type ClassComponent = typeof MyReactComponent;

export type ObjectComponent =
  | ReturnType<typeof createContext>['Consumer']
  | ReturnType<typeof createContext>['Provider']
  | ReturnType<typeof forwardRef>
  | ReturnType<typeof memo>
  | ReturnType<typeof lazy>
  | { ['$$typeof']: symbol; [p: string]: unknown };

export type MixinClassComponent = ClassComponent & {
  displayName?: string;
  defaultProps?: Record<string, unknown>;
};

export type MixinFunctionComponent = FunctionComponent & {
  displayName?: string;
  defaultProps?: Record<string, unknown>;
};

export type ElementType =
  | symbol
  | string
  | ObjectComponent
  | ClassComponent
  | FunctionComponent;

export type Children = ReturnType<typeof createVDom>;

export type ChildrenNode =
  | Children
  | string
  | number
  | boolean
  | null
  | undefined;

export type MaybeArrayChildrenNode = ChildrenNode | ChildrenNode[];

export type DynamicChildrenNode = ChildrenNode;

export type ArrayChildrenNode = ChildrenNode[];

export type Props = {
  children?: MaybeArrayChildrenNode;
  [key: string]: unknown;
};

export type CreateVDomProps = {
  type: ElementType;
  key: string | null;
  ref:
    | ReturnType<typeof createRef>
    | ((node?: Element | MyReactInternalInstance) => void)
    | null;
  props: Props;
  _self: MyReactInternalInstance | null;
  _source: { fileName: string; lineNumber: string } | null;
  _owner: MyReactFiberNode | null;
};

export type CreateElementConfig = {
  ref?: CreateVDomProps['ref'];
  key?: CreateVDomProps['key'];
  __self?: CreateVDomProps['_self'];
  __source?: CreateVDomProps['_source'];
  [key: string]: unknown;
};

export class MyReactVDom {
  ['$$typeof'] = My_React_Element;

  _store: Record<string, unknown> = {};

  constructor(
    readonly type: CreateVDomProps['type'],
    readonly key: CreateVDomProps['key'],
    readonly ref: CreateVDomProps['ref'],
    readonly props: CreateVDomProps['props'],
    readonly _self: CreateVDomProps['_self'],
    readonly _source: CreateVDomProps['_source'],
    readonly _owner: CreateVDomProps['_owner']
  ) {}
}

const createVDom = ({
  type,
  key,
  ref,
  props,
  _self,
  _source,
  _owner,
}: CreateVDomProps) => {
  return {
    ['$$typeof']: My_React_Element,
    type,
    key,
    ref,
    props,

    _owner,
    _self,
    _source,
    _store: {} as Record<string, unknown>,
  };
  // return new MyReactVDom(type, key, ref, props, _self, _source, _owner);
};

export function createElement(
  type: CreateVDomProps['type'],
  config: CreateElementConfig,
  children?: Props['children']
) {
  let key: CreateVDomProps['key'] = null;
  let ref: CreateVDomProps['ref'] = null;
  let self: CreateVDomProps['_self'] = null;
  let source: CreateVDomProps['_source'] = null;

  const props: CreateVDomProps['props'] = {};

  if (config !== null && config !== undefined) {
    const { ref: _ref, key: _key, __self, __source, ...resProps } = config;
    ref = _ref === undefined ? null : _ref;
    key = _key === undefined ? null : _key + '';
    self = __self === undefined ? null : __self;
    source = __source === undefined ? null : __source;
    Object.keys(resProps).forEach((key) => (props[key] = resProps[key]));
  }

  if (typeof type === 'function' || typeof type === 'object') {
    const typedType = type as MixinClassComponent | MixinFunctionComponent;
    Object.keys(typedType?.defaultProps || {}).forEach((key) => {
      props[key] =
        props[key] === undefined ? typedType.defaultProps?.[key] : props[key];
    });
  }

  const childrenLength = arguments.length - 2;

  if (childrenLength > 1) {
    children = Array.from(arguments).slice(2);
    checkArrayChildrenKey(children);
    props.children = children;
  } else if (childrenLength === 1) {
    checkSingleChildrenKey(children as ChildrenNode);
    props.children = children;
  }

  return createVDom({
    type,
    key,
    ref,
    props,
    _self: self,
    _source: source,
    _owner: currentFunctionFiber.current,
  });
}

export function cloneElement(
  element: ChildrenNode,
  config?: CreateElementConfig,
  children?: Props['children']
) {
  if (isValidElement(element)) {
    const typedElement = element as Children;
    const props = Object.assign({}, typedElement.props);
    let key = typedElement.key;
    let ref = typedElement.ref;
    const type = typedElement.type;
    const self = typedElement._self;
    const source = typedElement._source;
    let owner = typedElement._owner;
    if (config !== null && config !== undefined) {
      const { ref: _ref, key: _key, __self, __source, ...resProps } = config;
      if (_ref !== undefined) {
        ref = _ref;
        owner = currentFunctionFiber.current;
      }
      if (_key !== undefined) {
        key = _key + '';
      }
      let defaultProps: Record<string, unknown> | undefined = {};
      if (
        typeof typedElement.type === 'function' ||
        typeof typedElement.type === 'object'
      ) {
        const typedType = typedElement.type as
          | MixinClassComponent
          | MixinFunctionComponent;
        defaultProps = typedType?.defaultProps;
      }
      for (const key in resProps) {
        if (Object.prototype.hasOwnProperty.call(resProps, key)) {
          if (resProps[key] === undefined && defaultProps) {
            props[key] = defaultProps[key];
          } else {
            props[key] = resProps[key];
          }
        }
      }
    }

    const childrenLength = arguments.length - 2;

    if (childrenLength > 1) {
      children = Array.from(arguments).slice(2);
      checkArrayChildrenKey(children);
      props.children = children;
    } else if (childrenLength === 1) {
      checkSingleChildrenKey(children as ChildrenNode);
      props.children = children;
    }

    const clonedElement = createVDom({
      type,
      key,
      ref,
      props,
      _self: self,
      _source: source,
      _owner: owner,
    });

    clonedElement._store['cloned'] = true;

    return clonedElement;
  } else {
    throw new Error('cloneElement() need valid element as args');
  }
}
