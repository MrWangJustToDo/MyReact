var EmptyDispatch = /** @class */ (function () {
    function EmptyDispatch() {
    }
    EmptyDispatch.prototype.trigger = function (_fiber) {
        void 0;
    };
    EmptyDispatch.prototype.resolveLazy = function () {
        return false;
    };
    // TODO this part of logic should not include global dispatch interface
    // start
    EmptyDispatch.prototype.reconcileCommit = function (_fiber, _hydrate, _parentFiberWithDom) {
        return false;
    };
    EmptyDispatch.prototype.reconcileCreate = function (_list) {
        void 0;
    };
    EmptyDispatch.prototype.reconcileUpdate = function (_list) {
        void 0;
    };
    EmptyDispatch.prototype.beginProgressList = function () {
        void 0;
    };
    EmptyDispatch.prototype.endProgressList = function () {
        void 0;
    };
    EmptyDispatch.prototype.generateUpdateList = function (_fiber) {
        void 0;
    };
    // end
    EmptyDispatch.prototype.pendingCreate = function (_fiber) {
        void 0;
    };
    EmptyDispatch.prototype.pendingUpdate = function (_fiber) {
        void 0;
    };
    EmptyDispatch.prototype.pendingAppend = function (_fiber) {
        void 0;
    };
    EmptyDispatch.prototype.pendingContext = function (_fiber) {
        void 0;
    };
    EmptyDispatch.prototype.pendingPosition = function (_fiber) {
        void 0;
    };
    EmptyDispatch.prototype.pendingUnmount = function (_fiber, _pendingUnmount) {
        void 0;
    };
    EmptyDispatch.prototype.pendingLayoutEffect = function (_fiber, _layoutEffect) {
        void 0;
    };
    EmptyDispatch.prototype.pendingEffect = function (_fiber, _effect) {
        void 0;
    };
    EmptyDispatch.prototype.updateAllSync = function () {
        void 0;
    };
    EmptyDispatch.prototype.updateAllAsync = function () {
        void 0;
    };
    return EmptyDispatch;
}());
export { EmptyDispatch };
//# sourceMappingURL=instance.js.map