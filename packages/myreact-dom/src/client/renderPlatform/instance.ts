import { __my_react_scheduler__ } from "@my-react/react";
import { CustomRenderPlatform } from "@my-react/react-reconciler";

const { yieldTask, macroTask, microTask } = __my_react_scheduler__;

/**
 * @internal
 */
export class ClientDomPlatform extends CustomRenderPlatform {
  isServer: boolean;

  constructor(isServer: boolean) {
    super();
    this.isServer = isServer;
  }

  microTask(_task: () => void): void {
    !this.isServer && microTask(_task);
  }
  macroTask(_task: () => void): void {
    !this.isServer && macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    if (!this.isServer) {
      return yieldTask(_task);
    } else {
      return () => void 0;
    }
  }
}
