import type { MyReactFiberNode } from "../fiber";
import type { LinkTreeList } from "../share";

export interface DefaultRenderScope {
  rootFiber: MyReactFiberNode | null;

  rootContainer: { [p: string]: any };

  isAppMounted: boolean;

  isAppCrash: boolean;

  modifyFiberArray: MyReactFiberNode[];

  modifyFiberRoot: MyReactFiberNode | null;

  updateFiberListArray: LinkTreeList<MyReactFiberNode>[];

  updateFiberList: LinkTreeList<MyReactFiberNode> | null;
}

export type RenderScope<T = Record<string, any>> = DefaultRenderScope & T;
