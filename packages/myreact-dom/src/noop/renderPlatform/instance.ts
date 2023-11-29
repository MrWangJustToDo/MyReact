import { CustomRenderPlatform } from "@my-react/react-reconciler";

/**
 * @internal
 */
export class NoopDomPlatform extends CustomRenderPlatform {

  constructor() {
    super();
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
