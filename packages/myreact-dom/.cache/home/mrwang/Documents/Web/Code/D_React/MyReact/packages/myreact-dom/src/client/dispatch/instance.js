import { __myreact_shared__ } from "@my-react/react";
import { getFiberWithDom, LinkTreeList, pendingUpdateFiberList, pendingUpdateFiberListArray, triggerUpdate, } from "@ReactDOM_shared";
import { updateAllAsync, updateAllSync } from "../update";
import { append } from "./append";
import { context } from "./context";
import { create } from "./create";
import { effect, layoutEffect } from "./effect";
import { fallback } from "./fallback";
import { position } from "./position";
import { unmount } from "./unmount";
import { update } from "./update";
var safeCallWithFiber = __myreact_shared__.safeCallWithFiber;
var ClientDispatch = /** @class */ (function () {
    function ClientDispatch() {
    }
    ClientDispatch.prototype.trigger = function (_fiber) {
        triggerUpdate(_fiber);
    };
    ClientDispatch.prototype.resolveLazy = function () {
        return true;
    };
    ClientDispatch.prototype.beginProgressList = function () {
        pendingUpdateFiberList.current = new LinkTreeList();
    };
    ClientDispatch.prototype.endProgressList = function () {
        var _a;
        if ((_a = pendingUpdateFiberList.current) === null || _a === void 0 ? void 0 : _a.length) {
            pendingUpdateFiberListArray.current.push(pendingUpdateFiberList.current);
        }
        pendingUpdateFiberList.current = null;
    };
    ClientDispatch.prototype.generateUpdateList = function (_fiber) {
        if (_fiber) {
            if (pendingUpdateFiberList.current) {
                if (_fiber.__pendingCreate__ ||
                    _fiber.__pendingUpdate__ ||
                    _fiber.__pendingAppend__ ||
                    _fiber.__pendingContext__ ||
                    _fiber.__pendingPosition__ ||
                    _fiber.__effectQueue__.length ||
                    _fiber.__unmountQueue__.length ||
                    _fiber.__layoutEffectQueue__.length) {
                    pendingUpdateFiberList.current.append(_fiber, _fiber.fiberIndex);
                }
            }
            else {
                throw new Error("error");
            }
        }
    };
    ClientDispatch.prototype.reconcileCommit = function (_fiber, _hydrate, _parentFiberWithDom) {
        var _result = safeCallWithFiber({
            fiber: _fiber,
            action: function () { return create(_fiber, _hydrate, _parentFiberWithDom); },
        });
        safeCallWithFiber({
            fiber: _fiber,
            action: function () { return update(_fiber, _result); },
        });
        safeCallWithFiber({
            fiber: _fiber,
            action: function () { return append(_fiber, _parentFiberWithDom); },
        });
        var _final = _hydrate;
        if (_fiber.child) {
            _final = this.reconcileCommit(_fiber.child, _result, _fiber.dom ? _fiber : _parentFiberWithDom);
            fallback(_fiber);
        }
        safeCallWithFiber({ fiber: _fiber, action: function () { return layoutEffect(_fiber); } });
        Promise.resolve().then(function () { return safeCallWithFiber({ fiber: _fiber, action: function () { return effect(_fiber); } }); });
        if (_fiber.sibling) {
            this.reconcileCommit(_fiber.sibling, _fiber.dom ? _result : _final, _parentFiberWithDom);
        }
        if (_fiber.dom) {
            return _result;
        }
        else {
            return _final;
        }
    };
    ClientDispatch.prototype.reconcileCreate = function (_list) {
        _list.listToFoot(function (_fiber) {
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return create(_fiber, false, _fiber); },
            });
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return update(_fiber, false); },
            });
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return unmount(_fiber); },
            });
            safeCallWithFiber({ fiber: _fiber, action: function () { return context(_fiber); } });
        });
    };
    ClientDispatch.prototype.reconcileUpdate = function (_list) {
        _list.listToHead(function (_fiber) {
            var _parentFiberWithDom = getFiberWithDom(_fiber.parent, function (f) { return f.parent; });
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return position(_fiber, _parentFiberWithDom); },
            });
        });
        _list.listToFoot(function (_fiber) {
            var _parentFiberWithDom = getFiberWithDom(_fiber.parent, function (f) { return f.parent; });
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return append(_fiber, _parentFiberWithDom); },
            });
        });
        _list.reconcile(function (_fiber) {
            safeCallWithFiber({
                fiber: _fiber,
                action: function () { return layoutEffect(_fiber); },
            });
            Promise.resolve().then(function () { return safeCallWithFiber({ fiber: _fiber, action: function () { return effect(_fiber); } }); });
        });
    };
    ClientDispatch.prototype.pendingCreate = function (_fiber) {
        if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__ && !_fiber.__isPortal__)
            return;
        _fiber.__pendingCreate__ = true;
    };
    ClientDispatch.prototype.pendingUpdate = function (_fiber) {
        if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__)
            return;
        _fiber.__pendingUpdate__ = true;
    };
    ClientDispatch.prototype.pendingAppend = function (_fiber) {
        if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__)
            return;
        _fiber.__pendingAppend__ = true;
    };
    ClientDispatch.prototype.pendingContext = function (_fiber) {
        _fiber.__pendingContext__ = true;
    };
    ClientDispatch.prototype.pendingPosition = function (_fiber) {
        _fiber.__pendingPosition__ = true;
    };
    ClientDispatch.prototype.pendingUnmount = function (_fiber, _pendingUnmount) {
        _fiber.__unmountQueue__.push(_pendingUnmount);
    };
    ClientDispatch.prototype.pendingLayoutEffect = function (_fiber, _layoutEffect) {
        _fiber.__layoutEffectQueue__.push(_layoutEffect);
    };
    ClientDispatch.prototype.pendingEffect = function (_fiber, _effect) {
        _fiber.__effectQueue__.push(_effect);
    };
    ClientDispatch.prototype.updateAllSync = function () {
        updateAllSync();
    };
    ClientDispatch.prototype.updateAllAsync = function () {
        updateAllAsync();
    };
    return ClientDispatch;
}());
export { ClientDispatch };
//# sourceMappingURL=instance.js.map