import { __my_react_shared__ } from "@my-react/react";
import { enableFiberForLog, enableValidMyReactElement, initScheduler } from "@my-react/react-reconciler";

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

/**
 * @internal
 */
export const prepareScheduler = () => {
  enableDebugFiled.current = true;

  enableScopeTreeLog.current = true;

  enableFiberForLog.current = true;

  enableValidMyReactElement.current = false;

  initScheduler();
};
