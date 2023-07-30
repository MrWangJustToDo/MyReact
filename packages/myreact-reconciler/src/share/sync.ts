import { __my_react_shared__ } from "@my-react/react";

const { enableSyncFlush } = __my_react_shared__;

/**
 * @deprecated
 */
export let syncFlush = false;

/**
 * @deprecated
 */
export const beforeSyncFlush = () => {
  syncFlush = true;
};

/**
 * @deprecated
 */
export const afterSyncFlush = () => {
  syncFlush = false;
};

const prev = [enableSyncFlush.current];

export const beforeSyncUpdate = () => {
  prev.push(enableSyncFlush.current);

  enableSyncFlush.current = true;
};

export const afterSyncUpdate = () => {
  enableSyncFlush.current = prev.pop();
};
