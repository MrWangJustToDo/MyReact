import { globalInstance } from "./feature";

// hook api like `Vue`

export const onBeforeMount = (cb: () => void) => {
  if (globalInstance) {
    globalInstance.onBeforeMount.push(cb);
    globalInstance.hasHookInstalled = true;
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onMounted = (cb: () => void) => {
  if (globalInstance) {
    globalInstance.onMounted.push(cb);
    globalInstance.hasHookInstalled = true;
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onBeforeUpdate = (cb: () => void) => {
  if (globalInstance) {
    globalInstance.onBeforeUpdate.push(cb);
    globalInstance.hasHookInstalled = true;
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onUpdated = (cb: () => void) => {
  if (globalInstance) {
    globalInstance.onUpdated.push(cb);
    globalInstance.hasHookInstalled = true;
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onBeforeUnmount = (cb: () => void) => {
  if (globalInstance) {
    globalInstance.onBeforeUnmount.push(cb);
    globalInstance.hasHookInstalled = true;
  } else {
    throw new Error("can not use hook without setup function");
  }
};

export const onUnmounted = (cb: () => void) => {
  if (globalInstance) {
    globalInstance.onUnmounted.push(cb);
    globalInstance.hasHookInstalled = true;
  } else {
    throw new Error("can not use hook without setup function");
  }
};
