import type { MyReactFiberNode, MyReactFiberNodeRoot } from "../fiber";
import type { ListTree, UniqueArray } from "@my-react/react-shared";

interface DefaultRenderScope {
  rootFiber: MyReactFiberNodeRoot | null;

  yieldFiber: MyReactFiberNode | null;

  rootContainer: { [p: string]: any };

  isAppMounted: boolean;

  isAppCrashed: boolean;

  modifyFiberRoot: MyReactFiberNode | null;

  pendingProcessFiberArray: UniqueArray<MyReactFiberNode>;

  pendingCommitFiberListArray: ListTree<MyReactFiberNode>[];

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null;
}

export type RenderScope<T = Record<string, any>> = DefaultRenderScope & T;
