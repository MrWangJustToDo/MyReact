import { __myreact_internal__ } from "@my-react/react";
import { pendingUpdateFiberListArray } from "@ReactDOM_shared";
export var reconcileUpdate = function () {
    var allPendingList = pendingUpdateFiberListArray.current.slice(0);
    allPendingList.forEach(function (l) { return __myreact_internal__.globalDispatch.current.reconcileCreate(l); });
    allPendingList.forEach(function (l) { return __myreact_internal__.globalDispatch.current.reconcileUpdate(l); });
    pendingUpdateFiberListArray.current = [];
};
//# sourceMappingURL=reconcileUpdate.js.map