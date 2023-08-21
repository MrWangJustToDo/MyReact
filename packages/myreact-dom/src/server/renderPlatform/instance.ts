import { CustomRenderPlatform } from "@my-react/react-reconciler";

export class ServerDomPlatform extends CustomRenderPlatform {
  isServer: boolean;

  constructor(isServer: boolean) {
    super();
    this.isServer = isServer;
  }
  microTask(_task: () => void): void {
    void 0;
  }
  macroTask(_task: () => void): void {
    void 0;
  }
  yieldTask(_task: () => void): () => void {
    return () => void 0;
  }
}
