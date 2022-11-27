import { currentReactiveInstance } from "../share";

// hook api like `Vue`

export const onBeforeMount = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.beforeMountHooks.push(cb);
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onMounted = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.mountedHooks.push(cb);
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onBeforeUpdate = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.beforeUpdateHooks.push(cb);
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onUpdated = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.updatedHooks.push(cb);
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onBeforeUnmount = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.beforeUnmountHooks.push(cb);
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onUnmounted = (cb: () => void) => {
  const reactiveInstance = currentReactiveInstance.current;
  if (reactiveInstance) {
    reactiveInstance.unmountedHooks.push(cb);
  } else {
    throw new Error("can not use hook without setup function");
  }
};
