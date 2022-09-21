import type { LinkTreeList } from "./listTree";
import type { MyReactFiberNode, RenderScope } from "@my-react/react";

export class DomScope implements RenderScope<{ isHydrateRender: boolean; isServerRender: boolean; currentYield: MyReactFiberNode | null }> {
  rootFiber: MyReactFiberNode | null = null;

  rootContainer: { [p: string]: any } = {};

  isAppMounted = false;

  isAppCrash = false;

  modifyFiberArray: MyReactFiberNode[] = [];

  modifyFiberRoot: MyReactFiberNode | null = null;

  updateFiberListArray: LinkTreeList<MyReactFiberNode>[] = [];

  updateFiberList: LinkTreeList<MyReactFiberNode> | null = null;

  currentYield: MyReactFiberNode | null = null;

  isHydrateRender = false;

  isServerRender = false;
}
