import { generateFiberToUnmountList, unmountList } from "@my-react/react-reconciler";

import type { CustomRenderDispatch, MyReactFiberNode } from "@my-react/react-reconciler";

export const unmount = (_dispatch: CustomRenderDispatch, _pending: MyReactFiberNode) => {
  const list = generateFiberToUnmountList(_pending);

  unmountList(_dispatch, list);
};
