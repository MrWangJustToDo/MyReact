import { __my_react_scheduler__ } from "@my-react/react";
import { CustomRenderPlatform } from "@my-react/react-reconciler";

const { yieldTask, macroTask, microTask } = __my_react_scheduler__;

export class TerminalPlatform extends CustomRenderPlatform {
  microTask(_task: () => void): void {
    microTask(_task);
  }
  macroTask(_task: () => void): void {
    macroTask(_task);
  }
  yieldTask(_task: () => void): () => void {
    return yieldTask(_task);
  }
}

export const MyReactTerminalPlatform = new TerminalPlatform();
