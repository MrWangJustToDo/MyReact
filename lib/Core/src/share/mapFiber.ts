import { MyReactFiberNode } from '../fiber';

export const mapFiber = (
  arrayLike: MyReactFiberNode | MyReactFiberNode[],
  action: (f: MyReactFiberNode) => void
) => {
  if (Array.isArray(arrayLike)) {
    arrayLike.forEach((f) => mapFiber(f, action));
  } else {
    if (arrayLike instanceof MyReactFiberNode) {
      action(arrayLike);
    }
  }
};
