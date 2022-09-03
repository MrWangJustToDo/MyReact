export var flattenChildren = function (children) {
    if (Array.isArray(children)) {
        return children.reduce(function (p, c) { return p.concat(flattenChildren(c)); }, []);
    }
    return [children];
};
//# sourceMappingURL=flattenChildren.js.map