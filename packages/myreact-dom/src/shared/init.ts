import { __my_react_shared__ } from "@my-react/react";
import { enableFiberForLog, enableValidMyReactElement, initScheduler } from "@my-react/react-reconciler";

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

export const initServer = () => {
  enableFiberForLog.current = false;

  enableValidMyReactElement.current = false;

  enableDebugFiled.current = false;

  enableScopeTreeLog.current = false;

  initScheduler();
};

export const initClient = () => {
  enableFiberForLog.current = true;

  enableValidMyReactElement.current = false;

  enableDebugFiled.current = true;

  enableScopeTreeLog.current = true;

  initScheduler();
}