import { generateFiberToUnmountList, unmountList } from "@my-react/react-reconciler";

import type { CustomRenderDispatch, MyReactFiberNode } from "@my-react/react-reconciler";

export const unmount = (_pending: MyReactFiberNode, _dispatch: CustomRenderDispatch) => {
  const list = generateFiberToUnmountList(_pending);

  unmountList(list, _dispatch);
};
