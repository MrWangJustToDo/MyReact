import type { LogProps, RenderPlatform } from "./interface";

export class EmptyPlatform implements RenderPlatform {
  name = "empty";
  log: (p: LogProps) => void = () => void 0;
}
