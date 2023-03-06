import type { MyReactFiberNode } from "../fiber";

export type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

// TODO
interface DefaultRenderPlatform {
  name: string;
  log(p: LogProps): void;
}

export type RenderPlatform<T = Record<string, any>> = DefaultRenderPlatform & T;
