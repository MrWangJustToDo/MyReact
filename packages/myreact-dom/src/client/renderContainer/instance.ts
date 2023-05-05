import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { MyReactContainer } from "@my-react/react-reconciler";

export class ClientDomContainer extends MyReactContainer {
  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;
}

export const prepareDevContainer = (container: ClientDomContainer) => {
  Reflect.defineProperty(container, "_dev_shared", { value: __my_react_shared__ });
  Reflect.defineProperty(container, "_dev_internal", { value: __my_react_internal__ });
};
