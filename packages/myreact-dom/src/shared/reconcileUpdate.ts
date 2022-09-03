import { __myreact_internal__ } from "@my-react/react";

import { pendingUpdateFiberListArray } from "@ReactDOM_shared";

export const reconcileUpdate = () => {
  const allPendingList = pendingUpdateFiberListArray.current.slice(0);

  allPendingList.forEach((l) => __myreact_internal__.globalDispatch.current.reconcileCreate(l));

  allPendingList.forEach((l) => __myreact_internal__.globalDispatch.current.reconcileUpdate(l));

  pendingUpdateFiberListArray.current = [];
};
