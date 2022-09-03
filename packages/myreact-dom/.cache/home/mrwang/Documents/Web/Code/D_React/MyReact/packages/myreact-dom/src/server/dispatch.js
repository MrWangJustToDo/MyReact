import { __myreact_shared__ } from "@my-react/react";
import { append, create, update } from "./dom";
var safeCallWithFiber = __myreact_shared__.safeCallWithFiber;
var ServerDispatch = /** @class */ (function () {
    function ServerDispatch() {
    }
    ServerDispatch.prototype.trigger = function (_fiber) {
        void 0;
    };
    ServerDispatch.prototype.resolveLazy = function () {
        return false;
    };
    ServerDispatch.prototype.reconcileCommit = function (_fiber, _hydrate, _parentFiberWithDom) {
        safeCallWithFiber({ fiber: _fiber, action: function () { return create(_fiber); } });
        safeCallWithFiber({ fiber: _fiber, action: function () { return update(_fiber); } });
        safeCallWithFiber({
            fiber: _fiber,
            action: function () { return append(_fiber, _parentFiberWithDom); },
        });
        if (_fiber.child) {
            this.reconcileCommit(_fiber.child, _hydrate, _fiber.dom ? _fiber : _parentFiberWithDom);
        }
        if (_fiber.sibling) {
            this.reconcileCommit(_fiber.sibling, _hydrate, _parentFiberWithDom);
        }
        return true;
    };
    ServerDispatch.prototype.reconcileCreate = function (_list) {
        void 0;
    };
    ServerDispatch.prototype.reconcileUpdate = function (_list) {
        void 0;
    };
    ServerDispatch.prototype.beginProgressList = function () {
        void 0;
    };
    ServerDispatch.prototype.endProgressList = function () {
        void 0;
    };
    ServerDispatch.prototype.generateUpdateList = function (_fiber) {
        void 0;
    };
    ServerDispatch.prototype.pendingCreate = function (_fiber) {
        if (_fiber.__isPortal__) {
            throw new Error("should not use portal element on the server");
        }
        if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__)
            return;
        _fiber.__pendingCreate__ = true;
    };
    ServerDispatch.prototype.pendingUpdate = function (_fiber) {
        if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__)
            return;
        _fiber.__pendingUpdate__ = true;
    };
    ServerDispatch.prototype.pendingAppend = function (_fiber) {
        if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__)
            return;
        _fiber.__pendingAppend__ = true;
    };
    ServerDispatch.prototype.pendingContext = function (_fiber) {
        void 0;
    };
    ServerDispatch.prototype.pendingPosition = function (_fiber) {
        void 0;
    };
    ServerDispatch.prototype.pendingUnmount = function (_fiber, _pendingUnmount) {
        void 0;
    };
    ServerDispatch.prototype.pendingLayoutEffect = function (_fiber, _layoutEffect) {
        void 0;
    };
    ServerDispatch.prototype.pendingEffect = function (_fiber, _effect) {
        void 0;
    };
    ServerDispatch.prototype.updateAllSync = function () {
        void 0;
    };
    ServerDispatch.prototype.updateAllAsync = function () {
        void 0;
    };
    return ServerDispatch;
}());
export { ServerDispatch };
//# sourceMappingURL=dispatch.js.map