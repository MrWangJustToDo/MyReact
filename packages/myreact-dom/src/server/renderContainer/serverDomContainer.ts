import { MyReactContainer } from "@my-react/react-reconciler";

export class ServerDomContainer extends MyReactContainer {
  isHydrateRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;
}
