import type { MyReactFiberNode } from "../fiber";

export type LogProps = {
  message: string | Error;
  fiber?: MyReactFiberNode;
  triggerOnce?: boolean;
  level?: "warn" | "error";
};

// TODO
export interface RenderPlatform {
  name: string;
  log: (p: LogProps) => void;
}
