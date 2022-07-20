import { HOOK_TYPE } from '../hook';

import type { MixinMyReactComponentType } from '../component';
import type { MyReactFiberNode } from './instance';

export const unmountFiber = (fiber: MyReactFiberNode) => {
  fiber.children.forEach(unmountFiber);
  fiber.hookList.forEach((hook) => {
    if (
      hook.hookType === HOOK_TYPE.useEffect ||
      hook.hookType === HOOK_TYPE.useLayoutEffect
    ) {
      hook.effect = false;
      hook.cancel && hook.cancel();
    }
    if (hook.hookType === HOOK_TYPE.useContext) {
      hook.__context__?.removeDependence(hook);
    }
  });
  if (fiber.instance) {
    const typedInstance = fiber.instance as MixinMyReactComponentType;

    typedInstance.componentWillUnmount?.();

    typedInstance.__context__?.removeDependence(typedInstance);
  }
  fiber.mount = false;
  fiber.__pendingCreate__ = false;
  fiber.__pendingUpdate__ = false;
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
  fiber.__pendingUnmount__ = false;
  fiber.__needUpdate__ = false;
};
