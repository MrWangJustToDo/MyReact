import { unmountFiber } from "@my-react/react-reconciler";

import type { CustomRenderDispatch, MyReactFiberNode } from "@my-react/react-reconciler";

export const unmount = (_dispatch: CustomRenderDispatch, _pending: MyReactFiberNode) => {
  unmountFiber(_dispatch, _pending);
};
