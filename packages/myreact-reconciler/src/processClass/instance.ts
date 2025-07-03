import { getInstanceFieldByInstance, type InstanceField } from "../runtimeGenerate";

import type { MyReactComponent } from "@my-react/react";

export type ClassInstanceField = InstanceField & {
  isMounted: boolean;
};

export const initClassInstance = (instance: MyReactComponent) => {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not find instance field for component, look like a bug for @my-react`);

  const typedField = field as ClassInstanceField;

  typedField.isMounted = false;
};

export const mountClassInstance = (instance: MyReactComponent) => {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not find instance field for component, look like a bug for @my-react`);

  const typedField = field as ClassInstanceField;

  typedField.isMounted = true;
};

export const getClassInstanceFieldByInstance = (instance: MyReactComponent) => {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not find instance field for component, look like a bug for @my-react`);

  return field as ClassInstanceField;
};
