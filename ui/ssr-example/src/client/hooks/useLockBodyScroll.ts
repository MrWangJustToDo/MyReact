import { useEffect } from "react";
import { createStore, ref } from "reactivity-store";

const useGlobalLockStore = createStore(() => {
  const count = ref(0);
  const lock = () => count.value++;
  const unlock = (): void => (count.value--, void 0);

  return { count, lock, unlock };
});

export const useLockBodyScroll = (isLock?: boolean) => {
  const { lock, unlock } = useGlobalLockStore((state) => ({ lock: state.lock, unlock: state.unlock }));
  useEffect(() => {
    if (isLock) {
      lock();
      return unlock;
    }
  }, [isLock, lock, unlock]);
};

export const useLockBodyCount = () => useGlobalLockStore((state) => state.count);
