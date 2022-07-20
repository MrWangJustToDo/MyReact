import { MyReactFiberNode } from '../../fiber';
import { globalDispatch } from '../../share';

export const unmountComponentAtNode = (
  container: HTMLElement & { __fiber__: MyReactFiberNode }
) => {
  const fiber = container.__fiber__;
  if (fiber instanceof MyReactFiberNode) {
    globalDispatch.current.unmount(fiber);
  }
};
