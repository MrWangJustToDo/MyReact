export var isInternal = function (key) { return key.startsWith("_"); };
export var isChildren = function (key) { return key === "children" || key === "dangerouslySetInnerHTML"; };
export var isEvent = function (key) { return key.startsWith("on"); };
export var isStyle = function (key) { return key === "style"; };
export var isProperty = function (key) { return !isChildren(key) && !isEvent(key) && !isStyle(key) && !isInternal(key); };
export var isNew = function (oldProps, newProps) { return function (key) {
    return oldProps[key] !== newProps[key];
}; };
export var isGone = function (newProps) { return function (key) { return !(key in newProps); }; };
//# sourceMappingURL=tools.js.map