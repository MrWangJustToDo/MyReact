import { CustomRenderController } from "@my-react/react-reconciler";

import { shouldPauseAsyncUpdate } from "@my-react-dom-shared";

export class ClientDomController extends CustomRenderController {
  shouldYield(): boolean {
    return shouldPauseAsyncUpdate();
  }
}
