import type { MyReactElementType } from "@my-react/react";

type RefreshHandler = (type: MyReactElementType) => { current: MyReactElementType; latest: MyReactElementType };

let refreshHandler: RefreshHandler | null = null;

export const setRefreshHandler = (handler: RefreshHandler) => {
  if (refreshHandler) {
    throw new Error(`[@my-react/react-reconciler] "refreshHandler" can be only set once`);
  }

  refreshHandler = handler;
};

export const getStableTypeFromRefresh = (type: MyReactElementType) => {
  const family = refreshHandler?.(type);

  return family?.current || type;
};

export const getLatestTypeFromRefresh = (type: MyReactElementType) => {
  const family = refreshHandler?.(type);

  return family?.latest || type;
};
