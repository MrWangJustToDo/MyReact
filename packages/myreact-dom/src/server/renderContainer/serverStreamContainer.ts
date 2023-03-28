import { MyReactContainer } from "@my-react/react-reconciler";

export type SimpleReadable = {
  push(chunk: string | null): void;
  destroy(err: any): void;
};

export class ServerStreamContainer extends MyReactContainer {
  isHydrateRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

  stream: SimpleReadable;

  lastIsStringNode: boolean;
}
