import { UniqueArray } from "@my-react/react-shared";

import type { MyReactFiberNode, MyReactFiberNodeRoot, RenderScope } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export class DomScope
  implements
    RenderScope<{
      isServerRender: boolean;

      isHydrateRender: boolean;

      renderTime: number | null;

      hydrateTime: number | null;
    }>
{
  rootFiber: MyReactFiberNodeRoot;

  yieldFiber: MyReactFiberNode | null = null;

  rootContainer: { [p: string]: any };

  isAppMounted = false;

  isAppCrashed = false;

  isPending = false;

  modifyFiberRoot: MyReactFiberNode | null = null;

  pendingProcessFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray();

  pendingCommitFiberListArray: ListTree<MyReactFiberNode>[] = [];

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null = null;

  isServerRender = false;

  isHydrateRender = false;

  renderTime: number | null;

  hydrateTime: number | null;

  constructor(fiber: MyReactFiberNodeRoot, container: any) {
    this.rootFiber = fiber;
    this.rootContainer = container;
  }
}
