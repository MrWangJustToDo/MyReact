import { __my_react_shared__ } from "@my-react/react/type";
import { enableDebugUpdateQueue, enableFiberForLog, enableValidMyReactElement, initScheduler } from "@my-react/react-reconciler";

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

export function initServer() {
  enableFiberForLog.current = false;

  enableValidMyReactElement.current = false;

  enableDebugFiled.current = false;

  enableScopeTreeLog.current = false;

  initScheduler();
}

export function initClient() {
  enableFiberForLog.current = true;

  enableValidMyReactElement.current = false;

  enableDebugFiled.current = true;

  enableDebugUpdateQueue.current = true;

  enableScopeTreeLog.current = true;

  initScheduler();
}
