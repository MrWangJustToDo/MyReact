import { globalDispatch, pendingUpdateFiberListArray } from '../../share';

export const reconcileUpdate = () => {
  const allPendingList = pendingUpdateFiberListArray.current.slice(0);

  allPendingList.forEach((l) => globalDispatch.current.reconcileCreate(l));

  allPendingList.forEach((l) => globalDispatch.current.reconcileUpdate(l));

  pendingUpdateFiberListArray.current = [];
};
