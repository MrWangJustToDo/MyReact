import { CustomRenderPlatform } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

import type { LogProps } from "@my-react/react";

export class ServerDomPlatform extends CustomRenderPlatform {
  isServer: boolean;

  constructor(isServer: boolean) {
    super();
    this.isServer = isServer;
  }

  log(props: LogProps): void {
    log(props);
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
