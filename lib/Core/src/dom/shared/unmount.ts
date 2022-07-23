import { MyReactFiberNode } from '../../fiber';
import { _unmount } from '../client/dispatch/unmount';

export const unmountComponentAtNode = (
  container: Element & { __fiber__: MyReactFiberNode }
) => {
  const fiber = container.__fiber__;
  if (fiber instanceof MyReactFiberNode) {
    _unmount(fiber);
  }
};
