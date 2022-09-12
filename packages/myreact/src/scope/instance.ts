import type { MyReactFiberNode } from "../fiber";
import type { LinkTreeList } from "../share";
import type { RenderScope } from "./interface";

export class EmptyRenderScope implements RenderScope {
  rootFiber: MyReactFiberNode | null = null;

  rootContainer: { [p: string]: any } = {};

  isAppMounted = false;

  isAppCrash = false;

  modifyFiberArray: MyReactFiberNode[] = [];

  modifyFiberRoot: MyReactFiberNode | null = null;

  updateFiberListArray: LinkTreeList<MyReactFiberNode>[] = [];

  updateFiberList: LinkTreeList<MyReactFiberNode> | null = null;
}
