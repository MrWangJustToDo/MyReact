import { UniqueArray } from "@my-react/react-shared";

import { getInstanceFieldByInstance, type VisibleInstanceField } from "../runtimeGenerate";

import type { PromiseWithState } from "../processPromise";
import type { lazy, MyReactInternalInstance } from "@my-react/react";

export type SuspenseInstanceField = VisibleInstanceField & {
  asyncLoadList: UniqueArray<ReturnType<typeof lazy> | PromiseWithState<any>>;
};

export const initSuspenseInstance = (instance: MyReactInternalInstance) => {
  const field = getInstanceFieldByInstance(instance);

  if (!field) throw new Error(`[@my-react/react] can not get field for instance, this is a bug for @my-react`);

  const typedField = field as SuspenseInstanceField;

  typedField.isHidden = false;

  typedField.asyncLoadList = new UniqueArray<ReturnType<typeof lazy> | PromiseWithState<any>>();
};
