import { getInstanceFieldByInstance, type InstanceField } from "../runtimeGenerate";

import type { MyReactComponent } from "@my-react/react/type";

export type ClassInstanceField = InstanceField & {
  isMounted: boolean;
};

export function initClassInstance(instance: MyReactComponent) {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not find instance field for component, look like a bug for @my-react`);

  const typedField = field as ClassInstanceField;

  typedField.isMounted = false;
}

export function mountClassInstance(instance: MyReactComponent) {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not find instance field for component, look like a bug for @my-react`);

  const typedField = field as ClassInstanceField;

  typedField.isMounted = true;
}

export function getClassInstanceFieldByInstance(instance: MyReactComponent) {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not find instance field for component, look like a bug for @my-react`);

  return field as ClassInstanceField;
}
