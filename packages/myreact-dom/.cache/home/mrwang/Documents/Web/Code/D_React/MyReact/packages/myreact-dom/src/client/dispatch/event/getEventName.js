export var getNativeEventName = function (eventName, tagName, props) {
    var isCapture = false;
    var nativeName = eventName;
    if (eventName.endsWith("Capture")) {
        isCapture = true;
        nativeName = eventName.split("Capture")[0];
    }
    if (nativeName === "DoubleClick") {
        nativeName = "dblclick";
    }
    else if (nativeName === "Change") {
        if (tagName === "input") {
            if (props.type === "radio" || props.type === "checkbox") {
                nativeName = "click";
            }
            else {
                nativeName = "input";
            }
        }
        else {
            nativeName = "change";
        }
    }
    else {
        nativeName = nativeName.toLowerCase();
    }
    return { nativeName: nativeName, isCapture: isCapture };
};
//# sourceMappingURL=getEventName.js.map