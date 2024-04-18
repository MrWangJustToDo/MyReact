import { __my_react_internal__, type MyReactInternalInstance } from "@my-react/react";
import { Effect_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../runtimeFiber";

const { MyReactInternalInstance: MyReactInternalInstanceClass } = __my_react_internal__;

type InstanceField = {
  _context: MyReactFiberNode | null;
  _owner: MyReactFiberNode | null;
  effect: Effect_TYPE;
};

// support private instance field
export const instanceMap = new Map<MyReactInternalInstance, InstanceField>();

export const initInstance = (instance: MyReactInternalInstance) => {
  if (instanceMap.has(instance)) return;

  const field: InstanceField = {
    _context: null,
    _owner: null,
    effect: Effect_TYPE.__initial__,
  };

  instanceMap.set(instance, field);
};

export const setContextForInstance = (instance: MyReactInternalInstance, fiber: MyReactFiberNode | null) => {
  const field = instanceMap.get(instance);

  // unmount instance
  if (!field) return;

  field._context?._removeDependence(instance);

  field._context = fiber;

  field._context?._addDependence(instance);
};

export const setOwnerForInstance = (instance: MyReactInternalInstance, fiber: MyReactFiberNode) => {
  const field = instanceMap.get(instance);

  // unmount instance
  if (!field) return;

  field._owner = fiber;
};

export const setEffectForInstance = (instance: MyReactInternalInstance, effect: Effect_TYPE) => {
  const field = instanceMap.get(instance);

  // unmount instance
  if (!field) return;

  field.effect = effect;
};

export const unmountInstance = (instance: MyReactInternalInstance) => {
  const field = instanceMap.get(instance);

  if (!field) return;

  field._context?._removeDependence(instance);

  field.effect = Effect_TYPE.__unmount__;

  field._owner = null;

  field._context = null;

  instanceMap.delete(instance);
};

export const getInstanceOwnerFiber = (instance: MyReactInternalInstance) => {
  const field = instanceMap.get(instance);

  return field?._owner;
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
