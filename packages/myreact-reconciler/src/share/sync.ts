import { __my_react_shared__ } from "@my-react/react/type";

const { enableSyncFlush } = __my_react_shared__;

/**
 * @deprecated
 */
export let syncFlush = false;

/**
 * @deprecated
 */
export function beforeSyncFlush() {
  syncFlush = true;
}

/**
 * @deprecated
 */
export function afterSyncFlush() {
  syncFlush = false;
}

const stack = [enableSyncFlush.current];

export function beforeSyncUpdate() {
  stack.push(enableSyncFlush.current);

  enableSyncFlush.current = true;
}

export function afterSyncUpdate() {
  enableSyncFlush.current = stack.pop();
}
