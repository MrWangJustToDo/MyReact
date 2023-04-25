import { MyReactContainer } from "@my-react/react-reconciler";

export class ClientDomContainer extends MyReactContainer {
  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;
}
