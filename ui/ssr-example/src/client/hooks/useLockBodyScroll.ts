import { useEffect } from "react";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

const useGlobalLockStore = create<{
  count: number;
  lock: () => void;
  unlock: () => void;
}>((set, get) => ({
  count: 0,
  lock: () => set({ count: get().count + 1 }),
  unlock: () => set({ count: get().count - 1 }),
}));

export const useLockBodyScroll = (isLock?: boolean) => {
  const { lock, unlock } = useGlobalLockStore((state) => ({ lock: state.lock, unlock: state.unlock }), shallow);
  useEffect(() => {
    if (isLock) {
      lock();
      return unlock;
    }
  }, [isLock, lock, unlock]);
};

export const useLockBodyCount = () => useGlobalLockStore((state) => state.count);
