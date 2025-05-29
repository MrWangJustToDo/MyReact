import { __my_react_internal__, type MyReactInternalInstance } from "@my-react/react";
import { Effect_TYPE } from "@my-react/react-shared";

import { checkIsMyReactFiberNode, type MyReactFiberNode } from "../runtimeFiber";

const { MyReactInternalInstance: MyReactInternalInstanceClass, instanceToInitialFieldMap } = __my_react_internal__;

export type InstanceField = {
  _context: MyReactFiberNode | null;
  _owner: MyReactFiberNode | null;
  _subscribe: Set<MyReactFiberNode> | null;
  effect: Effect_TYPE;
};

export type VisibleInstanceField = InstanceField & {
  isHidden: boolean;
};

// support private instance field
const instanceMap = instanceToInitialFieldMap as Map<MyReactInternalInstance, InstanceField | VisibleInstanceField>;

export const initInstance = (instance: MyReactInternalInstance) => {
  const exist = instanceMap.get(instance);

  if (exist) return exist;

  const field: InstanceField = {
    _owner: null,
    _context: null,
    _subscribe: null,
    effect: Effect_TYPE.__initial__,
  };

  instanceMap.set(instance, field);

  return field;
};

export const initVisibleInstance = (instance: MyReactInternalInstance) => {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not get field for instance, this is a bug for @my-react`);

  const typedField = field as VisibleInstanceField;

  typedField.isHidden = false;
};

export const setOwnerForInstance = (instance: MyReactInternalInstance, fiber: MyReactFiberNode, instanceField?: InstanceField) => {
  const field = instanceField || instanceMap.get(instance);

  instance._reactInternals = fiber;

  // unmount instance
  if (!field) return;

  field._owner = fiber;
};

export const setContextForInstance = (instance: MyReactInternalInstance, fiber: MyReactFiberNode | null, instanceField?: InstanceField) => {
  const field = instanceField || instanceMap.get(instance);

  // unmount instance
  if (!field) return;

  field._context?._delDependence(instance);

  field._context = fiber;

  field._context?._addDependence(instance);
};

export const setSubscribeForInstance = (instance: MyReactInternalInstance, fiber: MyReactFiberNode | null, instanceField?: InstanceField) => {
  const field = instanceField || instanceMap.get(instance);

  // unmount instance
  if (!field) return;

  if (!field._subscribe) {
    field._subscribe = new Set();
  }

  if (fiber) {
    field._subscribe.add(fiber);

    fiber._addDependence(instance);
  }
};

export const setEffectForInstance = (instance: MyReactInternalInstance, effect: Effect_TYPE, instanceField?: InstanceField) => {
  const field = instanceField || instanceMap.get(instance);

  // unmount instance
  if (!field) return;

  field.effect = effect;
};

export const unmountInstance = (instance: MyReactInternalInstance | null) => {
  if (!instance || !instance.isMyReactInstance) return;

  const field = instanceMap.get(instance);

  if (!field) return;

  field._context?._delDependence(instance);

  field.effect = Effect_TYPE.__unmount__;

  field._owner = null;

  field._context = null;

  field._subscribe?.forEach?.((fiber) => {
    fiber?._delDependence?.(instance);
  });

  instanceMap.delete(instance);
};

export const getInstanceFieldByInstance = (instance: MyReactInternalInstance) => {
  const field = instanceMap.get(instance);

  if (!field) throw new Error("[@my-react/react] instance not found, look like a bug for @my-react");

  return field;
};

export const getInstanceOwnerFiber = (instance: MyReactInternalInstance | MyReactFiberNode): MyReactFiberNode => {
  const typedInstance = instance as MyReactInternalInstance;
  if (typedInstance.isMyReactInstance) {
    const field = instanceMap.get(typedInstance);

    return field?._owner;
  } else {
    if (checkIsMyReactFiberNode(instance)) {
      return instance;
    }
    throw new Error("instance is not a MyReactInternalInstance or MyReactFiberNode");
  }
};

export const getInstanceContextFiber = (instance: MyReactInternalInstance) => {
  const field = instanceMap.get(instance);

  return field?._context;
};

export const getInstanceEffectState = (instance: MyReactInternalInstance) => {
  const field = instanceMap.get(instance);

  return field?.effect;
};

if (__DEV__) {
  Object.defineProperty(MyReactInternalInstanceClass.prototype, "_debugField", {
    get() {
      return instanceMap.get(this);
    },
    configurable: true,
  });
}
