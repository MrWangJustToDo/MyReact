import { __my_react_shared__ } from "@my-react/react";

const { enableSyncFlush } = __my_react_shared__;

const prev = [enableSyncFlush.current];

export const beforeSync = () => {
  prev.push(enableSyncFlush.current);

  enableSyncFlush.current = true;
};

export const afterSync = () => {
  enableSyncFlush.current = prev.pop();
};
