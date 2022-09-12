import type { MyReactFiberNode, RenderScope } from "@my-react/react";
import type { LinkTreeList } from "@my-react/react/dist/types/share";

export class DomScope implements RenderScope<{ isHydrateRender: boolean; isServerRender: boolean }> {
  rootFiber: MyReactFiberNode | null = null;

  rootContainer: { [p: string]: any } = {};

  isAppMounted = false;

  isAppCrash = false;

  modifyFiberArray: MyReactFiberNode[] = [];

  modifyFiberRoot: MyReactFiberNode | null = null;

  updateFiberListArray: LinkTreeList<MyReactFiberNode>[] = [];

  updateFiberList: LinkTreeList<MyReactFiberNode> | null = null;

  isHydrateRender = false;

  isServerRender = false;
}
